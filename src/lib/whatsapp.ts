// WhatsApp Integration Helper
// Uses wa.me links for sending messages via WhatsApp

export interface OrderDetails {
  orderId: string;
  tableNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  specialInstructions?: string;
}

// Format phone number for WhatsApp (remove spaces, dashes, add country code if needed)
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Add India country code if not present
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  
  return cleaned;
};

// Generate WhatsApp link for customer order confirmation
export const generateCustomerConfirmationLink = (
  customerPhone: string,
  order: OrderDetails
): string => {
  const phone = formatPhoneNumber(customerPhone);
  
  const itemsList = order.items
    .map(item => `• ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`)
    .join('\n');
  
  const message = `🎉 *Order Confirmed - Bistro@17*

Order #${order.orderId.slice(0, 8)}
📍 Table ${order.tableNumber}

*Your Order:*
${itemsList}

💰 *Total: ₹${order.totalAmount}*

${order.specialInstructions ? `📝 Note: ${order.specialInstructions}\n` : ''}
Your order has been sent to the kitchen. We'll prepare it fresh for you!

Thank you for dining with us! ☕🍃`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

// Generate WhatsApp link for kitchen staff alert
export const generateKitchenAlertLink = (
  staffPhone: string,
  order: OrderDetails
): string => {
  const phone = formatPhoneNumber(staffPhone);
  
  const itemsList = order.items
    .map(item => `• ${item.name} × ${item.quantity}`)
    .join('\n');
  
  const message = `🔔 *NEW ORDER - Table ${order.tableNumber}*

Order #${order.orderId.slice(0, 8)}

*Items:*
${itemsList}

💰 Total: ₹${order.totalAmount}

${order.specialInstructions ? `⚠️ Special Instructions: ${order.specialInstructions}` : ''}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

// Open WhatsApp with pre-filled message
export const sendWhatsAppMessage = (phone: string, message: string): void => {
  const formattedPhone = formatPhoneNumber(phone);
  const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

// Send order ready notification to customer
export const generateOrderReadyLink = (
  customerPhone: string,
  tableNumber: string
): string => {
  const phone = formatPhoneNumber(customerPhone);
  
  const message = `✅ *Your Order is Ready!*

Hi there! 👋

Your order at Bistro@17 is ready to be served at Table ${tableNumber}.

Enjoy your meal! 🍽️☕`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
