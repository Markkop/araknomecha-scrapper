import puppeteer from 'puppeteer'
import { scrapClass } from './scrappers'
import { storeData } from './helpers'
/**
 * Execute this package.
 *
 * @returns {undefined}
 */
(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.wakfu.com/en/mmorpg/encyclopedia/classes/2-osamodas', { waitUntil: 'load', timeout: 0 })
  const osamodas = await scrapClass(page)
  await browser.close()
  storeData(osamodas, 'data/osamodas.json')
})()
