var tbl = document.getElementById("table");
let changeOfPlaceVertical = [-1, -1, -1, 0, 0, +1, +1, +1]; //up - down
let changeOfPlaceHorizontal = [-1, 0, +1, -1, +1, -1, 0, +1]; //left - right

var flags = 7;
var bombLeft = 7;
var continueGame = 1;
document.getElementById("numberOfFlags").textContent = "🚩" + flags;

function generateTable() {
    for (let cnt = 0; cnt < 10; ++cnt) {
        let row = tbl.insertRow(cnt);
        for (let count = 0; count < 10; ++count) {
            var cell = row.insertCell(count);
            cell.width = 75;
            cell.height = 75;
            cell.style.borderWidth = "3px";
            if (cnt % 2 == 0 && count % 2 == 0) {
                cell.style.backgroundColor = "#7CFC00";
            } else if (cnt % 2 == 1 && count % 2 == 0) {
                cell.style.backgroundColor = "green";
            } else if (cnt % 2 == 0 && count % 2 == 1) {
                cell.style.backgroundColor = "green";
            } else if (cnt % 2 == 1 && count % 2 == 1) {
                cell.style.backgroundColor = "#7CFC00";
            }
            tbl.rows[cnt].cells[count].setAttribute("visited", "false");

            cell.onclick =
                function() {
                    game(cnt, count);
                };
            tbl.rows[cnt].cells[count].addEventListener('contextmenu', function(ev) {
                ev.preventDefault();
                if (flags > 0) {
                    if (tbl.rows[cnt].cells[count].textContent === "") {
                        tbl.rows[cnt].cells[count].setAttribute("flag", "true");
                        tbl.rows[cnt].cells[count].textContent = "🚩";
                        --flags;
                        document.getElementById("numberOfFlags").textContent = "🚩 " + flags;
                    } else if (tbl.rows[cnt].cells[count].textContent === "🚩") {
                        tbl.rows[cnt].cells[count].setAttribute("flag", "false");
                        tbl.rows[cnt].cells[count].textContent = "";
                        ++flags
                        document.getElementById("numberOfFlags").textContent = "🚩 " + flags;
                    }
                }
                return false;
            }, false);
        }
    }
    generatesBombPositions();
}

function generatesBombPositions() {
    let x, y;
    for (let cnt = 1; cnt <= 7; ++cnt) {
        x = Math.floor((Math.random() * 9));
        y = Math.floor((Math.random() * 9));
        while (tbl.rows[x].cells[y].getAttribute("bomb") === "true") {
            x = Math.floor((Math.random() * 9));
            y = Math.floor((Math.random() * 9));
        }
        tbl.rows[x].cells[y].setAttribute("bomb", "true");
        // tbl.rows[x].cells[y].textContent = "💣";
    }
    for (let row = 0; row < 10; ++row) {
        for (let col = 0; col < 10; ++col) {
            if (tbl.rows[row].cells[col].hasAttribute("bomb") == false) {
                tbl.rows[row].cells[col].setAttribute("bomb", "false");
            }
        }
    }
}

function lose(x, y) {
    let ok = 0;
    let value = tbl.rows[x].cells[y];
    if (value.getAttribute("bomb") === "true") {
        let winText = document.getElementById("win");
        winText.textContent = "YOU LOSE";
        for (let row = 0; row < 10; ++row) {
            for (let col = 0; col < 10; ++col) {
                if (tbl.rows[row].cells[col].getAttribute("bomb") === "true") {
                    tbl.rows[row].cells[col].textContent = "💣";
                    ok = 1;
                }
            }
        }

    }
    return ok;
}

function howMannyBombs(x, y) {
    var bombs = 0;
    for (let cnt = 0; cnt < 8; ++cnt) {
        if (x + changeOfPlaceVertical[cnt] >= 0 && x + changeOfPlaceVertical[cnt] < 10 && y + changeOfPlaceHorizontal[cnt] >= 0 && y + changeOfPlaceHorizontal[cnt] < 10) {
            let value = tbl.rows[x + changeOfPlaceVertical[cnt]].cells[y + changeOfPlaceHorizontal[cnt]];
            if (value.getAttribute("bomb") === "true") {
                ++bombs;
            }
        }
    }
    return bombs;
}

function checkWin() {
    let isOk = 1;
    for (let row = 0; row < 10; ++row) {
        for (col = 0; col < 10; ++col) {
            if (tbl.rows[row].cells[col].getAttribute("bomb") === "false" && tbl.rows[row].cells[col].style.backgroundColor != "white") {
                isOk = 0;
            }
        }
    }
    return isOk;
}

function game(x, y) {
    tbl.rows[x].cells[y].setAttribute("visited", "true");
    if (checkWin() == 1) {
        document.getElementById("win").textContent = "YOU WIN";
        return false;
    }
    if (lose(x, y) == 1) {
        return false;
    }
    let numberBombs = howMannyBombs(x, y);
    if (numberBombs != 0) {
        tbl.rows[x].cells[y].textContent = numberBombs;
        tbl.rows[x].cells[y].style.backgroundColor = "white";
    } else if (numberBombs == 0) {
        tbl.rows[x].cells[y].style.backgroundColor = "white";
        for (let cnt = 0; cnt < 8; ++cnt) {
            if (x + changeOfPlaceVertical[cnt] >= 0 && x + changeOfPlaceVertical[cnt] < 10 && y + changeOfPlaceHorizontal[cnt] >= 0 && y + changeOfPlaceHorizontal[cnt] < 10) {
                if (tbl.rows[x + changeOfPlaceVertical[cnt]].cells[y + changeOfPlaceHorizontal[cnt]].getAttribute("visited") === "false") {
                    if (tbl.rows[x + changeOfPlaceVertical[cnt]].cells[y + changeOfPlaceHorizontal[cnt]].getAttribute("bomb") !== "true") {
                        tbl.rows[x + changeOfPlaceVertical[cnt]].cells[y + changeOfPlaceHorizontal[cnt]].style.backgroundColor = "white";
                        game(x + changeOfPlaceVertical[cnt], y + changeOfPlaceHorizontal[cnt]);
                        if (checkWin() == 1) {
                            document.getElementById("win").textContent = "YOU WIN";
                        }
                    }
                }
            }
        }
    }
    if (checkWin() == 1) {
        document.getElementById("win").textContent = "YOU WIN";
        for (let row = 0; row < 10; ++row) {
            for (let col = 0; col < 10; ++col) {
                if (tbl.rows[row].cells[col].getAttribute("bomb") === "true") {
                    tbl.rows[row].cells[col].textContent = "💣";
                }
            }
        }
    }
}