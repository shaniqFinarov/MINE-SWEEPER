var gBoard


var gLevel = {
    SIZE: 8,
    MINES: 8

}

var gGame = {
    state: "BEFORE", // "PLAYING"  "ENDED"
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}





buildBoard(-1, -1)

function buildBoard(iFirst, jFirst) {

    gBoard = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {

                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isBlown: false
            }
        }
    }


    console.table(gBoard)

    // 1 3
    // 1 3

    var numOfBombs = 0

    //Option 1
    while (numOfBombs < gLevel.MINES) {
        var jIdx = getRandomInt(0, gLevel.SIZE)
        var iIdx = getRandomInt(0, gLevel.SIZE)
        if (gBoard[iIdx][jIdx].isMine) continue
        else if (iIdx === iFirst && jIdx === jFirst) continue
        else {
            gBoard[iIdx][jIdx].isMine = true
            numOfBombs++
        }
    }

    // //optione 2
    // var untilCount=gLevel.MINES
    // for (var i=0;i<untilCount;i++)
    // {
    //     var jIdx = getRandomInt(0, gLevel.SIZE)
    //     var iIdx = getRandomInt(0, gLevel.SIZE)
    //     if (gBoard[iIdx][jIdx].isMine)
    //         untilCount++
    //     else
    //         gBoard[iIdx][jIdx].isMine = true

    // }

    // if (gBoard[iIdx][jIdx].isMine) {

    //     continue
    // }
    // else gBoard[iIdx][jIdx].isMine = true

    setMinesNegsCount()
}

function bombCounter() {

}

function expandShown(i, j) {
    if (gBoard[i][j].isMine) return
    if (gBoard[i][j].minesAroundCount != 0) {
        gBoard[i][j].isShown = true
        return
    }
    if (gBoard[i][j].minesAroundCount === 0) {
        gBoard[i][j].isShown = true

        for (var k = i - 1; k <= i + 1; k++) {
            for (var l = j - 1; l <= j + 1; l++) {
                if (k === i && l === j) continue
                if (k < 0 || l < 0 || k > gLevel.SIZE - 1 || l > gLevel.SIZE - 1) continue
                if (gBoard[k][l].isShown) continue
                expandShown(k, l)
            }
        }
    }
}

function getMinesSpecificCell(iIdx, jIdx) {

    var negMineCount = 0
    for (var k = iIdx - 1; k <= iIdx + 1; k++) {
        for (var l = jIdx - 1; l <= jIdx + 1; l++) {
            if (k === iIdx && l === jIdx) continue
            if (k < 0 || l < 0 || k > gLevel.SIZE - 1 || l > gLevel.SIZE - 1) continue
            if (gBoard[k][l].isMine) negMineCount++

        }
    }
    return negMineCount
}

function setMinesNegsCount() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j].minesAroundCount = getMinesSpecificCell(i, j)
            //i=1
            //k=0, k<=2
            //j=2
            //l=1, l<=3

        }
    }
}

onInit()

function onInit() {
    renderBoard()
}

function handleContextMenu(event) {
    event.preventDefault()
    return false
}

function renderBoard() {

    var strHTML = ''
    var remainedFlags = gLevel.MINES - gGame.markedCount
    strHTML += `<div class="counter">${remainedFlags}</div>`

    strHTML += gGame.state === "ENDED" ? '<button class="btn" onclick = startOver()> 😵 </button>' : '<button class="btn" onclick = startOver()> 😊 </button>'
    strHTML += '<table class="table">'
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.SIZE; j++) {

            if (gBoard[i][j].isShown) {
                if (gBoard[i][j].minesAroundCount !== 0) {
                    strHTML += `<td onMouseDown=onCellClicked(event,${i},${j}) oncontextmenu=handleContextMenu(event)>` + gBoard[i][j].minesAroundCount + '</td>'

                } else strHTML += `<td onMouseDown=onCellClicked(event,${i},${j})  oncontextmenu=handleContextMenu(event)></td>`
            }
            else if (gBoard[i][j].isMarked)
                strHTML += `<td onMouseDown=onCellClicked(event,${i},${j})  oncontextmenu=handleContextMenu(event)>🚩</td>`
            else if (gBoard[i][j].isMine && gGame.state === "ENDED" && !gBoard[i][j].isBlown)

                strHTML += `<td onMouseDown=onCellClicked(event,${i},${j})  oncontextmenu=handleContextMenu(event)>💣</td>`

            else if (gBoard[i][j].isMine && gGame.state === "ENDED" && gBoard[i][j].isBlown)
                strHTML += `<td onMouseDown=onCellClicked(event,${i},${j})  oncontextmenu=handleContextMenu(event)>💥</td>`
            else strHTML += `<td onMouseDown=onCellClicked(event,${i},${j})  oncontextmenu=handleContextMenu(event)> ⬛ </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</table>'
    //console.log(strHTML)
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

}

function checkAndAlertVictory() {
    var victory = true

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) victory = false
            if (!gBoard[i][j].isMine && gBoard[i][j].isMarked) victory = false
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked && !gBoard[i][j].isMine) victory = false
        }
    }
    if (victory) {

        alert('you won!')
    }
}


function startOver() {

    gGame.state = "BEFORE"
    buildBoard(-1, -1)
    gGame.markedCount = 0
    renderBoard()
}

function onCellClicked(event, i, j) {

    switch (event.button) {
        case 0:
            //alert('Left');

            if (gGame.state === "BEFORE") {
                buildBoard(i, j)
                gGame.state = "PLAYING"
                gBoard[i][j].isShown = true
                renderBoard()

            }

            if (gBoard[i][j].isMine) {
                gGame.state = "ENDED"
                gBoard[i][j].isBlown = true

                renderBoard()
                //alert('Game Over!')

            }

            if (gGame.state === "PLAYING") {
                expandShown(i, j)
                renderBoard()
                checkAndAlertVictory()
            }

            break;
        case 2:
            event.preventDefault()

            if (gGame.state === "PLAYING") {

                if (gBoard[i][j].isMarked) {
                    gGame.markedCount--
                    gBoard[i][j].isMarked = false
                }

                else {
                    gGame.markedCount++
                    gBoard[i][j].isMarked = true
                }

                checkAndAlertVictory()
                renderBoard()


            }
            break;
    }

}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min

}