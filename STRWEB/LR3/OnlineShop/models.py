from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    objects = models.Manager()
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Product(models.Model):
    UNIT_CHOICES = [
        ('pcs', 'Штук'),
        ('kg', 'Килограммы'),
        ('l', 'Литры'),
    ]

    objects = models.Manager()
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=3, choices=UNIT_CHOICES, default='pcs')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')

    def __str__(self):
        return self.name


class Review(models.Model):
    objects = models.Manager()
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    author = models.ForeignKey(User, related_name='reviews', on_delete=models.CASCADE)
    text = models.TextField()
    rating = models.PositiveSmallIntegerField(default=1)

    def __str__(self):
        return f'Review for {self.product.name} by {self.author.username}'


class Customer(models.Model):
    objects = models.Manager()
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Sale(models.Model):
    objects = models.Manager()
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='SaleProduct')
    sale_date = models.DateTimeField(auto_now_add=True)
    delivery_date = models.DateTimeField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    city = models.CharField(max_length=100, default="Неизвестно")

    def __str__(self):
        return f"Sale {self.id} to {self.customer}"

class SaleProduct(models.Model):
    objects = models.Manager()
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"SaleProduct {self.id}"

class Article(models.Model):
    objects = models.Manager()
    title = models.CharField(max_length=200)
    publication_date = models.DateField()
    summary = models.TextField()
    content = models.TextField(default='')
    author = models.CharField(max_length=100)
    image = models.ImageField(upload_to='images/', default='images/default.jpg')

    def __str__(self):
        return self.title


class FAQ(models.Model):
    objects = models.Manager()
    question = models.CharField(max_length=255)
    answer = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question


class Employee(models.Model):
    objects = models.Manager()
    name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='images/', default='images/default.jpg')
    job_description = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    url = models.URLField(max_length=200, blank=True)

    def __str__(self):
        return self.name


class PromoCode(models.Model):
    objects = models.Manager()
    code = models.CharField(max_length=20, unique=True)
    discount_percent = models.PositiveIntegerField(default=0, help_text="Discount percent")
    active = models.BooleanField(default=True, help_text="Promo is active")

    def __str__(self):
        return self.code

class Vacancy(models.Model):
    objects = models.Manager()
    title = models.CharField(max_length=100)
    description = models.TextField()
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    published_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title

class Partner(models.Model):
    objects = models.Manager()
    name = models.CharField(max_length=100, verbose_name="Название компании")
    logo = models.ImageField(upload_to='images', verbose_name="Логотип")
    website = models.URLField(verbose_name="Сайт компании")

    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='CartProduct')

    def __str__(self):
        return f"Cart for {self.user.username}"


class CartProduct(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    def get_total_price(self):
        return self.product.price * self.quantity


class Company(models.Model):
    objects = models.Manager()
    name = models.CharField("Название", max_length=255)
    description = models.TextField("Описание", blank=True)
    logo_small = models.ImageField("Логотип маленький", upload_to="company/")
    logo_medium = models.ImageField("Логотип средний", upload_to="company/")
    logo_large = models.ImageField("Логотип большой", upload_to="company/")
    video_url = models.URLField("Видео (YouTube)", blank=True)
    audio = models.FileField("Аудио", upload_to="company/", blank=True)
    certificate_number = models.CharField("Номер сертификата", max_length=100, blank=True)
    certificate_reg_number = models.CharField("Регистрационный номер", max_length=100, blank=True)
    certificate_valid_until = models.DateField("Срок действия", null=True, blank=True)
    certificate_authority = models.CharField("Орган по сертификации", max_length=255, blank=True)
    certificate_object = models.CharField("Объект сертификации", max_length=255, blank=True)

    # Реквизиты
    legal_address = models.CharField("Юридический адрес", max_length=255, blank=True)
    inn = models.CharField("ИНН", max_length=20, blank=True)
    ogrn = models.CharField("ОГРН", max_length=20, blank=True)
    bank_account = models.CharField("Расчётный счёт", max_length=50, blank=True)
    bank_name = models.CharField("Банк", max_length=255, blank=True)
    bik = models.CharField("БИК", max_length=20, blank=True)
    corr_account = models.CharField("Корр. счёт", max_length=50, blank=True)
    phone = models.CharField("Телефон", max_length=50, blank=True)
    email = models.EmailField("Email", blank=True)

    def __str__(self):
        return self.name

class PickupPoint(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="pickup_points")
    city = models.CharField("Город", max_length=100)
    address = models.CharField("Адрес", max_length=255)
    note = models.CharField("Примечание (например, метро)", max_length=255, blank=True)

    def __str__(self):
        return f"{self.city}, {self.address}"

class CertificationHistory(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="cert_history")
    year = models.IntegerField("Год")
    description = models.CharField("Описание", max_length=255)

    def __str__(self):
        return f"{self.year} — {self.description}"

