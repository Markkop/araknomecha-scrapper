import itemsData from '../../../data/raw/items'
import { storeData } from '../../helpers'
import { parseEffect } from '../../parsers/parseEffect'
import fs from 'fs'

const equipmentList = {
  en: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_en.json')),
  es: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_es.json')),
  fr: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_fr.json')),
  pt: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_pt.json'))
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
    mappedItem.level = itemDefinition.itemLevel
    mappedItem.useEffects = useEffects
    mappedItem.equipEffects = equipEffects
    mappedItem.useParameters = {
      useCostAp: useParameters.useCostAp,
      useCostMp: useParameters.useCostMp,
      useCostWp: useParameters.useCostWp
    }
    mappedItem.imageId = itemDefinition.graphicParameters.gfxId
    mappedItem.itemTypeId = itemDefinition.itemTypeId
    mappedItem.itemSetId = itemDefinition.itemSetId
    mappedItem.rarity = itemDefinition.rarity
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
