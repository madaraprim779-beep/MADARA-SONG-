
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  const apiKey = process.env.MUREKA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "La clé Mureka manque dans Vercel."
    });
  }

  const { lyrics, prompt } = req.body || {};

  if (
    typeof lyrics !== "string" ||
    !lyrics.trim() ||
    lyrics.length > 5000 ||
    typeof prompt !== "string" ||
    !prompt.trim() ||
    prompt.length > 1024
  ) {
    return res.status(400).json({
      error: "Ajoute des paroles et un style musical valides."
    });
  }

  try {
    const response = await fetch(
      "https://api.mureka.ai/v1/song/generate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lyrics,
          model: "auto",
          prompt,
          n: 1
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Erreur Mureka",
        trace_id: data.trace_id
      });
    }

    return res.status(200).json(data);
  } catch {
    return res.status(502).json({
      error: "Impossible de contacter Mureka."
    });
  }
}
