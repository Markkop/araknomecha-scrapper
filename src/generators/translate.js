import puppeteer from 'puppeteer'
import storeData from '../helpers/storeData'
import epic from '../../data/raw/sublimations/epic.json'
import relic from '../../data/raw/sublimations/relic.json'
import normal from '../../data/raw/sublimations/normal.json'
const sublimations = [...epic, ...relic, ...normal]

const transSelector = '.lmt__side_container--target .lmt__inner_textarea_container textarea'

/**
 * Execute this script.
 * This script is incomplete.
 */
async function translateStuff () {
  const enrichedSublimations = sublimations
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  const langs = ['en', 'es', 'fr']
  for (let index = 0; index < sublimations.length; index++) {
    const sublimation = sublimations[index]
    if (!sublimation.effects.pt) {
      continue
    }
    console.log(sublimation.name)

    let translation
    for (let langIndex = 0; langIndex < langs.length; langIndex++) {
      const lang = langs[langIndex]
      console.log(lang)
      const text = encodeURIComponent(sublimation.effects.pt)
      const url = `https://www.deepl.com/en/translator#pt/${lang}/${text}`
      await page.goto(url)
      await page.waitForSelector(transSelector, {
        visible: true
      })
      await page.waitFor(3000)
      translation = await page.evaluate(() => document.querySelector('.lmt__side_container--target .lmt__inner_textarea_container textarea').value)
      console.log(translation)
      enrichedSublimations[index].effects[lang] = translation
    }
  }

  await browser.close()
  storeData(enrichedSublimations, 'data/generated/sublimationsTranslated.json')
}

translateStuff()
