/**
 * src/hooks/useNotion.js
 * ─────────────────────────────────────────────────────────────
 * Entwicklung  → Vite-Proxy:     /notion-api  → api.notion.com
 * Production   → notion-proxy Container: /api/notion-proxy
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react'

const IS_DEV        = import.meta.env.DEV
const NOTION_TOKEN  = import.meta.env.VITE_NOTION_TOKEN
const DATABASE_ID   = import.meta.env.VITE_NOTION_DATABASE_ID
const NOTION_VERSION = '2022-06-28'

// Proxy-URL: im Dev über Vite, in Prod über den notion-proxy Container
// VITE_NOTION_PROXY_URL kann in .env auf z.B. https://notion-proxy.pasgri-cloud.de gesetzt werden
const PROXY_URL = import.meta.env.VITE_NOTION_PROXY_URL ?? ''

async function queryViaViteProxy(cursor) {
  const body = {
    sorts: [
      { property: 'category', direction: 'ascending' },
      { property: 'title',    direction: 'ascending' },
    ],
    ...(cursor ? { start_cursor: cursor } : {}),
  }

  const res = await fetch(`/notion-api/v1/databases/${DATABASE_ID}/query`, {
    method:  'POST',
    headers: {
      Authorization:    `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type':   'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message ?? `Notion API Fehler ${res.status}`)
  }
  return res.json()
}

async function queryViaProxy(cursor) {
  const body = {
    sorts: [
      { property: 'category', direction: 'ascending' },
      { property: 'title',    direction: 'ascending' },
    ],
    ...(cursor ? { start_cursor: cursor } : {}),
  }

  const res = await fetch(`${PROXY_URL}/api/notion-proxy`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ databaseId: DATABASE_ID, body }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `Proxy Fehler ${res.status}`)
  }
  return res.json()
}

const queryDatabase = IS_DEV ? queryViaViteProxy : queryViaProxy

// ── Notion Property Helpers ───────────────────────────────────

function getText(prop) {
  if (!prop) return ''
  switch (prop.type) {
    case 'title':     return prop.title?.map((t) => t.plain_text).join('')     ?? ''
    case 'rich_text': return prop.rich_text?.map((t) => t.plain_text).join('') ?? ''
    case 'select':    return prop.select?.name ?? ''
    case 'url':       return prop.url ?? ''
    default:          return ''
  }
}

function parseAuthors(raw) {
  if (!raw) return []
  const withAmp = raw.split(' & ')
  const last    = withAmp.length > 1 ? withAmp.pop().trim() : null
  const rest    = withAmp.join(' & ').split(';').map((a) => a.trim()).filter(Boolean)
  if (last) rest.push(last)
  return rest
}

function mapPage(page) {
  const p = page.properties
  return {
    id:           getText(p.id)           || page.id,
    type:         getText(p.type)         || 'website',
    category:     getText(p.category)     || 'Allgemein',
    title:        getText(p.title),
    authors:      parseAuthors(getText(p.authors)),
    year:         getText(p.year),
    journal:      getText(p.journal),
    volume:       getText(p.volume),
    issue:        getText(p.issue),
    pages:        getText(p.pages),
    doi:          getText(p.doi),
    publisher:    getText(p.publisher),
    organization: getText(p.organization),
    outlet:       getText(p.outlet),
    url:          getText(p.url),
    accessDate:   getText(p.accessDate),
    note:         getText(p.note),
  }
}

// ── Hook ─────────────────────────────────────────────────────

export function useNotion() {
  const [quellen,  setQuellen]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    if (!DATABASE_ID) {
      setError('VITE_NOTION_DATABASE_ID fehlt in der .env Datei.')
      setLoading(false)
      return
    }
    if (IS_DEV && !NOTION_TOKEN) {
      setError('VITE_NOTION_TOKEN fehlt in der .env Datei.')
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchAll() {
      try {
        let results = []
        let cursor  = undefined

        do {
          const data = await queryDatabase(cursor)
          results = results.concat(data.results ?? [])
          cursor  = data.has_more ? data.next_cursor : undefined
        } while (cursor)

        if (!cancelled) {
          setQuellen(results.map(mapPage))
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message)
          setLoading(false)
        }
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  return { quellen, loading, error }
}