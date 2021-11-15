import { NextRequest, NextResponse } from 'next/server'

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
  return NextResponse.redirect(destination || fallback)
}

const findDestination = async (slug: string): Promise<string | null> => {
  const records = await fetch(
    `https://api.airtable.com/v0/${airtable.baseId}/${airtable.tableName}`,
    { headers: { Authorization: `Bearer ${airtable.apiKey}` } }
  )
    .then(r => r.json())
    .then(json => json.records)
    .then((records: Array<{ fields: { slug: string; destination: string } }>) =>
      records.map((record) => record.fields)
    )

  return records.find((record) => record.slug === slug.toLowerCase())?.destination
}
