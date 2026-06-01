export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({
      error: "Missing OPENAI_API_KEY environment variable.",
    });
  }

  const { destination, guests, days, mood, vessel } = request.body || {};

  if (!destination || !guests || !days || !mood || !vessel) {
    return response.status(400).json({
      error: "Missing required route planning details.",
    });
  }

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "You are an expert yacht charter planner. Create concise, practical sailing holiday previews for clients. Mention that weather and marina details must be verified before booking.",
          },
          {
            role: "user",
            content: `Create a ${days}-day holiday preview.

Destination: ${destination}
Guests: ${guests}
Vessel style: ${vessel}
Trip mood: ${mood}

Include:
- Short route summary
- Day-by-day itinerary
- Suggested marinas or anchorages
- Swimming stops
- Food, wine, seafood, and local culture ideas
- Provisioning notes
- Weather assumptions
- Safety notes
- Fuel notes if powerboat or mixed vessel style

Keep it client-friendly and no more than 700 words.`,
          },
        ],
      }),
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return response.status(openaiResponse.status).json({
        error: data.error?.message || "OpenAI request failed.",
      });
    }

    return response.status(200).json({
      preview: data.output_text || "No preview generated.",
    });
  } catch (error) {
    return response.status(500).json({
      error: "Could not generate route preview.",
    });
  }
}
