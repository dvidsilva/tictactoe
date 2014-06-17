tictactoe
=========

Smart tic tac toe players that learns from previous games.

You can play against the machine in the live version here, make sure to train the computer first: [dvidsilva.github.io/tictactoe](https://dvidsilva.github.io/tictactoe).

The most recent code will reside in the [gh-pages](https://github.com/dvidsilva/tictactoe/tree/gh-pages) branch to keep the most up to date code available for playing. 


Explanation
--------

games are positions on screen
123
456
789

example game:

g = "51238"

equals: first player wins
        x o x
        _ o _
        _ o _

        5 1 2 3 8 
        o x o x o

**player 1:** 0

**player 2:** x

So after every player move the computer would look in his dictionary of previous games and choose the shortest similar game that resulted in a win.

games of odd length, are won by player1, o
games of even length, are won by player2, x
