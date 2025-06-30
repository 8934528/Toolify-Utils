// ================= SESSION MANAGEMENT =================
const SESSION_EXPIRY_MINUTES = 30; // Session expires after 30 minutes of inactivity

// Generate a random session ID
function generateSessionId() {
    return 'sess/' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Initialize or validate session
function initSession() {
    const urlParams = new URLSearchParams(window.location.search);
    let sessionId = urlParams.get('session');

    // Check if session exists in sessionStorage
    const storedSession = sessionStorage.getItem('currentSession');

    if (storedSession) {
        const { id, expiry } = JSON.parse(storedSession);

        // Check if session expired
        if (new Date().getTime() > expiry) {
            // Session expired, create new one
            sessionId = generateSessionId();
            const newExpiry = new Date().getTime() + (SESSION_EXPIRY_MINUTES * 60 * 1000);
            sessionStorage.setItem('currentSession', JSON.stringify({
                id: sessionId,
                expiry: newExpiry
            }));

            // Redirect to include session ID
            if (!window.location.search.includes('session=')) {
                const newUrl = window.location.pathname + '?session=' + sessionId;
                window.history.replaceState({}, '', newUrl);
            }
        } else {
            // Valid session exists
            sessionId = id;

            // Ensure URL has session ID
            if (!window.location.search.includes('session=')) {
                const newUrl = window.location.pathname + '?session=' + sessionId;
                window.history.replaceState({}, '', newUrl);
            }
        }
    } else {
        // No session exists, create new one
        sessionId = generateSessionId();
        const expiry = new Date().getTime() + (SESSION_EXPIRY_MINUTES * 60 * 1000);
        sessionStorage.setItem('currentSession', JSON.stringify({
            id: sessionId,
            expiry: expiry
        }));

        // Redirect to include session ID
        if (!window.location.search.includes('session=')) {
            const newUrl = window.location.pathname + '?session=' + sessionId;
            window.history.replaceState({}, '', newUrl);
        }
    }

    return sessionId;
}

// Modify all internal links to include session ID
function modifyInternalLinks() {
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');

        // Skip if external link, mailto, tel, or already has session
        if (!href ||
            href.startsWith('http') ||
            href.startsWith('mailto') ||
            href.startsWith('tel') ||
            href.startsWith('#') ||
            href.includes('session=')) {
            return;
        }

        // Get current session ID
        const storedSession = sessionStorage.getItem('currentSession');
        if (!storedSession) return;

        const { id } = JSON.parse(storedSession);

        // Add session parameter
        if (href.includes('?')) {
            link.setAttribute('href', href + '&session=' + id);
        } else {
            link.setAttribute('href', href + '?session=' + id);
        }
    });
}
// ================= END SESSION MANAGEMENT =================

document.addEventListener('DOMContentLoaded', function () {

    // Initialize session
    initSession();

    // Modify all internal links
    modifyInternalLinks();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add shadow to navbar on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Animation for tool cards on scroll
    const animateOnScroll = function() {
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.classList.add('animate__fadeInUp');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Enhanced hover effects for tool cards
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    
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
});