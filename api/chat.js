const https = require('https')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { message } = req.body
  const apiKey = process.env.VITE_GROQ_KEY

  const bodyData = JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 300,
    messages: [
      { role: 'system', content: 'You are LifeTwin AI, a warm personal decision advisor. Keep responses under 3 sentences.' },
      { role: 'user', content: message }
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
          res.status(200).json({ reply: parsed.choices[0].message.content })
          resolve()
        } catch (e) {
          res.status(500).json({ reply: 'Sorry, try again!' })
          resolve()
        }
      })
    })

    apiReq.on('error', (e) => {
      res.status(500).json({ reply: 'Connection error.' })
      resolve()
    })

    apiReq.write(bodyData)
    apiReq.end()
  })
}