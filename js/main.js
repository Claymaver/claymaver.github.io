document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Navigation highlight
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('text-theme-primary');
            }
        });
    }

    // Animate elements on scroll
    function initScrollAnimations() {
        // Fade in elements with data-animate attribute
        gsap.utils.toArray('[data-animate]').forEach(element => {
            gsap.from(element, {
                opacity: 0,
                y: 30,
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    // Portfolio filtering
    const portfolioFilters = document.querySelectorAll('[data-filter]');
    const portfolioItems = document.querySelectorAll('[data-category]');

    if (portfolioFilters.length > 0) {
        portfolioFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.dataset.filter;
                
                portfolioItems.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });

                // Update active filter
                portfolioFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
            });
        });
    }

    // Initialize everything
    highlightCurrentPage();
    initScrollAnimations();

    // Loading States
    function showLoading(element) {
        element.classList.add('loading');
    }

    function hideLoading(element) {
        element.classList.remove('loading');
    }

    // Back to Top Button
    function createBackToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
        `;
        button.className = 'fixed bottom-8 right-8 bg-theme-primary text-theme-dark p-3 rounded-full shadow-lg opacity-0 transition-opacity duration-300 z-50 hover:bg-theme-accent';
        button.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                button.classList.remove('opacity-0');
            } else {
                button.classList.add('opacity-0');
            }
        });

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initialize back to top button
    createBackToTopButton();

    // Add loading states to portfolio grid
    const portfolioGrid = document.getElementById('projectsGrid');
    if (portfolioGrid) {
        showLoading(portfolioGrid);
        // Your existing portfolio loading code here
        // After loading is complete:
        // hideLoading(portfolioGrid);
    }

    // Add loading state to contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
            `;
            submitButton.disabled = true;

            try {
                // Your form submission code here
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
                // Show success message
                alert('Message sent successfully!');
                contactForm.reset();
            } catch (error) {
                // Show error message
                alert('Failed to send message. Please try again.');
            } finally {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
});