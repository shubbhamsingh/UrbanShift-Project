from pathlib import Path
import os
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-change-me-urbanshift-dev-key'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party apps
    'rest_framework',
    'corsheaders',

    # Custom Apps
    'users',
    'properties',
    'relocation',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ✅ CORS Sabse upar
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media Files (Images Upload)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ✅ Custom User Model
AUTH_USER_MODEL = 'users.User'

# ✅ CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_ALL_ORIGINS = True

# 👇 ✅ REST FRAMEWORK CONFIGURATION (Ye Missing Tha!)
# Iske bina server ko pata nahi chalta ki Token kaise check karna hai
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

# ✅ JWT SETTINGS
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1), # Token 1 din tak chalega
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# 👇 PURANA 'JAZZMIN_UI_TWEAKS' HATAYEIN AUR YE NAYA WALA PASTE KAREIN

JAZZMIN_UI_TWEAKS = {
    # ✅ THEME: 'Cyborg' sabse best Deep Black theme hai (Site jaisa)
    "theme": "cyborg", 
    
    # ✅ Colors Customization (UrbanShift Branding)
    "navbar": "navbar-dark",          # Top Bar Black
    "brand_colour": "navbar-dark",    # Logo Background Black
    "sidebar": "sidebar-dark-warning", # Sidebar Black + Orange Active Links
    "accent": "accent-warning",       # Highlights Orange honge
    
    # ✅ Text & Layout
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "no_navbar_border": True,         # Border hata diya clean look ke liye
    "navbar_fixed": False,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": False,
    "sidebar_nav_small_text": False,
    
    # ✅ Buttons Styling (Site se match karne ke liye)
    "button_classes": {
        "primary": "btn-primary",    # Blue (Default action)
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",    # Orange (Important action)
        "danger": "btn-danger",      # Red (Delete)
        "success": "btn-success"     # Green (Save)
    }
}