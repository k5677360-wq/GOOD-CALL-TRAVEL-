// ============================================
// CLOUDFLARE PAGES FUNCTION - PROXY PARA COSTAMAR
// Ruta: /functions/api/flights/search.js
// ============================================

const COSTAMAR_URL = "https://costamar.com.pe/vuelos/api/flights/search";

// Headers CORS para permitir requests desde tu frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

/**
 * Maneja las peticiones HTTP
 * @param {Object} context - Contexto de Cloudflare Pages
 * @returns {Response}
 */
export async function onRequest(context) {
  const { request } = context;

  // Manejar preflight OPTIONS request (CORS)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Solo permitir POST
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed. Use POST." }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
    // Obtener el payload del frontend
    const payload = await request.json();

    console.log("📦 Payload recibido:", JSON.stringify(payload, null, 2));

    // Hacer la petición a Costamar desde el servidor (sin problemas de CORS)
    const costamarResponse = await fetch(COSTAMAR_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        // Estos headers SÍ se pueden usar desde el servidor
        "Origin": "https://booking.clickandbook.com",
        "Referer": "https://booking.clickandbook.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify(payload),
    });

    // Obtener la respuesta de Costamar
    const responseText = await costamarResponse.text();
    
    console.log("✅ Respuesta de Costamar:", costamarResponse.status);

    // Si Costamar devolvió error, retornar el error con CORS
    if (!costamarResponse.ok) {
      return new Response(
        JSON.stringify({
          error: `Costamar API error: ${costamarResponse.status}`,
          details: responseText
        }),
        {
          status: costamarResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Devolver la respuesta exitosa con CORS habilitado
    return new Response(responseText, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("❌ Error en proxy:", error);
    
    return new Response(
      JSON.stringify({
        error: "Error interno del proxy",
        message: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}
