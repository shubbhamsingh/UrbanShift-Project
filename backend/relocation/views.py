from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import MoveRequest
from .serializers import MoveRequestSerializer

# 1. Submit Request (Customer ke liye)
class SubmitMoveRequestView(generics.CreateAPIView):
    serializer_class = MoveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

# 2. Company Dashboard (Company ke liye Pending requests)
class CompanyMoveRequestsView(generics.ListAPIView):
    serializer_class = MoveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Agar user company hai, to Pending jobs aur khud ki accepted jobs dikhao
        if getattr(user, 'user_type', None) == 'COMPANY':
            return MoveRequest.objects.filter(
                Q(status='PENDING') | Q(company=user)
            ).order_by('-created_at')
        return MoveRequest.objects.none()

# 3. User My Moves (User ki booking history)
class UserMoveRequestsView(generics.ListAPIView):
    serializer_class = MoveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Sirf login user ka data dikhao
        return MoveRequest.objects.filter(customer=self.request.user).order_by('-created_at')

# 4. Update Status (Accept/Reject logic)
class UpdateMoveStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            move_request = MoveRequest.objects.get(pk=pk)
        except MoveRequest.DoesNotExist:
            return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        
        # Check if user is Company
        if getattr(request.user, 'user_type', None) != 'COMPANY':
            return Response({'error': 'Only companies can update status'}, status=status.HTTP_403_FORBIDDEN)

        if new_status in ['ACCEPTED', 'COMPLETED', 'CANCELLED']:
            move_request.status = new_status
            
            # Agar ACCEPT kiya, to Company assign kar do
            if new_status == 'ACCEPTED':
                move_request.company = request.user
            
            move_request.save()
            return Response({'status': 'updated'})

        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)