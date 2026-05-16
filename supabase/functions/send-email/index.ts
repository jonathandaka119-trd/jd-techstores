import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SENDGRID_API = 'https://api.sendgrid.com/v3/mail/send'
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') ?? ''
const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL') ?? 'noreply@jdtechstores.ru'
const FROM_NAME = 'JD TechStores'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type EmailType = 'order_confirmation' | 'registration' | 'password_reset' | 'shipping_update'

function buildEmailContent(type: EmailType, data: Record<string, any>): { subject: string; html: string } {
  const brandColor = '#E91E63'
  const header = `
    <div style="background:${brandColor};padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-family:sans-serif;font-size:22px;letter-spacing:2px;">
        JD TECHSTORES
      </h1>
    </div>`
  const footer = `
    <div style="background:#f5f5f5;padding:24px 32px;font-family:sans-serif;font-size:12px;color:#888;">
      <p style="margin:0;">Kirova Street, Kursk, Russia · support@jdtechstores.ru</p>
      <p style="margin:8px 0 0;">© 2026 JD TechStores. All rights reserved.</p>
    </div>`

  switch (type) {
    case 'order_confirmation':
      return {
        subject: `Order Confirmed – #${data.order_number}`,
        html: `
          ${header}
          <div style="padding:32px;font-family:sans-serif;color:#333;">
            <h2 style="margin-top:0;">Hi ${data.name}, your order is confirmed!</h2>
            <p>Thank you for shopping at JD TechStores. We've received your order and are preparing it for dispatch.</p>
            <div style="background:#f9f9f9;border:1px solid #eee;border-radius:8px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px;font-size:13px;color:#888;">ORDER NUMBER</p>
              <p style="margin:0;font-size:20px;font-weight:bold;font-family:monospace;">#${data.order_number}</p>
              <p style="margin:12px 0 0;font-size:13px;color:#888;">TOTAL AMOUNT</p>
              <p style="margin:0;font-size:20px;font-weight:bold;color:${brandColor};">₽${Number(data.total_amount).toLocaleString('ru-RU')}</p>
            </div>
            <p>We'll send you another email when your order ships.</p>
            <a href="${data.order_url ?? '#'}" style="display:inline-block;background:${brandColor};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">Track Order</a>
          </div>
          ${footer}`,
      }

    case 'registration':
      return {
        subject: 'Welcome to JD TechStores!',
        html: `
          ${header}
          <div style="padding:32px;font-family:sans-serif;color:#333;">
            <h2 style="margin-top:0;">Welcome, ${data.name}!</h2>
            <p>Your account has been created successfully. Explore our full catalog of premium computer hardware and gaming gear.</p>
            <a href="${data.shop_url ?? 'https://jdtechstores.ru/products'}" style="display:inline-block;background:${brandColor};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px;">Start Shopping</a>
          </div>
          ${footer}`,
      }

    case 'password_reset':
      return {
        subject: 'Reset Your Password – JD TechStores',
        html: `
          ${header}
          <div style="padding:32px;font-family:sans-serif;color:#333;">
            <h2 style="margin-top:0;">Password Reset Request</h2>
            <p>We received a request to reset your password. Click the button below to set a new password. This link expires in 1 hour.</p>
            <a href="${data.reset_url}" style="display:inline-block;background:${brandColor};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px;">Reset Password</a>
            <p style="margin-top:24px;font-size:13px;color:#888;">If you didn't request this, you can safely ignore this email.</p>
          </div>
          ${footer}`,
      }

    case 'shipping_update':
      return {
        subject: `Your Order #${data.order_number} Has Shipped`,
        html: `
          ${header}
          <div style="padding:32px;font-family:sans-serif;color:#333;">
            <h2 style="margin-top:0;">Your order is on its way!</h2>
            <p>Hi ${data.name}, order <strong>#${data.order_number}</strong> has been shipped.</p>
            ${data.tracking_number ? `<p>Tracking number: <strong>${data.tracking_number}</strong></p>` : ''}
            <p>Estimated delivery: <strong>${data.estimated_delivery ?? '5-7 business days'}</strong></p>
          </div>
          ${footer}`,
      }

    default:
      return { subject: 'JD TechStores Notification', html: `${header}<div style="padding:32px;">${JSON.stringify(data)}</div>${footer}` }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { type, to, ...data } = await req.json()

    if (!to) return new Response(JSON.stringify({ error: 'recipient email required' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

    const { subject, html } = buildEmailContent(type as EmailType, data)

    const res = await fetch(SENDGRID_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    })

    if (!res.ok && res.status !== 202) {
      const err = await res.text()
      throw new Error(`SendGrid error ${res.status}: ${err}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
