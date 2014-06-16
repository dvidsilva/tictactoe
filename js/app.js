/*jshint globalstrict: true */

/* Games has all recorded plays, comparisons is
    all possible winning positions. */
var g = "",  
    gameOver = false,
    games = [],
    comparisons = [],
    player1Icon = "glyphicon-remove-sign",
    player2Icon = "glyphicon-plus-sign";

comparisons.push(["1", "2", "3"]);
comparisons.push(["4", "5", "6"]);
comparisons.push(["7", "8", "9"]);

comparisons.push(["1", "4", "7"]);
comparisons.push(["2", "5", "8"]);
comparisons.push(["3", "6", "9"]);

comparisons.push(["1", "5", "9"]);
comparisons.push(["3", "5", "7"]);



/** test 3 values to see if they are equal */
function compare3(a, b, c) {
    var p = getPlayerPosition;
    if (p(g, a) == p(g, b) && p(g, b) == p(g, c)) {
        return p(g, a);
    }
    return false;
}
/** validate lines verticaly, horizontaly and diagonaly */
function boardWonBySomeone(g) {
    for (var i = 0; i < comparisons.length; i++) {
        var r = compare3(comparisons[i][0], comparisons[i][1], comparisons[i][2]);
        if (r !== false) {
            return r;
        }
    }
    return false;
}
/** 
    slow bad linear lookup 
    todo use indexOf

    who played square?, returns X or O, or false if nobody
    */
function getPlayerPosition(g, p) {
    for (var i = 0; i < g.length; i++) {
        if (g[i] == p) {
            if (i % 2 === 0) {
                return "x";
            } else {
                return "+";
            }
        }
    }
    return false;
}
/* just play a random valid move */
function playValidMove(g) {
    var valid_moves = {
        "1": '1',
        "2": '2',
        "3": '3',
        "4": '4',
        "5": '5',
        "6": '6',
        "7": '7',
        "8": '8',
        "9": '9'
    };
    for (var i = 0; i < g.length; i++) {
        delete(valid_moves[g[i]]);
    }
    //after deleting all played moves, now all that is left, 
    //are the actual valid moves
    //select one
    var a = any(valid_moves);
    if (a === false) {
        //no valid moves left
        return g;
    }
    g += a;
    play(a, false);
    return g;
}

function playSmartMove(){
    var choice, filter, victories = [], shortest;
    filter = new RegExp("^" + g);
    for(var i in games){
    	if(games[i].match(filter)){
            if(games[i].length % 2 == 0 ){
                victories.push(games[i]);
            }
        }
    }
    /* if the game was recorded play a choice, if not, play a random one */
    if(victories.length > 0){
        shortest = games.reduce(function (a, b) { return a.length < b.length ? a : b; });
        choice = shortest[ g.length ];
        play(choice, false);
    }else{
    	playValidMove(g);
    }
    return(g);
}


/* count a dict */
function count_items(x) {
    var c = 0;
    for (var i in x) {
        c++;
    }
    return c;
}
/* any of dict */
function any(x) {
    var count = count_items(x);
    if (count === 0) {
        return false;
    }
    var i = Math.floor((Math.random() * count));
    if (i == count && i > 0) {
        i--; // rand might give 1
    }
    var c = 0;
    for (var d in x) {
        if (c == i) {
            return x[d];
        }
        c++;
    }
    console.log("something went wrong, ups");
    return "";
}
/* 
 * just play randomly against itself
 * and add the game log to the list of all games
 * */
function generateGame() {
    g = "";
    while (boardWonBySomeone(g) === false) {
        old_board = g;
        g = playSmartMove(g);
        if (g == old_board) {
            //there were no more valid moves left
            //it was a tie
            //proceed to end the match
            break;
        }

    }
    games[games.length] = g;
}
/*
 * train the computer
 * */
function generateGames(total) {
    var total = total || 1000;
    for (var i = 0; i < total; i++) {
        generateGame();
    }
}

function clear() {
    gameOver = false;
    g = "";
    $("." + player1Icon).removeClass(player1Icon);
    $("." + player2Icon).removeClass(player2Icon);
    changeSign('');
    return true;
}

function changeSign(whatyousay){
	$('#sign').html(whatyousay);
}

function play(position, auto) {
    var currentPlayer;
    if( (g.match(position) !== null || g.length === 9 ) ){
        /* atempted to play in a position that has a move on it */
    	return false;
    }
    if (gameOver === true){
    	return false;
    }
    currentPlayer = g.length % 2 == 0 ? player1Icon : player2Icon;
    $("[data-position='"+position+"']").find('span').addClass(currentPlayer);
    g += "" + position;
    result = boardWonBySomeone(g);
    if ( result !== false ){
        games[games.length] = g;
        changeSign(result + " won the game");
        gameOver = true;
        return true;
    }
    if(currentPlayer===player1Icon && auto !== false){
        //playValidMove(g);
        // Function that analyses the previous game and makes a smart choice
        playSmartMove(g);
    }
    if(g.length === 9){
        gameOver = true;
		changeSign("tie");
        return true;
    }
    return true;
}

function train(){
    clear();
    generateGames(1000);
}
function init() {
    clear();
}