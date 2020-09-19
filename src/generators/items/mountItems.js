import itemsData from '../../../data/raw/items'
import { storeData } from '../../helpers'
import { parseEffect } from '../../parsers/parseEffect'
import epic from '../../../data/raw/sublimations/epic.json'
import relic from '../../../data/raw/sublimations/relic.json'
import normal from '../../../data/raw/sublimations/normal.json'
import fs from 'fs'

const sublimations = [...epic, ...relic, ...normal]

const equipmentList = {
  en: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_en.json')),
  es: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_es.json')),
  fr: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_fr.json')),
  pt: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_pt.json'))
}

/**
 * Check if the given object has any truthy property.
 *
 * @param {object} obj
 * @returns {boolean}
 */
function hasInfo (obj) {
  return Object.keys(obj).some(key => Boolean(obj[key]))
}

/**
 * Builds items with data from wakfu cdn and method.
 */
function mountItems () {
  const mountedItems = itemsData.map(itemData => {
    const mappedItem = {}
    const itemDefinition = itemData.definition.item
    const itemLevel = itemDefinition.level
    const useParameters = itemDefinition.useParameters
    const equipEffects = itemData.definition.equipEffects.map(equipEffect => parseEffect(equipEffect.effect, itemLevel))
    const useEffects = itemData.definition.useEffects.map(useEffect => parseEffect(useEffect.effect, itemLevel))

    mappedItem.id = itemDefinition.id
    mappedItem.title = itemData.title
    mappedItem.description = itemData.description
    mappedItem.level = itemLevel
    mappedItem.useEffects = useEffects
    mappedItem.equipEffects = equipEffects
    mappedItem.useParameters = {
      useCostAp: useParameters.useCostAp,
      useCostMp: useParameters.useCostMp,
      useCostWp: useParameters.useCostWp
    }
    mappedItem.imageId = itemDefinition.graphicParameters.gfxId
    mappedItem.itemTypeId = itemDefinition.baseParameters.itemTypeId
    mappedItem.itemSetId = itemDefinition.baseParameters.itemSetId
    mappedItem.rarity = itemDefinition.baseParameters.rarity

    // Enrich sublimations information
    const sublimation = sublimations.find(subli => subli.name.toLowerCase() === itemData.title.pt.toLowerCase().trim())
    if (!sublimation && Array.isArray(itemDefinition.sublimationParameters && itemDefinition.sublimationParameters.slotColorPattern)) {
      console.log('An item sublimation was not found in sublimation list:', { name: itemData.title.en, id: itemDefinition.id })
    }

    if (sublimation) {
      mappedItem.sublimation = itemDefinition.sublimationParameters
      mappedItem.sublimation.effects = sublimation.effects
      mappedItem.sublimation.source = {}
      if (hasInfo(sublimation.source.drop.monster)) {
        mappedItem.sublimation.source.drop = sublimation.source.drop
      }
      if (hasInfo(sublimation.source.chest)) {
        mappedItem.sublimation.source.chest = sublimation.source.chest
      }
      if (hasInfo(sublimation.source.craft)) {
        mappedItem.sublimation.source.craft = sublimation.source.craft
      }
      if (hasInfo(sublimation.source.quest)) {
        mappedItem.sublimation.source.quest = sublimation.source.quest
      }
    }

    // Enrich conditions information
    mappedItem.conditions = {}
    mappedItem.conditions.description = {}
    const langs = ['en', 'pt', 'fr', 'es']
    langs.forEach(lang => {
      const equip = equipmentList[lang].find(equip => equip.id === itemDefinition.id)
      if (!equip) {
        return
      }
      mappedItem.conditions.criteria = equip.conditions.criteria
      mappedItem.conditions.description = {
        ...mappedItem.conditions.description,
        [lang]: equip.conditions.description[0]
      }
    })
    return mappedItem
  })
  storeData(mountedItems, 'data/generated/items.json')
}

mountItems()
