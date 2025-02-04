'use strict'

function createEmptyBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {}
        }
    }
    return board
}

function placeMines() {
    for (var i = 0; i < gLevel.mines; i++) {
        const idxs = getAllEmptyIdxs(gBoard)
        const randomNum = getRandomInt(0, idxs.length)
        const randomIdx = idxs[randomNum]

        gBoard[randomIdx.i][randomIdx.j].isMine = true
    }
}

function updateMinesAroundCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

            gBoard[i][j].minesAroundCount = getNegsMinesCount(i, j)
        }
    }
}

function getAllEmptyIdxs(board) {
    var idxs = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currLocation = { i: i, j: j }

            if (currLocation.i === gGame.firstCell.i && currLocation.j === gGame.firstCell.j) continue
            if (!board[i][j].isMine) idxs.push({ i, j })
        }
    }
    return idxs
}

function getAllSafetyCells(board) {
    var idxs = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currLocation = { i: i, j: j }


            if (!board[i][j].isCovered || board[i][j].isMarked) continue
            if (!board[i][j].isMine) idxs.push({ i, j })
        }
    }
    if (!idxs[0]) return null
    return idxs
}

function getNegsMinesCount(cellI, cellJ) { 
    var minesCount = 0

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue

            if (gBoard[i][j].isMine === true) minesCount++
        }
    }
    return minesCount
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

function runFirstCell(i, j,elCell) {
    if (!gGame.firstCell) {
        gGame.firstCell = { i: i, j: j }
        gBoard[i][j].isCovered = false
        setBoardElements(gLevel.size,i,j)
    }
}

function timerStart() {
    if (!gGame.isOn) {
        gStartTime = Date.now()
        gIntervalTimer = setInterval(renderTime, 100)
    }
}

function resetTimer() {
    gIntervalTimer = 0
    gStartTime = 0
    const elSeconds = document.querySelector('.seconds span')
    elSeconds.innerHTML = 0
}

function runHintMode(i,j) {
    showNegs(gBoard, i,j)
    setTimeout(() => {
        hideNegs(gBoard, i, j)
        gElSelectedBulb.style.display = 'none'
    }, 1500)
}

function openCell(currCell,elCell,i,j) {
    currCell.isCovered = false
    elCell.classList.remove('covered')
    elCell.classList.remove('marked-safe')
    
    if (gBoard[i][j].minesAroundCount === 0) elCell.innerHTML = EMPTY
    else elCell.innerHTML = gBoard[i][j].minesAroundCount
}

function getLocationFromData(str) {
    var arr = str.split(',')
    return { i: +arr[0], j: +arr[1] }
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}