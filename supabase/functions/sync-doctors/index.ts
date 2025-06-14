
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    console.log('Starting doctors synchronization...')
    
    // Simulate fetching data from Belgian medical authority API
    // In real implementation, this would call the actual API
    const externalDoctorsData = [
      {
        inami_number: "12345678901",
        first_name: "Anne",
        last_name: "Lefevre",
        specialty: "Gynécologie",
        address: "Boulevard de Waterloo 38",
        city: "Bruxelles",
        postal_code: "1000",
        phone: "02/234.56.78",
        email: "a.lefevre@gyno.be"
      },
      {
        inami_number: "12345678902", 
        first_name: "Paul",
        last_name: "Moreau",
        specialty: "Orthopédie",
        address: "Rue de Namur 120",
        city: "Namur",
        postal_code: "5000",
        phone: "081/345.67.89",
        email: "p.moreau@ortho.be"
      }
    ]

    let syncedCount = 0
    let errorCount = 0

    for (const doctorData of externalDoctorsData) {
      try {
        // Check if doctor already exists
        const { data: existingDoctor } = await supabase
          .from('doctors')
          .select('id')
          .eq('inami_number', doctorData.inami_number)
          .single()

        if (existingDoctor) {
          // Update existing doctor
          const { error } = await supabase
            .from('doctors')
            .update({
              first_name: doctorData.first_name,
              last_name: doctorData.last_name,
              specialty: doctorData.specialty,
              address: doctorData.address,
              city: doctorData.city,
              postal_code: doctorData.postal_code,
              phone: doctorData.phone,
              email: doctorData.email,
              updated_at: new Date().toISOString()
            })
            .eq('inami_number', doctorData.inami_number)

          if (error) throw error
          console.log(`Updated doctor: ${doctorData.first_name} ${doctorData.last_name}`)
        } else {
          // Create new doctor
          const { error } = await supabase
            .from('doctors')
            .insert({
              inami_number: doctorData.inami_number,
              first_name: doctorData.first_name,
              last_name: doctorData.last_name,
              specialty: doctorData.specialty,
              address: doctorData.address,
              city: doctorData.city,
              postal_code: doctorData.postal_code,
              phone: doctorData.phone,
              email: doctorData.email,
              is_active: true
            })

          if (error) throw error
          console.log(`Created doctor: ${doctorData.first_name} ${doctorData.last_name}`)
        }

        syncedCount++
      } catch (error) {
        console.error(`Error syncing doctor ${doctorData.inami_number}:`, error)
        errorCount++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synchronization completed. ${syncedCount} doctors synced, ${errorCount} errors.`,
        synced: syncedCount,
        errors: errorCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Sync error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
