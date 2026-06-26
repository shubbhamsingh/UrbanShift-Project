import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from properties.models import Property, PropertyImage

User = get_user_model()

def run():
    print("Starting data population...")

    # 1. Create Dummy Users
    users_data = [
        {"username": "dummy_seller", "email": "seller@urbanshift.com", "user_type": "SELLER"},
        {"username": "dummy_buyer", "email": "buyer@urbanshift.com", "user_type": "BUYER"},
        {"username": "dummy_company", "email": "company@urbanshift.com", "user_type": "COMPANY"},
    ]

    created_users = {}
    for u_data in users_data:
        user, created = User.objects.get_or_create(username=u_data["username"], defaults={
            "email": u_data["email"],
            "user_type": u_data["user_type"]
        })
        if created:
            user.set_password("Test@1234")
            user.save()
            print(f"Created user: {user.username}")
        else:
            print(f"User {user.username} already exists")
        created_users[u_data["username"]] = user

    seller = created_users["dummy_seller"]

    # 2. Create Dummy Properties
    properties_data = [
        {
            "title": "Luxury Sea-Facing Villa",
            "description": "Experience luxury like never before with this beautiful sea-facing villa. Features modern architecture, a private pool, and 24/7 security.",
            "price": "45000000.00",
            "location": "Bandra West, Mumbai",
            "category": "SELL",
            "bedrooms": "Villa",
            "image_url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop"
        },
        {
            "title": "Modern 2 BHK Apartment",
            "description": "Fully furnished 2 BHK apartment in a prime location. Close to metro station and shopping malls. Perfect for small families.",
            "price": "35000.00",
            "location": "Vasant Kunj, Delhi",
            "category": "RENT",
            "bedrooms": "2BHK",
            "image_url": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop"
        },
        {
            "title": "Premium 3 BHK Condo",
            "description": "Spacious 3 BHK condo with premium amenities including gym, club house, and dedicated parking.",
            "price": "12000000.00",
            "location": "Whitefield, Bangalore",
            "category": "SELL",
            "bedrooms": "3BHK",
            "image_url": "https://images.unsplash.com/photo-1502672260266-1c1de2d936b4?w=800&auto=format&fit=crop"
        },
        {
            "title": "Cozy 1 BHK Studio",
            "description": "Perfect bachelor pad. Newly renovated studio apartment with smart home features and high-speed internet included.",
            "price": "18000.00",
            "location": "Koregaon Park, Pune",
            "category": "RENT",
            "bedrooms": "1BHK",
            "image_url": "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop"
        },
        {
            "title": "Beachside Holiday Villa",
            "description": "A stunning holiday home just 5 minutes from the beach. Features 4 bedrooms, a huge lawn, and a BBQ area.",
            "price": "28000000.00",
            "location": "Candolim, Goa",
            "category": "SELL",
            "bedrooms": "Villa",
            "image_url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop"
        }
    ]

    # Check if properties exist to avoid duplicate spam on re-run
    if Property.objects.filter(seller=seller).count() >= 5:
        print("Dummy properties already exist for this seller. Skipping property creation.")
    else:
        for p_data in properties_data:
            img_url = p_data.pop("image_url")
            
            # Create property
            prop = Property.objects.create(
                seller=seller,
                **p_data
            )
            
            # Create image linking to property
            PropertyImage.objects.create(
                property=prop,
                image_url=img_url
            )
            print(f"Created property: {prop.title}")

    print("Dummy data population complete!")

if __name__ == "__main__":
    run()
