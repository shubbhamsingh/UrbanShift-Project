from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q  # 👈 Ye import zaroori hai privacy ke liye
from .models import MoveRequest
from .serializers import MoveRequestSerializer

class MoveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = MoveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    def get_queryset(self):
        user = self.request.user
        
        # Check user type safely
        user_type = getattr(user, 'user_type', None)

        if user_type == 'COMPANY':
            # 👇 PRIVACY FIX: 
            # 1. Ya to request PENDING ho (Marketplace)
            # 2. YA fir wo request ISI company ne accept ki ho (My Jobs)
            return MoveRequest.objects.filter(
                Q(status='PENDING') | Q(company=user)
            ).order_by('-created_at')
        
        # Customer ko sirf apna data dikhega
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
            
            # Agar ACCEPT kiya, to Company ka Thappa laga do
            if new_status == 'ACCEPTED':
                move_request.company = request.user
            
            move_request.save()
            return Response({'status': 'updated'})
        
        return Response({'error': 'Invalid status'}, status=400)