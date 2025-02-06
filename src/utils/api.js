export async function fetchSensorsData() {
    const response = await fetch(
      `https://webapi.ubibot.com/channels?account_key=${process.env.NEXT_PUBLIC_UBIBOT_KEY}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los datos de la API");
    }
    const data = await response.json();
    return data.channels; // Retorna solo la lista de canales (sensores)
  }
  