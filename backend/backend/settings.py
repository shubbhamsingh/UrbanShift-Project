from pathlib import Path
import os
from datetime import timedelta
import dj_database_url  # 👈 Database connect karne ke liye
from dotenv import load_dotenv  # 👈 .env file padhne ke liye

# .env file load karein
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ==========================================
# 🔐 SECURITY SETTINGS (SECURE)
# ==========================================

# Secret Key ab .env se aayegi
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-change-me-urbanshift-dev-key')

# Debug Mode
DEBUG =  os.environ.get('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Application definition
INSTALLED_APPS = [
    'daphne',  # ✅ WSGI se pehle ASGI load hona chahiye (Chat ke liye zaroori)
    'jazzmin',  # ✅ Jazzmin MUST be at the top of admin
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party apps
    'rest_framework',
    'corsheaders',
    'channels', # ✅ Channels library

    # Custom Apps
    'users',
    'properties',
    'relocation',
    'chat',
    'payments', # ✅ Naya Payments App
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # ✅ Cors sabse upar hona chahiye
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # ✅ Static files serve karne ke liye
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

# ✅ WSGI ki jagah ab ASGI use hoga (Async Chat ke liye)
WSGI_APPLICATION = 'backend.wsgi.application'
ASGI_APPLICATION = 'backend.asgi.application' 

# ==========================================
# 💬 CHANNELS LAYER CONFIGURATION
# ==========================================
# Smart switch between Redis (Production) and InMemory (Development)
if os.environ.get('REDIS_URL'):
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels_redis.core.RedisChannelLayer',
            'CONFIG': {
                'hosts': [os.environ.get('REDIS_URL')],
            },
        },
    }
else:
    # Development ke liye InMemory
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels.layers.InMemoryChannelLayer',
        },
    }
# ==========================================
# 🗄️ DATABASE CONFIGURATION (SMART SWITCH)
# ==========================================

DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
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

# --- STATIC FILES CONFIGURATION ---
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = os.environ.get('AUTH_USER_MODEL', 'users.User')

# ==========================================
# 🌍 CORS & CSRF CONFIGURATION
# ==========================================

CORS_ALLOW_ALL_ORIGINS = True  # ✅ Allow all for easier access (or specify exact domains below)

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://urbanshift.vercel.app", # ✅ Corrected Vercel URL
    "https://urban-shift-project.vercel.app", 
]

CSRF_TRUSTED_ORIGINS = [
    "https://urbanshift-project.onrender.com", 
    "https://urbanshift.vercel.app", # ✅ Corrected here too
    "https://urban-shift-project.vercel.app",
]

# REST FRAMEWORK CONFIGURATION
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

# JWT SETTINGS
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# ==========================================
# 📧 EMAIL CONFIGURATION (BREVO SMTP)
# ==========================================
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp-relay.brevo.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('BREVO_SMTP_LOGIN', '75b4f8001@smtp-brevo.com') # Default fallback (should be env)
EMAIL_HOST_PASSWORD = os.environ.get('BREVO_API_KEY') # Using API Key as password for SMTP
DEFAULT_FROM_EMAIL = 'UrbanShift <noreply@urbanshift.vercel.app>'
SERVER_EMAIL = 'noreply@urbanshift.vercel.app'

BREVO_API_KEY = os.environ.get('BREVO_API_KEY')

# ==========================================
# 💳 RAZORPAY CONFIGURATION
# ==========================================
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')

# ==========================================
# 🎨 JAZZMIN SETTINGS
# ==========================================

JAZZMIN_SETTINGS = {
    "site_title": "UrbanShift Admin",
    "site_header": "UrbanShift",
    "site_brand": "UrbanShift",
    "welcome_sign": "Welcome to UrbanShift HQ",
    "copyright": "UrbanShift Ltd",
    
    "site_logo": "img/logo.png",
    "site_logo_classes": "img-fluid", 

    "custom_css": "css/admin_custom.css",
    "custom_js": "js/admin_custom.js",

    "show_ui_builder": True,

    "topmenu_links": [
        {"name": "Home",  "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "View Site", "url": "https://urban-shift-project.vercel.app", "new_window": True},
    ],

    "order_with_respect_to": ["properties", "users", "auth"],
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        "properties.Property": "fas fa-home", 
        "properties.Wishlist": "fas fa-heart",
    },
}

JAZZMIN_UI_TWEAKS = {
    "theme": "default",
    "dark_mode_theme": "darkly",
}