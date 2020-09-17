import axios from 'axios'
import { storeData } from '../../helpers'

const baseUrl = 'https://wakfu.cdn.ankama.com/gamedata'

/**
 * Get Wakfu recipe files.
 *
 * @returns {string}
 */
async function getFiles () {
  try {
    const { data: { version } } = await axios.get(`${baseUrl}/config.json`)
    const { data: jobs } = await axios.get(`${baseUrl}/${version}/recipeCategories.json`)
    const { data: ingredients } = await axios.get(`${baseUrl}/${version}/recipeIngredients.json`)
    const { data: results } = await axios.get(`${baseUrl}/${version}/recipeResults.json`)
    const { data: recipes } = await axios.get(`${baseUrl}/${version}/recipes.json`)
    const { data: jobsItems } = await axios.get(`${baseUrl}/${version}/jobsItems.json`)
    const { data: items } = await axios.get(`${baseUrl}/${version}/items.json`)
    const { data: collectibleResources } = await axios.get(`${baseUrl}/${version}/collectibleResources.json`)
    const dataCollection = [{ jobs }, { ingredients }, { results }, { recipes }, { jobsItems }, { items }, { collectibleResources }]
    dataCollection.forEach(data => {
      const dataName = Object.keys(data)[0]
      const dataValue = data[dataName]
      storeData(dataValue, `data/raw/${dataName}.json`)
    })
  } catch (error) {
    console.log(error)
  }
}
getFiles()
