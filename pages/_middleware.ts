import { NextRequest, NextResponse } from 'next/server'
import { AirtablePlusPlus, AirtablePlusPlusRecord } from 'airtable-plusplus'

const fallback = 'https://matthewstanciu.me'
// const airtable = new AirtablePlusPlus({
//   apiKey: process.env.AIRTABLE_API_KEY,
//   baseId: 'appwZU7mXFxKLVXs4',
//   tableName: 'ABLS'
// })

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
    `https://api.airtable.com/v0/appwZU7mXFxKLVXs4/ABLS`,
    { headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` } }
  )
    .then(r => r.json())
    .then(json => json.records)
    .then((records: Array<{ fields: { slug: string; destination: string } }>) =>
      records.map((record) => record.fields)
    )
    return records.find(record => record.slug === slug.toLowerCase())?.destination

  // const records = (await airtable.read({
  //   filterByFormula: `{slug} = "${slug.toLowerCase()}"`,
  //   maxRecords: 1
  // })) as AirtablePlusPlusRecord<{ slug: string, destination: string, visits: number }>[]

  // console.log('records: ' + records)
  // records.forEach(rec => {
  //   console.log(rec.fields)
  // })

  // return records[0].fields.destination
}
