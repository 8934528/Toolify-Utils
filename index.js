// ================= SESSION MANAGEMENT =================
const SESSION_EXPIRY_MINUTES = 30; // Session expires after 30 minutes of inactivity

// Generate a random session ID
function generateSessionId() {
    return 'sess-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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

            // Update URL with new session ID if needed
            if (!window.location.search.includes('session=')) {
                const newUrl = window.location.pathname + '?session=' + sessionId;
                window.history.replaceState({}, '', newUrl);
            }
        } else {
            // Valid session exists
            sessionId = id;

            // Ensure URL has session ID if it's missing
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

        // Update URL with new session ID
        const newUrl = window.location.pathname + '?session=' + sessionId;
        window.history.replaceState({}, '', newUrl);
    }

    return sessionId;
}

// Modify all internal links to include session ID
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
// ================= END SESSION MANAGEMENT =================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize session
    initSession();

    // Modify all internal links
    modifyInternalLinks();

    // Rest of your existing code...
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize toast
    const toastEl = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });

    // Show sample toast (can be removed or used for actual notifications)
    function showToast(title, message, type = 'info') {
        document.getElementById('toast-title').textContent = title;
        document.getElementById('toast-message').textContent = message;
        toast.show();
    }

    // Update stats (simulated - replace with real data in a real application)
    function updateStats() {
        // Simulate changing values
        const memory = Math.min(100, Math.max(0, 65 + Math.floor(Math.random() * 10 - 5)));
        const cpu = Math.min(100, Math.max(0, 42 + Math.floor(Math.random() * 10 - 5)));
        const storage = Math.min(100, Math.max(0, 78 + Math.floor(Math.random() * 5 - 2)));

        document.querySelectorAll('.stat-value')[0].textContent = memory + '%';
        document.querySelectorAll('.progress-bar')[0].style.width = memory + '%';
        document.querySelectorAll('.stat-value')[1].textContent = cpu + '%';
        document.querySelectorAll('.progress-bar')[1].style.width = cpu + '%';
        document.querySelectorAll('.stat-value')[2].textContent = storage + '%';
        document.querySelectorAll('.progress-bar')[2].style.width = storage + '%';
    }

    // Update stats every 5 seconds (simulation)
    setInterval(updateStats, 5000);

    // Refresh button functionality
    document.querySelector('.btn-outline-primary').addEventListener('click', function () {
        updateStats();
        showToast('System', 'Data refreshed successfully');
    });

    // Settings button functionality
    document.querySelector('.btn-outline-secondary').addEventListener('click', function () {
        showToast('Settings', 'Settings panel will open here');
    });

    // Animation for tool cards on scroll
    const animateOnScroll = function () {
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

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('ServiceWorker registration successful');
                })
                .catch((err) => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});