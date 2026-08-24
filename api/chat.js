export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: "You are a French tutor helping a beginner reach B2 level. Reply in simple French, include English translations in parentheses, kindly correct any grammar errors, and keep answers under 3 sentences."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ reply: `Groq Error: ${data.error?.message || 'Check API key or model availability'}` });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: 'Failed to process request.' });
  }
}
