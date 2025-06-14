
import { corsHeaders } from '../_shared/cors.ts'

const ORDOMEDIC_BASE_URL = 'https://ordomedic.be'

interface ScrapedDoctor {
  id: string;
  first_name: string;
  last_name: string;
  specialty?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    
    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ doctors: [] }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Scraping ordomedic.be for: "${query}"`)

    // Construire l'URL de recherche ordomedic.be
    const searchUrl = `${ORDOMEDIC_BASE_URL}/recherche-medecin?q=${encodeURIComponent(query)}`
    
    console.log(`Fetching: ${searchUrl}`)

    // Faire la requête vers ordomedic.be
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-BE,fr;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    })

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    console.log(`Received HTML content (${html.length} characters)`)

    // Parser le HTML pour extraire les informations des médecins
    const doctors = parseOrdomedicHTML(html)
    
    console.log(`Found ${doctors.length} doctors`)

    return new Response(
      JSON.stringify({ doctors }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error scraping ordomedic:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to scrape ordomedic.be',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function parseOrdomedicHTML(html: string): ScrapedDoctor[] {
  const doctors: ScrapedDoctor[] = []
  
  try {
    // Rechercher les patterns typiques dans le HTML d'ordomedic.be
    // Ces patterns peuvent changer, mais voici une approche basique
    
    // Pattern pour capturer les blocs de médecins
    const doctorBlockRegex = /<div[^>]*class[^>]*doctor[^>]*>[\s\S]*?<\/div>/gi
    
    // Si aucun bloc "doctor" spécifique, chercher des patterns plus génériques
    const nameRegex = /Dr\.?\s+([A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ][a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]+(?:\s+[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ][a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]+)*)\s+([A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ][A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ\s-]+)/g
    
    // Patterns pour extraire les informations
    const phoneRegex = /(?:tél\.?|phone|téléphone)\s*:?\s*([+]?[0-9\s\-\.\/\(\)]{8,})/gi
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    const addressRegex = /(\d+[^,]*(?:rue|avenue|av\.?|boulevard|bd\.?|place|pl\.?)[^,]{1,50})/gi
    const cityRegex = /(\d{4})\s+([A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ][a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ\s\-]+)/g
    const specialtyRegex = /(?:spécialité|spécialiste|médecin)\s*:?\s*([A-Za-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ\s\-]+)/gi

    let match
    let doctorIndex = 0

    // Extraire les noms des médecins
    while ((match = nameRegex.exec(html)) !== null) {
      const firstName = match[1]
      const lastName = match[2]
      
      doctorIndex++
      
      const doctor: ScrapedDoctor = {
        id: `ordo_scraped_${Date.now()}_${doctorIndex}`,
        first_name: firstName,
        last_name: lastName
      }

      // Chercher les informations additionnelles dans les environs du nom
      const contextStart = Math.max(0, match.index - 500)
      const contextEnd = Math.min(html.length, match.index + 1000)
      const context = html.slice(contextStart, contextEnd)

      // Extraire le téléphone
      const phoneMatch = phoneRegex.exec(context)
      if (phoneMatch) {
        doctor.phone = phoneMatch[1].trim()
      }

      // Extraire l'email
      const emailMatch = emailRegex.exec(context)
      if (emailMatch) {
        doctor.email = emailMatch[1]
      }

      // Extraire l'adresse
      const addressMatch = addressRegex.exec(context)
      if (addressMatch) {
        doctor.address = addressMatch[1].trim()
      }

      // Extraire la ville et code postal
      const cityMatch = cityRegex.exec(context)
      if (cityMatch) {
        doctor.postal_code = cityMatch[1]
        doctor.city = cityMatch[2].trim()
      }

      // Extraire la spécialité
      const specialtyMatch = specialtyRegex.exec(context)
      if (specialtyMatch) {
        doctor.specialty = specialtyMatch[1].trim()
      }

      doctors.push(doctor)
      
      // Limiter à 20 résultats pour éviter les timeouts
      if (doctors.length >= 20) break
    }

    // Si aucun résultat avec le pattern "Dr", essayer un pattern plus simple
    if (doctors.length === 0) {
      const simpleNameRegex = /([A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ][a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]+)\s+([A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ][A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ\s-]+)/g
      
      while ((match = simpleNameRegex.exec(html)) !== null && doctors.length < 10) {
        doctorIndex++
        
        doctors.push({
          id: `ordo_scraped_${Date.now()}_${doctorIndex}`,
          first_name: match[1],
          last_name: match[2]
        })
      }
    }

  } catch (error) {
    console.error('Error parsing HTML:', error)
  }

  return doctors
}
