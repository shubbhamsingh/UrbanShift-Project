from django.urls import path
from .views import (
    SubmitMoveRequestView, 
    CompanyMoveRequestsView, 
    UpdateMoveStatusView, 
    UserMoveRequestsView,
    AddReviewView,
    ProcessPaymentView # 👈 New Import (Payment ke liye)
)

urlpatterns = [
    # Submit Request
    path('submit/', SubmitMoveRequestView.as_view(), name='submit-move'),
    path('move-requests/', SubmitMoveRequestView.as_view(), name='move-requests-list'),

    # Company View
    path('company-requests/', CompanyMoveRequestsView.as_view(), name='company-requests'),
    
    # Status Update
    path('move-requests/<int:pk>/update_status/', UpdateMoveStatusView.as_view(), name='update-status'),

    # User History (My Moves)
    path('my-moves/', UserMoveRequestsView.as_view(), name='user-moves'),

    # Review Add karne ka URL
    path('move-requests/<int:pk>/add-review/', AddReviewView.as_view(), name='add-review'),

    # 👇 Payment Process karne ka URL (New Feature)
    path('move-requests/<int:pk>/pay/', ProcessPaymentView.as_view(), name='process-payment'),
]