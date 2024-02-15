
//https://lisperator.net/blog/javascript-sudoku-solver/ <-- base solver* heavily based on this lovely example


let boxes = document.querySelectorAll('.grid div'); // each sudoku sqaure has a corresponding html div
let board = createBoard(); // creates empty 81 square array
let isGenerating; // as both generate and solve clicks use the same the function, we tweak it with this bool
let possibilities = 0; // measures whether solution is unique or not
let uniqueSol; // boolean for if solution was unique or not
let solvedBoard; // a copy of the solved board, as board is modified to find further solutions

DisplaySudoku(board);
let backTracks = 0;
let gen = document.getElementById("gen"); // generate button
let slv = document.getElementById("solve"); // solve button
let rst = document.getElementById("rst"); // reset button

    gen.onclick = function() {genClick(board);}
    slv.onclick = function() {solveClick(board);}
    rst.onclick = function() {location.reload();}


function genClick(board) {
    try {
        // need method to shuffle/ flip rows and columns
        isGenerating = true;
        Generate(board)
        shuffle(board);
        shuffle(board); //shuffle (swap) rows/cols twice for variety
        console.log('removing squares');
        RemoveSquares(board); // recursively remove squares while checking solution is valid with solver
        DisplaySudoku(board); 
        console.log('done');
      } catch (e) {
        console.log("Timeout: caught " + e); // Sometimes generation causes a range error, page is reloaded if so
        location.reload();
      }

};

function solveClick(board) {
    isGenerating = false;
    console.log("Solving...");
   solveUnique(board);
   if(uniqueSol == false){
    console.log("More than one solution");}
    else if (possibilities == 0) {
        console.log("No solutions")
    }
    else console.log("Solution is unique!");
    console.log("Done");
 };

 function solveUnique(board) {
    possibilities = 0;
    Solve(board);
    
    //displays only the first solution if found
    if (!isGenerating && Array.isArray(solvedBoard)){
       DisplaySudoku(solvedBoard);
    }

 }

 function Solve(board){

    let emptySquares = [];
    for (let s = 0; s < board.length; ++s){
        if (board[s] == ""){
            emptySquares.push(s);
        }
    }

    if (emptySquares.length === 0 && possibilities == 0){
        solvedBoard = board.slice(0);
        uniqueSol = true;
        possibilities++;
        return false;
    }

    let {index, choices} = FindBest(board, emptySquares);

    if (!Array.isArray(choices)){
        if (possibilities > 1){
            possibilities++;
        }
        uniqueSol = false;
        return true;
    }
    
    for (let c of choices){
        
        board[index] = c;
        // if we find a path that successfully finds a solution from the choice 
           
        if (Solve(board) && possibilities <= 1) {

            //return true and finish paths
            return true;
        }
    }

    // if choice does not produce an outcome
    board[index] =  "";
    ++backTracks;

    return false;
}


function Generate(board){

    let emptySquares = [];
    for (let s = 0; s < board.length; ++s){
        if (board[s] == ""){
            emptySquares.push(s);
        }
    }
    
    let {index, choices} = FindBest(board, emptySquares);

    if (emptySquares.length === 81){
        // choices array order is randomized so we don't always generate the same puzzle
        choices = choices.sort(() => Math.random() - 0.5);
    }

    if (!Array.isArray(choices)){
        // avoiding using choices array if it is empty/undefined
        return true;
    }


    for (let c of choices){
        board[index] = c;
        // if we find a path that successfully finds a solution from the choice            
        if (Generate(board)) {
            //return true and finish path
            return true;
        
        }
    }


    // if choice does not produce an outcome
    board[index] =  "";
    
    return false;
    // reset board value and tell parent solve function we were unsuccessfully
}


function shuffle(board){
    let rows = [];
    let cols = [];
    let rnds;

    // collect a single row
    for (let i = 0; i < 9; ++i){
        rows.push(lineCollect(board, i, 1));
    }
    
    rnds = gen2RndLines(9); // generates two numbers under 9 that arent duplicate and that are in the same 3 squares

    swapLine(board, rnds.rnd1, rnds.rnd2, rows, 1);

    // collect a single column
    for (let i = 0; i < 9; ++i){
        cols.push(lineCollect(board, i, 9));
    }

    rnds = gen2RndLines(9);

    swapLine(board, rnds.rnd1, rnds.rnd2, cols, 9);


}

function gen2RndLines(max){
    let rnd1 = getRandomInt(max);
    let rnd2 = getRandomInt(max);
    let box1 = Math.floor(rnd1 / 3) * 3;
    let box2 = Math.floor(rnd2 / 3) * 3;
    while (rnd1 === rnd2 || box1 != box2) {
        rnd2 = getRandomInt(max);
        box2 = Math.floor(rnd2 / 3) * 3;
    }
    return {rnd1, rnd2};
}

function lineCollect(board, lineNo, increment){

    let lineValues = [];
    let startIndex = 0;

    //adapts for column and row indexing differences
    if (increment === 9) {
        startIndex = lineNo;
    }
    else{
        startIndex = lineNo * 9;
    }
    
    for (let i = 0; i < 9 * increment; i += increment) {
        lineValues.push(board[startIndex + i]);
    }

    return lineValues;
}

function swapLine(board, line1, line2, lineVals, increment) {
    //line1 is the line we take to overwrite line2
    //a copy of line2 is stored in oldLine so it can overwrite the original line1 without being lost
    let startIndex1;
    let startIndex2;
    let indexScale;
    
    
    if (increment === 9) {
        startIndex1 = line1;
        startIndex2 = line2;
        indexScale = 1/9;

    }
    else{
        startIndex1 = line1 * 9;
        startIndex2 = line2 * 9;
        indexScale = 1;
        
    }
    let oldLine = lineVals[line2];
    
    
    for (let i = 0; i < 9 * increment; i += increment) {
      board[startIndex2 + i] = lineVals[line1][i * indexScale];
      board[startIndex1 + i] = oldLine[i * indexScale];
    }

    return lineVals;
}


function createBoard(){
    let board = [];
    for (let square = 0; square < 81; square++)
    {
        board.push("");
        //  TEST PUZZLE
        // if (square == 3) {board[square] = 8};
        // if (square == 5) {board[square] = 1};
        // if (square == 16) {board[square] = 4};
        // if (square == 17) {board[square] = 3};
        // if (square == 18) {board[square] = 5};
        // if (square == 31) {board[square] = 7};
        // if (square == 33) {board[square] = 8};
        // if (square == 42) {board[square] = 1};
        // if (square == 46) {board[square] = 2};
        // if (square == 49) {board[square] = 3};
        // if (square == 54) {board[square] = 6};
        // if (square == 61) {board[square] = 7};
        // if (square == 62) {board[square] = 5};
        // if (square == 65) {board[square] = 3};
        // if (square == 66) {board[square] = 4};
        // if (square == 75) {board[square] = 2};
        // if (square == 78) {board[square] = 6};
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


function FindBest(board, emptySquares) {
    //finds options with smallest choices first -- more efficient method
    let index, choices;
    let leastMoves = 10; // start with random number above 9 (value changes with loop)
    for (let i = 0; i < emptySquares.length; ++i){
        
        let choiceArray = getChoices(board, emptySquares[i]);

        if(choiceArray.length < leastMoves){
            // keep testing length of choice array until we get the smallest
            leastMoves = choiceArray.length;
            choices = choiceArray;
            index = emptySquares[i];
            // Each new record becomes the future return value
            if (leastMoves == 0) {
                //breaks conditional if no choices
                break;
            }
        }
    }

    // index with smallest choice count at the end remains return val
    return {index, choices};
}


function DisplaySudoku(board){
    //update board array onto html div array
    for (let index = 0; index < 81; index++)
    {
        UpdateBoard(board, index);
    }
}

function UpdateBoard(board, index) {
    boxes[index].innerHTML = board[index];
}

function RemoveSquares(board){


    let emptySquares = [];
    for (let s = 0; s < board.length; ++s){
        if (board[s] == ""){
            emptySquares.push(s);
        }
    }

    let toRemove = findToRemove(emptySquares);
    let removed1 = board[toRemove];
    let removed2 = board[80 - toRemove];
    board[40] = ""; 
    board[toRemove] = ""; 
    //remove generated index pairs while keeping symmetry
    board[80 - toRemove] = "";
    solveUnique(board);

    if (emptySquares.length >= 51 && uniqueSol){
        
        return true;
    }

    if (RemoveSquares(board) && uniqueSol){
        return true;
        
    }
    
    //return originals if path unsuccessful
    board[toRemove] = removed1; 

    board[80 - toRemove] = removed2;
    return false;

}

function findToRemove(emptySquares) {
    let fromEnd = getRandomInt(40);

    if (emptySquares.length > 0){
        for (let i = 0 ; i < emptySquares.length; ++i){
 
            if (emptySquares[i] == fromEnd) {
                fromEnd = getRandomInt(40);
                i = 0;
            }
        }
    }
    
    return fromEnd;

}

// random function with max value
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }