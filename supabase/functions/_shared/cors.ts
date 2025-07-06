
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' // Replace with your actual domain
    : '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

export function createCorsResponse(body?: any, init?: ResponseInit) {
  return new Response(
    body ? JSON.stringify(body) : undefined,
    {
      ...init,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    }
  );
}

export function handleCorsPreflightRequest() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
