'use strict'

const MINE = '💣'
const BOOM = '💥'
const FLAG = '⛳️'
const EMPTY = ' '

var gLevel
var gGame
var gBoard

function onInitGame() {
    gLevel = {
        size: 4,
        mines: 1
    }

    gGame = {
        isOn: false,
        coveredCount: 0,
        markedCount: 0,
        secsPassed: 0,
        firstCell: false
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
            strHTML += `<td data-location="${i},${j}" class="covered" oncontextmenu="onCellMarked(this)" onclick="onClickCell(this)"></td>`
        }
        strHTML += `</tr>`
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onClickCell(elCell) {
    const cellLocation = getLocationFromData(elCell.dataset.location)

    if (!gGame.firstCell) {
        gGame.firstCell = { i: cellLocation.i, j: cellLocation.j }
    }

    if (!gGame.isOn) {
        setBoardElements(gLevel.size)
        gGame.isOn = true
    }


    const currCell = gBoard[cellLocation.i][cellLocation.j]
    // console.log(gBoard);

    if (!currCell.isMarked) {

        currCell.isCovered = false
        elCell.classList.remove('covered')

        if (currCell.minesAroundCount === 0) elCell.innerHTML = EMPTY
        else elCell.innerHTML = gBoard[cellLocation.i][cellLocation.j].minesAroundCount
    }
    if (currCell.isMine && !currCell.isMarked) elCell.innerHTML = BOOM
}

function onCellMarked(elCell) {
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