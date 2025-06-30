document.addEventListener('DOMContentLoaded', function() {
    // Set the date we're counting down to (3 days from now)
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 3);
    
    // Update the countdown every 1 second
    const countdownFunction = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the countdown date
        const distance = countDownDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        document.getElementById("days").textContent = days.toString().padStart(2, '0');
        document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
        
        // If the countdown is finished
        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
            document.querySelector(".progress-text").textContent = "Update completed! Refresh the page";
            document.querySelector(".progress-bar").style.width = "100%";
        }
    }, 1000);
    
    // Animate progress bar
    const progressBar = document.querySelector('.progress-bar');
    let width = 75;
    const progressInterval = setInterval(function() {
        if (width >= 100) {
            clearInterval(progressInterval);
        } else {
            width += 0.5;
            progressBar.style.width = width + '%';
            document.querySelector('.progress-text').textContent = `Update in progress (${Math.min(100, Math.floor(width))}%)`;
        }
    }, 3000);
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
    
    // Add animation to social icons on hover
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});