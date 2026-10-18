
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  const apiKey = process.env.MUREKA_API_KEY;
  const id = req.query?.id;

  if (!apiKey) {
    return res.status(500).json({
      error: "La clé Mureka manque dans Vercel."
    });
  }

  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return res.status(400).json({
      error: "Identifiant de génération invalide."
    });
  }

  try {
    const response = await fetch(
      `https://api.mureka.ai/v1/song/query/${encodeURIComponent(id)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Erreur de vérification Mureka",
        trace_id: data.trace_id
      });
    }

    return res.status(200).json(data);
  } catch {
    return res.status(502).json({
      error: "Impossible de vérifier la génération."
    });
  }
}
