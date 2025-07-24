// ================= SESSION VALIDATION =================
function validateSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    const storedSession = sessionStorage.getItem('currentSession');

    // If no session in URL or storage, redirect to home
    if (!sessionId || !storedSession) {
        window.location.href = '/';
        return false;
    }

    // Parse stored session
    const { id, expiry } = JSON.parse(storedSession);

    // Check if session matches and isn't expired
    if (sessionId !== id || new Date().getTime() > expiry) {
        sessionStorage.removeItem('currentSession');
        window.location.href = '/';
        return false;
    }

    return true;
}

function modifyInternalLinks() {
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');

        if (!href ||
            href.startsWith('http') ||
            href.startsWith('mailto') ||
            href.startsWith('tel') ||
            href.startsWith('#') ||
            href.includes('session=')) {
            return;
        }

        const storedSession = sessionStorage.getItem('currentSession');
        if (!storedSession) return;

        const { id } = JSON.parse(storedSession);

        if (href.includes('?')) {
            link.setAttribute('href', href + '&session=' + id);
        } else {
            link.setAttribute('href', href + '?session=' + id);
        }
    });
}
// ================= END SESSION VALIDATION =================

// Validate session on page load
if (!validateSession()) {
    // Redirect will happen automatically
} else {
    modifyInternalLinks();
}

// Calculator state
let currentInput = '0';
let previousInput = '';
let operation = null;
let resetInput = false;
let operationHistory = [];

// DOM Elements
const display = document.getElementById('display');
const historyItems = document.getElementById('historyItems');

// Initialize calculator
function initCalculator() {
    loadHistory();
    updateDisplay();
}

// Append to display
function appendToDisplay(number) {
    if (currentInput === '0' || resetInput) {
        currentInput = '';
        resetInput = false;
    }
    
    if (number === '.' && currentInput.includes('.')) return;
    
    currentInput += number;
    updateDisplay();
}

// Set operation
function setOperation(op) {
    if (currentInput === '') return;
    
    if (operation !== null) calculate();
    
    operation = op;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
}

// Calculate
function calculate() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = prev / current;
            break;
        default:
            return;
    }
    
    addToHistory(`${previousInput} ${operation} ${currentInput}`, computation.toString());
    
    currentInput = computation.toString();
    operation = null;
    previousInput = '';
    resetInput = true;
    updateDisplay();
}

// Calculate percentage
function calculatePercentage() {
    if (currentInput === '') return;
    
    const value = parseFloat(currentInput) / 100;
    currentInput = value.toString();
    updateDisplay();
}

// Clear display
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    updateDisplay();
}

// Backspace function
function backspace() {
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Update display
function updateDisplay() {
    display.textContent = currentInput;
}

// History functions
function addToHistory(expression, result) {
    const historyItem = {
        expression,
        result,
        timestamp: new Date().toLocaleTimeString()
    };
    
    operationHistory.unshift(historyItem);
    if (operationHistory.length > 10) operationHistory.pop();
    
    saveHistory();
    renderHistory();
}

function renderHistory() {
    historyItems.innerHTML = operationHistory.map(item => `
        <div class="history-item">
            <div>
                <span class="history-expression">${item.expression} =</span>
                <span class="history-result">${item.result}</span>
            </div>
            <div class="history-timestamp">${item.timestamp}</div>
        </div>
    `).join('');
}

function clearHistory() {
    operationHistory = [];
    saveHistory();
    renderHistory();
}

function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(operationHistory));
}

function loadHistory() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        operationHistory = JSON.parse(savedHistory);
        renderHistory();
    }
}

// Toggle history panel on mobile
function toggleHistory() {
    const historyPanel = document.querySelector('.history-panel');
    historyPanel.classList.toggle('active');
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (/[0-9.]/.test(e.key)) {
        appendToDisplay(e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        setOperation(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Escape') {
        clearDisplay();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === '%') {
        calculatePercentage();
    }
});

// Initialize calculator
document.addEventListener('DOMContentLoaded', initCalculator);