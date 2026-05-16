import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

serve(async (req) => {
  try {
    const body = await req.json()
    const { event, object: payment } = body

    if (event !== 'payment.succeeded' && event !== 'payment.canceled') {
      return new Response('ok', { status: 200 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const orderId = payment.metadata?.order_id

    if (!orderId) return new Response('missing order_id', { status: 400 })

    const paymentStatus = event === 'payment.succeeded' ? 'completed' : 'failed'
    const orderStatus = event === 'payment.succeeded' ? 'processing' : 'cancelled'

    await Promise.all([
      supabase
        .from('payments')
        .update({ status: paymentStatus })
        .eq('transaction_id', payment.id),
      supabase
        .from('orders')
        .update({ status: orderStatus })
        .eq('id', orderId),
    ])

    if (event === 'payment.succeeded') {
      const { data: order } = await supabase
        .from('orders')
        .select('*, profiles(email, full_name)')
        .eq('id', orderId)
        .single()

      if (order) {
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'order_confirmation',
            to: order.profiles?.email,
            name: order.profiles?.full_name ?? 'Customer',
            order_number: order.order_number,
            total_amount: order.total_amount,
          },
        })
      }
    }

    return new Response('ok', { status: 200 })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
