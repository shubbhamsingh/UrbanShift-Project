from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()

class UserModelTests(TestCase):
    def test_create_user(self):
        """Test creating a new user"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.user_type, 'BUYER')  # Default value
        self.assertFalse(user.is_verified)

    def test_user_str_method(self):
        """Test __str__ returns username"""
        user = User.objects.create_user(username='testuser', password='test123')
        self.assertEqual(str(user), 'testuser')


class UserAPITests(APITestCase):
    def test_register_user(self):
        """Test user registration endpoint"""
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'StrongPass123!',
            'user_type': 'BUYER'
        }
        response = self.client.post('/api/users/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_requires_verification(self):
        """Test that unverified users cannot login"""
        # Create inactive user
        user = User.objects.create_user(
            username='unverified',
            email='unverified@test.com',
            password='test123',
            is_active=False
        )
        
        data = {'username': 'unverified', 'password': 'test123'}
        response = self.client.post('/api/users/login/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)