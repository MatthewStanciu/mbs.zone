const AirtablePlus = require('airtable-plus')

const ablsTable = new AirtablePlus({
  apiKey: process.env.AIRTABLE_API_KEY,
  baseID: 'appwZU7mXFxKLVXs4',
  tableName: 'ABLS'
})

export default async (req, res) => {
  const { slug } = req.query
  const destination = await findDestination(slug)

  res.writeHead(302, { Location: destination || 'https://matthewstanciu.me' })
  res.end()
}

const findDestination = async (slug) => {
  const destinationRecord = (await ablsTable.read({
    filterByFormula: `{slug} = '${slug}'`
  }))[0]
  if (destinationRecord) return destinationRecord[0].fields['destination']
}