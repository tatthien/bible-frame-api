export function parseAddress(address: string) {
  const trimmedAddress = address.trim()

  const regex = /^(?<book>(?:[0-9]{1})?[A-Za-z]+)\s+(?<chapter>\d+)(?::(?<verseFrom>\d+)?(?:-(?<verseTo>\d+))?)?$/
  const match = trimmedAddress.match(regex)

  if (match) {
    const verseFrom = match[3]
    const verseTo = match[4]

    let verses = verseFrom ? [Number(verseFrom)] : []
    if (verseFrom && verseTo) {
      verses = Array.from({ length: Number(verseTo) - Number(verseFrom) + 1 }, (_, i) => Number(verseFrom) + i)
    }

    return {
      book: match[1].toUpperCase(),
      chapter: match[2],
      verses: verses,
    }
  }

  throw new Error('Invalid address')
}
