// Page Transition Functions
function initPageTransitions() {
    // Add transition overlay to the body if it doesn't exist
    if (!document.getElementById('page-transition')) {
        const overlay = document.createElement('div');
        overlay.id = 'page-transition';
        
        // Create 5 slide elements
        for (let i = 0; i < 5; i++) {
            const slide = document.createElement('div');
            slide.className = 'transition-slide';
            overlay.appendChild(slide);
        }
        
        document.body.appendChild(overlay);
    }

    // Handle all internal links
    document.querySelectorAll('a[href], .project-link').forEach(link => {
        // Only handle internal links
        if (link.href && (link.href.startsWith(window.location.origin) || link.href.startsWith('/') || link.href.includes('.html'))) {
            link.addEventListener('click', handleLinkClick);
        }
    });
}

// Function to handle link clicks
function handleLinkClick(e) {
    e.preventDefault();
    const href = this.href;
    
    // Start transition animation
    const slides = document.querySelectorAll('.transition-slide');
    slides.forEach((slide, index) => {
        gsap.to(slide, {
            scaleY: 1,
            duration: 0.5,
            delay: index * 0.1,
            ease: 'power2.inOut'
        });
    });

    // Navigate after animation
    setTimeout(() => {
        window.location.href = href;
    }, 1000);
}

// Handle page load transition
function handlePageLoad() {
    const slides = document.querySelectorAll('.transition-slide');
    
    // Set initial state
    gsap.set(slides, {
        scaleY: 1
    });

    // Create timeline for transition
    const tl = gsap.timeline();

    // Animate each slide with a slight delay
    slides.forEach((slide, i) => {
        tl.to(slide, {
            scaleY: 0,
            duration: 0.3,
            ease: "power2.inOut"
        }, i * 0.05);
    });
}

// Re-initialize transitions when new content is loaded dynamically
function reinitializeTransitions() {
    initPageTransitions();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    handlePageLoad();
});

// Export for use in other files
window.reinitializeTransitions = reinitializeTransitions; 