const https = require('https')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { question, category } = req.body
  const apiKey = process.env.VITE_GROQ_KEY

  const bodyData = JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1500,
    messages: [
      { role: 'system', content: 'You are LifeTwin AI, a personal decision simulator. Always respond with valid JSON only, no extra text.' },
      { role: 'user', content: `A user asked: "${question}" Category: ${category}. Return this exact JSON: {"ai_analysis":"2-3 sentence analysis","path_a":{"name":"Safe Path","description":"description","probability":65,"risk_level":"Low","regret_risk":12,"timeline":"6-9 months","happiness_score":"+20%"},"path_b":{"name":"Risky Path","description":"description","probability":35,"risk_level":"High","regret_risk":58,"timeline":"3-18 months","happiness_score":"-5%"},"path_c":{"name":"Optimal Path","description":"description","probability":78,"risk_level":"Moderate","regret_risk":15,"timeline":"4-8 months","happiness_score":"+45%"},"regret_score":15,"recommended_path":"C","key_insight":"one powerful insight"}` }
    ]
  })

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(bodyData)
      }
    }

    const apiReq = https.request(options, (apiRes) => {
      let data = ''
      apiRes.on('data', chunk => { data += chunk })
      apiRes.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          const text = parsed.choices[0].message.content
          const clean = text.replace(/```json|```/g, '').trim()
          res.status(200).json(JSON.parse(clean))
          resolve()
        } catch (e) {
          res.status(500).json({ error: 'Parse error' })
          resolve()
        }
      })
    })

    apiReq.on('error', (e) => {
      res.status(500).json({ error: e.message })
      resolve()
    })

    apiReq.write(bodyData)
    apiReq.end()
  })
}