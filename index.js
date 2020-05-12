//@author: Klimenkov
let formula = '';

window.addEventListener('load',()=>{
    let 
        nextBtn = getId('nex-btn'),
        checkBtn = getId('to-check');
    let formulaInput = getId('formula');
    let inputs = document.getElementsByTagName('input');
    let testResult = {
        isFormula: getId('isFormula-answer'),
        isGeneral: getId('isGeneral-answer'),
    }

    formula = generateFormula("");
    formulaInput.value = formula;


    formulaInput.addEventListener('keydown', () => {
        operandArr = [];
        operatorArr = [];
        resultArr = [];
        table =[];
    })


    checkBtn.addEventListener('click', ()=>{
        operandArr = [];
        operatorArr = [];
        resultArr = [];
        table =[];
        for(let i =0, len = inputs.length; i < len;i++){
            if(inputs[i].checked === true){
                inputs[i].value == ''+checking(inputs[i].name, formulaInput.value) 
                    ? (testResult[inputs[i].name].innerHTML = '✓', 
                        testResult[inputs[i].name].classList.add('correct'),
                        testResult[inputs[i].name].classList.remove('wrong') )
                    : (testResult[inputs[i].name].innerHTML = '×', 
                        testResult[inputs[i].name].classList.add('wrong'),
                        testResult[inputs[i].name].classList.remove('correct') );
            }
        }
    });

    nextBtn.addEventListener('click', ()=>{

        for (let input in testResult){
            console.log(input)
            testResult[input].innerHTML = "";
        }

        formula = createExpression(); 
        formulaInput.value = formula;

        for(let i =0, len = inputs.length; i < len;i++){
            inputs[i].checked = false;
        }
    });

})

function getId(id){
    return document.getElementById(id);
}

function checking(name, value){
    switch(name){
        case 'isFormula':
            return checkSDNF(value);
        case 'isGeneral':
            return checkIsNeutral(value);
    }
}