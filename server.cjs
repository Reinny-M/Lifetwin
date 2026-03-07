const express = require('express')
const cors = require('cors')
const https = require('https')

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/test', (req, res) => {
  res.json({ status: 'working', key: process.env.VITE_ANTHROPIC_KEY ? 'found' : 'missing' })
})

app.post('/simulate', (req, res) => {
  const { question, category } = req.body
  const apiKey = process.env.VITE_ANTHROPIC_KEY

  console.log('Simulating:', question)

  const bodyData = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: `You are LifeTwin AI. A user asked: "${question}" Category: ${category}. Respond with JSON only, no other text:
{"ai_analysis":"2-3 sentence analysis","path_a":{"name":"Safe Path","description":"brief description","probability":65,"risk_level":"Low","regret_risk":12,"timeline":"6-9 months","happiness_score":"+20%"},"path_b":{"name":"Risky Path","description":"brief description","probability":35,"risk_level":"High","regret_risk":58,"timeline":"3-18 months","happiness_score":"-5%"},"path_c":{"name":"Optimal Path","description":"brief description","probability":78,"risk_level":"Moderate","regret_risk":15,"timeline":"4-8 months","happiness_score":"+45%"},"regret_score":15,"recommended_path":"C","key_insight":"one powerful insight"}`
    }]
  })

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(bodyData)
    }
  }

  const apiReq = https.request(options, (apiRes) => {
    let data = ''
    apiRes.on('data', chunk => { data += chunk })
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data)
        console.log('Anthropic status:', apiRes.statusCode)
        res.json(parsed)
      } catch(e) {
        res.status(500).json({ error: 'Parse error' })
      }
    })
  })

  apiReq.on('error', (e) => {
    console.error('Error:', e.message)
    res.status(500).json({ error: e.message })
  })

  apiReq.write(bodyData)
  apiReq.end()
})

app.listen(3002, () => {
  console.log('LifeTwin server running on port 3002')
})