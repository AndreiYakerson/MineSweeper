'use strict'

function onBulbClick(el) {
    if (gIsBulbOn) return
    gIsBulbOn = true
    gElSelectedBulb = el
    gGame.hintsCount--
    gGame.isHintMode = true
    el.src = 'img/bulbOn.png'
}

function onDarkMode(el) {
    var elCSS = document.querySelector('link')

    if (!gIsDarkMode) {
        el.innerText = 'Dark mode On'
        elCSS.href = 'css/dark.css'
        gIsDarkMode = true
    } else {
        el.innerText = 'Dark mode Off'
        elCSS.href = 'css/style.css'
        gIsDarkMode = false
    }
}

function onSetBeginner() {
    gLevel.size = 4
    gLevel.mines = 2
    gLevel.levelMode = 'beginner'
    onInitGame()

    const elTd = document.querySelectorAll('td')
    for (let i = 0; i < elTd.length; i++) {
        const element = elTd[i];
        element.style.width = '10vw'
        element.style.height = '10vw'
    }
}

function onSetMedium() {
    gLevel.size = 8
    gLevel.mines = 14
    gLevel.levelMode = 'medium'
    onInitGame()

    const elTd = document.querySelectorAll('td')
    for (let i = 0; i < elTd.length; i++) {
        const element = elTd[i];
        element.style.width = '8vw'
        element.style.height = '8vw'
    }
}

function onSetExpert() {
    gLevel.size = 12
    gLevel.mines = 32
    gLevel.levelMode = 'expert'
    onInitGame()

    const elTd = document.querySelectorAll('td')
    for (let i = 0; i < elTd.length; i++) {
        const element = elTd[i];
        element.style.width = '5vw'
        element.style.height = '5vw'
    }
}

function onSafeClick() {
    const idxs = getAllSafetyCells(gBoard)

    if (gGame.safeCount === 0 || !gGame.isOn || !idxs) return

    const randomNum = getRandomInt(0, idxs.length)
    const randomIdx = idxs[randomNum]

    const elCell = document.getElementById(`${randomIdx.i},${randomIdx.j}`)
    elCell.classList.add('marked-safe')
    gGame.safeCount--
    renderSafes(gGame.safeCount, SAFE)
}

function onUndoClick() {
    gGameHistory.pop()

    // gBoard = gGameHistory[gGameHistory.length - 1] //// NEED TO FIX

    renderBoard(gGameHistory[gGameHistory.length - 1])




}