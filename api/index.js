const AirtablePlus = require('airtable-plus')

const ablsTable = new AirtablePlus({
  apiKey: process.env.AIRTABLE_API_KEY,
  baseID: 'appwZU7mXFxKLVXs4',
  tableName: 'ABLS'
})

export default async (req, res) => {
  console.log(req.url)
  console.log(req.pathname)
  const slug = req.url.substring(1)
  console.log(slug)
  const destination = await findDestination(slug)

  res.writeHead(302, { Location: destination || 'https://matthewstanciu.me' })
  res.end()
}

const findDestination = async (slug) => {
  const destinationRecord = (await ablsTable.read({
    filterByFormula: `{slug} = '${slug}'`,
    maxRecords: 1
  }))[0]
  if (destinationRecord) return destinationRecord.fields['destination']
}