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
