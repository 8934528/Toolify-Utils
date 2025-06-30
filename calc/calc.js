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

let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetInput = false;

function appendNumber(number) {
    if (shouldResetInput) {
        currentInput = '';
        shouldResetInput = false;
    }
    
    // Prevent multiple decimals
    if (number === '.' && currentInput.includes('.')) {
        return;
    }
    
    currentInput += number;
    updateDisplay();
}

function setOperator(op) {
    // Handle negative numbers
    if (currentInput === '' && op === '-') {
        currentInput = '-';
        updateDisplay();
        return;
    }
    
    if (currentInput === '') return;
    
    if (previousInput !== '') {
        calculateResult();
    }
    
    operator = op;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
}

function calculateResult() {
    if (operator && previousInput !== '') {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            default:
                return;
        }
        
        currentInput = result.toString();
        operator = '';
        previousInput = '';
        shouldResetInput = true;
        updateDisplay();
    }
}

function clearDisplay() {
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetInput = false;
    updateDisplay();
}

function updateDisplay() {
    const display = document.getElementById('display');
    
    // Show previous operation in small text
    if (operator && previousInput) {
        display.innerHTML = `
            <div style="font-size: 0.6em; opacity: 0.7;">${previousInput} ${operator}</div>
            <div>${currentInput || '0'}</div>
        `;
    } else {
        display.textContent = currentInput || '0';
    }
}

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (/[0-9.]/.test(e.key)) {
        appendNumber(e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        setOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculateResult();
    } else if (e.key === 'Escape') {
        clearDisplay();
    } else if (e.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') currentInput = '0';
        updateDisplay();
    }
});