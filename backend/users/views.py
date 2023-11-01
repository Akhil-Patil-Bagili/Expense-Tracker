# Standard library imports
from django.http import HttpResponse
from django.contrib.auth import authenticate, login

# Third-party imports
from rest_framework import status, generics, exceptions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken


# Local application/library specific imports
from .serializers import UserSerializer, ExpenseSerializer, IncomeSerializer
from . import models
from .models import Expense, Income


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def UserTotalExpenses(request):
    user = request.user
    total_expenses = Expense.objects.filter(user=user).aggregate(models.Sum('amount'))['amount__sum'] or 0

    return Response({'total_expenses': total_expenses}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def UserTotalIncomes(request):
    user = request.user
    total_incomes = Income.objects.filter(user=user).aggregate(models.Sum('amount'))['amount__sum'] or 0

    return Response({'total_incomes': total_incomes}, status=status.HTTP_200_OK)

class UserExpenseListView(APIView):
    permission_classes = [IsAuthenticated]  # Define the permission_classes here

    def get(self, request):
        user = request.user
        expenses = Expense.objects.filter(user=user).order_by('-date')

        # Add pagination for expenses
        paginator = PageNumberPagination()
        paginator.page_size = 10  # Number of expenses per page
        result_page = paginator.paginate_queryset(expenses, request)
        
        serializer = ExpenseSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class UserIncomeListView(APIView):
    permission_classes = [IsAuthenticated]  # Define the permission_classes here

    def get(self, request):
        user = request.user
        incomes = Income.objects.filter(user=user).order_by('-date')

        # Add pagination for expenses
        paginator = PageNumberPagination()
        paginator.page_size = 10  # Number of expenses per page
        result_page = paginator.paginate_queryset(incomes, request)
        
        serializer = IncomeSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)



class UserExpenseIncomeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        expenses = Expense.objects.filter(user=user).order_by('-date')
        incomes = Income.objects.filter(user=user).order_by('-date')

        expense_serializer = ExpenseSerializer(expenses, many=True)
        income_serializer = IncomeSerializer(incomes, many=True)

        data = {
            'expenses': expense_serializer.data,
            'incomes': income_serializer.data,
        }

        return Response(data, status=status.HTTP_200_OK)


from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Expense
from .serializers import ExpenseSerializer
from rest_framework.exceptions import ValidationError

class UserExpenseCreateView(generics.CreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            # Print the received data for debugging purposes
            print("Received data:", self.request.data)
            
            # Check if the user is authenticated
            if not self.request.user.is_authenticated:
                raise ValidationError("User is not authenticated.")
            
            # Validate the serializer data
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Save the expense with the user information
            serializer.save(user=self.request.user)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Print the exception message for debugging purposes
            print("Exception:", str(e))
            raise ValidationError(str(e))  # Raise a ValidationError with the exception message



from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Income
from .serializers import IncomeSerializer
from rest_framework.exceptions import ValidationError



class UserIncomeCreateView(generics.CreateAPIView):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            # Print the received data for debugging purposes
            print("Received data:", self.request.data)
            
            # Check if the user is authenticated
            if not self.request.user.is_authenticated:
                raise ValidationError("User is not authenticated.")
            
            # Validate the serializer data
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Save the expense with the user information
            serializer.save(user=self.request.user)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Print the exception message for debugging purposes
            print("Exception:", str(e))
            raise ValidationError(str(e))  # Raise a ValidationError with the exception message


from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import UserSerializer

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this view

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            print("Received data:", request.data)
            username = request.data.get('username')
            password = request.data.get('password')

            # Attempt to authenticate the user
            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                return Response({'access': access_token, 'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                print("Invalid username or password")
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            # Print the exception message for debugging purposes
            print("Exception:", str(e))
            return Response({'error': 'An error occurred during login'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




def index(request):
    return HttpResponse("Hello, this is the Expense Tracker API!")
