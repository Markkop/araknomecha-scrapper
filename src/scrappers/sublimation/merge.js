import storeData from '../../helpers/storeData'
import sublimationsEffects from '../../../data/generated/sublimations/sublimationsEffects.json'
import sublimationsDrops from '../../../data/generated/sublimations/sublimationsDrops.json'

/**
 * Merge sublimation drops and effects datas.
 */
function mergeSublimationsData () {
  sublimationsDrops.forEach(subliDrop => {
    const subliEffect = sublimationsEffects.find(subliEffect => subliEffect.name.toLowerCase() === subliDrop.name.toLowerCase())
    if (!subliEffect) {
      console.log(`Sublimation with drop info not found for ${subliDrop.name}`)
      return
    }

    subliDrop.effects = subliEffect.effects
  })
  storeData(sublimationsDrops, 'data/generated/sublimations/sublimations.json')
}

mergeSublimationsData()
