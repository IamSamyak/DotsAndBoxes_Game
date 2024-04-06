var boxes = [];
var turn = true;
var player1Score = 0;
var player2Score = 0;
var m = 0;
var n = 0;

function load() {
    boxes = [];
    turn = true;
    player1Score = 0;
    player2Score = 0;
    m = 9;
    n = 9;
    var offset = 50;

    var sx = window.innerWidth / 2 - (m * offset) / 2,
        sy = offset * 2.5;
    var html = "";
    $("#app").html(html);
    var c = 0;
    for (var j = 0; j < m; j++) {
        for (var i = 0; i < n; i++) {

            var x = sx + i * offset,
                y = sy + j * offset;

            html += `
                <div class="box" data-id="${c}" style="z-index=${i-1}; left:${x+2.5}px; top:${y+2.5}px"></div>
                <div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>						
                <div class="line lineh" data-line-1="${c}" data-line-2="${c-m}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
                <div class="line linev" data-line-1="${c}" data-line-2="${c-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
                `;
            boxes.push(0);
            c++;
        }
    }

    //right boxes
    for (var i = 0; i < n; i++) {
        var x = sx + m * offset,
            y = sy + i * offset;
        html += `				
                <div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>
                <div class="line linev" data-line-1="${m*(i+1)-1}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
                `;
    }

    //bottom boxes
    for (var i = 0; i < m; i++) {
        var x = sx + i * offset,
            y = sy + n * offset;
        html += `				
                <div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>
                <div class="line lineh" data-line-1="${((n-1)*m)+i}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
                `;
    }

    //right-bottom most dot
    html += `<div class="dot" style="z-index=${i}; left:${sx+m*offset-5}px; top:${sy+n*offset-5}px" data-active="false"></div>`

    // Append player turn text and set it to Player 1's turn initially
    $("#app").prepend(`<div id="playerTurn">Player 1's Turn</div>`);

    // Append to dom
    $("#app").html(html);
    applyEvents();
}

function applyEvents() {
    console.log('applyevents');
    $("div.line").unbind('click').bind('click', function() {
        var id1 = parseInt($(this).attr("data-line-1"));
        var id2 = parseInt($(this).attr("data-line-2"));
        id2 = id1 % n === 0 && id2 === id1-1 ? -3 : id2;
        if (checkValid(this)) {
            if (turn) {
                playerMove(id1, id2, $(this));
            } else {
                playerMove(id1, id2, $(this));
            }
        }
    });
}

function playerMove(id1, id2, lineElement) {
    var a = false,
        b = false;
    if (id1 >= 0) a = addValue(id1);
    if (id2 >= 0) b = addValue(id2);
    lineElement.addClass("line-active");
    lineElement.attr("data-active", "true");

    var playerTurnColor = turn ? "salmon" : "skyblue"; // Get current player's color

    if (a === false && b === false) {
        // Switch turns between players
        turn = !turn;

        // Update player turn text and color
        var playerTurnText = turn ? "Player 1's Turn" : "Player 2's Turn";
        $("#playerTurn").text(playerTurnText).css("color", playerTurnColor);
    }
    var winnerText = '';
    var full = true;
    for (var i = boxes.length - 1; i >= 0; i--) {
        if (boxes[i] != "full") {
            full = false;
            break;
        }
    }
    if (full) {
        winnerText = (player1Score > player2Score) ? "Player1" : "Player2";
    }

    if (winnerText) {
        var winnerElement = (winnerText === "Player1") ? $(".player1") : $(".player2");
        winnerElement.html("<br><span style='color: #2E8B57; font-size: 24px;'>Winner is: " + winnerText + "</span>");
        var LoserElement = (winnerText === "Player1") ? $(".player2") : $(".player1");
        LoserElement.html("");
        var TurnElement = $("#playerTurn");
        TurnElement.html("");
        setTimeout(function() {
            window.location.href = "index.html";
        }, 3000);
    }
}


function acquire(id) {
    var color;
    if (turn) {
        color = "skyblue";
        player1Score++;
    } else {
        color = "salmon";
        player2Score++;
    }

    $("div.box[data-id='" + id + "']").css("background-color", color);
    boxes[id] = "full";

    $(".player1").text("Player1: " + player1Score);
    $(".player2").text("Player2: " + player2Score);
}

function addValue(id) {
    boxes[id]++;
    if (boxes[id] === 4) {
        acquire(id);
        return true;
    }
    return false;
}

function checkValid(t) {
    return ($(t).attr("data-active") === "false");
}

// Remove the computer related functions

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function() {
    load();
});