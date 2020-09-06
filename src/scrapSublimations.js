import puppeteer from 'puppeteer'

const sublimacoes = [
  {
    name: 'Braseiro',
    slots: 'Relíquia',
    effects:
          '+50% do lvl do jogador em 2 Maestrias secundarias diferentes por turno (1: CaC+ST, 2: Dist+ST, 3: Dist+AoE, 4: Cac+AoE, ...)',
    source: 'Baú de Final de Temporada de Calabouço'
  },
  {
    name: 'Kebra-Karkaça',
    slots: 'Relíquia',
    effects: 'O Primeiro dano infligido durante o turno remove 30% da armadura do alvo.',
    source: 'Baú de Final de Temporada de Calabouço'
  },
  {
    name: 'Alternância',
    slots: 'Relíquia',
    effects:
          'Se o usuário usa apenas um elemento para infligir danos durante o turno, ele recebe 15% de dano para seus outros 3 elementos no próximo turno.',
    source: 'Baú de Final de Temporada de Calabouço'
  },
  {
    name: 'Confiança',
    slots: 'Relíquia',
    effects: '+20% de Bloqueio se o usuário não foi curado no turno anterior.',
    source: 'Baú de Final de Temporada de Calabouço'
  },
  {
    name: 'Robusto',
    slots: 'Relíquia',
    effects: '50% do nível do personagem em barreira para ataques a distancia.',
    source: 'Baú de Final de Temporada de Calabouço'
  },
  {
    name: 'Alternância II',
    slots: 'Relíquia',
    effects:
          'Se o usuário causa dano em um elemento, ele ganha +10% de Maestria elemental para os outros elementos para a próxima magia.',
    source: 'Baú de Final de Temporada de Calabouço'
  },
  {
    name: 'Excesso',
    slots: 'Relíquia',
    effects:
          '-10% de danos causados. A cada 10 magias conjuradas que custem PA, o usuário ganha 100% de dano causado para o próximo ataque',
    source: 'Baú de Final de Temporada de Chefe Supremo (UB)'
  },
  {
    name: 'Sangue do Talho',
    slots: 'Relíquia',
    effects: 'Em turnos ímpar: O usuário ganha 30% de danos causados, mas recebe 15% do dano realizado.',
    source: 'Baú de Final de Temporada de Chefe Supremo (UB)'
  },
  {
    name: 'Aura de Chamas',
    slots: 'Relíquia',
    effects: '+10 de flamejante (acumulativo) para cada magia recebida no corpo a corpo por um inimigo.',
    source: 'Baú de Final de Temporada de Chefe Supremo (UB)'
  },
  {
    name: 'Guarda baixada',
    slots: 'Relíquia',
    effects: '-30% de dano recebido no turno do próprio usuário',
    source: 'Baú de Final de Temporada de Chefe Supremo (UB)'
  },
  {
    name: 'Brisa',
    slots: 'Relíquia',
    effects: '+20% de dano no alvo direto de uma magia em zona e -50% nos outros alvos',
    source: 'Baú de Final de Temporada de Calabouço'
  },
  {
    name: 'Diretivas',
    slots: 'Relíquia',
    effects: '+10% de danos causados nas magias em zona com alvos alinhados com o usuário',
    source: 'Baú de Final de Temporada de Calabouço'
  },
  {
    name: 'Nhé',
    slots: 'Relíquia',
    effects:
          'Em turnos pares: recupera 2 PA ao usar PW (1x por turno). Em turnos ímpares: perde 2 PA ao usar PW (1x por turno)',
    source: 'Baú de Final de Temporada de Calabouço'
  },
  {
    name: 'Estasificação',
    slots: 'Relíquia',
    effects: 'Aumenta os danos causados em 2% por turno permanentemente. (max 30%)',
    source: 'Baú de Final de Temporada de Calabouço'
  },
  {
    name: 'Arma de Luz',
    slots: 'Relíquia',
    effects:
          'Reduz o dano causado por um ataque de arma em 20% e aplica um veneno que dura 3 turnos com dano de acordo com os PAs gastos (arma principal apenas)',
    source: 'Baú de Final de Temporada de Calabouço'
  }
]
;

/**
 * Execute this package.
 *
 * @returns {undefined}
 */
(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  for (let index = 0; index < sublimacoes.length; index++) {
    if (sublimacoes[index]) {
      await page.goto('https://www.google.com/')
      await page.waitForSelector('[title="Pesquisar"]', {
        visible: true
      })
      await page.focus('[title="Pesquisar"]')
      await page.keyboard.type(sublimacoes[index].name + ' sublimação wakfu' + String.fromCharCode(13))
      await page.waitForNavigation()
      await page.click('#main #center_col div div div div a')
      await page.waitForSelector('.ak-encyclo-detail-illu img', { timeout: 60000 })
      const details = await page.evaluate(() => {
        const image = document.querySelector('.ak-encyclo-detail-illu img')
        return { image: image.getAttribute('src'), link: window.location.href }
      })
      sublimacoes[index].image = details.image
      sublimacoes[index].link = details.link
    }
  }

  await browser.close()
  console.log(sublimacoes)
})()
