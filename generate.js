//@author: Sinelnikov
let createExpression = function () { 
    let type = Math.floor(Math.random() * 2); 
    let formula = generateFormula(); 
    
    if (type === 0) { 
        let symbol = formula[Math.floor(Math.random() * formula.length)] 
        formula = formula.replace(symbol, ""); 
    } 
    
    return formula; 
}


let generateFormula = function () {
    let arity = Math.floor(Math.random() * 2)+1;
    let formula = "(";
    if (arity === 1) {
        formula = formula.concat("!");
        formula = formula.concat(generateElement());
    }
    else if(arity === 2){
        formula = formula.concat(generateElement());
        let operatorType = Math.floor(Math.random() * GRAMMAR.bin_operation.length);
        formula = formula.concat(GRAMMAR.bin_operation[operatorType]).concat(generateElement());
    }
    formula = formula.concat(")");
    return formula;
};

let generateElement = function () {
    let type = Math.floor(Math.random() * 2);
    let element;
    if (type === 0) {
        element = generateFormula();
    }
    else {
        element = generateAtomicElement();
    }
    return element;
};


let generateAtomicElement = function () {
    let constant = Math.floor(Math.random() * 2);
    let index;
    if (constant === 0) {
        index = Math.floor(Math.random() * GRAMMAR.const.length);
        return GRAMMAR.const[index];
    }
    else {
        index = Math.floor(Math.random() * GRAMMAR.symbol.length);
        return GRAMMAR.symbol[index];
    }
};