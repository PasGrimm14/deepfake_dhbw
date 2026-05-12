/**
 * ============================================================
 *  QUELLEN — APA 7 Quellenverzeichnis
 * ============================================================
 *
 *  Neue Quelle hinzufügen?
 *  ─────────────────────────────────────────────────────────
 *  1. Kopiere einen der bestehenden Einträge weiter unten.
 *  2. Füge ihn ans Ende des Arrays (vor dem ]) ein.
 *  3. Fülle die Felder aus — nicht benötigte Felder einfach
 *     leer lassen ("") oder die Zeile löschen.
 *  4. Speichern — die Seite aktualisiert sich automatisch.
 *
 *  Pflichtfelder je Typ:
 *  ─────────────────────────────────────────────────────────
 *  Alle Typen  → id (eindeutig!), type, category
 *  journal     → authors, year, title, journal, volume, issue, pages, doi
 *  book        → authors, year, title, publisher
 *  website     → authors (oder organization), year, title, url
 *              → accessDate nur setzen wenn Inhalt sich ändern kann
 *  news        → authors, year, title, outlet, url
 *  report      → authors (oder organization), year, title, organization, url
 *
 *  Felder-Referenz:
 *  ─────────────────────────────────────────────────────────
 *  id           Eindeutige ID (z.B. "sumsub2023")
 *  type         "journal" | "book" | "website" | "news" | "report"
 *  category     Thematische Gruppe, frei wählbar (z.B. "Technologie")
 *  authors      Array von Strings: ["Nachname, V.", "Nachname2, V."]
 *               Bei Organisationen: ["Sumsub"] (ein Element)
 *  year         Erscheinungsjahr als String: "2023"
 *  title        Titel des Werks (Artikel/Kapitel nicht kursiv — normal lassen)
 *  journal      (nur journal) Name der Zeitschrift — wird kursiv dargestellt
 *  volume       (nur journal) Band — wird kursiv dargestellt
 *  issue        (nur journal) Heft/Ausgabe — in Klammern, nicht kursiv
 *  pages        Seitenzahlen, z.B. "123–145"
 *  doi          DOI ohne "https://doi.org/" — APA 7 gibt ihn immer als Link aus
 *  publisher    (book) Verlagsname — APA 7: kein Erscheinungsort mehr!
 *  organization (report) Herausgebende Organisation
 *  url          Vollständige URL inkl. https://
 *  accessDate   Zugriffsdatum NUR bei sich ändernden Inhalten: "12. Mai 2026"
 *  note         Optionaler Hinweis (wird in Klammern angezeigt)
 * ============================================================
 */

export const quellen = [
  // ── TECHNOLOGIE ───────────────────────────────────────────────────────────

  {
    id: "goodfellow2014",
    type: "journal",
    category: "Technologie",
    authors: ["Goodfellow, I.", "Pouget-Abadie, J.", "Mirza, M.", "Xu, B.", "Warde-Farley, D.", "Ozair, S.", "Courville, A.", "Bengio, Y."],
    year: "2014",
    title: "Generative adversarial nets",
    journal: "Advances in Neural Information Processing Systems",
    volume: "27",
    pages: "2672–2680",
    url: "https://papers.nips.cc/paper/2014/hash/5ca3e9b122f61f8f06494c97b1afccf3-Abstract.html",
  },
  {
    id: "tolosana2020",
    type: "journal",
    category: "Technologie",
    authors: ["Tolosana, R.", "Vera-Rodriguez, R.", "Fierrez, J.", "Morales, A.", "Ortega-Garcia, J."],
    year: "2020",
    title: "Deepfakes and beyond: A survey of face manipulation and fake detection",
    journal: "Information Fusion",
    volume: "64",
    pages: "131–148",
    doi: "10.1016/j.inffus.2020.06.014",
  },
  {
    id: "westerlund2019",
    type: "journal",
    category: "Technologie",
    authors: ["Westerlund, M."],
    year: "2019",
    title: "The emergence of deepfake technology: A review",
    journal: "Technology Innovation Management Review",
    volume: "9",
    issue: "11",
    pages: "39–52",
    doi: "10.22215/timreview/1282",
  },

  // ── FALLBEISPIELE ─────────────────────────────────────────────────────────

  {
    id: "cnn2024hongkong",
    type: "news",
    category: "Fallbeispiele",
    authors: ["Magramo, K.", "Krishnan, A."],
    year: "2024",
    title: "Finance worker pays out $25 million after video call with deepfake 'chief financial officer'",
    outlet: "CNN",
    url: "https://edition.cnn.com/2024/02/04/asia/deepfake-cfo-scam-hong-kong-intl-hnk/index.html",
  },
  {
    id: "bbc2022ukraine",
    type: "news",
    category: "Fallbeispiele",
    authors: ["BBC News"],
    year: "2022",
    title: "Ukraine war: Deepfake shows President Zelensky 'surrendering'",
    outlet: "BBC News",
    url: "https://www.bbc.com/news/technology-60780142",
  },
  {
    id: "wapo2023voice",
    type: "news",
    category: "Fallbeispiele",
    authors: ["Lerman, R."],
    year: "2023",
    title: "AI voice clones are being used to defraud families",
    outlet: "The Washington Post",
    url: "https://www.washingtonpost.com/technology/2023/03/05/ai-voice-scam/",
  },

  // ── STATISTIKEN & REPORTS ─────────────────────────────────────────────────

  {
    id: "sumsub2023",
    type: "report",
    category: "Statistiken & Reports",
    authors: ["Sumsub"],
    year: "2023",
    title: "Identity fraud report 2023",
    organization: "Sumsub",
    url: "https://sumsub.com/fraud-report/",
  },
  {
    id: "europol2022",
    type: "report",
    category: "Statistiken & Reports",
    authors: ["Europol"],
    year: "2022",
    title: "Facing reality? Law enforcement and the challenge of deepfakes",
    organization: "Europol Innovation Lab",
    url: "https://www.europol.europa.eu/publications-events/publications/facing-reality-law-enforcement-and-challenge-of-deepfakes",
  },

  // ── REGULIERUNG ───────────────────────────────────────────────────────────

  {
    id: "eu_ai_act2024",
    type: "report",
    category: "Regulierung",
    authors: ["Europäisches Parlament", "Rat der Europäischen Union"],
    year: "2024",
    title: "Regulation (EU) 2024/1689 of the European Parliament and of the Council — Artificial Intelligence Act",
    organization: "EUR-Lex",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
    note: "Insbesondere Art. 50 zur Kennzeichnungspflicht von Deepfakes",
  },
  {
    id: "bsi2023",
    type: "report",
    category: "Regulierung",
    authors: ["Bundesamt für Sicherheit in der Informationstechnik"],
    year: "2023",
    title: "Deepfakes — Technische Hintergründe und Schutzmaßnahmen",
    organization: "BSI",
    url: "https://www.bsi.bund.de",
  },

  // ── DETECTION ─────────────────────────────────────────────────────────────

  {
    id: "rossler2019",
    type: "journal",
    category: "Detection",
    authors: ["Rössler, A.", "Cozzolino, D.", "Verdoliva, L.", "Riess, C.", "Thies, J.", "Nießner, M."],
    year: "2019",
    title: "FaceForensics++: Learning to detect manipulated facial images",
    journal: "Proceedings of the IEEE/CVF International Conference on Computer Vision",
    pages: "1–11",
    doi: "10.1109/ICCV.2019.00009",
  },
]


// ============================================================
//  Hilfsfunktionen — NICHT verändern
// ============================================================

/**
 * Formatiert einen Eintrag als APA-7-Zitationsstring.
 *
 * APA 7 Kernunterschiede zu APA 6:
 *  - Bis zu 20 Autoren vollständig nennen (ab 21: erste 19 + „. . ." + letzter)
 *  - Kein Erscheinungsort mehr bei Büchern und Reports
 *  - DOI immer als https://doi.org/... (nie als "doi:")
 *  - "Abgerufen von / Zugriff" entfällt bei stabilen Webseiten
 *  - Volume kursiv, Issue in Klammern (nicht kursiv)
 */
export function formatAPA7(q) {
  const authorStr = formatAuthors(q.authors ?? [])
  const year = q.year ? `(${q.year}).` : "(o. J.)."

  switch (q.type) {
    case "journal": {
      // Nachname, V., & Nachname, V. (Jahr). Titel des Artikels.
      // *Zeitschrift*, *Band*(Heft), Seiten. https://doi.org/...
      const base       = `${authorStr} ${year} ${q.title}.`
      const journalPart = q.journal ? ` *${q.journal}*` : ""
      const volumePart  = q.volume  ? `, *${q.volume}*` : ""
      const issuePart   = q.issue   ? `(${q.issue})`    : ""
      const pagesPart   = q.pages   ? `, ${q.pages}`    : ""
      const end = journalPart + volumePart + issuePart + pagesPart + "."
      const doiPart = q.doi ? ` https://doi.org/${q.doi}` : q.url ? ` ${q.url}` : ""
      return base + end + doiPart
    }

    case "book": {
      // Nachname, V. (Jahr). *Titel*. Verlag.
      // APA 7: kein Erscheinungsort!
      const base = `${authorStr} ${year} *${q.title}*.`
      const pub  = q.publisher ? ` ${q.publisher}.` : ""
      const doi  = q.doi ? ` https://doi.org/${q.doi}` : q.url ? ` ${q.url}` : ""
      return base + pub + doi
    }

    case "website": {
      // Organisation/Autor. (Jahr). *Titel*. URL
      // accessDate nur wenn Inhalt sich ändern kann
      const base   = `${authorStr} ${year} *${q.title}*.`
      const url    = q.url ? ` ${q.url}` : ""
      const access = q.accessDate ? ` Zugriff am ${q.accessDate}.` : ""
      return base + url + access
    }

    case "news": {
      // Nachname, V. (Jahr). Titel des Artikels. *Outlet*. URL
      const base   = `${authorStr} ${year} ${q.title}.`
      const outlet = q.outlet ? ` *${q.outlet}*.` : ""
      const url    = q.url ? ` ${q.url}` : ""
      return base + outlet + url
    }

    case "report": {
      // Organisation. (Jahr). *Titel*. Herausgebende Organisation. URL
      // APA 7: kein Erscheinungsort!
      const base = `${authorStr} ${year} *${q.title}*.`
      const org  = q.organization ? ` ${q.organization}.` : ""
      const url  = q.url ? ` ${q.url}` : ""
      return base + org + url
    }

    default:
      return `${authorStr} ${year} ${q.title}.${q.url ? " " + q.url : ""}`
  }
}

function formatAuthors(authors) {
  if (!authors || authors.length === 0) return "Unbekannt,"
  if (authors.length === 1) return authors[0] + ","
  // APA 7: bis 20 Autoren → alle vollständig nennen
  if (authors.length <= 20) {
    return authors.slice(0, -1).join(", ") + ", & " + authors[authors.length - 1] + ","
  }
  // APA 7: ab 21 Autoren → erste 19 + ". . ." + letzter
  return authors.slice(0, 19).join(", ") + ", . . . " + authors[authors.length - 1] + ","
}

/** Gibt alle einzigartigen Kategorien zurück, sortiert. */
export function getCategories(quellenArray) {
  return [...new Set(quellenArray.map((q) => q.category))].sort()
}