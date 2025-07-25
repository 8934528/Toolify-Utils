// ================= SESSION VALIDATION =================
function validateSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    const storedSession = sessionStorage.getItem('currentSession');

    if (!sessionId || !storedSession) {
        window.location.href = '../index.html';
        return false;
    }

    const { id, expiry } = JSON.parse(storedSession);

    if (sessionId !== id || new Date().getTime() > expiry) {
        sessionStorage.removeItem('currentSession');
        window.location.href = '../index.html';
        return false;
    }

    return true;
}

function modifyInternalLinks() {
    const storedSession = sessionStorage.getItem('currentSession');
    if (!storedSession) return;

    const { id } = JSON.parse(storedSession);

    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');

        // Skip if external link, mailto, tel, or already has session
        if (!href || href.startsWith('http') || href.startsWith('mailto') ||
            href.startsWith('tel') || href.startsWith('#') || href.includes('session=')) {
            return;
        }

        // Add session parameter
        const separator = href.includes('?') ? '&' : '?';
        link.setAttribute('href', `${href}${separator}session=${id}`);
    });
}

// Validate session on page load
document.addEventListener('DOMContentLoaded', function () {
    if (!validateSession()) return;
    modifyInternalLinks();



    // Toast and Modal Elements
    const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));

    // Show toast notification
    function showToast(title, message, type = 'info') {
        const toastTitle = document.getElementById('toast-title');
        const toastMessage = document.getElementById('toast-message');

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        // Set toast color based on type
        const toastHeader = document.querySelector('.toast-header');
        switch (type) {
            case 'success':
                toastHeader.style.backgroundColor = 'var(--success)';
                break;
            case 'warning':
                toastHeader.style.backgroundColor = 'var(--warning)';
                break;
            case 'error':
                toastHeader.style.backgroundColor = 'var(--danger)';
                break;
            default:
                toastHeader.style.backgroundColor = 'var(--primary)';
        }

        liveToast.show();
    }

    // Confirm action with modal
    function confirmAction(title, message, actionCallback) {
        const modalTitle = document.getElementById('confirmModalTitle');
        const modalBody = document.getElementById('confirmModalBody');
        const modalAction = document.getElementById('confirmModalAction');

        modalTitle.textContent = title;
        modalBody.textContent = message;

        modalAction.onclick = function () {
            actionCallback();
            confirmModal.hide();
        };

        confirmModal.show();
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
        showToast('Welcome', 'Calculator is ready to use!', 'success');
    }

    // Append to display
    function appendToDisplay(number) {
        if (currentInput === '0' || resetInput) {
            currentInput = '';
            resetInput = false;
        }

        if (number === '.' && currentInput.includes('.')) {
            showToast('Invalid Input', 'Decimal point already exists', 'warning');
            return;
        }

        currentInput += number;
        updateDisplay();
    }

    // Set operation
    function setOperation(op) {
        if (currentInput === '') {
            showToast('Invalid Operation', 'Please enter a number first', 'warning');
            return;
        }

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

        if (isNaN(prev)) {
            showToast('Calculation Error', 'First number is invalid', 'error');
            return;
        }

        if (isNaN(current)) {
            showToast('Calculation Error', 'Second number is invalid', 'error');
            return;
        }

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
                if (current === 0) {
                    showToast('Math Error', 'Cannot divide by zero', 'error');
                    currentInput = 'Error';
                    updateDisplay();
                    setTimeout(() => {
                        clearDisplay();
                    }, 1000);
                    return;
                }
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
        if (currentInput === '') {
            showToast('Invalid Operation', 'Please enter a number first', 'warning');
            return;
        }

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

    function confirmClearHistory() {
        confirmAction(
            'Clear History',
            'Are you sure you want to clear all calculation history? This action cannot be undone.',
            clearHistory
        );
    }

    function clearHistory() {
        operationHistory = [];
        saveHistory();
        renderHistory();
        showToast('History Cleared', 'All calculation history has been removed', 'success');
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

});
// ================= END SESSION VALIDATION =================