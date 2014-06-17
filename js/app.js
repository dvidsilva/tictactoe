/*jshint globalstrict: true */

/* Games has all recorded plays, comparisons is
    all possible winning positions. */
var g = "",  
    gameOver = false,
    obviousMoves = [],
    strategies = [],
    games = [],
    comparisons = [],
    computerPlayer = true,
    player1Icon = "glyphicon-plus-sign",
    player2Icon = "glyphicon-remove-sign";

comparisons.push(["1", "2", "3"]);
comparisons.push(["4", "5", "6"]);
comparisons.push(["7", "8", "9"]);

comparisons.push(["1", "4", "7"]);
comparisons.push(["2", "5", "8"]);
comparisons.push(["3", "6", "9"]);

comparisons.push(["1", "5", "9"]);
comparisons.push(["3", "5", "7"]);


/* There were a lot of obvious games that the computer was losing so I'm hardcoding them */
obviousMoves = 
    ['7534','753496','7598','751436','7598','7534','1795','1759','179532','17953286','179532864','197435','139587','195738','85942136','7814','78149','781495','75','7514','751468','75146823','7418','741895',
     '453892','459832','1594','159436','1574','157436','1547','154732','1532'
    ];

/* strategies, default second move, 
like if the first move is in the center then play a edge, or if is a corner then the second should be the center. */
strategies = ['25','45','65','75','51','15','35','85','95','5137','5173'];

/* Start the Board with the computer knowing the obvious games. */
games = strategies.concat(obviousMoves);

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
    @todo use indexOf

    who played square?, returns X or O, or false if nobody
*/
function getPlayerPosition(g, p) {
    for (var i = 0; i < g.length; i++) {
        if (g[i] == p) {
            if (i % 2 === 0) {
                return "+";
            } else {
                return "x";
            }
        }
    }
    return false;
}

/* just play a random valid move by checking all the board and choosing any empty tile*/
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


/* 
	A smart move from the computer works by checking the array of stored games, it will check for games in which the 
	board was in the current state and that resulted in the computer winning, 
	will then play the next move that the computer played in that game to move towards a desired result. 
*/
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
        /* Get the shortest of the games that were won, not of all the games FIXED */
        shortest = victories.reduce(function (a, b) { 
            return ( a.length <= b.length && a.length > g.length ) ? a : b; 
         });
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
        g = playValidMove(g);
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
        clear();
        generateGame();
    }
}


/*Resets all variables to start over, cleans the board */
function clear() {
    gameOver = false;
    g = "";
    $("." + player1Icon).removeClass(player1Icon);
    $("." + player2Icon).removeClass(player2Icon);
    $('.btn-danger').removeClass('btn-danger');
    changeSign('');
    return true;
}


/* 	Puts the color icon in the appropiate sector of the board. 
	After the move calls the function to check if the game was won and then
    updates the message acordingly.
*/
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
    if(currentPlayer === player1Icon ){ $("[data-position='"+position+"']").addClass('btn-danger'); }
    
    g += "" + position;
    result = boardWonBySomeone(g);
    if ( result !== false ){
        games.push(g);
        if(result === "+"){
            // console.log(g);
        }
        changeSign(result + " won the game");
        gameOver = true;
        return true;
    }
    if(currentPlayer===player1Icon && auto !== false && computerPlayer === true ){
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

/* Deletes the array that contains previous games from which the computer learns, just for debugging purposes.*/
function cleargames(){
    games = [];
}

/*Generates a bunch of games to fill up the array that trains the game */
function train(){
    clear();
    generateGames(10000);
}

/* Clears the board to start a new game*/
function init() {
    clear();
}

/* Used to play against another person */
function toggleAuto(){
    computerPlayer = !computerPlayer;
    // alert(computerPlayer);
}

/*
	Utility function to update the sign in the board
*/
function changeSign(whatyousay){
	$('#sign').html(whatyousay);
}