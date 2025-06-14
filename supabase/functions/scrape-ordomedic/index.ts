
import { corsHeaders } from '../_shared/cors.ts'

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
  source?: string;
}

// Fonction pour scraper DoctorAnytime.be
async function scrapeDoctorAnytime(query: string): Promise<ScrapedDoctor[]> {
  try {
    console.log(`🔍 Scraping DoctorAnytime.be pour: "${query}"`);
    
    const searchUrl = `https://www.doctoranytime.be/fr/recherche?q=${encodeURIComponent(query)}`;
    console.log(`URL de recherche: ${searchUrl}`);
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });

    if (!response.ok) {
      console.log(`❌ Erreur HTTP ${response.status} pour DoctorAnytime`);
      return [];
    }

    const html = await response.text();
    console.log(`📄 HTML reçu, taille: ${html.length} caractères`);
    
    // Parser le HTML pour extraire les médecins
    const doctors: ScrapedDoctor[] = [];
    
    // Regex pour extraire les informations des médecins
    const doctorPattern = /<div[^>]*class="[^"]*doctor[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
    const namePattern = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i;
    const specialtyPattern = /<span[^>]*class="[^"]*specialty[^"]*"[^>]*>([^<]+)<\/span>/i;
    const locationPattern = /<span[^>]*class="[^"]*location[^"]*"[^>]*>([^<]+)<\/span>/i;
    
    const matches = html.match(doctorPattern);
    if (matches) {
      matches.forEach((match, index) => {
        const nameMatch = match.match(namePattern);
        const specialtyMatch = match.match(specialtyPattern);
        const locationMatch = match.match(locationPattern);
        
        if (nameMatch) {
          const fullName = nameMatch[1].trim();
          const nameParts = fullName.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          doctors.push({
            id: `doctoranytime_${Date.now()}_${index}`,
            first_name: firstName,
            last_name: lastName,
            specialty: specialtyMatch ? specialtyMatch[1].trim() : undefined,
            city: locationMatch ? locationMatch[1].trim() : undefined,
            source: 'DoctorAnytime.be'
          });
        }
      });
    }
    
    console.log(`✅ DoctorAnytime: ${doctors.length} médecins trouvés`);
    return doctors;
    
  } catch (error) {
    console.error(`❌ Erreur scraping DoctorAnytime:`, error.message);
    return [];
  }
}

// Fonction pour scraper Ordomedic.be
async function scrapeOrdomedic(query: string): Promise<ScrapedDoctor[]> {
  try {
    console.log(`🔍 Scraping Ordomedic.be pour: "${query}"`);
    
    const searchUrl = `https://ordomedic.be/fr/medecins?search=${encodeURIComponent(query)}`;
    console.log(`URL de recherche: ${searchUrl}`);
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Referer': 'https://ordomedic.be/',
      }
    });

    if (!response.ok) {
      console.log(`❌ Erreur HTTP ${response.status} pour Ordomedic`);
      return [];
    }

    const html = await response.text();
    console.log(`📄 HTML reçu d'Ordomedic, taille: ${html.length} caractères`);
    
    const doctors: ScrapedDoctor[] = [];
    
    // Parser spécifique pour Ordomedic.be
    const doctorBlocks = html.split('<div class="doctor-card"');
    
    for (let i = 1; i < doctorBlocks.length; i++) {
      const block = doctorBlocks[i];
      
      // Extraire le nom
      const nameMatch = block.match(/<h3[^>]*>Dr\.?\s*([^<]+)<\/h3>/i);
      // Extraire la spécialité
      const specialtyMatch = block.match(/<p[^>]*class="specialty"[^>]*>([^<]+)<\/p>/i);
      // Extraire l'adresse
      const addressMatch = block.match(/<p[^>]*class="address"[^>]*>([^<]+)<\/p>/i);
      
      if (nameMatch) {
        const fullName = nameMatch[1].trim();
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        doctors.push({
          id: `ordomedic_${Date.now()}_${i}`,
          first_name: firstName,
          last_name: lastName,
          specialty: specialtyMatch ? specialtyMatch[1].trim() : undefined,
          address: addressMatch ? addressMatch[1].trim() : undefined,
          source: 'Ordomedic.be'
        });
      }
    }
    
    console.log(`✅ Ordomedic: ${doctors.length} médecins trouvés`);
    return doctors;
    
  } catch (error) {
    console.error(`❌ Erreur scraping Ordomedic:`, error.message);
    return [];
  }
}

// Fonction pour scraper Doctoralia.be
async function scrapeDoctoralia(query: string): Promise<ScrapedDoctor[]> {
  try {
    console.log(`🔍 Scraping Doctoralia.be pour: "${query}"`);
    
    const searchUrl = `https://www.doctoralia.be/recherche?q=${encodeURIComponent(query)}`;
    console.log(`URL de recherche: ${searchUrl}`);
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      }
    });

    if (!response.ok) {
      console.log(`❌ Erreur HTTP ${response.status} pour Doctoralia`);
      return [];
    }

    const html = await response.text();
    console.log(`📄 HTML reçu de Doctoralia, taille: ${html.length} caractères`);
    
    const doctors: ScrapedDoctor[] = [];
    
    // Parser pour Doctoralia
    const profilePattern = /<div[^>]*data-doctor[^>]*>[\s\S]*?<\/div>/gi;
    const matches = html.match(profilePattern);
    
    if (matches) {
      matches.forEach((match, index) => {
        const nameMatch = match.match(/data-doctor-name="([^"]+)"/i);
        const specialtyMatch = match.match(/data-specialty="([^"]+)"/i);
        const cityMatch = match.match(/data-city="([^"]+)"/i);
        
        if (nameMatch) {
          const fullName = nameMatch[1].trim().replace('Dr. ', '').replace('Dr ', '');
          const nameParts = fullName.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          doctors.push({
            id: `doctoralia_${Date.now()}_${index}`,
            first_name: firstName,
            last_name: lastName,
            specialty: specialtyMatch ? specialtyMatch[1].trim() : undefined,
            city: cityMatch ? cityMatch[1].trim() : undefined,
            source: 'Doctoralia.be'
          });
        }
      });
    }
    
    console.log(`✅ Doctoralia: ${doctors.length} médecins trouvés`);
    return doctors;
    
  } catch (error) {
    console.error(`❌ Erreur scraping Doctoralia:`, error.message);
    return [];
  }
}

Deno.serve(async (req) => {
  console.log(`=== NOUVELLE REQUÊTE DE RECHERCHE WEB ===`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`Handling CORS preflight`);
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let body;
    let query = '';

    // Parse body safely
    try {
      const bodyText = await req.text();
      console.log(`Body brut reçu: "${bodyText}"`);
      
      if (bodyText.trim()) {
        body = JSON.parse(bodyText);
        query = body?.query || '';
      }
    } catch (parseError) {
      console.log(`Erreur parsing JSON, utilisation query vide:`, parseError.message);
      query = '';
    }
    
    console.log(`=== RECHERCHE WEB EN TEMPS RÉEL ===`)
    console.log(`Query finale: "${query}"`)
    
    // Si pas de requête valide
    if (!query || query.trim().length < 2) {
      console.log(`Query trop courte pour recherche web`);
      return new Response(
        JSON.stringify({ 
          doctors: [],
          metadata: { 
            message: 'Veuillez saisir au moins 2 caractères pour la recherche',
            query: query,
            sources: [],
            timestamp: new Date().toISOString()
          }
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const cleanQuery = query.trim();
    console.log(`🌐 Lancement de la recherche web pour: "${cleanQuery}"`);

    // Lancer les recherches en parallèle sur tous les sites
    const searchPromises = [
      scrapeDoctorAnytime(cleanQuery),
      scrapeOrdomedic(cleanQuery),
      scrapeDoctoralia(cleanQuery)
    ];

    console.log(`⏳ Recherche en cours sur 3 sites...`);
    const results = await Promise.allSettled(searchPromises);
    
    // Collecter tous les résultats réussis
    const allDoctors: ScrapedDoctor[] = [];
    const successfulSources: string[] = [];
    
    results.forEach((result, index) => {
      const siteName = ['DoctorAnytime.be', 'Ordomedic.be', 'Doctoralia.be'][index];
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allDoctors.push(...result.value);
        successfulSources.push(siteName);
        console.log(`✅ ${siteName}: ${result.value.length} résultats`);
      } else {
        console.log(`⚠️ ${siteName}: aucun résultat ou erreur`);
      }
    });

    // Dédupliquer les résultats
    const uniqueDoctors = allDoctors.filter((doctor, index, self) => 
      index === self.findIndex(d => 
        d.first_name.toLowerCase() === doctor.first_name.toLowerCase() && 
        d.last_name.toLowerCase() === doctor.last_name.toLowerCase()
      )
    );

    // Trier par pertinence
    const sortedDoctors = uniqueDoctors.sort((a, b) => {
      const aFullName = `${a.first_name} ${a.last_name}`.toLowerCase();
      const bFullName = `${b.first_name} ${b.last_name}`.toLowerCase();
      
      // Correspondance exacte en premier
      const aExactMatch = aFullName === cleanQuery.toLowerCase();
      const bExactMatch = bFullName === cleanQuery.toLowerCase();
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // Correspondance du début
      const aStartsWithQuery = aFullName.startsWith(cleanQuery.toLowerCase());
      const bStartsWithQuery = bFullName.startsWith(cleanQuery.toLowerCase());
      if (aStartsWithQuery && !bStartsWithQuery) return -1;
      if (!aStartsWithQuery && bStartsWithQuery) return 1;

      return a.last_name.localeCompare(b.last_name);
    });

    console.log(`=== RÉSULTATS FINAUX DE LA RECHERCHE WEB ===`);
    console.log(`Total: ${sortedDoctors.length} médecins trouvés sur ${successfulSources.length} sites`);
    console.log(`Sites consultés avec succès: ${successfulSources.join(', ')}`);
    
    sortedDoctors.forEach(doc => {
      console.log(`- ${doc.first_name} ${doc.last_name} (${doc.specialty || 'N/A'}) - ${doc.source}`);
    });
    
    return new Response(
      JSON.stringify({ 
        doctors: sortedDoctors.slice(0, 20), // Limiter à 20 résultats
        metadata: {
          query: cleanQuery,
          total: sortedDoctors.length,
          sources: successfulSources,
          sites_searched: ['DoctorAnytime.be', 'Ordomedic.be', 'Doctoralia.be'],
          timestamp: new Date().toISOString(),
          search_type: 'real_time_web_scraping'
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('=== ERREUR GLOBALE DE RECHERCHE WEB ===')
    console.error('Erreur:', error.message)
    console.error('Stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        doctors: [],
        metadata: {
          query: 'erreur',
          error: error.message,
          search_type: 'real_time_web_scraping_failed',
          timestamp: new Date().toISOString()
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
