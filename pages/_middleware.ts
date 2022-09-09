import { NextRequest, NextResponse } from 'next/server'

// Note: The official Airtable API wrapper (and by extension, every other one I could find) does not
// currently work on Edge Functions because it uses `eval` somewhere, and `eval` is not allowed on
// Edge Functions (at least this is my understanding). When a TypeScript-compatible Airtable API wrapper
// begins working on Edge Functions, I will start using it. In the meantime, however, I need to make raw requests.

const fallback = 'https://matthewstanciu.me'
const airtable = {
  baseId: 'appwZU7mXFxKLVXs4',
  tableName: 'ABLS',
  apiKey: process.env.AIRTABLE_API_KEY
}

export default async (req: NextRequest) => {
  const slug = req.nextUrl.pathname.replace('/', '')
  if (slug.length === 0) {
    NextResponse.redirect(fallback)
  }

  const destination = await findDestination(slug)
  logVisit(destination?.recId, destination?.visits)
  return NextResponse.redirect(destination?.destination || fallback)
}

const findDestination = async (slug: string): Promise<{destination: string | undefined, visits: number | undefined, recId: string | undefined} | null> => {
  const records = await fetch(
    `https://api.airtable.com/v0/${airtable.baseId}/${airtable.tableName}`,
    { headers: { Authorization: `Bearer ${airtable.apiKey}` } }
  )
    .then(r => r.json())
    .then(json => json.records)
    .then((records: Array<{ fields: { slug: string; destination: string; visits: number; id: string } }>) =>
      records.map((record) => record.fields)
    )
    const record = records.find(rec => rec.slug === slug.toLowerCase())
    return {
      destination: record?.destination,
      visits: record?.visits,
      recId: record?.id
    }
}

const logVisit = (recordId: string|undefined, visits: number|undefined): void => {
  if (!recordId || typeof visits === 'undefined') return
  fetch(
    `https://api.airtable.com/v0/${airtable.baseId}/${airtable.tableName}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${airtable.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [
          {
            id: recordId,
            fields: {
                visits: visits + 1
            }
          }
        ]
      })
    }
  )
}