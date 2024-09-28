import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { chromium } from 'playwright';
import fs from 'fs';
import { cors } from 'hono/cors'

const app = new Hono()
app.use('/', cors())
app.use('/screenshot', cors())

app.get('/', (c) => {
  return c.text('Hello Honey!')
})

app.post('/screenshot', async (c) => {
  const body = await c.req.json()
  const url = body.url as string;

  console.log(`Taking screenshot of ${url}`)
  const browser = await chromium.launch();
	const page = await browser.newPage();
	await page.goto(url);
	await page.screenshot({ path: `static/screenshot.png` });
	await browser.close();

	const screenshot = fs.readFileSync(`static/screenshot.png`);

  return c.json({
    screenshot: Buffer.from(screenshot)
  })
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
