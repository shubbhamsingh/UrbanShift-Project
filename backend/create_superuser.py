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
    print("[OK] Superuser created successfully!")
else:
    # ✅ Update existing superuser's email if it changed
    admin = User.objects.get(username=username)
    if admin.email != email:
        admin.email = email
        admin.save()
        print(f"[OK] Superuser email updated to: {email}")
    else:
        print("[INFO] Superuser already exists with correct email.")