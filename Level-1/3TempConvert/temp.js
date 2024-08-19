document.getElementById('convert-btn').addEventListener('click', function () {
    const temperature = parseFloat(document.getElementById('temperature').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    const resultDiv = document.getElementById('result');


    if (isNaN(temperature)) {
        resultDiv.textContent = "Please enter a valid number.";
        resultDiv.style.color = "red";
        return;
    }



    let convertedTemperature;



    if (fromUnit === 'celsius') {
        if (toUnit === 'fahrenheit') {
            convertedTemperature = (temperature * 9 / 5) + 32;
        } else if (toUnit === 'kelvin') {
            convertedTemperature = temperature + 273.15;
        } else {
            convertedTemperature = temperature;
        }
    } else if (fromUnit === 'fahrenheit') {
        if (toUnit === 'celsius') {
            convertedTemperature = (temperature - 32) * 5 / 9;
        } else if (toUnit === 'kelvin') {
            convertedTemperature = ((temperature - 32) * 5 / 9) + 273.15;
        } else {
            convertedTemperature = temperature;
        }
    } else if (fromUnit === 'kelvin') {
        if (toUnit === 'celsius') {
            convertedTemperature = temperature - 273.15;
        } else if (toUnit === 'fahrenheit') {
            convertedTemperature = ((temperature - 273.15) * 9 / 5) + 32;
        } else {
            convertedTemperature = temperature;
        }
    }



    resultDiv.textContent = `Converted Temperature: ${convertedTemperature.toFixed(2)}° ${toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}`;
    resultDiv.style.color = "black";
});
