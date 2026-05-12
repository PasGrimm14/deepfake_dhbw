/**
 * src/data/quellenUtils.js
 * APA-7-Formatter und Hilfsfunktionen — keine statischen Daten.
 */

export function formatAPA7(q) {
  const authorStr = formatAuthors(q.authors ?? [])
  const year = q.year ? `(${q.year}).` : '(o. J.).'

  switch (q.type) {
    case 'journal': {
      const base        = `${authorStr} ${year} ${q.title}.`
      const journalPart = q.journal ? ` *${q.journal}*` : ''
      const volumePart  = q.volume  ? `, *${q.volume}*` : ''
      const issuePart   = q.issue   ? `(${q.issue})`    : ''
      const pagesPart   = q.pages   ? `, ${q.pages}`    : ''
      const end         = journalPart + volumePart + issuePart + pagesPart + '.'
      const doiPart     = q.doi ? ` https://doi.org/${q.doi}` : q.url ? ` ${q.url}` : ''
      return base + end + doiPart
    }
    case 'book': {
      const base = `${authorStr} ${year} *${q.title}*.`
      const pub  = q.publisher ? ` ${q.publisher}.` : ''
      const doi  = q.doi ? ` https://doi.org/${q.doi}` : q.url ? ` ${q.url}` : ''
      return base + pub + doi
    }
    case 'website': {
      const base   = `${authorStr} ${year} *${q.title}*.`
      const url    = q.url ? ` ${q.url}` : ''
      const access = q.accessDate ? ` Zugriff am ${q.accessDate}.` : ''
      return base + url + access
    }
    case 'news': {
      const base   = `${authorStr} ${year} ${q.title}.`
      const outlet = q.outlet ? ` *${q.outlet}*.` : ''
      const url    = q.url ? ` ${q.url}` : ''
      return base + outlet + url
    }
    case 'report': {
      const base = `${authorStr} ${year} *${q.title}*.`
      const org  = q.organization ? ` ${q.organization}.` : ''
      const url  = q.url ? ` ${q.url}` : ''
      return base + org + url
    }
    default:
      return `${authorStr} ${year} ${q.title}.${q.url ? ' ' + q.url : ''}`
  }
}

function formatAuthors(authors) {
  if (!authors || authors.length === 0) return 'Unbekannt,'
  if (authors.length === 1) return authors[0] + ','
  if (authors.length <= 20)
    return authors.slice(0, -1).join(', ') + ', & ' + authors[authors.length - 1] + ','
  return authors.slice(0, 19).join(', ') + ', . . . ' + authors[authors.length - 1] + ','
}

export function getCategories(quellenArray) {
  return [...new Set(quellenArray.map((q) => q.category))].sort()
}