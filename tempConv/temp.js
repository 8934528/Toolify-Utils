// ================= SESSION VALIDATION =================
function validateSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    const storedSession = sessionStorage.getItem('currentSession');

    if (!sessionId || !storedSession) {
        window.location.href = '/';
        return false;
    }

    const { id, expiry } = JSON.parse(storedSession);

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
        if (!href || href.startsWith('http') || href.startsWith('mailto') || 
            href.startsWith('tel') || href.startsWith('#') || href.includes('session=')) {
            return;
        }

        const storedSession = sessionStorage.getItem('currentSession');
        if (!storedSession) return;

        const { id } = JSON.parse(storedSession);
        link.setAttribute('href', href.includes('?') ? `${href}&session=${id}` : `${href}?session=${id}`);
    });
}

// Validate session on page load
if (!validateSession()) {
    // Redirect will happen automatically
} else {
    modifyInternalLinks();
}
// ================= END SESSION VALIDATION =================

// Initialize Toast
const toastEl = document.getElementById('liveToast');
const toast = new bootstrap.Toast(toastEl);

function showToast(title, message, type = 'info') {
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Remove previous color classes
    toastEl.querySelector('.toast-header').classList.remove(
        'bg-primary', 'bg-success', 'bg-warning', 'bg-danger'
    );
    
    // Add appropriate color class
    switch(type) {
        case 'success':
            toastEl.querySelector('.toast-header').classList.add('bg-success');
            break;
        case 'warning':
            toastEl.querySelector('.toast-header').classList.add('bg-warning');
            break;
        case 'error':
            toastEl.querySelector('.toast-header').classList.add('bg-danger');
            break;
        default:
            toastEl.querySelector('.toast-header').classList.add('bg-primary');
    }
    
    toast.show();
}

// Temperature Converter Logic
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const temperatureInput = document.getElementById('temperature');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const convertBtn = document.getElementById('convert-btn');
    const resultValue = document.getElementById('result-value');
    const resultDetails = document.getElementById('result-details');
    const resultBox = document.getElementById('result');
    const fromUnitPreview = document.getElementById('from-unit-preview');
    const historyModal = new bootstrap.Modal(document.getElementById('historyModal'));
    
    // Conversion History
    let conversionHistory = JSON.parse(localStorage.getItem('tempConversionHistory')) || [];
    
    // Update unit preview when from unit changes
    fromUnitSelect.addEventListener('change', updateUnitPreview);
    
    // Convert on button click
    convertBtn.addEventListener('click', convertTemperature);
    
    // Convert on Enter key press
    temperatureInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') convertTemperature();
    });
    
    // Initial setup
    updateUnitPreview();
    
    function updateUnitPreview() {
        const selectedOption = fromUnitSelect.options[fromUnitSelect.selectedIndex].text;
        const unitSymbol = selectedOption.match(/\(([^)]+)\)/)[1];
        fromUnitPreview.textContent = unitSymbol;
    }
    
    function swapUnits() {
        const temp = fromUnitSelect.value;
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = temp;
        updateUnitPreview();
        
        if (resultValue.textContent !== '-') {
            convertTemperature();
        }
    }
    
    function convertTemperature() {
        const temperature = parseFloat(temperatureInput.value);
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        
        // Validate input
        if (isNaN(temperature)) {
            showError("Please enter a valid number");
            showToast('Error', 'Please enter a valid temperature value', 'error');
            return;
        }
        
        // Perform conversion
        let convertedTemp;
        let fromSymbol, toSymbol;
        
        // Get unit symbols
        fromSymbol = fromUnitSelect.options[fromUnitSelect.selectedIndex].text.match(/\(([^)]+)\)/)[1];
        toSymbol = toUnitSelect.options[toUnitSelect.selectedIndex].text.match(/\(([^)]+)\)/)[1];
        
        // Celsius conversions
        if (fromUnit === 'celsius') {
            if (toUnit === 'fahrenheit') {
                convertedTemp = (temperature * 9/5) + 32;
            } else if (toUnit === 'kelvin') {
                convertedTemp = temperature + 273.15;
            } else {
                convertedTemp = temperature;
            }
        } 
        // Fahrenheit conversions
        else if (fromUnit === 'fahrenheit') {
            if (toUnit === 'celsius') {
                convertedTemp = (temperature - 32) * 5/9;
            } else if (toUnit === 'kelvin') {
                convertedTemp = ((temperature - 32) * 5/9) + 273.15;
            } else {
                convertedTemp = temperature;
            }
        } 
        // Kelvin conversions
        else if (fromUnit === 'kelvin') {
            if (toUnit === 'celsius') {
                convertedTemp = temperature - 273.15;
            } else if (toUnit === 'fahrenheit') {
                convertedTemp = ((temperature - 273.15) * 9/5) + 32;
            } else {
                convertedTemp = temperature;
            }
        }
        
        // Display result
        showResult(temperature, fromSymbol, convertedTemp, toSymbol);
        
        // Add to history
        addToHistory(temperature, fromSymbol, convertedTemp, toSymbol);
        
        // Show success toast
        showToast('Conversion Complete', 
                 `Converted ${temperature}${fromSymbol} to ${convertedTemp.toFixed(2)}${toSymbol}`, 
                 'success');
    }
    
    function showResult(inputTemp, inputUnit, resultTemp, resultUnit) {
        resultBox.classList.remove('error-box');
        resultValue.innerHTML = `${resultTemp.toFixed(2)} <span class="text-primary">${resultUnit}</span>`;
        resultDetails.innerHTML = `
            ${inputTemp}${inputUnit} = ${resultTemp.toFixed(2)}${resultUnit}
        `;
        
        // Add animation
        resultBox.classList.remove('pulse-animation');
        void resultBox.offsetWidth; // Trigger reflow
        resultBox.classList.add('pulse-animation');
    }
    
    function showError(message) {
        resultBox.classList.add('error-box');
        resultValue.textContent = message;
        resultDetails.textContent = '';
        
        // Add animation
        resultBox.classList.remove('shake-animation');
        void resultBox.offsetWidth; // Trigger reflow
        resultBox.classList.add('shake-animation');
    }
    
    function addToHistory(inputTemp, inputUnit, resultTemp, resultUnit) {
        const historyItem = {
            fromValue: inputTemp,
            fromUnit: inputUnit,
            toValue: resultTemp,
            toUnit: resultUnit,
            timestamp: new Date().toLocaleString()
        };
        
        conversionHistory.unshift(historyItem);
        if (conversionHistory.length > 10) conversionHistory.pop();
        
        localStorage.setItem('tempConversionHistory', JSON.stringify(conversionHistory));
    }
    
    function showHistory() {
        const historyItemsEl = document.getElementById('historyItems');
        historyItemsEl.innerHTML = '';
        
        if (conversionHistory.length === 0) {
            historyItemsEl.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">No conversion history yet</td>
                </tr>
            `;
            historyModal.show();
            return;
        }
        
        conversionHistory.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.fromValue} ${item.fromUnit}</td>
                <td>${item.toValue.toFixed(2)} ${item.toUnit}</td>
                <td>${item.timestamp}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="useHistoryItem(${index})">
                        <i class="fi fi-rr-redo"></i> Use
                    </button>
                </td>
            `;
            historyItemsEl.appendChild(row);
        });
        
        historyModal.show();
    }
    
    function useHistoryItem(index) {
        const item = conversionHistory[index];
        temperatureInput.value = item.fromValue;
        
        // Set the from unit
        Array.from(fromUnitSelect.options).forEach(option => {
            if (option.text.includes(item.fromUnit)) {
                fromUnitSelect.value = option.value;
            }
        });
        
        // Set the to unit
        Array.from(toUnitSelect.options).forEach(option => {
            if (option.text.includes(item.toUnit)) {
                toUnitSelect.value = option.value;
            }
        });
        
        updateUnitPreview();
        convertTemperature();
        historyModal.hide();
        
        showToast('History Loaded', 'Previous conversion loaded successfully');
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear all conversion history?')) {
            conversionHistory = [];
            localStorage.removeItem('tempConversionHistory');
            document.getElementById('historyItems').innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">No conversion history yet</td>
                </tr>
            `;
            showToast('History Cleared', 'All conversion history has been cleared', 'success');
        }
    }
    
    // Make functions available globally
    window.swapUnits = swapUnits;
    window.showHistory = showHistory;
    window.clearHistory = clearHistory;
    window.useHistoryItem = useHistoryItem;
});