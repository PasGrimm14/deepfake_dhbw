const express = require('express')
const app = express()

const NOTION_API     = 'https://api.notion.com'
const NOTION_VERSION = '2022-06-28'
const NOTION_TOKEN   = process.env.NOTION_TOKEN
const PORT           = process.env.PORT || 3002

app.use(express.json())

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// Health check
app.get('/health', (req, res) => res.json({ ok: true }))

// Notion proxy
app.post('/api/notion-proxy', async (req, res) => {
  const { databaseId, body: queryBody } = req.body ?? {}

  if (!databaseId) {
    return res.status(400).json({ error: 'databaseId fehlt' })
  }
  if (!NOTION_TOKEN) {
    return res.status(500).json({ error: 'NOTION_TOKEN nicht gesetzt' })
  }

  try {
    const notionRes = await fetch(
      `${NOTION_API}/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization:    `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type':   'application/json',
        },
        body: JSON.stringify(queryBody ?? {}),
      }
    )

    const data = await notionRes.json()
    res.status(notionRes.status).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => console.log(`Notion proxy läuft auf Port ${PORT}`))