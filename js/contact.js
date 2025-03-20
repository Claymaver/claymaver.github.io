// Initialize EmailJS
emailjs.init('qzaJuHMnuxHKdAReO');

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const formStatus = document.getElementById('formStatus');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        submitButton.disabled = true;
        buttonText.textContent = 'Sending...';
        loadingSpinner.classList.remove('opacity-0', 'invisible');
        formStatus.classList.add('hidden');
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');

        try {
            // Send email using form data
            const response = await emailjs.sendForm(
                'service_moasx19', 
                'template_2xgwahu', 
                form
            );
            
            console.log('EmailJS Response:', response);
            formStatus.classList.remove('hidden');
            successMessage.classList.remove('hidden');
            form.reset();
        } catch (error) {
            console.error('EmailJS error details:', error);
            formStatus.classList.remove('hidden');
            errorMessage.textContent = 'Error sending message: ' + (error.text || error.message || 'Unknown error');
            errorMessage.classList.remove('hidden');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            buttonText.textContent = 'Send Message';
            loadingSpinner.classList.add('opacity-0', 'invisible');
        }
    });
}); 