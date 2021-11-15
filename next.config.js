module.exports = {
  async headers() {
    return [
      {
        source: '/*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=10, stale-while-revalidate',
          }
        ],
      },
    ]
  },
}