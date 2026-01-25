from django.urls import path
from .views import SubmitMoveRequestView, CompanyMoveRequestsView, UpdateMoveStatusView, UserMoveRequestsView

urlpatterns = [
    # Submit Request
    path('submit/', SubmitMoveRequestView.as_view(), name='submit-move'),
    path('move-requests/', SubmitMoveRequestView.as_view(), name='move-requests-list'), # Backup URL

    # Company View
    path('company-requests/', CompanyMoveRequestsView.as_view(), name='company-requests'),
    
    # Status Update
    path('move-requests/<int:pk>/update_status/', UpdateMoveStatusView.as_view(), name='update-status'),

    # User History (My Moves)
    path('my-moves/', UserMoveRequestsView.as_view(), name='user-moves'),
]