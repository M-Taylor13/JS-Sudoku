document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.grid div');
    let rowNo = 0;

    for (let i = 0; i < boxes.length; i++) {
        
        ClassHandling(i);

    }
    let buildCount = 0;

    let limit = 50;

    while (buildCount < limit){
        let boxToFill = 80;
        let unfilled = [];
        let filled2 = []
        let unfilledIndex = 0;
        let rowTest = [1,2,3,4,5,6,7,8,9]
        for (let boxNum = 0; boxNum < boxToFill; boxNum++){
            unF = AddNumber(boxNum);
            if (unF.length > 0){
                unfilled.push(unF);
            }
            
        }
        
        
        for (boxNum = 0; boxNum < unfilled.length; boxNum++){
            let randomFill = false;
            console.log(unfilled[unfilledIndex]);
            if (unfilled[boxNum] != undefined)
            {

                
                let tried = [0];

                for (rowInd = 0; rowInd < 9; rowInd++){
                    
                    
                    validNo = CheckValid(unfilled[boxNum], tried, randomFill, rowTest[rowInd]);

                    if (validNo)
                    {
                        console.log(unfilled[boxNum]);
                        filled2.push(unfilled[boxNum]);

                        break;
                    }
                }
            }
            unfilledIndex++;  
        }
        if (filled2.length == unfilled){
            buildCount = limit;
        }
        else {
            unF.clear;
            buildCount++;

        }
        
}
        

    function AddNumber(indx){
        let cycles = 0;
        let tried = [0];
        let validNo = false
        let randomFill = true;
        let unF = [];
        
        
        while (cycles < 1000)
        {   
            validNo = CheckValid(indx, tried, randomFill, 1);
            if (validNo == true)
            {
                return unF;
            }
            cycles++
            
        }
        if (validNo == false)
        {
            unF.push(indx);
        }
        return unF;
    }

    function CheckValid(ind, tryd, rndFill, manualNum) {
        let currentBox = boxes[ind];
       // console.log(ind);
        let val = true;
        let num = manualNum;


            if (currentBox.classList.contains("empty"))
            {
                let cRow= 0;
                let cCol= 0;
                let cBox= 0;

                for (let bn = 0; bn < 9; bn++)
                {
                    if (currentBox.classList.contains(`row${bn}`)){
                        cRow = bn;
                    }
                    if (currentBox.classList.contains(`col${bn}`)){
                        cCol = bn;
                    }
                    if (currentBox.classList.contains(`box${bn}`)){
                        cBox = bn;
                    }

                }

                let nodeRows = document.querySelectorAll(`.row${cRow}:not(.empty)`);
                let nodeCols = document.querySelectorAll(`.col${cCol}:not(.empty)`);
                let nodeBoxes = document.querySelectorAll(`.box${cBox}:not(.empty)`);
                let checkList1 = Array.prototype.slice.call(nodeRows);
                let checkList2 = Array.prototype.slice.call(nodeCols);
                let checkList3 = Array.prototype.slice.call(nodeBoxes);
                let checkList4 = checkList1.concat(checkList2);
                let checkList = checkList4.concat(checkList3);
                if (rndFill)
                {
                    num = (getRandomInt(9) + 1);
                    for (let nChkd = 0; nChkd < tryd.length; nChkd++)
                    {
                        if (tryd[nChkd] == num)
                        {
                            
                            num = (getRandomInt(9) + 1);
                        }
                    }
                }
                if (checkList != undefined)
                {
                    for (let chkd = 0; chkd < checkList.length; chkd++){
                        //console.log(checkList[chkd].innerHTML);
                        if (checkList[chkd].innerHTML == num){
                            val = false;
                            tryd.push(num);
                            
                            return false;
                        }
                    }
                }
                if (val == true)
                {
                    currentBox.classList.remove("empty");
                    currentBox.innerHTML = num;
                    return true;
                }  
                return false;

                
            }
        
        
    }
    

    // taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

    function ClassHandling(index){
        boxes[index].classList.add("empty");

        if (index % 9 == 0 && index != 0) {
            ++rowNo;
        }
        boxes[index].classList.add(`row${rowNo}`);

        if (index <= 8){

            for (let row = 0; row <=8; row++) {
                    boxes[index + (9 * row)].classList.add(`col${index}`);

            }

        }

        let topLeft = [0, 3, 6, 27, 30, 33, 54, 57, 60];

        for (let box = 0; box < topLeft.length; box++) {
            if (index === topLeft[box])
            {

                
                for (let lineJumps = 0; lineJumps < 3; lineJumps++)
                {
                    for (let toRight = 0; toRight < 3; toRight++)
                    {
                        boxes[index + toRight + (lineJumps * 9)].classList.add(`box${box}`)
                    }

                }

            }

        }


    }  

    

    function PosCheck(index){
        for (let i = 0; i < 9; i++ )
        {
            //if (boxes[index + 1]classList)
        }
    }

})