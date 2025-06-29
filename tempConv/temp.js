document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const temperatureInput = document.getElementById('temperature');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const convertBtn = document.getElementById('convert-btn');
    const resultValue = document.getElementById('result-value');
    const resultBox = document.getElementById('result');
    const fromUnitPreview = document.getElementById('from-unit-preview');
    
    // Update unit preview when from unit changes
    fromUnitSelect.addEventListener('change', updateUnitPreview);
    
    // Convert on button click
    convertBtn.addEventListener('click', convertTemperature);
    
    // Convert on Enter key press
    temperatureInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertTemperature();
        }
    });
    
    // Initial setup
    updateUnitPreview();
    
    function updateUnitPreview() {
        const selectedOption = fromUnitSelect.options[fromUnitSelect.selectedIndex].text;
        // Extract unit symbol (content in parentheses)
        const unitSymbol = selectedOption.match(/\(([^)]+)\)/)[1];
        fromUnitPreview.textContent = unitSymbol;
    }
    
    function convertTemperature() {
        const temperature = parseFloat(temperatureInput.value);
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        
        // Validate input
        if (isNaN(temperature)) {
            showError("Please enter a valid number");
            return;
        }
        
        // Perform conversion
        let convertedTemp;
        let convertedUnit;
        
        // Celsius conversions
        if (fromUnit === 'celsius') {
            if (toUnit === 'fahrenheit') {
                convertedTemp = (temperature * 9/5) + 32;
                convertedUnit = "°F";
            } else if (toUnit === 'kelvin') {
                convertedTemp = temperature + 273.15;
                convertedUnit = "K";
            } else {
                convertedTemp = temperature;
                convertedUnit = "°C";
            }
        } 
        // Fahrenheit conversions
        else if (fromUnit === 'fahrenheit') {
            if (toUnit === 'celsius') {
                convertedTemp = (temperature - 32) * 5/9;
                convertedUnit = "°C";
            } else if (toUnit === 'kelvin') {
                convertedTemp = ((temperature - 32) * 5/9) + 273.15;
                convertedUnit = "K";
            } else {
                convertedTemp = temperature;
                convertedUnit = "°F";
            }
        } 
        // Kelvin conversions
        else if (fromUnit === 'kelvin') {
            if (toUnit === 'celsius') {
                convertedTemp = temperature - 273.15;
                convertedUnit = "°C";
            } else if (toUnit === 'fahrenheit') {
                convertedTemp = ((temperature - 273.15) * 9/5) + 32;
                convertedUnit = "°F";
            } else {
                convertedTemp = temperature;
                convertedUnit = "K";
            }
        }
        
        // Display result
        showResult(convertedTemp, convertedUnit);
    }
    
    function showResult(temp, unit) {
        resultBox.classList.remove('error');
        resultValue.innerHTML = `${temp.toFixed(2)} <span class="unit">${unit}</span>`;
        
        // Add animation
        resultBox.style.animation = 'none';
        void resultBox.offsetWidth; // Trigger reflow
        resultBox.style.animation = 'pulse 0.5s ease';
    }
    
    function showError(message) {
        resultBox.classList.add('error');
        resultValue.textContent = message;
        
        // Add animation
        resultBox.style.animation = 'none';
        void resultBox.offsetWidth; // Trigger reflow
        resultBox.style.animation = 'shake 0.5s ease';
    }
    
    // Add animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});