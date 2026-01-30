from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Property

User = get_user_model()

class PropertyModelTests(TestCase):
    def setUp(self):
        self.seller = User.objects.create_user(
            username='seller1',
            password='test123',
            user_type='SELLER',
            is_verified=True
        )

    def test_create_property(self):
        """Test creating a property"""
        prop = Property.objects.create(
            seller=self.seller,
            title='Test Property',
            description='A nice property',
            price=5000000,
            location='Mumbai',
            category='SELL',
            bedrooms='2BHK'
        )
        self.assertEqual(prop.title, 'Test Property')
        self.assertFalse(prop.is_sold)

    def test_property_str_method(self):
        """Test property string representation"""
        prop = Property.objects.create(
            seller=self.seller,
            title='Test Home',
            description='Test',
            price=1000000,
            location='Delhi'
        )
        self.assertIn('Test Home', str(prop))
        self.assertIn('AVAILABLE', str(prop))


class PropertyAPITests(APITestCase):
    def test_list_properties_public(self):
        """Test that anyone can list properties"""
        response = self.client.get('/api/properties/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_property_requires_auth(self):
        """Test that creating property requires authentication"""
        data = {
            'title': 'New Property',
            'description': 'Test',
            'price': 1000000,
            'location': 'Mumbai'
        }
        response = self.client.post('/api/properties/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)