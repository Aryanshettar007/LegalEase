import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const apiResponse = await fetch("https://api.perplexity.ai/chat/completions", {
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
            content: "Translate this text into multiple Indian languages if required.",
          },
          { role: "user", content: text },
        ],
        temperature: 0,
        max_tokens: 8000,
      }),
    });

    const data = await apiResponse.json();
    let reply = data?.choices?.[0]?.message?.content?.trim();

    reply = reply.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      res.json(JSON.parse(reply));
    } catch (err) {
      res.json({ translation: reply });
    }
  } catch (error) {
    console.error("❌ Translator error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

export default router;
