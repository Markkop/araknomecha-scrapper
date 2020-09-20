import storeData from '../../helpers/storeData'
import epic from '../../../data/raw/sublimations/epic.json'
import relic from '../../../data/raw/sublimations/relic.json'
import normal from '../../../data/raw/sublimations/normal.json'
import axios from 'axios'
const sublimations = [...epic, ...relic, ...normal]

/**
 * Execute this script.
 */
async function importSublimationsEffects () {
  const sublimationsEffects = []
  const langs = ['pt', 'en', 'es', 'fr']
  for (let langIndex = 0; langIndex < langs.length; langIndex++) {
    const lang = langs[langIndex]
    const { data: sublimationsLang } = await axios.get(`https://builder.methodwakfu.com/mw-api/enchant/sublimations?lang=${lang}`)
    sublimationsLang.forEach((subli, index) => {
      const id = subli.id
      const name = subli.title
      const effects = subli.effects.map(eff => eff.descriptions.join(' ')).join(', ')
      if (sublimationsEffects[index]) {
        sublimationsEffects[index].title[lang] = name
        sublimationsEffects[index].effects[lang] = effects
      } else {
        const sublimation = { id: 0, title: {}, effects: {} }
        sublimation.id = id
        sublimation.title[lang] = name
        sublimation.effects[lang] = effects
        sublimationsEffects.push(sublimation)
      }
    })
  }
  const enrichedSublimarions = []
  sublimationsEffects.forEach(subliEff => {
    const originalSubli = sublimations.find(originalSubli => originalSubli.name.toLowerCase() === subliEff.title.pt.toLowerCase())
    if (!originalSubli) {
      console.log(`Original sublimation not found for ${subliEff.title.en}`)
      return
    }
    const langs = Object.keys(subliEff.effects)
    langs.forEach(lang => {
      originalSubli.effects[lang] = subliEff.effects[lang]
    })
    enrichedSublimarions.push(originalSubli)
  })
  storeData(enrichedSublimarions, 'data/generated/sublimations/sublimationsEffects.json')
}

importSublimationsEffects()
