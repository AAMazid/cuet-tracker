export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "API key not set" });

  try {
    const { system, messages, max_tokens } = req.body;

    // Build Gemini conversation
    const history = (messages || []).slice(0, -1).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    const lastMsg = messages[messages.length - 1];

    const body = {
      system_instruction: { parts: [{ text: system || "" }] },
      contents: [
        ...history,
        { role: "user", parts: [{ text: lastMsg?.content || "" }] }
      ],
      generationConfig: { maxOutputTokens: max_tokens || 1024, temperature: 0.7 }
    };

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + key;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";

    // Return in Claude format so App.jsx works without changes
    res.status(200).json({ content: [{ text }] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
