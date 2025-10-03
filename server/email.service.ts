import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    size: string;
    color: string;
    price: string;
  }>;
  subtotal: string;
  shipping: string;
  total: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  paymentMethod: string;
  orderDate: string;
}

interface QuoteEmailData {
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    size: string;
    color: string;
    price: string;
  }>;
  subtotal: string;
  total: string;
  notes?: string;
  validUntil: string;
  requestDate: string;
}

const ADMIN_EMAIL = 'angelitosfoto@gmail.com'; // Email del administrador
// Cambiar a 'pedidos@treeuniforme.com' cuando el dominio esté verificado en Resend
const FROM_EMAIL = 'onboarding@resend.dev';

// Plantilla HTML para confirmación de pedido
function createOrderConfirmationHTML(data: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1F4287; color: white; padding: 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 20px; }
    .order-info { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .order-info h2 { color: #1F4287; margin-top: 0; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th { background: #1F4287; color: white; padding: 10px; text-align: left; }
    .items-table td { padding: 10px; border-bottom: 1px solid #ddd; }
    .total-row { font-weight: bold; font-size: 18px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 ¡Pedido Confirmado!</h1>
      <p>TREE Uniformes & Kodiak Industrial</p>
    </div>
    
    <div class="content">
      <p>Hola <strong>${data.customerName}</strong>,</p>
      <p>Gracias por tu pedido. Hemos recibido tu orden y la estamos procesando.</p>
      
      <div class="order-info">
        <h2>Detalles del Pedido</h2>
        <p><strong>Número de Pedido:</strong> ${data.orderNumber}</p>
        <p><strong>Fecha:</strong> ${data.orderDate}</p>
        <p><strong>Método de Pago:</strong> ${data.paymentMethod}</p>
      </div>
      
      <div class="order-info">
        <h2>Productos</h2>
        <table class="items-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Talla</th>
              <th>Color</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>
                  <strong>${item.name}</strong><br>
                  <small>SKU: ${item.sku}</small>
                </td>
                <td>${item.size}</td>
                <td>${item.color}</td>
                <td>${item.quantity}</td>
                <td>$${item.price}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="4" style="text-align: right;"><strong>Subtotal:</strong></td>
              <td>$${data.subtotal}</td>
            </tr>
            <tr>
              <td colspan="4" style="text-align: right;"><strong>Envío:</strong></td>
              <td>$${data.shipping}</td>
            </tr>
            <tr class="total-row">
              <td colspan="4" style="text-align: right;">Total:</td>
              <td>$${data.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="order-info">
        <h2>Dirección de Envío</h2>
        <p>
          ${data.shippingAddress.street}<br>
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}<br>
          ${data.shippingAddress.country || 'México'}
        </p>
      </div>
      
      <p>Nos pondremos en contacto contigo pronto para confirmar los detalles de envío.</p>
      <p>¡Gracias por confiar en TREE Uniformes!</p>
    </div>
    
    <div class="footer">
      <p>TREE Uniformes & Kodiak Industrial</p>
      <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Plantilla HTML para notificación de presupuesto
function createQuoteRequestHTML(data: QuoteEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1F4287; color: white; padding: 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 20px; }
    .quote-info { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .quote-info h2 { color: #1F4287; margin-top: 0; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th { background: #1F4287; color: white; padding: 10px; text-align: left; }
    .items-table td { padding: 10px; border-bottom: 1px solid #ddd; }
    .total-row { font-weight: bold; font-size: 18px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .highlight { background: #FFCC00; padding: 2px 5px; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Solicitud de Presupuesto Recibida</h1>
      <p>TREE Uniformes & Kodiak Industrial</p>
    </div>
    
    <div class="content">
      <p>Hola <strong>${data.customerName}</strong>,</p>
      <p>Hemos recibido tu solicitud de presupuesto. Nuestro equipo la revisará y te contactará pronto.</p>
      
      <div class="quote-info">
        <h2>Detalles del Presupuesto</h2>
        <p><strong>Número de Presupuesto:</strong> ${data.quoteNumber}</p>
        <p><strong>Fecha de Solicitud:</strong> ${data.requestDate}</p>
        <p><strong>Válido hasta:</strong> <span class="highlight">${data.validUntil}</span></p>
        ${data.companyName ? `<p><strong>Empresa:</strong> ${data.companyName}</p>` : ''}
      </div>
      
      <div class="quote-info">
        <h2>Productos Solicitados</h2>
        <table class="items-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Talla</th>
              <th>Color</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>
                  <strong>${item.name}</strong><br>
                  <small>SKU: ${item.sku}</small>
                </td>
                <td>${item.size}</td>
                <td>${item.color}</td>
                <td>${item.quantity}</td>
                <td>$${item.price}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="4" style="text-align: right;">Total Estimado:</td>
              <td>$${data.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      ${data.notes ? `
      <div class="quote-info">
        <h2>Notas Adicionales</h2>
        <p>${data.notes}</p>
      </div>
      ` : ''}
      
      <p>Te contactaremos pronto con tu presupuesto final y detalles de entrega.</p>
      <p>¡Gracias por tu interés en TREE Uniformes!</p>
    </div>
    
    <div class="footer">
      <p>TREE Uniformes & Kodiak Industrial</p>
      <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Enviar confirmación de pedido al cliente
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Confirmación de Pedido ${data.orderNumber} - TREE Uniformes`,
      html: createOrderConfirmationHTML(data),
    });
    
    console.log('Order confirmation email sent to customer:', result);
    return result;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

// Enviar notificación de pedido al administrador
export async function sendOrderNotificationToAdmin(data: OrderEmailData) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🛒 Nuevo Pedido ${data.orderNumber} - TREE Uniformes`,
      html: `
        <h2>Nuevo Pedido Recibido</h2>
        <p><strong>Número de Pedido:</strong> ${data.orderNumber}</p>
        <p><strong>Cliente:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Total:</strong> $${data.total}</p>
        <p><strong>Fecha:</strong> ${data.orderDate}</p>
        <hr>
        ${createOrderConfirmationHTML(data)}
      `,
    });
    
    console.log('Order notification email sent to admin:', result);
    return result;
  } catch (error) {
    console.error('Error sending order notification to admin:', error);
    throw error;
  }
}

// Enviar confirmación de solicitud de presupuesto al cliente
export async function sendQuoteConfirmationEmail(data: QuoteEmailData) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Solicitud de Presupuesto ${data.quoteNumber} - TREE Uniformes`,
      html: createQuoteRequestHTML(data),
    });
    
    console.log('Quote confirmation email sent to customer:', result);
    return result;
  } catch (error) {
    console.error('Error sending quote confirmation email:', error);
    throw error;
  }
}

// Enviar notificación de presupuesto al administrador
export async function sendQuoteNotificationToAdmin(data: QuoteEmailData) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `📋 Nueva Solicitud de Presupuesto ${data.quoteNumber} - TREE Uniformes`,
      html: `
        <h2>Nueva Solicitud de Presupuesto</h2>
        <p><strong>Número de Presupuesto:</strong> ${data.quoteNumber}</p>
        <p><strong>Cliente:</strong> ${data.customerName} (${data.customerEmail})</p>
        ${data.companyName ? `<p><strong>Empresa:</strong> ${data.companyName}</p>` : ''}
        <p><strong>Total Estimado:</strong> $${data.total}</p>
        <p><strong>Fecha:</strong> ${data.requestDate}</p>
        <hr>
        ${createQuoteRequestHTML(data)}
      `,
    });
    
    console.log('Quote notification email sent to admin:', result);
    return result;
  } catch (error) {
    console.error('Error sending quote notification to admin:', error);
    throw error;
  }
}
