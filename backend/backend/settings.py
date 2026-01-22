from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-a@&t7omml3r^l$ra@^fqx*hmasc*6-jrpj%(0k#=(^1l7h+d_u'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# ✅ CHANGE 1: Allow all hosts for Render
ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'corsheaders',

    # Hamare Custom Apps
    'users',
    'properties',
    'relocation',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    
    # ✅ CHANGE 2: WhiteNoise for Static Files (CSS/Images on Render)
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
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# --- DATABASE CONFIGURATION (Neon / Render) ---
DATABASES = {
    'default': dj_database_url.config(
        # Aapka Sahi Neon URL ✅
        default='postgresql://neondb_owner:npg_VW3uMgo1TdpQ@ep-super-fire-a1p6e23d-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
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


# --- STATIC FILES CONFIGURATION (WhiteNoise) ---
STATIC_URL = 'static/'
# ✅ CHANGE 3: Static Root for Render
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# CSS Compression
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Hamara Custom User Model
AUTH_USER_MODEL = 'users.User'

# React ke liye permission (CORS)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://urbanshift-frontend.vercel.app", # Future Vercel URL
]
# Testing ke liye sabko allow kar sakte hain (Optional)
CORS_ALLOW_ALL_ORIGINS = True