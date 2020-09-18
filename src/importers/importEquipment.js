/* eslint-disable no-unused-vars */
import axios from 'axios'
import fs from 'fs'

/**
 * Get and save to file equipament from an external api.
 */
async function getEquipment () {
  try {
    const langs = ['en', 'pt', 'fr', 'es']
    for (let langIndex = 0; langIndex < langs.length; langIndex++) {
      let results = []
      let skip = 0
      for (let rarity = 1; rarity <= 7; rarity++) {
        skip = 0
        const { data } = await axios.get(`https://builder.methodwakfu.com/mw-api/items/?filters={%22rarity%22:[${rarity}],%22typeId%22:[],%22level%22:[1,215],%22actionIds%22:[],%22skip%22:${skip},%22limit%22:24,%22upgrade%22:true}&lang=${langs[langIndex]}`)
        const { count, items: firstItems } = data
        results = [...results, ...firstItems]
        const numberOfSearchs = Math.ceil(count / 24) - 1
        for (let search = 1; search <= numberOfSearchs; search++) {
          skip = 24 * search
          const url = `https://builder.methodwakfu.com/mw-api/items/?filters={%22rarity%22:[${rarity}],%22typeId%22:[],%22level%22:[1,215],%22actionIds%22:[],%22skip%22:${skip},%22limit%22:24,%22upgrade%22:true}&lang=${langs[langIndex]}`
          const { data: { items } } = await axios.get(url)
          results = [...results, ...items]
          console.log({ lang: langs[langIndex] }, { rarity }, { skip }, results.length)
        }
      }
      fs.writeFileSync(`data/raw/methodEquipment_${langs[langIndex]}.json`, JSON.stringify(results, null, 2))
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * Get a list with all equipment id, title and rarity.
 *
 * @returns {object[]}
 */
async function getLightList () {
  const { data } = await axios.get('https://builder.methodwakfu.com/mw-api/items/lightlist?lang=pt')
  return data
}

/**
 * Return the same equipment list, but without repeated ids.
 *
 * @param {object[]} equipmentList
 * @returns {object[]}
 */
function removeRepeated (equipmentList) {
  return Array.from(new Set(equipmentList.map(equip => equip.id))).map(id => {
    return equipmentList.find(equip => equip.id === id)
  })
}

/**
 * Get equipment that are missing by id.
 *
 * @param {object[]} equipmentList
 * @returns {string[]}
 */
async function getMissingIds (equipmentList) {
  const lightList = await getLightList()
  const idLightList = lightList.map(item => item.id)
  const equipList = removeRepeated(equipmentList)
  const idEquipList = equipList.map(item => item.id)
  const missingIds = idLightList.filter(item => {
    return !idEquipList.includes(item)
  })
  console.log('Missing IDs quantity', missingIds.length)
  return missingIds
}

/**
 * Get equipments that are missing.
 */
async function enrichEquipListWithMissingIds () {
  const langs = ['en', 'pt', 'fr', 'es']
  for (let langIndex = 0; langIndex < langs.length; langIndex++) {
    let equipmentListRaw = fs.readFileSync(`data/raw/methodEquipment_${langs[langIndex]}.json`)
    let equipmentList = JSON.parse(equipmentListRaw)
    let missingIds = await getMissingIds(equipmentList)
    while (missingIds.length) {
      let skip = 0
      let results = []
      const { data } = await axios.get(`https://builder.methodwakfu.com/mw-api/items/?filters={%22ids%22:[${missingIds.join(',')}],%22skip%22:${skip}}&lang=${langs[langIndex]}`)
      const { count, items: firstItems } = data
      results = [...results, ...firstItems]
      const numberOfSearchs = Math.ceil(count / 24) - 1
      for (let search = 1; search <= numberOfSearchs; search++) {
        skip = 24 * search
        const url = `https://builder.methodwakfu.com/mw-api/items/?filters={%22ids%22:[${missingIds.join(',')}],%22skip%22:${skip}}&lang=${langs[langIndex]}`
        const { data: { items } } = await axios.get(url)
        results = [...results, ...items]
        console.log({ lang: langs[langIndex] }, { skip }, results.length)
      }
      const finalList = removeRepeated([...equipmentList, ...results])
      console.log(finalList.length)
      fs.writeFileSync(`data/raw/methodEquipment_${langs[langIndex]}.json`, JSON.stringify(finalList, null, 2))
      equipmentListRaw = fs.readFileSync(`data/raw/methodEquipment_${langs[langIndex]}.json`)
      equipmentList = JSON.parse(equipmentListRaw)
      missingIds = await getMissingIds(equipmentList)
    }
  }
}

/**
 * Runs these scripts.
 */
async function runScripts () {
  await getEquipment()
  await enrichEquipListWithMissingIds()
}

runScripts()
