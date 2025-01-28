'use strict'

const MINE = '💣'
const BOOM = '💥'
const FLAG = '🚩'
const EMPTY = ' '

const LOOSE_SMILEY = '😵'
const ALIVE_SMILEY = '😁'
const WIN_SMILEY = '😎'

var gGame
var gBoard
var gSmiley

var gLevel = {
    size: 4,
    mines: 2
}

function onInitGame() {
    gSmiley = document.querySelector('.smiley')
    gSmiley.innerHTML = ALIVE_SMILEY


    gGame = {
        isOn: false,
        coveredCount: 0,
        markedCount: 0,
        secsPassed: 0,
        firstCell: false,
        isGameOver: false,
    }

    gBoard = createEmptyBoard(gLevel.size)
    // console.log(gBoard);

    renderBoard(gBoard)
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
    // console.log(gBoard);
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

    gGame.isOn = true
    const cellLocation = getLocationFromData(elCell.dataset.location)

    if (!gGame.firstCell) {
        gGame.firstCell = { i: cellLocation.i, j: cellLocation.j }
        setBoardElements(gLevel.size)
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
        const elSmiley = document.querySelector('.smiley')

        elSmiley.innerHTML = LOOSE_SMILEY
        elCell.classList.add('boom')
    }
    expandUncover(gBoard,cellLocation.i, cellLocation.j)
    checkGameOver()
}

function onCellMarked(elCell, ev) {
    ev.preventDefault()

    if (gGame.isGameOver) return

    const cellLocation = getLocationFromData(elCell.dataset.location)
    const currCell = gBoard[cellLocation.i][cellLocation.j]

    if (!currCell.isMarked && currCell.isCovered) {
        gBoard[cellLocation.i][cellLocation.j].isMarked = true
        elCell.innerHTML = FLAG
    } else {
        gBoard[cellLocation.i][cellLocation.j].isMarked = false
        elCell.innerHTML = EMPTY
    }


    checkGameOver()
    // console.log(gBoard);
}



function expandUncover(board, cellI, cellJ) {

    if (gBoard[cellI][cellJ].minesAroundCount !== 0) return


    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            const currCell = board[i][j]
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue

            var elCurrCell = document.getElementById(`${i},${j}`)

            if (currCell.isCovered && !currCell.isMine) {

                currCell.isCovered = false
                elCurrCell.classList.remove('covered')

                if (currCell.minesAroundCount === 0) {
                    elCurrCell.innerHTML = EMPTY
                } else {
                    elCurrCell.innerHTML = gBoard[i][j].minesAroundCount
                }

            }

        }
    }
}

function checkGameOver() {

    if (isLoose(gBoard)) {
        gGame.isGameOver = true
        showAllMines(gBoard)

    } else if (isWin(gBoard)) {
        gGame.isGameOver = true
        gSmiley = document.querySelector('.smiley')
        gSmiley.innerHTML = WIN_SMILEY
    }
}
function onSetBeginner() {
    gLevel.size = 4
    gLevel.mines = 2
    onInitGame()
}

function onSetMedium() {
    gLevel.size = 8
    gLevel.mines = 14
    onInitGame()
}

function onSetExpert() {
    gLevel.size = 12
    gLevel.mines = 32
    onInitGame()
}

