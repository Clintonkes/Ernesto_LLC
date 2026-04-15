"""
Resend email service for RA Ernesto LLC.

Required environment variables:
  RESEND_API_KEY   — your Resend API key (re_xxxxxxxxxxxx)
  RESEND_FROM_EMAIL — verified sender, e.g. "RA Ernesto <noreply@yourdomain.com>"
  ADMIN_EMAIL      — admin inbox for new-order notifications
"""

import os
import logging
import resend

logger = logging.getLogger(__name__)

FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "RA Ernesto LLC <noreply@raernesto.com>")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "raernesto1110@gmail.com")


def _client_ready() -> bool:
    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        logger.warning("RESEND_API_KEY not set — email skipped")
        return False
    resend.api_key = api_key
    return True


def _items_html(items) -> str:
    rows = "".join(
        f"""
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;">{item.product_name}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:center;">{item.quantity}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;">${item.price * item.quantity:.2f}</td>
        </tr>
        """
        for item in items
    )
    return f"""
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr style="background:#f8f9fa;">
          <th style="padding:10px 8px;text-align:left;font-size:12px;text-transform:uppercase;color:#555;">Product</th>
          <th style="padding:10px 8px;text-align:center;font-size:12px;text-transform:uppercase;color:#555;">Qty</th>
          <th style="padding:10px 8px;text-align:right;font-size:12px;text-transform:uppercase;color:#555;">Subtotal</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
    """


def _base_template(title: str, body: str) -> str:
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:#0A2540;padding:24px 32px;">
        <span style="color:#fff;font-size:22px;font-weight:bold;">
          RA Ernesto<span style="color:#00A8E8;">.</span>
        </span>
      </div>
      <div style="padding:32px;">
        <h2 style="color:#0A2540;margin-top:0;">{title}</h2>
        {body}
      </div>
      <div style="background:#f8f9fa;padding:16px 32px;text-align:center;font-size:12px;color:#999;">
        RA Ernesto LLC &bull; 1703 Prince ST, Beaufort, SC 29902 &bull; +1 (860) 543-0799
      </div>
    </div>
    """


def send_order_confirmation(order) -> None:
    """Send order confirmation (status: pending) to the customer."""
    if not _client_ready():
        return
    try:
        body = f"""
        <p>Hi <strong>{order.customer_name}</strong>,</p>
        <p>Thank you for your order! We've received it and it is currently being processed.</p>
        <div style="background:#fff8e1;border-left:4px solid #ffc107;padding:12px 16px;margin:16px 0;border-radius:4px;">
          <strong>Order Status: PENDING</strong><br>
          We'll notify you by email once your order has been confirmed and shipped.
        </div>
        <h3 style="color:#0A2540;">Order #{order.id} Summary</h3>
        {_items_html(order.items)}
        <div style="background:#f8f9fa;padding:16px;border-radius:8px;margin-top:16px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="color:#555;">Shipping</span>
            <strong style="color:#28A745;">Free</strong>
          </div>
          <div style="display:flex;justify-content:space-between;border-top:2px solid #dee2e6;padding-top:8px;margin-top:8px;">
            <span style="font-weight:bold;color:#0A2540;">Total</span>
            <strong style="color:#0A2540;font-size:18px;">${order.total_amount:.2f}</strong>
          </div>
        </div>
        <p style="margin-top:24px;color:#555;"><strong>Shipping to:</strong> {order.shipping_address}</p>
        <p style="color:#555;">If you have questions, reply to this email or call us at +1 (860) 543-0799.</p>
        """
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [order.customer_email],
            "subject": f"Order #{order.id} Received – RA Ernesto LLC",
            "html": _base_template(f"Order #{order.id} Confirmed!", body),
        })
        logger.info(f"[Email] Order confirmation sent to {order.customer_email}")
    except Exception as e:
        logger.error(f"[Email] Failed to send order confirmation: {e}")


def send_admin_new_order_notification(order) -> None:
    """Notify admin when a new order arrives."""
    if not _client_ready():
        return
    try:
        body = f"""
        <p>A new order has been placed on the storefront.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px;color:#555;width:150px;"><strong>Order ID</strong></td><td style="padding:8px;">#{order.id}</td></tr>
          <tr style="background:#f8f9fa;"><td style="padding:8px;color:#555;"><strong>Customer</strong></td><td style="padding:8px;">{order.customer_name}</td></tr>
          <tr><td style="padding:8px;color:#555;"><strong>Email</strong></td><td style="padding:8px;">{order.customer_email}</td></tr>
          <tr style="background:#f8f9fa;"><td style="padding:8px;color:#555;"><strong>Address</strong></td><td style="padding:8px;">{order.shipping_address}</td></tr>
          <tr><td style="padding:8px;color:#555;"><strong>Total</strong></td><td style="padding:8px;font-weight:bold;color:#0A2540;">${order.total_amount:.2f}</td></tr>
        </table>
        <h3 style="color:#0A2540;">Items Ordered</h3>
        {_items_html(order.items)}
        <a href="#" style="display:inline-block;background:#00A8E8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">
          View in Admin Dashboard
        </a>
        """
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": f"[New Order] #{order.id} – ${order.total_amount:.2f} from {order.customer_name}",
            "html": _base_template(f"New Order #{order.id}", body),
        })
        logger.info(f"[Email] Admin new-order notification sent for order #{order.id}")
    except Exception as e:
        logger.error(f"[Email] Failed to send admin notification: {e}")


def send_order_completed_notification(order) -> None:
    """Notify customer that their order is completed/shipped."""
    if not _client_ready():
        return
    try:
        body = f"""
        <p>Hi <strong>{order.customer_name}</strong>,</p>
        <p>Great news! Your order has been confirmed and is on its way.</p>
        <div style="background:#d4edda;border-left:4px solid #28A745;padding:12px 16px;margin:16px 0;border-radius:4px;">
          <strong style="color:#155724;">Order Status: COMPLETED</strong><br>
          <span style="color:#155724;">Your parts have been dispatched. Thank you for choosing RA Ernesto LLC!</span>
        </div>
        <h3 style="color:#0A2540;">Order #{order.id} Details</h3>
        {_items_html(order.items)}
        <p style="margin-top:24px;color:#555;"><strong>Shipped to:</strong> {order.shipping_address}</p>
        <p style="color:#555;">For any queries contact us at raernesto1110@gmail.com or +1 (860) 543-0799.</p>
        """
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [order.customer_email],
            "subject": f"Order #{order.id} Completed – RA Ernesto LLC",
            "html": _base_template(f"Your Order #{order.id} is Complete!", body),
        })
        logger.info(f"[Email] Order completed notification sent to {order.customer_email}")
    except Exception as e:
        logger.error(f"[Email] Failed to send order completed email: {e}")


def send_enquiry_acknowledgement(enquiry) -> None:
    """Acknowledge a customer service enquiry to the customer."""
    if not _client_ready():
        return
    try:
        body = f"""
        <p>Hi <strong>{enquiry.customer_name}</strong>,</p>
        <p>We've received your enquiry and will get back to you within 1-2 business days.</p>
        <div style="background:#f8f9fa;padding:16px;border-radius:8px;border-left:4px solid #00A8E8;margin:16px 0;">
          <strong>Subject:</strong> {enquiry.subject}<br><br>
          <strong>Your message:</strong><br>
          <p style="color:#555;">{enquiry.message}</p>
        </div>
        <p style="color:#555;">If this is urgent, call us at +1 (860) 543-0799.</p>
        """
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [enquiry.customer_email],
            "subject": f"We received your enquiry – RA Ernesto LLC",
            "html": _base_template("Enquiry Received", body),
        })
        logger.info(f"[Email] Enquiry acknowledgement sent to {enquiry.customer_email}")
    except Exception as e:
        logger.error(f"[Email] Failed to send enquiry acknowledgement: {e}")


def send_admin_enquiry_notification(enquiry) -> None:
    """Notify admin of a new customer enquiry."""
    if not _client_ready():
        return
    try:
        body = f"""
        <p>A new customer enquiry has been submitted.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px;color:#555;width:150px;"><strong>Name</strong></td><td style="padding:8px;">{enquiry.customer_name}</td></tr>
          <tr style="background:#f8f9fa;"><td style="padding:8px;color:#555;"><strong>Email</strong></td><td style="padding:8px;">{enquiry.customer_email}</td></tr>
          <tr><td style="padding:8px;color:#555;"><strong>Subject</strong></td><td style="padding:8px;">{enquiry.subject}</td></tr>
        </table>
        <div style="background:#f8f9fa;padding:16px;border-radius:8px;border-left:4px solid #00A8E8;margin:16px 0;">
          <strong>Message:</strong><br>
          <p style="color:#555;">{enquiry.message}</p>
        </div>
        """
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": f"[New Enquiry] {enquiry.subject} – from {enquiry.customer_name}",
            "html": _base_template("New Customer Enquiry", body),
        })
        logger.info(f"[Email] Admin enquiry notification sent for enquiry from {enquiry.customer_email}")
    except Exception as e:
        logger.error(f"[Email] Failed to send admin enquiry notification: {e}")
