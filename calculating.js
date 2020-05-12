//@author: Klimenkov
const GRAMMAR = {
    symbol: ["A", "B", "C", "D", "E", "F", "G", "H", "I", 
                "J", "K", "L", "M", "N", "O", "P", "Q", "R",
                "S", "T", "U", "V", "W", "X", "Y", "Z"],
    const: ['1','0'],
    bracket: ['(',')'],
    unar_operation: ['!'],
    bin_operation: ['&','|','->','~'],
};
const MAX_ELEM_LENGTH = 2;

const TRUTH_TABLE_BINARY = {
    '&': [
        ['0', '0', '0'],
        ['0', '1', '0'],
        ['1', '0', '0'],
        ['1', '1', '1'],
    ],
    '|': [
        ['0', '0', '0'],
        ['0', '1', '1'],
        ['1', '0', '1'],
        ['1', '1', '1'],
    ],
    '->': [
        ['0', '0', '1'],
        ['0', '1', '1'],
        ['1', '0', '0'],
        ['1', '1', '1'],
    ],
    '~': [
        ['0', '0', '1'],
        ['0', '1', '0'],
        ['1', '0', '0'],
        ['1', '1', '1'],
    ],
};
const TRUTH_TABLE_UNARY = {
    '!': [
        ['0', '1'],
        ['1', '0'],
    ],
};


let operandArr = [], operatorArr = [], resultArr = [];

let table = [];


Object.size = function(obj) {
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
//@author: Glushchenko
function checkIsNeutral(value){
    if(!formulaCheck(value)) return false;
    let arr = calculating();
    if (arr.reduce(function(product, value) { return product * value; }) == 1 || arr.reduce(function(product, value) { return product + value; }) == 0)
        return false;
    else
        return true;
};
//@author: Glushchenko
function checkSDNF(formula){
    if(!formulaCheck(formula)) return false;
    let arr = divideIntoArrs(formula);
    let f = generateSDNF();
    console.log("formula", f);
    if (formula == f)
        return true;
    else
        return false;
};
//@author: Glushchenko
function generateSDNF(){
    let _operandArr = findOperandArr();
    let n = _operandArr.length;
    let rez = findRezArr(n);
    let rez_elemArr = calculating();
    let k=0, s=0, t=0;
    let formula = "";
     for (var i = 0; i<rez_elemArr.length; i++)
        if(rez_elemArr[i]==1)
            k++;
    let h = k;
    if (k==0)
        return false;
    if (k>1)
        formula = formula.concat("(");
    for (var i = 0; i<rez_elemArr.length; i++){
        if(rez_elemArr[i]==1){
            if (k-h>0) {
                    formula = formula.concat("|");
                    if (h>1){
                        formula = formula.concat("(");
                        t++;
                    }
                }
                h--;
            if(n>1)
                formula = formula.concat("(");
            for(var j = 0; j<n; j++){
                if (j>0) {
                    formula = formula.concat("&");
                    if(n-j>1){
                        formula = formula.concat("(");
                        s++;
                    }
                }
                if (rez[i][j]==0) {
                    formula = formula.concat("(!" + _operandArr[j] + ")");
                }
                else{
                    formula = formula.concat(_operandArr[j]);
                }
            }
            for(let l=0; l<s; l++)
                formula = formula.concat(")");
            if(n>1)
                formula = formula.concat(")");
            
        }
        s=0;
    }
    for(let l=0; l<t; l++)
        formula = formula.concat(")");
    if (k>1)
        formula = formula.concat(")");
    return formula;
};

function pushInArr(key, elem){
    if(key === 'symbol' || key === 'const'){
        operandArr.push(elem);
        resultArr.push(elem);
    }
    else {
        operatorArr.push(elem);

        if(elem === ')'){
            operatorArr.pop();
            resultArr.push(operatorArr.pop());
            operatorArr.pop();            
        }
    }   
}

function divideIntoArrs(input){
    let formula = input.trim();
    //let isFormula = true, next = true;
    let elem = '', i = 0, propertyNum;

    for (let element of formula){
        i++;
        propertyNum = 0;
        if(element === ' '){
            continue;
        }
        elem = elem + element;
        //for(let indexGrammarGroup = 0; indexGrammarGroup < GRAMMAR.length; indexGrammarGroup++){}
        for(let key in GRAMMAR){
            propertyNum++;
            if(GRAMMAR[key].indexOf(elem) + 1){
                pushInArr(key,elem);
                elem = '';
                break;
            }
            if((elem.length === MAX_ELEM_LENGTH || i+1 >= formula.length) 
                && Object.size(GRAMMAR) <= propertyNum){
                //alert('NT a formula');  
                return -1;
            }
        }
        
    }
    //console.log('operandArr',operandArr,'operatorArr',operatorArr, 'resultArr', resultArr); 
    table = Array(resultArr.length);  
    return calculating(); 
}
//@author: Glushchenko
function findOperandArr(){
    let _operandArr = [...operandArr];

    //----------------
    for(let i = 0; i < _operandArr.length; i++){
        if(GRAMMAR.const.indexOf(_operandArr[i]) +1){
            _operandArr.splice(i,1);
            i--;
        }
        else 
        for(let j = 0; j < i; j++){
            if(_operandArr[j] === _operandArr[i]){
                _operandArr.splice(i,1);
                i--;
            }
        }
    }
    return _operandArr;
};
//@author: Glushchenko
function findRezArr(n){
    let rez = Array(Math.pow(2, n));

    for(let a = 0, len = table.length; a < len; a++){
        table[a] = Array(rez);
    }

    for(let i = 0, len = rez.length; i < len; i++){
        let binRepresentation = i.toString(2);
        for(let j = 0, j_max = n - binRepresentation.length; j < j_max;j++){
            binRepresentation = '0'+binRepresentation
        }
        rez[i] = binRepresentation.split('');
    }
    return rez;
};
//@author: Glushchenko
function calculating(){
    let _operandArr = findOperandArr();
    console.log('_operandArr',_operandArr)
    //----------------
    let n = _operandArr.length;
    let rez = findRezArr(n);
    console.log("rez", rez)

    let constInsteadOperandArr = Array(Math.pow(2, n));
    for(let i = 0, len = constInsteadOperandArr.length; i < len; i++){
        constInsteadOperandArr[i] = [...resultArr];

        for(let k = 0, _len = constInsteadOperandArr[i].length; k < _len; k++){
            let index = _operandArr.indexOf(constInsteadOperandArr[i][k]);
            (index + 1) ? (constInsteadOperandArr[i][k] = rez[i][index]) : null;

        }
    }

    //console.log('constInsteadOperandArr',constInsteadOperandArr);

    let rez_elemArr = [];
    for(let q = 0; q < constInsteadOperandArr.length; q++){
        rez_elemArr.push(...findFormulaRezult(constInsteadOperandArr[q]));
    }
    console.log("rez_elemArr", rez_elemArr)
    // //
    return rez_elemArr;
}
    

//@author: Sinnelnikov
function countBinaryOperatorResult(firstOperand, secondOperand, symbol) {
    const truthTable = TRUTH_TABLE_BINARY[symbol];

    for (let rowIndex = 0; rowIndex < truthTable.length; rowIndex++) {
        if (firstOperand === truthTable[rowIndex][0]) {
            if (secondOperand === truthTable[rowIndex][1]) {
                return truthTable[rowIndex][2];
            }
        }
    }
}

function countUnaryOperatorResult(operand, symbol) {
    const truthTable = TRUTH_TABLE_UNARY[symbol];

    for (let rowIndex = 0; rowIndex < truthTable.length; rowIndex++) {
        if (operand === truthTable[rowIndex][0]) {
            return truthTable[rowIndex][1];
        }
    }
}

function findFormulaRezult(array){
    let arr = [...array];
    for(let i = 0; i < arr.length; i++){
        //console.log(i, arr);
        if(GRAMMAR.bin_operation.indexOf(arr[i]) + 1){
            arr[i-2] = countBinaryOperatorResult(arr[i-2],...arr.splice(i-1,1),...arr.splice(i-1,1));
            i = i -2;
        }
        else if(GRAMMAR.unar_operation.indexOf(arr[i]) + 1) {
            arr[i-1] = countUnaryOperatorResult(arr[i-1],...arr.splice(i,1))
            i--;
        }
    }
    return arr;
}

//@author: Sinelnikov
let expression = '\((([A-Zf0-1](~|(->)|&|\|)[A-Zf0-1])|(![A-Zf0-1]))\)|[A-Z0-1]/g';


function formulaCheck(formula){

    console.log("start",formula);
        let expression = formula;
        let length;
        if (expression.search("f") === -1) {
            do {
                length = expression.length;
                expression = expression.replace(/\((([A-Zf0-1](~|(->)|&|\|)[A-Zf0-1])|(![A-Zf0-1]))\)|[A-Z0-1]/g, "f")
            } while (length > expression.length);

            return (expression === "f");
        } else {
            return false;
        }
}       