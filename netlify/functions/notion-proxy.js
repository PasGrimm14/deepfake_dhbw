/**
 * netlify/functions/notion-proxy.js
 * ─────────────────────────────────────────────────────────────
 * Serverless Function — läuft auf Netlify, nicht im Browser.
 * Leitet Anfragen an die Notion API weiter und setzt die
 * richtigen CORS-Header, damit der Browser die Antwort akzeptiert.
 *
 * Aufruf vom Frontend: fetch('/api/notion-proxy', { ... })
 * ─────────────────────────────────────────────────────────────
 */

const NOTION_API     = 'https://api.notion.com'
const NOTION_VERSION = '2022-06-28'

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { databaseId, body: queryBody } = JSON.parse(event.body ?? '{}')

    if (!databaseId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'databaseId fehlt' }),
      }
    }

    const notionRes = await fetch(
      `${NOTION_API}/v1/databases/${databaseId}/query`,
      {
        method:  'POST',
        headers: {
          Authorization:    `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type':   'application/json',
        },
        body: JSON.stringify(queryBody ?? {}),
      }
    )

    const data = await notionRes.json()

    return {
      statusCode: notionRes.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    }
  }
}