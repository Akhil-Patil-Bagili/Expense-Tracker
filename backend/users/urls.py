from django.urls import path
from django.views.generic import TemplateView

from .views import (
    index,
    UserRegistrationView,
    UserLoginView,
    UserExpenseListView,
    UserIncomeListView,
    UserTotalExpenses,
    UserTotalIncomes,
    UserExpenseCreateView,
    UserIncomeCreateView
)

urlpatterns = [
    path('', index, name='index'),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('api/expenses/', UserExpenseListView.as_view(), name='user-expenses'),
    path('api/incomes/', UserIncomeListView.as_view(), name='user-incomes'),
    path('api/total-expenses/', UserTotalExpenses, name='user-total-expenses'),
    path('api/total-incomes/', UserTotalIncomes, name='user-total-incomes'),
    path('api/expenses/create/', UserExpenseCreateView.as_view(), name='user-expense-create'),
    path('api/incomes/create/', UserIncomeCreateView.as_view(), name='user-income-create')
]
