import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import Database from 'better-sqlite3';
import { parseAddress } from './helpers/parseAddress';

const app = new Hono()
const db = new Database(process.env.DATABASE_PATH);

app.get('/', (c) => {
  return c.text('Bible Frame API')
})

app.get('/verses', (c) => {
  try {
    const address = c.req.query('address')
    const { book, chapter, verses } = parseAddress(address as string)
    let query = 'SELECT * FROM verses WHERE book_id = ? and chapter = ?'
    if (verses.length) {
      query += ` and number in (${verses.map((v) => v).join(',')})`
    }
    console.log(query)
    const data = db.prepare(query).all(book, chapter)

    return c.json(data, 200, {
      'Access-Control-Allow-Origin': '*'
    })
  } catch (err) {
    console.log(err)
    return c.json({ err }, 400, {
      'Access-Control-Allow-Origin': '*'
    })
  }
})

const port = Number(process.env.PORT) || 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
