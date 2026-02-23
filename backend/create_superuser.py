import os
import django

# Django settings setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Credentials (Render Environment Variables se lenge)
username = os.environ.get("ADMIN_USERNAME", "admin")
password = os.environ.get("ADMIN_PASSWORD", "TemporaryPass123")
email = "urbanshiftt@gmail.com"

if not User.objects.filter(username=username).exists():
    print(f"Creating superuser: {username}")
    User.objects.create_superuser(username, email, password)
    print("✅ Superuser created successfully!")
else:
    # ✅ Update existing superuser's email if it changed
    admin = User.objects.get(username=username)
    if admin.email != email:
        admin.email = email
        admin.save()
        print(f"✅ Superuser email updated to: {email}")
    else:
        print("ℹ️ Superuser already exists with correct email.")