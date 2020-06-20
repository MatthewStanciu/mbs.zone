const AirtablePlus = require('airtable-plus')

const ablsTable = new AirtablePlus({
  apiKey: process.env.AIRTABLE_API_KEY,
  baseID: 'appwZU7mXFxKLVXs4',
  tableName: 'ABLS'
})

export default async (req, res) => {
  const slug = req.url.substring(1)
  const destination = await findDestination(slug)

  res.writeHead(302, { Location: destination.dest || 'https://matthewstanciu.me' })
  res.end()

  ablsTable.update(destination.id, {
    'visits': destination.visits + 1
  })
}

const findDestination = async (slug) => {
  const destinationRecord = (await ablsTable.read({
    filterByFormula: `{slug} = '${slug}'`,
    maxRecords: 1
  }))[0]
  if (destinationRecord) return {
    dest: destinationRecord.fields['destination'],
    id: destinationRecord.id,
    visits: destinationRecord.fields['visits']
  }
}