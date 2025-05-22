from decimal import Decimal
from statistics import mean, median, mode, StatisticsError

import requests
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.db.models import Sum, F
from django.db.models.functions import TruncMonth
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone

from .forms import CustomUserCreationForm, ProductEdit, SaleProductForm, ReviewForm
from .models import Product, Customer, Sale, SaleProduct, Article, FAQ, Employee, Review, PromoCode, Category, Vacancy


def get_random_gif():
    api_key = 'Eio5GQwmcuMOFpcd811Iu4fvlUBVjVDN'
    url = f'https://api.giphy.com/v1/gifs/random?api_key={api_key}&rating=g'
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data['data']['images']['original']['url']
    except requests.exceptions.RequestException as e:
        print(f"Giphy API error: {e}")
        return None
    except (KeyError, ValueError) as e:
        print(f"Error parsing Giphy API response: {e}")
        return None


def get_random_joke():
    url = 'https://official-joke-api.appspot.com/random_joke'
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return f"{data['setup']} - {data['punchline']}"
    except requests.exceptions.RequestException as e:
        print(f"Joke API error: {e}")
        return None
    except (KeyError, ValueError) as e:
        print(f"Error parsing Joke API response: {e}")
        return None


def product_list(request):
    products = Product.objects.all()
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    category_id = request.GET.get('category')

    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)
    if category_id:
        products = products.filter(category_id=category_id)

    categories = Category.objects.all()
    return render(request, 'product_list.html', {
        'products': products,
        'categories': categories,
    })


def create_product(request):
    if request.method == 'POST':
        form = ProductEdit(request.POST)
        if form.is_valid():
            product = Product(
                name=form.cleaned_data['name'],
                price=form.cleaned_data['price'],
                unit=form.cleaned_data['unit'],
                category=form.cleaned_data['category']
            )
            product.save()
            return redirect('products_list')
    else:
        form = ProductEdit()
    return render(request, 'create_product.html', {'form': form})


def edit_product(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == "POST":
        form = ProductEdit(request.POST)
        if form.is_valid():
            product.name = form.cleaned_data['name']
            product.price = form.cleaned_data['price']
            product.unit = form.cleaned_data['unit']
            product.category = form.cleaned_data['category']
            product.save()
            return redirect('products_list')
    else:
        form = ProductEdit(initial={
            'name': product.name,
            'price': product.price,
            'unit': product.unit,
            'category': product.category
        })
    return render(request, 'edit_product.html', {'form': form, 'product': product})


def delete_product(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == "POST":
        product.delete()
        return redirect('products_list')
    return None


def buy_product(request, product_id):
    product = get_object_or_404(Product, pk=product_id)

    if request.method == 'POST':
        form = SaleProductForm(request.POST)
        if form.is_valid():
            quantity = form.cleaned_data['quantity']
            promo_code = form.cleaned_data.get('promo_code')
            city = form.cleaned_data.get('city')

            email = request.user.email
            customer = Customer.objects.get(email=email)

            sale = Sale.objects.create(
                city=city,
                customer=customer,
                delivery_date=timezone.now() + timezone.timedelta(days=7)
            )

            # Промокод
            discount = Decimal('0.00')
            if promo_code:
                try:
                    promo = PromoCode.objects.get(code=promo_code, active=True)
                    discount = Decimal(promo.discount_percent) / Decimal(100)
                except PromoCode.DoesNotExist:
                    form.add_error('promo_code', 'Промокод недействителен или неактивен')
                    return render(request, 'buy_product.html', {'form': form, 'product': product})

            price_with_discount = product.price - (product.price * discount)

            SaleProduct.objects.create(
                sale=sale,
                product=product,
                quantity=quantity,
                price=price_with_discount
            )

            sale.total_price = price_with_discount * quantity
            sale.save()

            return redirect('products_list')
    else:
        form = SaleProductForm()

    return render(request, 'buy_product.html', {'form': form, 'product': product})



def sale_list(request):
    selected_city = request.GET.get('city')

    sales = Sale.objects.select_related('customer').prefetch_related('saleproduct_set__product')
    if selected_city:
        sales = sales.filter(city=selected_city)

    unique_cities = Sale.objects.values_list('city', flat=True).distinct().order_by('city')

    customers = Customer.objects.order_by('last_name', 'first_name')
    sales_total_by_customer = {
        f"{customer.first_name} {customer.last_name}": round(
            SaleProduct.objects.filter(
                sale__customer=customer
            ).aggregate(total=Sum(F('quantity') * F('product__price')))['total'] or 0, 2
        )
        for customer in customers
    }

    sales_totals = list(sales_total_by_customer.values())
    try:
        sales_mean = round(mean(sales_totals), 2)
        sales_median = round(median(sales_totals), 2)
        sales_mode = round(mode(sales_totals), 2)
    except StatisticsError:
        sales_mode = "Нет моды"

    product_sales = SaleProduct.objects.values('product__category__name').annotate(
        total_quantity=Sum('quantity'),
        total_profit=Sum(F('quantity') * F('product__price'))
    ).order_by('-total_quantity')

    most_popular_type = product_sales[0]['product__category__name'] if product_sales else "Нет данных"
    most_profitable_type = sorted(product_sales, key=lambda x: x['total_profit'], reverse=True)[0]['product__category__name'] if product_sales else "Нет данных"

    most_demanded_product = SaleProduct.objects.values('product__name').annotate(
        total=Sum('quantity')
    ).order_by('-total').first()
    most_demanded_product_name = most_demanded_product['product__name'] if most_demanded_product else "Нет данных"

    sold_product_ids = SaleProduct.objects.values_list('product_id', flat=True).distinct()
    unsold_products = Product.objects.exclude(id__in=sold_product_ids)

    # Ежемесячный объем продаж по категориям
    monthly_sales = SaleProduct.objects.annotate(
        month=TruncMonth('sale__sale_date')
    ).values('month', 'product__category__name').annotate(
        total=Sum('quantity')
    ).order_by('month')

    return render(request, 'sale_list.html', {
        'sales': sales,
        'unique_cities': unique_cities,
        'selected_city': selected_city,
        'sales_total_by_customer': sales_total_by_customer,
        'sales_mean': sales_mean,
        'sales_median': sales_median,
        'sales_mode': sales_mode,
        'most_popular_type': most_popular_type,
        'most_profitable_type': most_profitable_type,
        'most_demanded_product_name': most_demanded_product_name,
        'unsold_products': unsold_products,
        'monthly_sales': monthly_sales,
    })


def latest_article(request):
    latest_article_obj = Article.objects.latest('publication_date')
    return render(request, 'latest_article.html', {'article': latest_article_obj, 'user': request.user})


def about_us(request):
    return render(request, 'about_us.html', {'user': request.user})


def article_list(request):
    articles = Article.objects.all()
    return render(request, 'article_list.html', {'articles': articles, 'user': request.user})


def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    return render(request, 'article_detail.html', {'article': article})


def faq_list(request):
    faqs = FAQ.objects.all().order_by('-date_added')
    return render(request, 'faq_list.html', {'faqs': faqs, 'user': request.user})


def contact_list(request):
    employees = Employee.objects.all()
    return render(request, 'contact_list.html', {'employees': employees, 'user': request.user})


def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            phone = form.cleaned_data.get('phone')

            # Создаем Customer с телефоном, если надо
            Customer.objects.get_or_create(
                email=user.email,
                defaults={
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'phone': phone
                }
            )

            login(request, user)
            return redirect('about_us')
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})



def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('about_us')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('login')


def main_info(request):
    random_joke = get_random_joke()
    return render(request, 'jokes.html', {'random_joke': random_joke})


def privacy_policy_page(request):
    random_gif_url = get_random_gif()
    return render(request, "gif.html", {"random_gif_url": random_gif_url})


def product_reviews(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    reviews = Review.objects.filter(product=product)

    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.product = product
            review.author = request.user
            review.save()
            return redirect('product_reviews', product_id=product_id)
    else:
        form = ReviewForm()

    return render(request, 'product_reviews.html', {
        'product': product,
        'reviews': reviews,
        'form': form
    })

def promo_list(request):
    promo_codes = PromoCode.objects.all()
    return render(request, 'promo_list.html', {'promo_codes': promo_codes})


@login_required
def my_purchases(request):
    try:
        customer = Customer.objects.get(email=request.user.email)
        sales = Sale.objects.filter(customer=customer).order_by('-sale_date')
    except Customer.DoesNotExist:
        sales = []

    return render(request, 'my_purchases.html', {'sales': sales})

def vacancy_list(request):
    vacancies = Vacancy.objects.order_by('-published_date')
    return render(request, 'vacancies.html', {'vacancies': vacancies})
