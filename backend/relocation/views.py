from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q 
from .models import MoveRequest
from .serializers import MoveRequestSerializer

# 1. Main ViewSet (Create, Update, Delete ke liye)
class MoveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = MoveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    def get_queryset(self):
        user = self.request.user
        user_type = getattr(user, 'user_type', None)

        if user_type == 'COMPANY':
            # Company ko Pending aur apni Accepted requests dikhengi
            return MoveRequest.objects.filter(
                Q(status='PENDING') | Q(company=user)
            ).order_by('-created_at')
        
        # Customer ko apna data dikhega
        return MoveRequest.objects.filter(customer=user).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        move_request = self.get_object()
        new_status = request.data.get('status')
        user_type = getattr(request.user, 'user_type', None)
        
        if user_type != 'COMPANY':
            return Response({'error': 'Only companies can update status'}, status=403)

        if new_status in ['ACCEPTED', 'COMPLETED', 'CANCELLED']:
            move_request.status = new_status
            if new_status == 'ACCEPTED':
                move_request.company = request.user
            move_request.save()
            return Response({'status': 'updated'})
        
        return Response({'error': 'Invalid status'}, status=400)

# 2. Specific View (Sirf "My Moves" page ke liye)
class UserMoveRequestsView(generics.ListAPIView):
    serializer_class = MoveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # ✅ FIX: 'user' ki jagah 'customer' use kiya hai
        return MoveRequest.objects.filter(customer=self.request.user).order_by('-created_at')