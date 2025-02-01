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
    // console.log(gBoard);

    renderLives(gGame.livesCount, LIVE)
    renderBulbs(gGame.hintsCount)
    renderSmiley(ALIVE_SMILEY)
    renderBoard(gBoard)
    renderMinesCount(gLevel.mines)
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

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`

        for (var j = 0; j < board.length; j++) {
            strHTML += `<td id="${i},${j}" data-location="${i},${j}"
             class="covered"
              oncontextmenu="onCellMarked(this,event)"
                 onclick="onClickCell(this)"></td>`
        }
        strHTML += `</tr>`
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onClickCell(elCell) {
    if (gGame.isGameOver) return

    //STARTS THE TIMER
    if (!gGame.isOn) {
        gStartTime = Date.now()
        gIntervalTimer = setInterval(renderTime, 100)
    }

    gGame.isOn = true

    const cellLocation = getLocationFromData(elCell.dataset.location)

    //IN PROCESS



    //PLACE THE MINES AFTER THE FIRST CLICK (FIRST CLICK IS SAFE)
    if (!gGame.firstCell) {
        gGame.firstCell = { i: cellLocation.i, j: cellLocation.j }
        setBoardElements(gLevel.size)
    }

    if (gGame.isHintMode) {
        showNegs(gBoard, cellLocation.i, cellLocation.j)
        setTimeout(() => {
            hideNegs(gBoard, cellLocation.i, cellLocation.j)
            gElSelectedBulb.style.display = 'none'
        }, 1500)
        return
    }

    const currCell = gBoard[cellLocation.i][cellLocation.j]
    // console.log(gBoard);

    if (!currCell.isMarked) {
        currCell.isCovered = false
        elCell.classList.remove('covered')

        if (currCell.minesAroundCount === 0) elCell.innerHTML = EMPTY
        else elCell.innerHTML = gBoard[cellLocation.i][cellLocation.j].minesAroundCount
    }

    if (currCell.isMine && !currCell.isMarked) {
        //CHECKS LIVES COUNT AND HINT MODE
        if (gGame.livesCount > 1 && !gGame.isHintMode) {
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
            return

        } else {
            renderSmiley(LOOSE_SMILEY)
            elCell.classList.add('boom')
        }

    }
    expandUncover(gBoard, cellLocation.i, cellLocation.j)
    checkGameOver()
}

function onCellMarked(elCell, ev) {
    //PREVENT MENU CONTEXT WHILE LEFT CLICKING ON THE BOARD
    ev.preventDefault()

    if (!gGame.isOn) return
    if (gGame.isGameOver) return

    const cellLocation = getLocationFromData(elCell.dataset.location)
    const currCell = gBoard[cellLocation.i][cellLocation.j]

    if (!currCell.isMarked && currCell.isCovered) {
        currCell.isMarked = true

        if (gGame.minesCount !== 0) {
            gGame.minesCount--
            renderMinesCount(gGame.minesCount)
        }
        elCell.innerHTML = FLAG

    } else {
        gBoard[cellLocation.i][cellLocation.j].isMarked = false
        elCell.innerHTML = EMPTY
    }

    checkGameOver()
}



function expandUncover(board, cellI, cellJ) {

    if (gBoard[cellI][cellJ].minesAroundCount !== 0) return

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue

            const currCell = board[i][j]
            var elCurrCell = document.getElementById(`${i},${j}`)

            if (currCell.isCovered && !currCell.isMine) {
                currCell.isCovered = false
                elCurrCell.classList.remove('covered')

                if (currCell.minesAroundCount === 0) {
                    elCurrCell.innerHTML = EMPTY
                    expandUncover(board, i, j)
                } else {
                    elCurrCell.innerHTML = gBoard[i][j].minesAroundCount
                }
            }

        }
    }
}

function checkGameOver() {

    if (isLoose(gBoard) && !gGame.isHintMode) {
        gGame.isGameOver = true
        showAllMines(gBoard)
        renderLives(1, LIVE_BREAK)
        clearInterval(gIntervalTimer)
    } else if (isWin(gBoard) && !gGame.isHintMode) {
        gGame.isGameOver = true
        renderSmiley(WIN_SMILEY)
        clearInterval(gIntervalTimer)
    }

}

function onBulbClick(el) {
    gElSelectedBulb = el
    gGame.hintsCount--
    gGame.isHintMode = true
    el.src = 'img/bulbOn.png'
}


//IN PROCESS

function showNegs(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue

            const currCell = board[i][j]
            var elCurrCell = document.getElementById(`${i},${j}`)

            if (currCell.isCovered) {
                elCurrCell.classList.remove('covered')

                if (currCell.isMine) {
                    elCurrCell.innerHTML = MINE
                } else if (currCell.minesAroundCount === 0) {
                    elCurrCell.innerHTML = EMPTY
                } else if (currCell.minesAroundCount > 0) {
                    elCurrCell.innerHTML = gBoard[i][j].minesAroundCount
                }
            }

        }
    }
}

function hideNegs(board, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue

            const currCell = board[i][j]
            var elCurrCell = document.getElementById(`${i},${j}`)

            if (currCell.isCovered) {
                elCurrCell.classList.add('covered')
                elCurrCell.innerHTML = EMPTY
            }

            if (currCell.isMarked) {
                elCurrCell.innerHTML = FLAG
            }

        }
        gGame.isHintMode = false
    }
}

function renderBulbs(count) {
    var elBulbs = document.querySelector('.bulbs')
    var strHTML = ''
    for (var i = 0; i < count; i++) {
        strHTML += `<img src="img/bulbOff.png" onclick="onBulbClick(this)"></img>`
    }
    elBulbs.innerHTML = strHTML
}

function darkMode(el) {
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