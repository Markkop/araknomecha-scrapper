import puppeteer from 'puppeteer'
import storeData from '../helpers/storeData'
import epic from '../../data/raw/sublimations/epic.json'
import relic from '../../data/raw/sublimations/relic.json'
import normal from '../../data/raw/sublimations/normal.json'
const sublimations = [...epic, ...relic, ...normal]

/**
 * Scrap drop information from item.
 *
 * @returns {object}
 */
function scrapDrop () {
  const dropChanceElement = document.querySelector('.ak-aside')
  if (!dropChanceElement) {
    return
  }
  const dropElement = dropChanceElement.parentElement
  const dropChanceText = dropChanceElement.innerText
  const monsterElement = dropElement.querySelector('.ak-content .ak-linker')
  const monsterText = monsterElement.innerText
  return { monster: monsterText, dropChance: dropChanceText }
}

/**
 * Execute this script.
 */
async function scrapSublimations () {
  const enrichedSublimations = sublimations
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  const langs = ['en', 'es', 'fr']
  for (let index = 0; index < sublimations.length; index++) {
    const sublimation = sublimations[index]
    if (!sublimation.source.drop.monster.pt) {
      continue
    }
    console.log(sublimation.name)

    await page.goto('https://www.google.com/')
    await page.waitForSelector('[title="Pesquisar"]', {
      visible: true
    })
    await page.focus('[title="Pesquisar"]')
    await page.keyboard.type(sublimations[index].name + ' sublimação wakfu' + String.fromCharCode(13))
    await page.waitForNavigation()
    await page.click('#main #center_col div div div div a')
    await page.waitForSelector('.ak-encyclo-detail-illu img', { timeout: 60000 })
    const drop = await page.evaluate(scrapDrop)
    enrichedSublimations[index].source.drop.monster.pt = `${drop.monster} (${drop.dropChance})`
    for (let langIndex = 0; langIndex < langs.length; langIndex++) {
      const lang = langs[langIndex]
      await page.waitForSelector('.ak-flags-links', { visible: true, timeout: 60000 })
      const langHref = await page.evaluate((lang) => document.querySelector(`.ak-flag-${lang}`).href, lang)
      await page.goto(langHref, { timeout: 60000 })
      await page.waitForSelector('.ak-encyclo-detail-illu img', { timeout: 60000 })
      const drop = await page.evaluate(scrapDrop)
      const dropText = `${drop.monster} (${drop.dropChance})`
      console.log(dropText)
      enrichedSublimations[index].source.drop.monster[lang] = dropText
    }
  }

  await browser.close()
  storeData(enrichedSublimations, 'data/generated/sublimations/sublimationsDrops.json')
}

scrapSublimations()
