'use strict'

//GAME ELEMENTS
const MINE = '💣'
const FLAG = '🚩'
const LIVE = '💙'
const LIVE_BREAK = '💔'
const EMPTY = ' '

//SMILEYS
const LOOSE_SMILEY = '😵'
const ALIVE_SMILEY = '😁'
const WIN_SMILEY = '😎'

//GLOBAL VARS
var gGame
var gBoard
var gSmiley
var gIntervalTimer
var gStartTime
var gElSelectedBulb
var gIsDarkMode = false

var gLevel = {
    size: 4,
    mines: 2,
    levelMode: 'beginner'
}

function onInitGame() {
    clearInterval(gIntervalTimer)
    resetTimer()

    gGame = {
        isOn: false,
        coveredCount: 0,
        markedCount: 0,
        secsPassed: 0,
        firstCell: false,
        isGameOver: false,
        isHintMode: false,
        minesCount: gLevel.mines,
        livesCount: 3,
        hintsCount: 3,

    }

    gBoard = createEmptyBoard(gLevel.size)

    renderLives(gGame.livesCount, LIVE)
    renderBulbs(gGame.hintsCount)
    renderSmiley(ALIVE_SMILEY)
    renderBoard(gBoard)
    renderMinesCount(gLevel.mines)
    renderScoreboard()
}

function setBoardElements(size) {
    //set cell properties
    var board = []

    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isCovered: true,
                isMine: false,
                isMarked: false,
            }
        }
    }
    //update board without mines
    gBoard = board

    // place mines
    placeMines()
    updateMinesAroundCount()
}

function onClickCell(elCell) {
    const cellLocation = getLocationFromData(elCell.dataset.location)
    const currCell = gBoard[cellLocation.i][cellLocation.j]

    if (gGame.isGameOver) return
    if (currCell.isMarked) return

    timerStart()
    
    gGame.isOn = true

    //PLACE THE MINES AFTER THE FIRST CLICK (FIRST CLICK IS SAFE)
    runFirstCell(cellLocation.i, cellLocation.j)
    
    if (gGame.isHintMode) {
        runHintMode(cellLocation.i, cellLocation.j)
        return
    }

    if (!currCell.isMarked) openCell(currCell,elCell,cellLocation.i,cellLocation.j)

    if (currCell.isMine && !currCell.isMarked) {
        //CHECKS LIVES COUNT AND HINT MODE
        if (gGame.livesCount > 1 && !gGame.isHintMode) {
            clickOnMine(currCell,elCell)
            return
        } else {
            elCell.classList.add('boom')
        }

    }
    expandUncover(gBoard, cellLocation.i, cellLocation.j)
    checkGameOver()
}

function onCellMarked(elCell, ev) {
    //PREVENT MENU CONTEXT WHILE LEFT CLICKING ON THE BOARD
    ev.preventDefault()

    const cellLocation = getLocationFromData(elCell.dataset.location)
    const currCell = gBoard[cellLocation.i][cellLocation.j]

    if (!gGame.isOn) return
    if (gGame.isGameOver) return
    if (gGame.isHintMode) return
    if (!currCell.isCovered) return

    if (!currCell.isMarked && currCell.isCovered) {
        currCell.isMarked = true

        gGame.minesCount--
        renderMinesCount(gGame.minesCount)
        elCell.innerHTML = FLAG
    } else {
        gBoard[cellLocation.i][cellLocation.j].isMarked = false
        elCell.innerHTML = EMPTY
        gGame.minesCount++
        renderMinesCount(gGame.minesCount)
    }

    checkGameOver()
}

function checkGameOver() {

    if (isLoose(gBoard) && !gGame.isHintMode) {
        const loseSound = new Audio('audio/loseSound.mp3')
        loseSound.play()
        
        gGame.isGameOver = true
        showAllMines(gBoard)
        renderLives(1, LIVE_BREAK)
        clearInterval(gIntervalTimer)
        renderSmiley(LOOSE_SMILEY)
    } else if (isWin(gBoard) && !gGame.isHintMode) {
        const winSound = new Audio('audio/winSound.mp3')
        winSound.play()

        gGame.isGameOver = true
        renderSmiley(WIN_SMILEY)
        clearInterval(gIntervalTimer)
        checkScoreboard(gLevel.levelMode)
        renderScoreboard(gLevel.levelMode)
    }

}

function isLoose(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            if (!currCell.isCovered && currCell.isMine) return true
        }
    }
    return false
}

function isWin(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]

            if (currCell.isCovered && !currCell.isMine && !currCell.isMarked) return false
            if (currCell.isCovered && !currCell.isMine && currCell.isMarked) return false
            if (currCell.isMine && !currCell.isMarked) return false
        }
    }
    return true
}

function checkScoreboard(currLevel) {

    const currBegScore = +localStorage.getItem('beginner', gGame.secsPassed)
    const currMedScore = +localStorage.getItem('medium', gGame.secsPassed)
    const currExpScore = +localStorage.getItem('expert', gGame.secsPassed)

    if (currLevel === 'beginner' && currBegScore === 0) {
        localStorage.setItem('beginner', gGame.secsPassed)
    } else if (currLevel === 'beginner' && currBegScore > gGame.secsPassed) {
        localStorage.setItem('beginner', gGame.secsPassed)
    }

    if (currLevel === 'medium' && currMedScore === 0) {
        localStorage.setItem('medium', gGame.secsPassed)
    } else if (currLevel === 'medium' && currMedScore > gGame.secsPassed) {
        localStorage.setItem('medium', gGame.secsPassed)
    }

    if (currLevel === 'expert' && currExpScore === 0) {
        localStorage.setItem('expert', gGame.secsPassed)
    } else if (currLevel === 'expert' && currExpScore > gGame.secsPassed) {
        localStorage.setItem('expert', gGame.secsPassed)
    }
}

function clickOnMine(currCell,elCell) {
    const wrongSound = new Audio('audio/wrongSound.mp3')
    wrongSound.play()
    
    gGame.livesCount--
    
    elCell.classList.remove('covered')
    elCell.innerHTML = MINE
    gGame.isGameOver = true
    
    setTimeout(() => {
        currCell.isCovered = true
        elCell.classList.add('covered')
        elCell.innerHTML = EMPTY
    
        renderLives(gGame.livesCount, LIVE)
        gGame.isGameOver = false
    }, 1000)
}

