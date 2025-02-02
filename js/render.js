'use strict'

function renderScoreboard() {
    const elBeginner = document.querySelector('.beginner span')
    const elMedium = document.querySelector('.medium span')
    const elExpert = document.querySelector('.expert span')

    elBeginner.innerHTML = +localStorage.getItem('beginner')
    elMedium.innerHTML = +localStorage.getItem('medium')
    elExpert.innerHTML = +localStorage.getItem('expert')
}

function renderBulbs(count) {
    var elBulbs = document.querySelector('.bulbs')
    var strHTML = ''
    for (var i = 0; i < count; i++) {
        strHTML += `<img src="img/bulbOff.png" onclick="onBulbClick(this)"></img>`
    }
    elBulbs.innerHTML = strHTML
}

function showNegs(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue

            const currCell = board[i][j]
            var elCurrCell = document.getElementById(`${i},${j}`)

            if (currCell.isCovered || cellI === gGame.firstCell.i && cellJ === gGame.firstCell.j ) {
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

            if (currCell.isCovered || cellI === gGame.firstCell.i && cellJ === gGame.firstCell.j) {
                elCurrCell.classList.add('covered')
                elCurrCell.innerHTML = EMPTY
            }

            if (currCell.isMarked) {
                elCurrCell.innerHTML = FLAG
            }

        }
        gGame.isHintMode = false
        gIsBulbOn = false
    }
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

function renderSmiley(smiley) {
    gSmiley = document.querySelector('.smiley')
    gSmiley.innerHTML = smiley
}

function renderLives(count, heart) {
    const elLive = document.querySelector('.lives')
    elLive.innerHTML = heart.repeat(count)
    return heart.repeat(count)
}

function renderMinesCount(num) {
    const elMinesCount = document.querySelector('.mines span')
    elMinesCount.innerHTML = num
}

function renderTime() {
    const secDiff = Math.floor((Date.now() - gStartTime) / 1000)
    const elSeconds = document.querySelector('.seconds span')
    gGame.secsPassed = secDiff
    elSeconds.innerHTML = secDiff
}

function showAllMines(board) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

            const currCell = board[i][j]
            if (currCell.isMine) {
                currCell.isCovered = false

                const currElement = document.getElementById(`${i},${j}`)
                currElement.classList.remove('covered')
                currElement.innerHTML = MINE
            }
        }
    }
}