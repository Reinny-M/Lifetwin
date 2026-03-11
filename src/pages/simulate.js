export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question, category } = req.body
  const apiKey = process.env.VITE_GROQ_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1500,
        messages: [
          { role: 'system', content: 'Respond with valid JSON only, no extra text.' },
          { role: 'user', content: `User asked: "${question}" Category: ${category}. Return this JSON: {"ai_analysis":"your analysis here","path_a":{"name":"Safe Path","description":"description","probability":65,"risk_level":"Low","regret_risk":12,"timeline":"6-9 months","happiness_score":"+20%"},"path_b":{"name":"Risky Path","description":"description","probability":35,"risk_level":"High","regret_risk":58,"timeline":"3-18 months","happiness_score":"-5%"},"path_c":{"name":"Optimal Path","description":"description","probability":78,"risk_level":"Moderate","regret_risk":15,"timeline":"4-8 months","happiness_score":"+45%"},"regret_score":15,"recommended_path":"C","key_insight":"your insight here"}` }
        ]
      })
    })

    const data = await response.json()
    const text = data.choices[0].message.content
    const clean = text.replace(/```json|```/g, '').trim()
    return res.status(200).json(JSON.parse(clean))

  } catch (err) {
    console.error('Simulate error:', err)
    return res.status(500).json({ error: err.message })
  }
}
