import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let messages = [];

    if (req.body.text) {
      messages = [{ role: "user", content: req.body.text }];
    } else if (Array.isArray(req.body.messages)) {
      messages = req.body.messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));
    } else {
      return res.status(400).json({
        error: "Please provide either 'text' or 'messages' array in request body.",
      });
    }

    messages.unshift({
      role: "system",
      content: "You are a helpful assistant who understands context from previous messages.",
    });

    const apiResponse = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages,
      }),
    });

    const data = await apiResponse.json();
    const reply = data?.choices?.[0]?.message?.content || "No reply received.";
    res.json(reply);
  } catch (error) {
    console.error("❌ Error processing text:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

export default router;
