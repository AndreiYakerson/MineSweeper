'use strict'

const MINE = '💣'
const BOOM = '💥'
const FLAG = '⛳️'
const EMPTY = ' '

const LOOSE_SMILEY = '😵'
const ALIVE_SMILEY = '😁'

var gLevel
var gGame
var gBoard
var gSmiley

function onInitGame() {
    gSmiley = document.querySelector('.smiley')
    gSmiley.innerHTML = ALIVE_SMILEY

    gLevel = {
        size: 8,
        mines: 14
    }

    gGame = {
        isOn: false,
        coveredCount: 0,
        markedCount: 0,
        secsPassed: 0,
        firstCell: false,
        isGameOver: false
    }

    gBoard = createEmptyBoard(gLevel.size)
    console.log(gBoard);

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
            strHTML += `<td data-location="${i},${j}"
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
        elCell.innerHTML = BOOM
        elCell.classList.add('boom')
    }

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

    // console.log(gBoard);

}


function checkGameOver() {


    if (isLoose(gBoard)) {
        gGame.isGameOver = true
    }
}