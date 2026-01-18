/**
 * Obtém coordenadas (latitude e longitude) a partir de um endereço usando a API de Geocoding do Google Maps
 * Requer GOOGLE_MAPS_API_KEY nas variáveis de ambiente
 */
export async function getCoordinatesFromAddress(
  endereco: string,
  numero: string,
  cep: string
): Promise<{ latitude: number; longitude: number } | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Se não houver API key, retorna null (coordenadas não obrigatórias)
  if (!apiKey) {
    console.warn("GOOGLE_MAPS_API_KEY não configurada. Coordenadas não serão obtidas.");
    return null;
  }

  try {
    const address = `${endereco}, ${numero}, ${cep}, Brasil`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    }

    console.warn("Não foi possível obter coordenadas para o endereço:", address);
    return null;
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    return null;
  }
}
