from datetime import date

from django.utils import timezone

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from .models import Product, Review, Category


class ProductEdit(forms.Form):
    name = forms.CharField(max_length=100)
    price = forms.DecimalField(max_digits=10, decimal_places=2)
    unit = forms.ChoiceField(choices=Product.UNIT_CHOICES)
    category = forms.ModelChoiceField(queryset=Category.objects.all())

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['text', 'rating']

    def clean_rating(self):
        rating = self.cleaned_data['rating']
        if rating < 0:
            raise forms.ValidationError("Рейтинг не может быть меньше 0.")
        elif rating > 10:
            raise forms.ValidationError("Рейтинг не может быть больше 10.")
        return rating

class SaleProductForm(forms.Form):
    city = forms.CharField(max_length=100)
    quantity = forms.IntegerField(min_value=1)
    promo_code = forms.CharField(max_length=20, required=False)

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True, label="Имя")
    last_name = forms.CharField(max_length=30, required=True, label="Фамилия")
    phone = forms.RegexField(
        regex=r'^\+375\d{9}$',
        max_length=20,
        required=True,
        label="Телефон",
        error_messages={
            'invalid': 'Введите номер в формате +375XXXXXXXXX'
        }
    )

    birth_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}),
        label="Дата рождения",
        required=True
    )

    class Meta:
        model = User
        fields = (
            "username", "email", "first_name", "last_name",
            "phone", "birth_date", "password1", "password2"
        )

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        if commit:
            user.save()
        return user


class CheckoutForm(forms.Form):
    city = forms.CharField(
        max_length=100,
        label='Город доставки',
        widget=forms.TextInput(attrs={'placeholder': 'Введите город доставки'})
    )
    delivery_date = forms.DateField(
        label='Дата доставки',
        widget=forms.DateInput(attrs={'type': 'date'}),
        initial=timezone.now().date() + timezone.timedelta(days=7)
    )
    promo_code = forms.CharField(
        max_length=20,
        required=False,
        label='Промокод',
        widget=forms.TextInput(attrs={'placeholder': 'Введите промокод (если есть)'})
    )
    comments = forms.CharField(
        required=False,
        label='Комментарии к заказу',
        widget=forms.Textarea(attrs={'rows': 3, 'placeholder': 'Особые пожелания к доставке'})
    )