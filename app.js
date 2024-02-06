
let board = createBoard();
DisplaySudoku(board);
let btn = document.getElementById("solve");
let rst = document.getElementById("rst");
let backTracks = 0;

    btn.onclick = function() {Clicked(board);}
    rst.onclick = function() {location.reload();}


function Clicked(board) {
     DisplaySudoku(board);
     let bkTracks = 0;
     let {solved, bt} = Solve(board, bkTracks);
     console.log(solved);
     console.log(bt);
 };


//https://lisperator.net/blog/javascript-sudoku-solver/ <-- solver* completely based on this lovely example

function Solve(board, bTracks){
    let backTracks = bTracks;
    let {index, choices} = FindBest(board);
    let solved = false;
    //console.log(backTracks);
   
    if (index == null){
        solved = true;
        //console.log(backTracks);
        return {solved, backTracks}; // no more to fill
    }
    //
    // if (index == 1){
    //     solved = true;
    //     return {solved, backTracks}; // no more to fill
    // }
    //
    if (index == 0){
        choices = choices.sort(() => Math.random() - 0.5);
    }
    for (let c of choices){
        board[index] = c;
        // if we find a path that successfully finds a solution from the choice
        let returned = Solve(board, backTracks);
        
        backTracks += returned.backTracks;
        console.log(backTracks);
       // console.log(returned.backTracks);
                
        if (returned.solved) {
            //update visual board
            DisplaySudoku(board);
            //return true and finish
            solved = true;
            console.log(backTracks);
            return {solved, backTracks}; 
        }
    }
    // if choice does not produce an outcome
    board[index] =  "";
    backTracks++;
    solved = false;
    return {solved, backTracks}; 
    // reset board value and tell parent solve function we were unsuccessfully
}


function createBoard(){
    let board = [];
    for (let square = 0; square < 81; square++)
    {
        board.push("");
        //  TEST PUZZLE
        if (square == 3) {board[square] = 8};
        if (square == 5) {board[square] = 1};
        if (square == 16) {board[square] = 4};
        if (square == 17) {board[square] = 3};
        if (square == 18) {board[square] = 5};
        if (square == 31) {board[square] = 7};
        if (square == 33) {board[square] = 8};
        if (square == 42) {board[square] = 1};
        if (square == 46) {board[square] = 2};
        if (square == 49) {board[square] = 3};
        if (square == 54) {board[square] = 6};
        if (square == 61) {board[square] = 7};
        if (square == 62) {board[square] = 5};
        if (square == 65) {board[square] = 3};
        if (square == 66) {board[square] = 4};
        if (square == 75) {board[square] = 2};
        if (square == 78) {board[square] = 6};
    }
    return board;
}



function ind2rc(index){
    // converts index to rows and columns
    return {row: Math.floor(index/9), col: (index % 9)};
}

function rc2index(row, col){
    //converts rows and columns to index
    return row * 9 + col;
}


function getChoices(board, index) {
    let choices = [];
    for (let choice = 1; choice <= 9; ++choice)
    {
        //loops through all 9 possible numbers/choices
        if (acceptable(board, choice, index))
        {
            // adds to the choices array if legal
            choices.push(choice);
        }
    }
    return choices;
}


function acceptable(board, choice, index) {
    let {row, col} = ind2rc(index);
    //search row
    for (let colIndex = 0; colIndex < 9; ++colIndex)
    {
        if (board[rc2index(row, colIndex)] == choice)
        {
            return false;
        }
    }
    //search column
    for (let rowIndex = 0; rowIndex < 9; rowIndex++)
    {
        if (board[rc2index(rowIndex, col)] == choice)
        {
            return false;
        }
    }

    //establish current box
    let r1 = Math.floor(row / 3) * 3;
    let c1 = Math.floor(col / 3) * 3;
    //search box
    for (let rChk = r1; rChk < r1+3; ++rChk)
    {
        for (let cChk = c1; cChk < c1 + 3; ++cChk)
        {
            if (board[rc2index(rChk, cChk)] == choice)
            {
                return false;
            }     
        }   
    }
    return true;
}


function FindBest(board) {
    //finds options with smallest choices first -- more efficient method
    let index, choices;
    let leastMoves = 10; // start with random number above 9 (value changes with loop)
    for (let i = 0; i < 81; ++i){
        if (board[i] == "") // if cell is empty
        {

            let choiceArray = getChoices(board, i);

            if(choiceArray.length < leastMoves){
                // keep testing length of choice array until we get the smallest
                leastMoves = choiceArray.length;
                choices = choiceArray;
                index = i;
                // Each new record becomes the future return value
                if (leastMoves == 0) {
                    //breaks conditional if no choices
                    break;
                }
            }
        }
    }

    // randomly reversing choices array to add minor solution variety
    let dir = getRandomInt(2);
    if (dir == 1 && choices != undefined){
        choices.sort((a, b) => b-a); 
    }

    // index with smallest choice count at the end remains return val
    return {index, choices};
}


function DisplaySudoku(board){
    let boxes = document.querySelectorAll('.grid div');
    //update board array onto div array
    for (let index = 0; index < 81; index++)
    {
        boxes[index].innerHTML = board[index];
    }
}


// random function with max value
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }