module.exports = async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed. Use POST." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({
      error: "Missing OPENAI_API_KEY in Vercel Environment Variables.",
    });
  }

  const body =
    typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};

  const { region, start, guests, days, mood, vessel } = body;

  if (!region || !start || !guests || !days || !mood || !vessel) {
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
              "You are an expert yacht charter planner. Create concise, practical sailing holiday previews for clients. Mention that weather and marina details must be verified before booking. Return only valid JSON, with no markdown fences.",
          },
          {
            role: "user",
            content: `Create a ${days}-day holiday preview and route map data.

Region: ${region}
Starting point: ${start}
Guests: ${guests}
Vessel style: ${vessel}
Trip mood: ${mood}

Include:
- Short route summary
- Day-by-day itinerary
- Suggested marinas or anchorages
- Swimming stops
- Family-friendly pacing, short passages, safe swim stops, and kid-friendly food if trip mood is with kids
- Food, wine, seafood, and local culture ideas
- Provisioning notes
- Weather assumptions
- Safety notes
- Fuel notes if powerboat or mixed vessel style

Return only this JSON shape:
{
  "summary": "Short client-friendly route summary",
  "stops": [
    {
      "day": 1,
      "name": "Starting marina or destination",
      "type": "marina | anchorage | swim stop | town | bay",
      "note": "Very short note",
      "lat": 37.9838,
      "lng": 23.7275
    }
  ],
  "itinerary": [
    "Day 1: ...",
    "Day 2: ..."
  ],
  "food": ["..."],
  "weather": "...",
  "provisioning": "...",
  "safety": "..."
}

Rules:
- Include 5 to 8 route stops.
- First stop must be ${start}.
- Each stop must include approximate decimal coordinates as lat and lng.
- Keep text client-friendly.
- Do not exceed 700 words total.`,
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

    const text = extractOpenAIText(data);
    const routePlan = parseRoutePlan(text);

    return response.status(200).json({
      preview: formatRoutePreview(routePlan, text),
      stops: routePlan.stops || [],
      routePlan,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message || "Could not generate route preview.",
    });
  }
};

function extractOpenAIText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text;
  }

  if (!Array.isArray(data.output)) {
    return "";
  }

  return data.output
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function parseRoutePlan(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return {
          summary: text || "No preview generated.",
          stops: [],
          itinerary: [],
        };
      }
    }
    return {
      summary: text || "No preview generated.",
      stops: [],
      itinerary: [],
    };
  }
}

function formatRoutePreview(routePlan, fallbackText) {
  if (!routePlan || typeof routePlan !== "object") {
    return fallbackText || "No preview generated.";
  }

  const sections = [];

  if (routePlan.summary) {
    sections.push(routePlan.summary);
  }

  if (Array.isArray(routePlan.itinerary) && routePlan.itinerary.length) {
    sections.push(`Itinerary:\n${routePlan.itinerary.join("\n")}`);
  }

  if (Array.isArray(routePlan.food) && routePlan.food.length) {
    sections.push(`Food and culture:\n${routePlan.food.join("\n")}`);
  }

  if (routePlan.weather) {
    sections.push(`Weather:\n${routePlan.weather}`);
  }

  if (routePlan.provisioning) {
    sections.push(`Provisioning:\n${routePlan.provisioning}`);
  }

  if (routePlan.safety) {
    sections.push(`Safety:\n${routePlan.safety}`);
  }

  return sections.join("\n\n") || fallbackText || "No preview generated.";
}
