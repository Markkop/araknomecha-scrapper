
import ingredientsData from '../../data/raw/ingredients'
import recipesData from '../../data/raw/recipes'
import jobsData from '../../data/raw/jobs'
import resultsData from '../../data/raw/results'
import jobsItemsData from '../../data/raw/jobsItems'
import itemsData from '../../data/raw/items'
import { storeData } from '../../helpers'

/**
 * Combine recipes information to a single file.
 */
function mountRecipes () {
  try {
    const mountedRecipes = recipesData.map(recipe => {
      const job = jobsData.find(job => job.definition.id === recipe.categoryId)
      const namedJob = {
        ...job,
        title: job.title
      }
      const ingredients = ingredientsData.filter(ingredient => ingredient.recipeId === recipe.id)
      const namedIngredients = ingredients.map(ingredient => {
        const jobItem = jobsItemsData.find(jobItem => jobItem.definition.id === ingredient.itemId)
        return {
          ...ingredient,
          title: jobItem.title
        }
      })
      const result = resultsData.find(result => result.recipeId === recipe.id)
      let item = itemsData.find(itemData => itemData.definition.item.id === result.productedItemId)
      if (!item) {
        item = jobsItemsData.find(jobItem => jobItem.definition.id === result.productedItemId)
      }
      const namedResult = {
        ...result,
        title: item.title,
        description: item.description || ''
      }
      return {
        id: recipe.id,
        level: recipe.level,
        xpRatio: recipe.xpRatio,
        isUpgrade: recipe.isUpgrade,
        upgradeItemId: recipe.upgradeItemId,
        job: namedJob,
        ingredients: namedIngredients,
        result: namedResult
      }
    })
    storeData(mountedRecipes, 'data/generated/recipes.json')
    console.log(`Successfully generated ${mountedRecipes.length} recipes`)
  } catch (error) {
    console.log(error)
  }
}

mountRecipes()
