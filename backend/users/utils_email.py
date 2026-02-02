from django.conf import settings
import threading
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

def send_email_async(subject, html_content, recipient_list):
    """
    Sends email via Brevo API (HTTP) to bypass SMTP auth issues.
    """
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = settings.BREVO_API_KEY

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    
    # Sender must be a verified email in Brevo
    sender = {"name": "UrbanShift", "email": "urbanshiftt@gmail.com"}
    to = [{"email": recipient_list[0]}] # ApiClient expects list of dicts
    
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        sender=sender,
        subject=subject,
        html_content=html_content
    )

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        print(f"✅ Email sent successfully via Brevo API! MsgId: {api_response.message_id}")
    except ApiException as e:
        print(f"❌ Error sending email via Brevo API: {e}")

def send_notification_email(user, template_type, context={}):
    """
    Sends an email notification based on the provided template type.
    """
    
    if not user.email:
        print("User has no email address. Skipping notification.")
        return

    # User Name Logic
    user_name = context.get('userName', user.first_name or user.username or "User")
    
    # Templates Configuration
    templates = {
        # --- USER / AUTH ---
        'welcome': {
            'subject': "🚀 Welcome to UrbanShift!",
            'body': f"""Hi {user_name},<br><br>
Welcome to UrbanShift! 🎉<br><br>
Your account has been successfully created. You can now:<br>
🏠 Search for your dream home.<br>
🚚 Book verified Packers & Movers easily.<br><br>
Click the link below to start exploring:<br>
👉 <a href="{context.get('exploreLink', 'https://urbanshift.vercel.app/')}">Start Exploring</a><br><br>
We are happy to have you with us!<br><br>
Best Regards,<br>
Team UrbanShift"""
        },
        'email_verification': {
            'subject': "✉️ Verify your Email Address",
            'body': f"""Hi {user_name},<br><br>
Please verify your email address to unlock booking features on UrbanShift.<br><br>
Your Verification Code is: <h3>{context.get('otpCode', 'N/A')}</h3><br>
Or click this link to verify directly: <a href="{context.get('verifyLink', '#')}">Verify Email</a><br><br>
If you didn't sign up for UrbanShift, please ignore this email.<br><br>
Regards,<br>
Team UrbanShift"""
        },
        'forgot_password': {
            'subject': "🔒 Reset Your Password - OTP",
            'body': f"""Hi {user_name},<br><br>
We received a request to reset the password for your UrbanShift account.<br><br>
Your Password Reset OTP is:<br>
<h2>{context.get('otpCode', 'N/A')}</h2><br>
Please enter this OTP on the app to set a new password. This code is valid for 10 minutes.<br><br>
If you did not request a password reset, please ignore this email.<br><br>
Regards,<br>
UrbanShift Security Team"""
        },
        'profile_update': {
            'subject': "✏️ Profile Updated Successfully",
            'body': f"""Hi {user_name},<br><br>
This is to inform you that your profile details (Name/Phone Number) have been updated successfully.<br><br>
Date of Change: {context.get('date', 'Today')}<br>
Time: {context.get('time', 'Just now')}<br><br>
⚠️ Important: If you did NOT make these changes, please contact our support team immediately.<br><br>
Stay Safe,<br>
Team UrbanShift"""
        },

        # --- PROPERTY BOOKING ---
        'payment_success': {
            'subject': "🎉 Payment Successful: Property Booked!",
            'body': f"""Hi {user_name},<br><br>
Congratulations! 🎉<br><br>
Your payment of ₹{context.get('amount', '0')} was successful. You have successfully booked {context.get('propertyTitle', 'Property')}.<br><br>
<b>Transaction Details:</b><br>
• Property: {context.get('propertyTitle', 'Property')}<br>
• Transaction ID: {context.get('txnId', 'N/A')}<br>
• Amount Paid: ₹{context.get('amount', '0')}<br><br>
Welcome to your new home! 🏡<br><br>
Best Regards,<br>
Team UrbanShift"""
        },
        'payment_failed': {
            'subject': "❌ Payment Failed - Action Required",
            'body': f"""Hi {user_name},<br><br>
We noticed that your payment for {context.get('propertyTitle', 'Property')} could not be completed.<br><br>
Reason: The transaction was declined.<br><br>
Please try again.<br><br>
Regards,<br>
Team UrbanShift"""
        },

    # --- MOVERS AND PACKERS ---
        'movers_quote_received': {
            'subject': f"⏳ Quote Request Received: {context.get('fromCity', 'City A')} -> {context.get('toCity', 'City B')}",
            'body': f"""Hi {user_name},<br><br>
We have received your request for shifting services from {context.get('fromCity', 'City A')} to {context.get('toCity', 'City B')}.<br><br>
<b>Request Details:</b><br>
• Move Date: {context.get('moveDate', 'TBD')}<br>
• Items: {context.get('itemsList', 'N/A')}<br><br>
Our verified movers will send you an estimate shortly.<br><br>
Regards,<br>
Team UrbanShift"""
        },
        'movers_booking_confirmed': {
            'subject': f"✅ Booking Confirmed! Move Scheduled for {context.get('moveDate', 'TBD')}",
            'body': f"""Hi {user_name},<br><br>
Your booking is confirmed! 🚚<br><br>
<b>Booking Details:</b><br>
• Date: {context.get('moveDate', 'TBD')}<br>
• Token Paid: ₹{context.get('tokenAmount', '0')}<br><br>
<b>Mover Assigned:</b><br>
• Company: {context.get('companyName', 'UrbanShift Movers')}<br>
• Phone: {context.get('driverPhone', 'TBD')}<br><br>
They will contact you on the moving day.<br><br>
Have a safe move!<br>
Team UrbanShift"""
        },

        # --- SELLER NOTIFICATIONS (NEW) ---
        'property_listed': {
            'subject': f"✅ Your Property is Live! - {context.get('propertyTitle', 'Property')}",
            'body': f"""Hi {user_name},<br><br>
Great news! Your property listing "{context.get('propertyTitle', 'Property')}" has been successfully approved and is now live on UrbanShift.<br><br>
Potential buyers can now view your property and contact you directly.<br><br>
<b>Listing Details:</b><br>
• Title: {context.get('propertyTitle', 'Property')}<br>
• Price: ₹{context.get('price', '0')}<br>
• Location: {context.get('location', 'N/A')}<br><br>
You can manage your listing or edit details from your dashboard.<br><br>
👉 View Your Listing: <a href="{context.get('listingLink', '#')}">View Listing</a><br><br>
Good luck with your sale!<br><br>
Regards, Team UrbanShift"""
        },
        'new_lead': {
            'subject': "📩 New Lead: Someone is interested in your property!",
            'body': f"""Hi {user_name},<br><br>
You have a new inquiry for your property "{context.get('propertyTitle', 'Property')}".<br><br>
<b>Buyer Details:</b><br>
• Name: {context.get('buyerName', 'Interested Buyer')}<br>
• Email: {context.get('buyerEmail', 'N/A')}<br>
• Phone: {context.get('buyerPhone', 'N/A')}<br><br>
They are interested in your property. We recommend contacting them as soon as possible to close the deal!<br><br>
👉 Chat with Buyer: <a href="{context.get('chatLink', '#')}">Start Chat</a><br><br>
Happy Selling! Team UrbanShift"""
        },
        'property_sold': {
            'subject': f"💰 Your Property is SOLD! - {context.get('propertyTitle', 'Property')}",
            'body': f"""Hi {user_name},<br><br>
Congratulations! 🎉<br><br>
Your property "{context.get('propertyTitle', 'Property')}" has been sold successfully to {context.get('buyerName', 'Buyer')}.<br><br>
<b>Transaction Details:</b><br>
• Booking Amount: ₹{context.get('amount', '0')}<br>
• Buyer Name: {context.get('buyerName', 'Buyer')}<br>
• Transaction ID: {context.get('txnId', 'N/A')}<br>
• Date: {context.get('date', 'Today')}<br><br>
The amount has been credited to your UrbanShift Wallet/Bank Account (subject to processing time).<br>
Please coordinate with the buyer for the handover process.<br><br>
👉 View Order Details: <a href="{context.get('dashboardLink', '#')}">Dashboard</a><br><br>
Best Regards, Team UrbanShift"""
        },
        'weekly_performance': {
            'subject': f"📊 Weekly Report: {context.get('views', '0')} people viewed your property!",
            'body': f"""Hi {user_name},<br><br>
Here is how your property "{context.get('propertyTitle', 'Property')}" performed this week:<br><br>
👀 Views: {context.get('views', '0')} ❤️ Wishlisted by: {context.get('wishlistCount', '0')} users 📞 Inquiries: {context.get('inquiryCount', '0')}<br><br>
Want to sell faster? Ensure your photos are high quality and the description is detailed.<br><br>
👉 Manage Listing: <a href="{context.get('listingLink', '#')}">Manage Listing</a><br><br>
Regards, Team UrbanShift"""
        },

        # --- COMPANY / MOVER NOTIFICATIONS (NEW) ---
        'new_job_opportunity': {
            'subject': f"🚚 New Moving Job: {context.get('fromCity', 'CityA')} -> {context.get('toCity', 'CityB')}",
            'body': f"""Hi {user_name},<br><br>
A new moving request matches your service area!<br><br>
<b>Job Details:</b><br>
• Customer: {context.get('customerName', 'User')}<br>
• Route: {context.get('fromCity', 'CityA')} to {context.get('toCity', 'CityB')}<br>
• Move Date: {context.get('moveDate', 'TBD')}<br>
• House Size: {context.get('moveSize', 'TBD')}<br><br>
Review the items list and submit your best quote to win this booking.<br><br>
👉 Submit Quote: <a href="{context.get('dashboardLink', '#')}">View Dashboard</a><br><br>
Hurry! Other movers are also viewing this request.<br><br>
Regards, Team UrbanShift"""
        },
        'booking_confirmed_company': {
            'subject': f"✅ Booking Confirmed! - {context.get('customerName', 'Customer')}",
            'body': f"""Hi {user_name},<br><br>
Great news! Your quote for the move {context.get('fromCity', 'CityA')} to {context.get('toCity', 'CityB')} has been accepted.<br><br>
<b>Booking Details:</b><br>
• Customer Name: {context.get('customerName', 'Customer')}<br>
• Phone: {context.get('customerPhone', 'N/A')}<br>
• Move Date: {context.get('moveDate', 'TBD')}<br>
• Token Paid: ₹{context.get('tokenAmount', '0')} (Credited to your wallet)<br><br>
Please contact the customer immediately to coordinate the pickup time.<br><br>
👉 View Full Details: <a href="{context.get('bookingLink', '#')}">View Booking</a><br><br>
Best of luck! Team UrbanShift"""
        },
        'payment_received_company': {
            'subject': f"💰 Payment Received: ₹{context.get('amount', '0')}",
            'body': f"""Hi {user_name},<br><br>
You have received a payment of ₹{context.get('amount', '0')} for Booking ID #{context.get('bookingId', 'N/A')}.<br><br>
<b>Transaction Details:</b><br>
• Amount: ₹{context.get('amount', '0')}<br>
• Source: Booking Token ({context.get('customerName', 'Customer')})<br>
• Date: {context.get('date', 'Today')}<br><br>
You can view your earnings and withdraw funds from your dashboard.<br><br>
👉 Check Wallet: <a href="{context.get('walletLink', '#')}">My Wallet</a><br><br>
Regards, UrbanShift Finance Team"""
        },
        'booking_cancelled_company': {
            'subject': f"❌ Booking Cancelled - ID #{context.get('bookingId', 'N/A')}",
            'body': f"""Hi {user_name},<br><br>
We regret to inform you that the booking for {context.get('moveDate', 'TBD')} ({context.get('fromCity', 'CityA')} -> {context.get('toCity', 'CityB')}) has been cancelled by the customer.<br><br>
<b>Reason:</b> {context.get('cancellationReason', 'Not specified')}<br><br>
Your slot is now free. We will prioritize your profile for the next relevant lead.<br><br>
Regards, Team UrbanShift"""
        },
        'new_review_received': {
            'subject': "⭐ You got a new 5-Star Rating!",
            'body': f"""Hi {user_name},<br><br>
Customer {context.get('customerName', 'User')} has rated your service!<br><br>
<b>Rating:</b> ⭐⭐⭐⭐⭐ ({context.get('rating', '5')}/5)<br>
<b>Review:</b> "{context.get('reviewText', 'Great service!')}"<br><br>
Great job! Positive reviews help you get more bookings.<br><br>
👉 Reply to Review: <a href="{context.get('reviewLink', '#')}">View Reviews</a><br><br>
Keep it up! Team UrbanShift"""
        },

        # --- ADMIN NOTIFICATIONS (NEW) ---
        'payout_request_received': {
            'subject': f"💸 Action Required: Payout Request of ₹{context.get('amount', '0')}",
            'body': f"""Hi Admin,<br><br>
You have received a new payout request.<br><br>
<b>Request Details:</b><br>
• User Name: {context.get('requesterName', 'User')} ({context.get('userType', 'Partner')})<br>
• Amount: ₹{context.get('amount', '0')}<br>
• Bank Account: {context.get('bankAccountNumber', 'N/A')}<br>
• IFSC: {context.get('ifscCode', 'N/A')}<br><br>
Please verify the earnings and approve the transfer.<br><br>
👉 Approve/Reject Request: <a href="{context.get('adminDashboardLink', '#')}">Admin Dashboard</a><br><br>
Regards, UrbanShift System"""
        },
        'new_registration_alert': {
            'subject': f"👤 New Registration Alert: {context.get('companyName', 'Company')}",
            'body': f"""Hi Admin,<br><br>
A new {context.get('userType', 'Service Provider')} has registered on UrbanShift.<br><br>
<b>Details:</b><br>
• Name: {context.get('userName', 'User')}<br>
• Company: {context.get('companyName', 'N/A')}<br>
• Email: {context.get('email', 'N/A')}<br>
• Phone: {context.get('phone', 'N/A')}<br><br>
Status: Pending Verification ⏳<br><br>
Please review their documents/KYC to activate their account.<br><br>
👉 Verify User: <a href="{context.get('adminVerifyLink', '#')}">Verify User</a><br><br>
Regards, UrbanShift System"""
        },
        'refund_dispute_raised': {
            'subject': f"⚠️ Dispute Raised: Booking ID #{context.get('bookingId', 'N/A')}",
            'body': f"""Hi Admin,<br><br>
A dispute has been raised for Booking ID #{context.get('bookingId', 'N/A')}.<br><br>
Complainant: {context.get('userName', 'User')}<br>
Against: {context.get('providerName', 'Provider')}<br>
Issue: "{context.get('issueDescription', 'N/A')}"<br><br>
Refund Requested: ₹{context.get('refundAmount', '0')}<br><br>
Immediate intervention is required to resolve this issue.<br><br>
👉 Resolve Dispute: <a href="{context.get('resolutionCenterLink', '#')}">Resolution Center</a><br><br>
Regards, UrbanShift System"""
        },
        'reported_listing': {
            'subject': f"🚩 Flagged Content: Property \"{context.get('propertyTitle', 'Property')}\"",
            'body': f"""Hi Admin,<br><br>
A user has reported a property listing as inappropriate/fake.<br><br>
Reported Property: {context.get('propertyTitle', 'Property')}<br>
Seller: {context.get('sellerName', 'Seller')}<br>
Reason: {context.get('reportReason', 'N/A')}<br><br>
Please review the listing and take necessary action (Delete/Ban).<br><br>
👉 Review Listing: <a href="{context.get('reviewLink', '#')}">Review Listing</a><br><br>
Regards, UrbanShift System"""
        },
        'suspicious_login': {
            'subject': "🔒 Security Alert: New Admin Login",
            'body': f"""Hi Admin,<br><br>
A new login was detected on your Admin Dashboard.<br><br>
• Time: {context.get('loginTime', 'Just now')}<br>
• IP Address: {context.get('ipAddress', 'Unknown')}<br>
• Device/Browser: {context.get('deviceInfo', 'Unknown')}<br><br>
If this was you, ignore this email. If not, please change your password immediately and lock the account.<br><br>
👉 Secure Account: <a href="{context.get('resetPasswordLink', '#')}">Reset Password</a><br><br>
Regards, UrbanShift Security"""
        },
        'daily_summary': {
            'subject': f"📊 UrbanShift Daily Summary - {context.get('date', 'Today')}",
            'body': f"""Hi Admin,<br><br>
Here is today's performance report:<br><br>
✅ New Users: {context.get('newUserCount', '0')} 🏠 Properties Posted: {context.get('propertyCount', '0')} 🚚 Movers Booked: {context.get('bookingCount', '0')} 💰 Total Revenue: ₹{context.get('revenue', '0')}<br><br>
Keep growing! 🚀<br><br>
Regards, UrbanShift System"""
        },
        'contact_us_submission': {
            'subject': f"📩 New Contact Inquiry from {context.get('name', 'User')}",
            'body': f"""Hi Admin,<br><br>
You have received a new message via the Contact Us form.<br><br>
<b>Sender Details:</b><br>
• Name: {context.get('name', 'User')}<br>
• Email: {context.get('email', 'N/A')}<br>
• Phone: {context.get('phone', 'N/A')}<br><br>
<b>Message:</b> "{context.get('message', 'No message')}"<br><br>
Please reply to this inquiry within 24 hours.<br><br>
👉 Reply via Email: <a href="mailto:{context.get('email', '')}">{context.get('email', '')}</a><br><br>
Regards, UrbanShift Website"""
        },
        'critical_system_error': {
            'subject': "🚨 CRITICAL: Payment Gateway Failure / Server Error",
            'body': f"""Hi Admin,<br><br>
A critical error has occurred on UrbanShift.<br><br>
Error Type: {context.get('errorType', 'Unknown')}<br>
Time: {context.get('timestamp', 'Now')}<br>
Affected User: {context.get('userId', 'N/A')}<br><br>
<b>Error Log:</b> {context.get('errorStack', 'N/A')}<br><br>
Immediate developer attention is required.<br><br>
Regards, System Monitor"""
        },
        'new_user_joined': {
            'subject': f"👤 New User Joined: {context.get('userName', 'User')}",
            'body': f"""Hi Admin,<br><br>
A new user has successfully registered on UrbanShift! 🚀<br><br>
<b>User Details:</b><br>
• Name: {context.get('userName', 'Name')}<br>
• Email: {context.get('userEmail', 'N/A')}<br>
• Phone: {context.get('userPhone', 'N/A')}<br>
• Role: Customer / Buyer<br>
• Joined At: {context.get('registrationDate', 'Today')}<br><br>
Current User Count: {context.get('totalUsers', 'N/A')}<br><br>
Keep growing!<br><br>
Regards, UrbanShift System"""
        },
        'job_completed': {
            'subject': f"✅ Job Completed: Booking #{context.get('bookingId', 'N/A')}",
            'body': f"""Hi Admin,<br><br>
A move has been successfully completed!<br><br>
<b>Job Details:</b><br>
• Mover: {context.get('moverName', 'Mover')} ({context.get('companyName', 'Company')})<br>
• Customer: {context.get('customerName', 'Customer')}<br>
• Route: {context.get('fromCity', 'CityA')} to {context.get('toCity', 'CityB')}<br>
• Completion Time: {context.get('completionTime', 'Now')}<br><br>
The booking is now closed. Waiting for customer feedback.<br><br>
Regards, UrbanShift System"""
        },
        'job_rejected_by_mover': {
            'subject': f"⚠️ Job Rejected by Mover: Booking #{context.get('bookingId', 'N/A')}",
            'body': f"""Hi Admin,<br><br>
Alert! A mover has cancelled/rejected an assigned booking.<br><br>
Mover: {context.get('moverName', 'Mover')}<br>
Reason: {context.get('rejectionReason', 'Not specified')}<br><br>
<b>Action Needed:</b> Please assign a new mover to Customer {context.get('customerName', 'Customer')} immediately to avoid bad experience.<br><br>
👉 Reassign Booking: <a href="{context.get('adminPanelLink', '#')}">Admin Panel</a><br><br>
Regards, UrbanShift System"""
        },
        'property_sold_admin': {
            'subject': f"💰 Property Marked as SOLD: {context.get('propertyTitle', 'Property')}",
            'body': f"""Hi Admin,<br><br>
Seller {context.get('sellerName', 'Seller')} has marked their property as SOLD.<br><br>
<b>Property Details:</b><br>
• Title: {context.get('propertyTitle', 'Property')}<br>
• Final Price: ₹{context.get('soldPrice', '0')}<br>
• Buyer: {context.get('buyerName', 'Buyer')}<br><br>
This listing has been removed from search results.<br><br>
Regards, UrbanShift System"""
        },
        'property_deleted': {
            'subject': f"🗑️ Property Deleted: {context.get('propertyTitle', 'Property')}",
            'body': f"""Hi Admin,<br><br>
Seller {context.get('sellerName', 'Seller')} has deleted a property listing.<br><br>
Property: {context.get('propertyTitle', 'Property')}<br>
Reason: {context.get('deleteReason', 'Changed mind / Sold elsewhere')}<br><br>
No action required. Just for your records.<br><br>
Regards, UrbanShift System"""
        },
        'booking_cancelled_by_user': {
            'subject': f"❌ Booking Cancelled by User: #{context.get('bookingId', 'N/A')}",
            'body': f"""Hi Admin,<br><br>
A user has cancelled their moving request.<br><br>
User: {context.get('userName', 'User')}<br>
Booking ID: #{context.get('bookingId', 'N/A')}<br>
Refund Status: {context.get('refundStatus', 'Pending')}<br><br>
Reason: "{context.get('cancellationReason', 'Not specified')}"<br><br>
Regards, UrbanShift System"""
        },
        'new_review_posted': {
            'subject': f"⭐ New Review Posted for {context.get('moverName', 'Mover')}",
            'body': f"""Hi Admin,<br><br>
A new review has been posted on the platform.<br><br>
Reviewer: {context.get('userName', 'User')}<br>
For: {context.get('moverName', 'Mover')} (Mover)<br>
Rating: {context.get('rating', '0')}/5<br>
Comment: "{context.get('reviewText', 'N/A')}"<br><br>
Please check if the content follows community guidelines.<br><br>
👉 Moderate Review: <a href="{context.get('adminLink', '#')}">Admin Panel</a><br><br>
Regards, UrbanShift System"""
        }
    }

    template = templates.get(template_type)
    if not template:
        print(f"Template '{template_type}' not found.")
        return

    # Send Email in a separate thread to ensure non-blocking UI
    threading.Thread(
        target=send_email_async,
        args=(template['subject'], template['body'], [user.email])
    ).start()
