import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const YOOKASSA_API = 'https://api.yookassa.ru/v3'
const SHOP_ID = Deno.env.get('YOOKASSA_SHOP_ID') ?? ''
const SECRET_KEY = Deno.env.get('YOOKASSA_SECRET_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const { order_id, amount, description, return_url } = await req.json()

    if (!order_id || !amount) {
      return new Response(JSON.stringify({ error: 'order_id and amount are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const idempotenceKey = `${order_id}-${Date.now()}`
    const credentials = btoa(`${SHOP_ID}:${SECRET_KEY}`)

    const yooResponse = await fetch(`${YOOKASSA_API}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Idempotence-Key': idempotenceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: { value: amount.toFixed(2), currency: 'RUB' },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: return_url ?? `${Deno.env.get('FRONTEND_URL')}/order-confirmation/${order_id}`,
        },
        description: description ?? `Order #${order_id} – JD TechStores`,
        metadata: { order_id },
      }),
    })

    const payment = await yooResponse.json()

    if (!yooResponse.ok) {
      throw new Error(payment.description ?? 'YooKassa API error')
    }

    await supabase.from('payments').insert({
      order_id,
      amount,
      status: 'pending',
      payment_method: 'yookassa',
      transaction_id: payment.id,
    })

    return new Response(
      JSON.stringify({ confirmation_url: payment.confirmation.confirmation_url, payment_id: payment.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
