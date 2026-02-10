import logging
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
import uuid  # 👈 New Import (Fake ID generate karne ke liye)
from .models import MoveRequest
from .serializers import MoveRequestSerializer, ReviewSerializer

logger = logging.getLogger(__name__)

# 1. Submit Request (Customer ke liye)
class SubmitMoveRequestView(generics.CreateAPIView):
    serializer_class = MoveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        move_request = serializer.save(customer=self.request.user)
        
        # 📧 Send Quote Request Email
        from users.utils_email import send_notification_email
        send_notification_email(self.request.user, 'movers_quote_received', {
            'userName': self.request.user.username,
            'fromCity': move_request.source,
            'toCity': move_request.destination,
            'moveDate': str(move_request.move_date),
            'moveSize': move_request.move_size,
            'itemsList': move_request.items_list or "Standard Items",
            'requestLink': f"https://urbanshift.vercel.app/my-moves"
        })

        # 📧 2. Send New Job Alert to All Movers (Companies)
        # (Ideal scenario: Filter by Service Area, but sending to all Verified Companies for now)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        movers = User.objects.filter(user_type='COMPANY', is_verified=True)
        
        for mover in movers:
            send_notification_email(mover, 'new_job_opportunity', {
                'userName': mover.username,
                'customerName': self.request.user.username,
                'fromCity': move_request.source,
                'toCity': move_request.destination,
                'moveDate': str(move_request.move_date),
                'moveSize': move_request.move_size,
                'dashboardLink': "https://urbanshift.vercel.app/company/dashboard"
            })

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
            # Capture old company before clearing/changing if needed
            assigned_company = move_request.company
            
            move_request.status = new_status
            
            # Agar ACCEPT kiya, to Company assign kar do
            if new_status == 'ACCEPTED':
                move_request.company = request.user
            
            move_request.save()

            # 📧 Send Cancellation Email
            if new_status == 'CANCELLED':
                 # Determine who cancelled
                 cancelled_by = request.user
                 is_company = getattr(cancelled_by, 'user_type', None) == 'COMPANY'
                 
                 # 1. To Company (if User Cancelled) - ALREADY DONE
                 if assigned_company and not is_company:
                     from users.utils_email import send_notification_email
                     send_notification_email(assigned_company, 'booking_cancelled_company', {
                         'userName': assigned_company.username,
                         'bookingId': str(move_request.id),
                         'moveDate': str(move_request.move_date),
                         'fromCity': move_request.source,
                         'toCity': move_request.destination,
                         'cancellationReason': request.data.get('reason', 'Client Request')
                     })

                 # 2. To Admin (Alert based on who cancelled)
                 try:
                    from django.contrib.auth import get_user_model
                    User = get_user_model()
                    admin_user = User.objects.filter(is_superuser=True).first()
                    
                    if admin_user:
                        if is_company: # Mover Rejected
                             send_notification_email(admin_user, 'job_rejected_by_mover', {
                                'bookingId': str(move_request.id),
                                'moverName': request.user.username,
                                'rejectionReason': request.data.get('reason', 'Not provided'),
                                'customerName': move_request.customer.username,
                                'adminPanelLink': "https://urbanshift.vercel.app/admin/moves"
                             })
                        else: # User Cancelled
                             send_notification_email(admin_user, 'booking_cancelled_by_user', {
                                'userName': request.user.username,
                                'bookingId': str(move_request.id),
                                'refundStatus': 'Manual Review Needed',
                                'cancellationReason': request.data.get('reason', 'Not provided')
                             })
                 except Exception as e:
                     logger.error(f"Admin Alert Failed: {e}")
            
            # 📧 Send Completion Email to Admin
            if new_status == 'COMPLETED':
                 try:
                    from django.contrib.auth import get_user_model
                    User = get_user_model()
                    admin_user = User.objects.filter(is_superuser=True).first()
                    if admin_user:
                         send_notification_email(admin_user, 'job_completed', {
                            'bookingId': str(move_request.id),
                            'moverName': request.user.username,
                            'companyName': getattr(request.user, 'company_name', 'Company'),
                            'customerName': move_request.customer.username,
                            'fromCity': move_request.source,
                            'toCity': move_request.destination,
                            'completionTime': "Now"
                         })
                 except Exception as e:
                     logger.error(f"Admin Alert Failed: {e}") 

            return Response({'status': 'updated'})

        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

# 5. Add Review (Feature)
class AddReviewView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            move_request = MoveRequest.objects.get(pk=pk)
        except MoveRequest.DoesNotExist:
            return Response({'error': 'Move Request not found'}, status=status.HTTP_404_NOT_FOUND)

        # 1. Security Check: Kya ye user wahi customer hai?
        if move_request.customer != request.user:
            return Response({'error': 'You are not authorized to review this move.'}, status=status.HTTP_403_FORBIDDEN)

        # 2. Logic Check: Kya move complete ho chuka hai?
        if move_request.status != 'COMPLETED':
            return Response({'error': 'You can only review completed moves.'}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Duplicate Check: Kya pehle se review hai?
        if hasattr(move_request, 'review'):
            return Response({'error': 'You have already reviewed this move.'}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Save Review
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                move=move_request,
                reviewer=request.user,
                company=move_request.company
            )
            
            # 📧 Send Review Notification to Company
            from users.utils_email import send_notification_email
            company_email_thread = send_notification_email(move_request.company, 'new_review_received', {
                'userName': move_request.company.username, 
                'customerName': request.user.username,
                'rating': str(request.data.get('rating', 5)),
                'reviewText': request.data.get('comment', 'No comments'),
                'reviewLink': f"https://urbanshift.vercel.app/company/reviews"
            })
            
            # 📧 Send Admin Alert
            try:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                admin_user = User.objects.filter(is_superuser=True).first()
                if admin_user:
                    send_notification_email(admin_user, 'new_review_posted', {
                        'userName': request.user.username, 
                        'moverName': move_request.company.username,
                        'rating': str(request.data.get('rating', 5)),
                        'reviewText': request.data.get('comment', 'No comments'),
                        'adminLink': f"https://urbanshift.vercel.app/admin/reviews"
                    })
            except Exception as e:
                logger.error(f"Admin Alert Failed: {e}")
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 👇 6. Process Mock Payment (NEW FEATURE)
class ProcessPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            move_request = MoveRequest.objects.get(pk=pk)
        except MoveRequest.DoesNotExist:
            return Response({'error': 'Move Request not found'}, status=status.HTTP_404_NOT_FOUND)

        # 1. Check permissions (Sirf Customer hi pay karega)
        if move_request.customer != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

        # 2. Check if already paid
        if move_request.is_paid:
            return Response({'message': 'Already paid!'}, status=status.HTTP_200_OK)

        # 3. Mock Payment Logic
        # (Yahan hum man rahe hain payment successful ho gaya)
        move_request.is_paid = True
        move_request.payment_amount = 5000.00  # Filhal hardcode (mock) value
        
        # Ek fake transaction ID generate karna
        fake_txn_id = f"TXN_{uuid.uuid4().hex[:8].upper()}"
        move_request.transaction_id = fake_txn_id
        
        move_request.save()
        
        # 📧 Send Booking Confirmed Email
        from users.utils_email import send_notification_email
        send_notification_email(request.user, 'movers_booking_confirmed', {
            'userName': request.user.username,
            'moveDate': str(move_request.move_date),
            'fromCity': move_request.source,
            'toCity': move_request.destination,
            'tokenAmount': '5000',
            'companyName': move_request.company.username if move_request.company else "UrbanShift Partner",
            'driverName': 'Assigned Driver',
            'driverPhone': '9999999999',
            'bookingLink': f"https://urbanshift.vercel.app/my-moves"
        })

        return Response({
            'status': 'Payment Successful',
            'transaction_id': fake_txn_id,
            'amount': 5000.00
        }, status=status.HTTP_200_OK)