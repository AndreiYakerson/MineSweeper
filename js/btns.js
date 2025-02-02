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
}

function onSetMedium() {
    gLevel.size = 8
    gLevel.mines = 14
    gLevel.levelMode = 'medium'
    onInitGame()
}

function onSetExpert() {
    gLevel.size = 12
    gLevel.mines = 32
    gLevel.levelMode = 'expert'
    onInitGame()
}