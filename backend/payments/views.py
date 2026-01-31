import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Transaction
from .serializers import TransactionSerializer
from relocation.models import MoveRequest

# Initialize Razorpay Client
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreateOrderView(APIView):
    """
    Creates a Razorpay Order ID for payment initiation.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        move_id = request.data.get('move_id') # Identify Kis cheez ki payment hai

        if not amount:
            return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Razorpay expects amount in paise (multiply by 100)
        amount_paise = int(float(amount) * 100)

        data = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": f"receipt_{move_id}",
            "payment_capture": 1 # Auto Capture
        }

        try:
            order = client.order.create(data=data)
            return Response({
                'order_id': order['id'],
                'amount': amount,
                'currency': 'INR',
                'key': settings.RAZORPAY_KEY_ID
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyPaymentView(APIView):
    """
    Verifies the payment signature sent by Razorpay after success.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        move_id = request.data.get('move_id')

        # 1. Verify Signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }

        try:
            client.utility.verify_payment_signature(params_dict)

            # 2. Payment Verified! Save to DB
            
            # Save Transaction Record
            transaction = Transaction.objects.create(
                user=request.user,
                amount=request.data.get('amount', 0), # Get from request
                transaction_id=razorpay_payment_id,
                status='SUCCESS',
                description=f"Payment for {request.data.get('property_title', 'Service/Move')}"
            )

            # Update Move Request Status (If Move)
            if move_id:
                try:
                    move = MoveRequest.objects.get(id=move_id)
                    move.is_paid = True
                    move.transaction_id = razorpay_payment_id
                    move.payment_amount = request.data.get('amount', 5000)
                    move.save()
                    
                    # ✅ TODO: Send Mover Booking Email here
                except MoveRequest.DoesNotExist:
                    pass
            
            # ✅ Send Payment Success Email (Property/General)
            # PropertyDetail.js se 'property_title' aur 'amount' aana chahiye
            from users.utils_email import send_notification_email
            from django.utils import timezone
            
            send_notification_email(request.user, 'payment_success', {
                'userName': request.user.username,
                'amount': request.data.get('amount', '5000'),
                'propertyTitle': request.data.get('property_title', 'UrbanShift Property'), # Frontend must send this
                'txnId': razorpay_payment_id,
                'date': timezone.now().strftime("%Y-%m-%d")
            })

            return Response({'message': 'Payment Verified Successfully!'}, status=status.HTTP_200_OK)

        except razorpay.errors.SignatureVerificationError:
            return Response({'error': 'Payment Verification Failed'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)