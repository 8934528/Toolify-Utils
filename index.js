// Smooth hover effects
document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
    });
});