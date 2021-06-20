
const themeChangerBtns = document.querySelectorAll(".calculator__theme-btn");
const html = document.documentElement;
const warningMessageBox = document.querySelector(".calculator__warning-message");
const allButtons = document.querySelectorAll("button");
const digits = document.querySelectorAll(".calculator__operand-btn");
const notification = document.querySelector(".notification");

const dotBtn = document.querySelector(".calculator__dot-btn");

let operation = [];

let isAdded = false;

const currentOperatation = document.querySelector(".calculator__current-operator");
const currentOperand = document.querySelector(".calculator__current-operand");

const clearScreenBtns = {
    clearBtn: document.querySelector(".calculator__clear-btn"),
    backspaceBtn: document.querySelector(".calculator__erase-btn"),
}


const operators = {
    moduloBtn: document.querySelector(".calculator__modulo-btn"),
    mutliplyBtn: document.querySelector(".calculator__multiply-btn"),
    divideBtn: document.querySelector(".calculator__divide-btn"),
    addBtn: document.querySelector(".calculator__add-btn"),
    substractBtn: document.querySelector(".calculator__substract-btn"),
    equalBtn: document.querySelector(".calculator__calculate-btn"),
};


 
const disableAllOtherButtons = ()=>{
    allButtons.forEach(btn =>{
        btn.disabled = true;
    })
}
const enableAllOtherButtons = ()=>{
    allButtons.forEach(btn =>{
        btn.disabled = false;
    })
}
const resetResults = ()=>{
    currentOperand.textContent = "";
    currentOperatation.textContent = "";
    operation = [];
}
const isBothNumbersAreFloats = (num1, num2)=>{
    return !Number.isInteger(num1) && !Number.isInteger(num2);
}
const displayWarningMessage = (num1, message)=>{
    console.log(warningMessageBox, 'warning message');
    warningMessageBox.style = "transform: translate3d(0,0,0)";
    warningMessageBox.textContent = `${num1} ${message}`;
    disableAllOtherButtons();
    setTimeout(() => {
        warningMessageBox.style = "transform: translate3d(300%,0,0)";
        enableAllOtherButtons();
        resetResults();
    }, 4500);
        
}
const add = (num1, num2) => {
    if(isBothNumbersAreFloats(num1, num2)){
        return (num1 * 10 + num2 * 10) / 10;
    } else {
        return num1 + num2;
    }
};
const substract = (num1, num2) => {
    if(isBothNumbersAreFloats(num1, num2)){
        return (num1 * 10 - num2 * 10) / 10;
    } else {
        return num1 - num2;
    }
};
const divide = (num1, num2)=>{
    console.log(isBothNumbersAreFloats(num1, num2), num1, num2, num1*num2, (num1 * 10 * num2 * 10) / 10, 'hhhheeerre');
    if(num2 == 0){
        displayWarningMessage(num1, "can't be divied by 0");
        return 'INVALID';
    } else {
        return num1 / num2;
    }
}
const mutliply = (num1, num2) => num1 * num2;
const modulo = (num1, num2)=>{  
    if((num1 == 0 && num2 == 0) || num2 == 0){
        displayWarningMessage(num1, "can't be modulod by 0");
        return 'INVALID';
    } else {
        return num1 % num2;
    }
}
 
const operate = (operator, num1, num2)=>{
    num1 = Number(num1);
    num2 = Number(num2);
    let operationResult = 0;
    switch(operator){
        case "+":
            operationResult = add(num1, num2);
        break;
        case "-":
            operationResult = substract(num1, num2);
        break;
        case "*":
            operationResult = mutliply(num1, num2);
        break;
        case "/":
            operationResult = divide(num1, num2);
        break;
        case "%":
            operationResult = modulo(num1, num2);
        break;
    }
    return operationResult;
}
const removeActiveClass = ()=>{
    themeChangerBtns.forEach(btn =>{
        btn.classList.remove("active");
    })
}
const removeModeType = (el)=>{
    if(el.target.parentElement.classList.contains("calculator__day-mode")){
        html.classList.remove("night-mode");
    } else {
        html.classList.add("night-mode");
    }
}

const changeTheme = (e)=>{
    if(e.target.parentElement.classList.contains("active"))return;
    removeActiveClass();
    removeModeType(e);
    e.target.parentElement.classList.add("active");
}
const clearScreen = (e)=>{
    if(e.type === "keyup" && e.key === "c"){
        currentOperatation.textContent = "";
        currentOperand.textContent = "";
        operation = [];
    } else if(e.type === "click"){
        currentOperatation.textContent = "";
        currentOperand.textContent = "";
        operation = [];
    }
}
const removeLastCharacter = (str)=>{
    const newStr = str.split("");
    newStr.pop();
    return newStr.join("");
}
const eraseCurrentCharacter = (e)=>{
    if((e.type === "keyup" && e.key === "Backspace") || (e.type === "click" && e.target.dataset.erase === "x")){
        currentOperand.textContent = removeLastCharacter(currentOperand.textContent.trim());
        if(operation.length <= 1){
            operation[0] = removeLastCharacter(operation[0]);
        } else {
            operation[2] = removeLastCharacter(operation[2]);
        }
    }
}
const clearOperationArray = ()=>{
    operation = [];
}
const updateScreenWithOperationResult = (operationResult, operator)=>{
    currentOperatation.textContent = operationResult;
    currentOperand.textContent = operationResult;
    currentOperatation.textContent += operator;   
}
const updateOperationArray = (operator)=>{
    operation[0]= currentOperand.textContent.trim();
    operation[1] = operator; 
}
const addNumbers = (e)=>{
    if((e.type === "keyup" && e.key === "+") || (e.type === "click" && e.target.dataset.add === "+")){
        if(operation.length === 0){
            currentOperatation.textContent = "0 +";
            operation[0] = "0";
            operation[1] = "+";
        } else if(operation.length === 1 || operation.length === 2){
            currentOperatation.textContent = `${operation[0]} +`;
            operation[1] = "+";
        } else if(operation.length === 3){
            const operationResult  =  operate(operation[1], operation[0], operation[2]);
            updateScreenWithOperationResult(operationResult, "+");
            clearOperationArray(operation);
            updateOperationArray("+")
            isAdded = true;    
        }
    }
}
const trimCurrentOperand = ()=>{
  return  currentOperand.textContent.trim();
}
const updateOperand = (e)=>{
    if(currentOperand.textContent.trim().length >= 15)return;
    currentOperand.textContent += e.type === "keyup" ? e.key : e.target.dataset.operand;
}
const populateArray = (e)=>{   
    if(operation.length <= 1){
        const digit = e.type === "keyup" ? e.key : e.target.dataset.operand;
        /**
         *  If first character is 0 and second character is not dot don't do a thing
         *  else populate array
         * 
         * 
         */
        if(trimCurrentOperand()[0] == 0 && trimCurrentOperand()[1] != "."){
            currentOperand.textContent = "";
            operation[0] = "";
        }
         
         updateOperand(e);
         operation[0] = trimCurrentOperand();
        console.log('in heeere', operation)
        
    } else if(operation.length === 2){
        currentOperand.textContent = e.type === "keyup" ? e.key : e.target.dataset.operand; 
        operation[2] = trimCurrentOperand();
    } else if(isAdded){
         updateOperand(e);
         operation[2] = trimCurrentOperand();
         isAdded = false;
    } else {   
        //console.log(operation)
        updateOperand(e);
        operation[2] = trimCurrentOperand();
    }
}
const populateDigit = (e)=>{
    if(e.type === "keyup" && e.key.match(/[0-9]/) || (e.type === "click" && e.target.dataset.operand.match(/[0-9]/))){
        populateArray(e)
    }  
}
const substractNumbers = (e)=>{
    if((e.type === "keyup" && e.key === "-") || (e.type === "click" && e.target.dataset.substract === "-")){   
        if(operation.length === 0){
            currentOperatation.textContent = "0 -";
            operation[0] = "0";
            operation[1] = "-";
        } else if(operation.length === 1 || operation.length === 2){
            currentOperatation.textContent = `${operation[0]} -`;
            operation[1] = "-";
        } else if(operation.length === 3){
            const operationResult  =  operate(operation[1], operation[0], operation[2]);
            updateScreenWithOperationResult(operationResult, "-");
            clearOperationArray(operation);
            updateOperationArray("-") 
        }
    }
}
const divideNumbers = (e)=>{
    if((e.type === "keyup" && e.key === "/") || (e.type === "click" && e.target.dataset.divide === "/")){    
        if(operation.length === 0){
            currentOperatation.textContent = "0 /";
            operation[0] = "0";
            operation[1] = "/";
        } else if(operation.length === 1 || operation.length === 2){
            currentOperatation.textContent = `${operation[0]} /`;
            operation[1] = "/";
        } else if(operation.length === 3){
            const operationResult  =  operate(operation[1], operation[0], operation[2]);
            if(operationResult !== "INVALID"){
                updateScreenWithOperationResult(operationResult, "/");
                clearOperationArray();
                updateOperationArray("/") 
            }
        }
    }
}

const moduloNumbers = (e)=>{
    if((e.type === "keyup" && e.key === "%") || (e.type === "click" && e.target.dataset.modulo === "%")){   
        if(operation.length === 0){
            currentOperatation.textContent = "0 %";
            operation[0] = "0";
            operation[1] = "%";
        } else if(operation.length === 1 || operation.length === 2){
            currentOperatation.textContent = `${operation[0]} %`;
            operation[1] = "%";
        } else if(operation.length === 3){
            const operationResult  =  operate(operation[1], operation[0], operation[2]);
            if(operationResult !== "INVALID"){
                updateScreenWithOperationResult(operationResult, "%");
                clearOperationArray();
                updateOperationArray("%") 
            }       
        }
    }
}

const mutliplyNumbers = (e)=>{
    if((e.type === "keyup" && e.key === "*") || (e.type === "click" && e.target.dataset.multiply === "*")){   
        if(operation.length === 0){
            currentOperatation.textContent = "0 *";
            operation[0] = "0";
            operation[1] = "*";
        } else if(operation.length === 1 || operation.length === 2){
            currentOperatation.textContent = `${operation[0]} *`;
            operation[1] = "*";
        } else if(operation.length === 3){
            const operationResult  =  operate(operation[1], operation[0], operation[2]);
            updateScreenWithOperationResult(operationResult, '*');
            clearOperationArray();
            updateOperationArray("*") 
        }
    }
}
const calculate = (e)=>{     
    if((e.type === "keyup" && (e.key === "=" || e.key === "Enter")) || (e.type === "click" && e.target.dataset.calculate === "=")){
        if(operation.length !== 3){
            warningMessageBox.style = "transform:translate3d(0,0,0)";
            warningMessageBox.textContent = "You can't calculate with single operand and operator";
            disableAllOtherButtons();
            setTimeout(() => {
                warningMessageBox.style = "transform:translate3d(300%,0,0)";
                enableAllOtherButtons();
            }, 3000);
        } else if(operation.length){
            const operator = operation[1];
            const operationResult  =  operate(operation[1], operation[0], operation[2]);
            updateScreenWithOperationResult(operationResult, operator);
            clearOperationArray();
            updateOperationArray(operator);
        }
    }
}
const addFloatingPointNumbers = (e)=>{
    if((e.type === "keyup" && e.key === ".") || (e.type === "click" && e.target.dataset.dot === ".")){
        if(operation.length === 1){
            if(!operation[0].includes(".") && operation[0].match(/[0-9]/)) {
                currentOperand.textContent +=".";
                operation[0] = operation[0] + ".";
            }
        } else if(operation.length === 3){
            if(!operation[2].includes(".") && operation[2].match(/[0-9]/)) {
                currentOperand.textContent +=".";
                operation[2] = operation[2] + ".";
            }
        }
    } 
}
const removeNotification = ()=>{
    notification.style = "transform: translate3d(0,-300%,0)";
}
const notifyUser = ()=>{
    notification.style = "transform: translate3d(0,0,0)";
    const notificationCancelBtn = notification.querySelector(".notification__cancel");
    setTimeout(() => {
        notification.style = "transform: translate3d(0,-300%,0)";
    }, 4000);
    notificationCancelBtn.addEventListener("click", removeNotification);
}
themeChangerBtns.forEach(btn => btn.addEventListener("click", changeTheme));

clearScreenBtns.clearBtn.addEventListener("click", clearScreen);
window.addEventListener("keyup", clearScreen);

clearScreenBtns.backspaceBtn.addEventListener("click", eraseCurrentCharacter);
window.addEventListener("keyup", eraseCurrentCharacter);

operators.addBtn.addEventListener("click", addNumbers);
window.addEventListener("keyup", addNumbers);

operators.substractBtn.addEventListener("click", substractNumbers);
window.addEventListener("keyup", substractNumbers);

operators.divideBtn.addEventListener("click", divideNumbers);
window.addEventListener("keyup", divideNumbers);

operators.moduloBtn.addEventListener("click", moduloNumbers);
window.addEventListener("keyup", moduloNumbers);

operators.mutliplyBtn.addEventListener("click", mutliplyNumbers);
window.addEventListener("keyup", mutliplyNumbers);

operators.equalBtn.addEventListener("click", calculate);
window.addEventListener("keyup", calculate);

dotBtn.addEventListener("click", addFloatingPointNumbers);
window.addEventListener("keyup", addFloatingPointNumbers);

digits.forEach(digit => {
    digit.addEventListener("click", populateDigit);
    window.addEventListener("keyup", populateDigit);
})

window.addEventListener("DOMContentLoaded", notifyUser);


 