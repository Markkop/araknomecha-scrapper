
/**
 * Get spell name.
 *
 * @returns {string}
 */
function getSpellName () {
  return document.querySelector('.ak-spell-name').innerText.match(/(.*?)\s\s/)[1]
}

/**
 * Get spell description.
 *
 * @returns {string}
 */
function getSpellDescription () {
  return document.querySelector('.ak-spell-description').innerText.trim()
}

/**
 * Get spell AP (Action Points) cost.
 *
 * @returns {string}
 */
function getSpellAPCost () {
  const apElement = document.querySelector('.ak-spell-details-infos .pa') || {}
  const apText = apElement.innerText || ''
  return apText.trim() || '0'
}

/**
 * Get spell MP (Moviments Points) cost.
 *
 * @returns {string}
 */
function getSpellMPCost () {
  const mpElement = document.querySelector('.ak-spell-details-infos .pm') || {}
  const mpText = mpElement.innerText || ''
  return mpText.trim() || '0'
}

/**
 * Get spell WP (Wakfu Points) cost.
 *
 * @returns {string}
 */
function getSpellWPCost () {
  const wpElement = document.querySelector('.ak-spell-details-infos .wakfu') || {}
  const wpText = wpElement.innerText || ''
  return wpText.trim() || '0'
}

/**
 * Get spell range.
 *
 * @returns {string}
 */
function getSpellRange () {
  const rangeElement = document.querySelector('.ak-spell-details-infos .costs_range') || {}
  const rangeText = rangeElement.innerText || ''
  return rangeText.trim() || '0'
}

/**
 * Check if spell requires Line of Sight.
 *
 * @returns {boolean}
 */
function getSpellLineOfSight () {
  const lineOfSightElement = document.querySelector('.ak-spell-details-infos img[src="https://static.ankama.com/wakfu/ng/img/encyclo/ligne_vu.png"]')
  return Boolean(lineOfSightElement)
}

/**
 * Check if spell has modifiable range.
 *
 * @returns {boolean}
 */
function getSpellModifiableRange () {
  const modifiableRangeElement = document.querySelector('.ak-spell-details-infos img[src="https://static.ankama.com/wakfu/ng/img/encyclo/picto_portee_modif.png"]')
  return Boolean(modifiableRangeElement)
}

/**
 * Check if spell can only be cast aligned.
 *
 * @returns {boolean}
 */
function getSpellLineOnly () {
  const lineOnlyElement = document.querySelector('.ak-spell-details-infos img[src="https://static.ankama.com/wakfu/ng/img/encyclo/picto_spell_line.png"]')
  return Boolean(lineOnlyElement)
}

/**
 * Get anchors href attribute.
 *
 * @param { Array } anchors
 * @returns {string[]}
 */
function mapAnchorsHref (anchors) {
  return anchors.map(anchor => anchor.getAttribute('href'))
}

/**
 * Loops trough spells, navigating to them and scrapping data.
 *
 * @param {object} page
 * @param {string[]} spellsHref
 * @returns {object}
 */
async function navigateAndGetSpell (page, spellsHref) {
  const spells = []
  for (let index = 0; index < spellsHref.length; index++) {
    console.log(spellsHref[index])
    const spellsElementsAfterClick = await page.$$('.ak-spells-element-line a')
    await spellsElementsAfterClick[index].click()
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
    } catch (error) {
      const spellHref = spellsHref[index]
      await page.goto(`https://www.wakfu.com/${spellHref}`, { waitUntil: 'networkidle2', timeout: 60000 })
    }
    await page.waitFor(() => !document.querySelector('.loadmask'))

    const name = await page.evaluate(getSpellName)
    const description = await page.evaluate(getSpellDescription)
    const pa = await page.evaluate(getSpellAPCost)
    const pm = await page.evaluate(getSpellMPCost)
    const pw = await page.evaluate(getSpellWPCost)
    const range = await page.evaluate(getSpellRange)
    const lineOfSight = await page.evaluate(getSpellLineOfSight)
    const modifiableRange = await page.evaluate(getSpellModifiableRange)
    const lineOnly = await page.evaluate(getSpellLineOnly)
    spells.push({
      name,
      description,
      pa,
      pm,
      pw,
      range,
      lineOfSight,
      modifiableRange,
      lineOnly
    })
  }
  return spells
}

/**
 * Scraps spells assuming it's on a class page.
 *
 * @param {object} page
 * @returns {object[]}
 */
export default async function scrapSpells (page) {
  const spellsHrefs = await page.$$eval('.ak-spells-element-line a', mapAnchorsHref)
  return navigateAndGetSpell(page, spellsHrefs)
}
