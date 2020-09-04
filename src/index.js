import puppeteer from 'puppeteer'

/**
 * Execute this package.
 *
 * @returns {undefined}
 */
(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.wakfu.com/en/mmorpg/encyclopedia/classes/2-osamodas')
  const name = await page.evaluate(getClassName)
  const roles = await page.evaluate(getClassRoles)
  const description = await page.evaluate(getClassDescription)
  const difficulty = await page.evaluate(getClassDifficulty)
  const characterClass = {
    name,
    description,
    difficulty,
    roles
  }
  console.log(characterClass)
  await browser.close()
})()

/**
 * Get character's class name.
 *
 * @returns {string}
 */
function getClassName () {
  return document.querySelector('.ak-breed-long-name-text span').innerText
}

/**
 * @typedef ClassRole
 * @property {string} title
 * @property {string} description
 */

/**
 * Get class roles from class page.
 *
 * @returns { ClassRole[] }
 */
function getClassRoles () {
  const roleListElement = document.querySelector('.ak-content-roles .ak-list')
  const roleTitles = Array.from(roleListElement.querySelectorAll('span'))
  const roleDescription = Array.from(roleListElement.querySelectorAll('div'))
  return roleTitles.map((roleTitle, index) => {
    const title = roleTitle.innerText
    const description = roleDescription[index].innerText
    return { title, description }
  })
}
/**
 * @typedef ClassDescription
 * @property {string} text
 * @property {string} keyWord
 */

/**
 * Get descripition's class.
 *
 * @returns { ClassDescription }
 */
function getClassDescription () {
  const keyWord = document.querySelector('.ak-breed-description span').innerText
  const descriptionText = document.querySelector('.ak-breed-description').innerText
  const text = descriptionText.replace(keyWord, '').trim()
  return { keyWord, text }
}

/**
 * Get class difficulty.
 *
 * @returns {number} From 1 to 3.
 */
function getClassDifficulty () {
  const difficultyValue = {
    'ak-stars1': 1,
    'ak-stars2': 2,
    'ak-stars3': 3
  }
  const difficultyElement = document.querySelector('.ak-content-difficulty .ak-stars')
  const classNames = Array.from(difficultyElement.classList)
  return classNames.reduce((difficulty, className) => difficultyValue[className] || difficulty, 1)
}
