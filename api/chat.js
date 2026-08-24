export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  // Try the most reliable active Groq model ID
  const model = "llama3-8b-8192";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a French tutor. Reply in simple French, include English translations in parentheses, kindly point out grammar mistakes, and keep answers under 3 sentences."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ reply: `Groq Error: ${data.error?.message || 'Check API key or model string'}` });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: 'Failed to process request.' });
  }
}
