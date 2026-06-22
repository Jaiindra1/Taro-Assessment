const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const RETRYABLE_STATUS_CODES = new Set([429, 500, 503]);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function generateWithRetry(request, retries = 3) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await model.generateContent(request);
    } catch (error) {
      lastError = error;
      const statusCode = error?.status;
      const shouldRetry =
        RETRYABLE_STATUS_CODES.has(statusCode) &&
        attempt < retries - 1;

      if (!shouldRetry) {
        throw error;
      }

      const delayMs = 2000 * (attempt + 1);
      console.warn(`Gemini request failed with ${statusCode}. Retrying in ${delayMs}ms.`);
      await sleep(delayMs);
    }
  }

  throw lastError;
}

function stripCodeFences(text = "") {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function extractJsonObject(text = "") {
  const cleaned = stripCodeFences(text);
  const start = cleaned.indexOf("{");

  if (start === -1) {
    return cleaned;
  }

  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let index = start; index < cleaned.length; index += 1) {
    const char = cleaned[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === "\\") {
        isEscaped = true;
        continue;
      }

      if (char === "\"") {
        inString = false;
      }

      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return cleaned.slice(start, index + 1);
      }
    }
  }

  return cleaned.slice(start);
}

function parseJsonResponse(text) {
  const candidate = extractJsonObject(text);
  return JSON.parse(candidate);
}

async function generateTripPlan(
  destination,
  durationDays,
  budgetTier,
  interests
) {
  const prompt = `
Generate a travel plan.

Destination: ${destination}
Days: ${durationDays}
Budget: ${budgetTier}
Interests: ${interests.join(", ")}

Return ONLY JSON.

{
  "itinerary":[
    {
      "day":1,
      "activities":[]
    }
  ],
  "budget":{
    "flights":0,
    "accommodation":0,
    "food":0,
    "activities":0,
    "total":0
  },
  "hotels":[]
}
`;

  const request = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const result = await generateWithRetry(request);

  const text = result.response.text();

  try {
    return parseJsonResponse(text);
  } catch (parseError) {
    const repairPrompt = `
Convert the following content into valid JSON only.
Do not add commentary.
Keep the same trip structure and values where possible.

${stripCodeFences(text)}
`;

    const repairRequest = {
      contents: [
        {
          role: "user",
          parts: [{ text: repairPrompt }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const repairResult = await generateWithRetry(repairRequest);

    const repairedText = repairResult.response.text();

    try {
      return parseJsonResponse(repairedText);
    } catch (repairError) {
      console.error("Gemini JSON parse failed.", {
        initialResponse: stripCodeFences(text).slice(0, 500),
        repairedResponse: stripCodeFences(repairedText).slice(0, 500)
      });
      throw repairError;
    }
  }
}

module.exports = {
  generateTripPlan,
};
