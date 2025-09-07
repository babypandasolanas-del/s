import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { event_type, resource } = await req.json()

    console.log('PayPal webhook received:', { event_type, resource })

    // Handle subscription activation
    if (event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subscriptionId = resource.id
      const customId = resource.custom_id // This should contain the user ID

      if (!customId) {
        throw new Error('No user ID found in subscription custom_id')
      }

      // Update user's subscription status to active
      const { error } = await supabaseClient
        .from('profiles')
        .update({ 
          subscription_status: 'active',
          last_login: new Date().toISOString()
        })
        .eq('id', customId)

      if (error) {
        console.error('Error updating subscription status:', error)
        throw error
      }

      console.log(`Subscription activated for user: ${customId}`)
    }

    // Handle subscription cancellation
    if (event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
      const subscriptionId = resource.id
      const customId = resource.custom_id

      if (!customId) {
        throw new Error('No user ID found in subscription custom_id')
      }

      // Update user's subscription status to canceled
      const { error } = await supabaseClient
        .from('profiles')
        .update({ subscription_status: 'canceled' })
        .eq('id', customId)

      if (error) {
        console.error('Error updating subscription status:', error)
        throw error
      }

      console.log(`Subscription cancelled for user: ${customId}`)
    }

    // Handle subscription expiration
    if (event_type === 'BILLING.SUBSCRIPTION.EXPIRED') {
      const subscriptionId = resource.id
      const customId = resource.custom_id

      if (!customId) {
        throw new Error('No user ID found in subscription custom_id')
      }

      // Update user's subscription status to expired
      const { error } = await supabaseClient
        .from('profiles')
        .update({ subscription_status: 'expired' })
        .eq('id', customId)

      if (error) {
        console.error('Error updating subscription status:', error)
        throw error
      }

      console.log(`Subscription expired for user: ${customId}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('PayPal webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})