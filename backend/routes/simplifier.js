import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const schema = {
      type: "object",
      properties: {
        summary: { type: "string" },
        keyClauses: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              detail: { type: "string" },
              status: { type: "string" },
              alert: { type: "boolean" },
            },
            required: ["title", "detail", "status", "alert"],
          },
        },
      },
      required: ["summary", "keyClauses"],
    };

    const prompt = `
Summarize this legal text in plain English and extract important clauses.
Text:
${text}
`;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a JSON-only assistant. Return only valid JSON that matches the provided schema.",
          },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "contract_summary_schema", schema },
        },
        temperature: 0,
      }),
    });

    const data = await response.json();
    let reply = data?.choices?.[0]?.message?.content;

    if (!reply) return res.status(502).json({ error: "No valid content from API." });
    reply = reply.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      res.json(JSON.parse(reply));
    } catch (e) {
      res.status(502).json({ error: "Invalid JSON received", details: e.message });
    }
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

export default router;
