import Papa from "papaparse";

export async function loadCsvData(channelId) {
  const filePath = `/csv/${channelId}-feeds.csv`; // El nombre limpio que decidiste
  const response = await fetch(filePath);
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((row) => {
          const parsedRow = {
            timestamp: new Date(row["created_at"]).getTime(),
            // CAMBIO AQUÍ
          };

          // Normaliza los nombres de columna con los del archivo
          if (row["field1(Temperatura ºC )"])
            parsedRow.temperatura = parseFloat(row["field1(Temperatura ºC )"]);
          if (row["field2(Humedad)"])
            parsedRow.humedad = parseFloat(row["field2(Humedad)"]);
          if (row["field3(Voltage)"])
            parsedRow.voltaje = parseFloat(row["field3(Voltage)"]);
          if (row["field9"]) parsedRow.presion = parseFloat(row["field9"]);
          if (row["field6"]) parsedRow.luz = parseFloat(row["field6"]);

          return parsedRow;
        });

        resolve(data);
      },
      error: (err) => reject(err),
    });
  });
}
