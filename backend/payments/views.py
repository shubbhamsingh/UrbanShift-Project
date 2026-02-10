import logging
import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Transaction
from .serializers import TransactionSerializer
from relocation.models import MoveRequest

logger = logging.getLogger(__name__)

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
                    
                    # ✅ Send Mover Booking & Payment Emails
                    if move.company:
                         from users.utils_email import send_notification_email
                         from django.utils import timezone
                         
                         # 1. Booking Confirmed Email
                         send_notification_email(move.company, 'booking_confirmed_company', {
                             'userName': move.company.username,
                             'customerName': request.user.username,
                             'customerPhone': 'N/A', # Need to fetch profile if available
                             'moveDate': str(move.move_date),
                             'fromCity': move.source,
                             'toCity': move.destination,
                             'tokenAmount': str(move.payment_amount),
                             'bookingLink': f"https://urbanshift.vercel.app/company/my-jobs"
                         })

                         # 2. Payment Received Email
                         send_notification_email(move.company, 'payment_received_company', {
                             'userName': move.company.username,
                             'amount': str(move.payment_amount),
                             'bookingId': str(move.id),
                             'customerName': request.user.username,
                             'date': timezone.now().strftime("%Y-%m-%d"),
                             'walletLink': f"https://urbanshift.vercel.app/company/wallet"
                         })

                except MoveRequest.DoesNotExist:
                    pass
            
            # ✅ Send Payment Success Email (Property/General)
            # PropertyDetail.js se 'property_title' aur 'amount' aana chahiye
            from users.utils_email import send_notification_email
            from django.utils import timezone
            
            # 1. Email to Buyer (Payer)
            send_notification_email(request.user, 'payment_success', {
                'userName': request.user.username,
                'amount': request.data.get('amount', '5000'),
                'propertyTitle': request.data.get('property_title', 'UrbanShift Property'), # Frontend must send this
                'txnId': razorpay_payment_id,
                'date': timezone.now().strftime("%Y-%m-%d")
            })

            # 2. Email to Seller (If Property)
            property_id = request.data.get('property_id')
            if property_id:
                try:
                    from properties.models import Property
                    property_obj = Property.objects.get(id=property_id)
                    
                    # ✅ Mark Property as Sold
                    if not property_obj.is_sold:
                        property_obj.buyer = request.user
                        property_obj.is_sold = True
                        property_obj.save()
                    
                    send_notification_email(property_obj.seller, 'property_sold', {
                        'userName': property_obj.seller.username,
                        'propertyTitle': property_obj.title,
                        'amount': str(request.data.get('amount', '0')),
                        'buyerName': request.user.username,
                        'txnId': razorpay_payment_id,
                        'date': timezone.now().strftime("%Y-%m-%d"),
                        'dashboardLink': "https://urbanshift.vercel.app/dashboard/seller"
                    })

                    # 📧 Send Admin Alert (Property Sold)
                    try:
                        from django.contrib.auth import get_user_model
                        User = get_user_model()
                        admin_user = User.objects.filter(is_superuser=True).first()
                        if admin_user:
                             send_notification_email(admin_user, 'property_sold_admin', {
                                'sellerName': property_obj.seller.username,
                                'propertyTitle': property_obj.title,
                                'soldPrice': str(request.data.get('amount', '0')),
                                'buyerName': request.user.username
                             })
                    except Exception as e:
                        logger.error(f"Admin Alert Failed: {e}")
                except Exception as e:
                     logger.error(f"Error sending seller notification: {e}")

            return Response({'message': 'Payment Verified Successfully!'}, status=status.HTTP_200_OK)

        except razorpay.errors.SignatureVerificationError:
            return Response({'error': 'Payment Verification Failed'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)