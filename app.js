
let boxes = document.querySelectorAll('.grid div');
let board = createBoard();
let isGenerating = true;
let possibilities = 0;
let solving = false;

DisplaySudoku(board);
let backTracks = 0;
let gen = document.getElementById("gen");
let slv = document.getElementById("solve");
let rst = document.getElementById("rst");

    gen.onclick = function() {genClick(board);}
    slv.onclick = function() {solveClick(board);}
    rst.onclick = function() {location.reload();}


function genClick(board) {
    isGenerating = true;
    Solve(board);
    RemoveSquares(board);
    DisplaySudoku(board);
};

function solveClick(board) {
   
   let found = solveUnique(board);
   DisplaySudoku(board);
   if(found == false){console.log("failed")}

 };

 function solveUnique (board) {
    isGenerating = false;
    let found = false;
    //let cycles = 0;
    possibilities = 0;
    Solve(board);
    console.log(board);
    if(possibilities > 1 || possibilities === 0) found = false;
    
    else found = true;
    console.log(found);
    return found;
 }


//https://lisperator.net/blog/javascript-sudoku-solver/ <-- solver* completely based on this lovely example

function Solve(board){
    
    let {index, choices} = FindBest(board);
    // let emptySquares = board.filter((square) => square.value == "");
    let emptySquares = [];
    for (let s = 0; s < board.length; ++s){
        if (board[s] == ""){
            emptySquares.push(board[s]);
        }
    }
    
    
    DisplaySudoku(board);

    if(emptySquares.length == 0){
        possibilities++;
        return false;
    }

    if (possibilities > 1){
        //no unique solutions
        console.log("no unique");
        return true;
    }
    

    if (index == 0 && isGenerating == true){
        choices = choices.sort(() => Math.random() - 0.5);
        console.log("error: accessing generation");
    }


    for (let c of choices){
        board[index].value = c;
        // if we find a path that successfully finds a solution from the choice            
        if (Solve(board) && possibilities <= 1) {
            console.log(board);
            //update visual board
            DisplaySudoku(board);

            console.log("solved");

            //return true and finish path
            return true;
        
        }
    }
    
    if (possibilities > 0 && isGenerating == true){
        isGenerating = false;
        console.log("gen");
        //return true and finish path
        return true;
    }

    // if choice does not produce an outcome
    board[index] =  "";
    ++backTracks;
    console.log(possibilities);
    
    return false;
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
    //setTimeout(LogUpdate, 100);
    //update board array onto div array
    for (let index = 0; index < 81; index++)
    {
        UpdateBoard(board, index);
    }
}

function UpdateBoard(board, index) {
    boxes[index].innerHTML = board[index];
}

function RemoveSquares(board){
    let toRemove = findToRemove();

    for (let removed = 0; removed < toRemove.length; ++removed){
        board[toRemove[removed]] = ""; 
        //remove generated index pairs to keep symmetry
        board[80 - toRemove[removed]] = "";
        //manually remove centre square
        board[40] = "";
    }

}

function findToRemove() {
    let fromEnd;
    let toRemove = [];
    for (let rmAmt = 0; rmAmt < 22; ++rmAmt){
        let valid = true;
        fromEnd = getRandomInt(40);
        for (let prevRm = 0; prevRm < toRemove.length; ++prevRm){
            if (fromEnd == toRemove[prevRm]){
                rmAmt--;
                valid = false;
            }
        }
        if (valid == true){
            toRemove.push(fromEnd);
        }
    }
    return toRemove;

}

// function betweenRange(x, value) {
//     return x >= value - 1 && x <= value + 1;
//   }

// random function with max value
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }