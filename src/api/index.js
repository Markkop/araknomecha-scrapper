import express from 'express'
import puppeteer from 'puppeteer'
import scrapAlmanax from '../scrappers/almanax'

const app = express()

app.get('/', function (req, res) {
  puppeteer.launch().then(async function (browser) {
    const page = await browser.newPage()
    await page.goto('http://www.krosmoz.com/en/almanax/2020-10-06')

    const almanax = await scrapAlmanax(page)
    await browser.close()
    res.send(almanax)
  })
})

app.listen(7000, function () {
  console.log('Running on port 7000.')
})

puppeteer.launch().then(async function (browser) {
  const page = await browser.newPage()
  await page.goto('http://www.krosmoz.com/en/almanax/')

  console.log(await scrapAlmanax(page))
  await browser.close()
})
