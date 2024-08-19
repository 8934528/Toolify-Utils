let currentInput = '';
let operator = '';
let previousInput = '';

function appendNumber(number) {
    currentInput += number;
    updateDisplay();
}

function setOperator(op) {
    if (currentInput === '' && op === '-') {
        currentInput = '-';
    } else if (currentInput !== '') {
        operator = op;
        previousInput = currentInput;
        currentInput = '';
    }
    updateDisplay();
}

function calculateResult() {
    if (operator && previousInput !== '') {
        const result = eval(`${previousInput} ${operator} ${currentInput}`);
        currentInput = result.toString();
        operator = '';
        previousInput = '';
        updateDisplay();
    }
}

function clearDisplay() {
    currentInput = '';
    operator = '';
    previousInput = '';
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('display').innerText = currentInput || '0';
}
