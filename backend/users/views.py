from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status

# Login API
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Django ka built-in checker
    user = authenticate(username=username, password=password)

    if user is not None:
        # Agar password sahi hai
        return Response({
            'message': 'Login Successful',
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff  # Pata chalega ki ye Admin hai ya normal user
        }, status=status.HTTP_200_OK)
    else:
        # Agar password galat hai
        return Response({'error': 'Galat Username ya Password!'}, status=status.HTTP_400_BAD_REQUEST)