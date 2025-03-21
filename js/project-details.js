// Function to get software icon path
function getSoftwareIcon(software) {
    switch(software.toLowerCase()) {
        case 'blender':
            return 'Assets/Icons/blender.png';
        case 'maya':
            return 'Assets/Icons/maya.png';
        case 'zbrush':
            return 'Assets/Icons/zbrush.png';
        case 'substance painter':
            return 'Assets/Icons/substance.png';
        case 'unreal engine':
            return 'Assets/Icons/unreal-engine.png';
        case 'unity':
            return 'Assets/Icons/unity.png';
        case 'photoshop':
            return 'Assets/Icons/photoshop.png';
        default:
            return 'Assets/Icons/tools.png';
    }
}

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to create lightbox
function createLightbox() {
    // Remove existing lightbox if it exists
    const existingLightbox = document.getElementById('lightbox');
    if (existingLightbox) {
        existingLightbox.remove();
    }

    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'fixed inset-0 bg-black/95 z-50 hidden flex items-center justify-center';
    lightbox.innerHTML = `
        <button class="absolute top-4 right-4 text-white hover:text-theme-primary transition-colors text-2xl" id="closeLightbox">
            ×
        </button>
        <button class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-theme-primary transition-colors text-2xl" id="prevImage">
            ‹
        </button>
        <button class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-theme-primary transition-colors text-2xl" id="nextImage">
            ›
        </button>
        <div class="relative max-w-[90vw] max-h-[90vh]">
            <img id="lightboxImage" class="max-w-full max-h-[90vh] object-contain" src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);
    return lightbox;
}

// Function to initialize lightbox
function initializeLightbox(project) {
    console.log('Initializing lightbox with project:', project);
    const lightbox = createLightbox();
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    let currentIndex = 0;
    let images = [];

    // Combine main image and gallery images
    if (project.image) {
        images.push({ url: project.image, caption: project.title });
    }
    if (project.gallery) {
        images = [...images, ...project.gallery];
    }

    console.log('Combined images array:', images);

    function showImage(index) {
        if (index >= 0 && index < images.length) {
            currentIndex = index;
            lightboxImage.src = images[index].url;
            lightboxImage.alt = images[index].caption || '';
            console.log('Showing image:', images[index].url, 'at index:', index);
        }
    }

    function showLightbox(index) {
        console.log('Showing lightbox at index:', index);
        showImage(index);
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function hideLightbox() {
        console.log('Hiding lightbox');
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Event listeners
    closeBtn.addEventListener('click', hideLightbox);
    prevBtn.addEventListener('click', () => {
        console.log('Previous button clicked');
        showImage(currentIndex - 1);
    });
    nextBtn.addEventListener('click', () => {
        console.log('Next button clicked');
        showImage(currentIndex + 1);
    });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) hideLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') hideLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        }
    });

    return { showLightbox };
}

// Function to load project details
async function loadProjectDetails() {
    try {
        const projectId = parseInt(getUrlParameter('id'));
        console.log('Loading project with ID:', projectId);
        
        if (!projectId) {
            console.error('No project ID provided');
            window.location.href = 'portfolio.html';
            return;
        }

        const response = await fetch('./js/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Loaded projects data:', data);
        
        const project = data.projects.find(p => p.id === projectId);
        console.log('Found project:', project);

        if (!project) {
            console.error('Project not found:', projectId);
            window.location.href = 'portfolio.html';
            return;
        }

        // Update page title
        document.title = `${project.title} | Clay MacDonald - 3D Artist`;

        // Render project content
        const projectContent = document.getElementById('projectContent');
        if (!projectContent) {
            console.error('Project content container not found');
            return;
        }

        // Initialize lightbox with the project data
        const lightboxInstance = initializeLightbox(project);

        projectContent.innerHTML = `
            <div class="grid lg:grid-cols-2 gap-8 mb-12">
                <!-- Main Project Image -->
                <div class="bg-theme-secondary/50 rounded-lg overflow-hidden border border-theme-primary/10">
                    <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" data-image-index="0">
                </div>

                <!-- Project Info -->
                <div class="space-y-6">
                    <div>
                        <h1 class="text-4xl font-bold mb-2">${project.title}</h1>
                        <p class="text-theme-primary">${project.category}</p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        ${project.tags.map(tag => `
                            <span class="text-sm px-3 py-1 bg-theme-primary/10 text-theme-primary rounded-full">
                                ${tag}
                            </span>
                        `).join('')}
                    </div>

                    <div class="prose prose-invert">
                        <p class="text-theme-light/80">${project.description}</p>
                    </div>

                    ${project.specifications ? `
                        <div class="space-y-4">
                            <h2 class="text-2xl font-bold text-theme-primary">Technical Specifications</h2>
                            <div class="grid grid-cols-2 gap-4">
                                ${Object.entries(project.specifications).map(([key, value]) => `
                                    <div class="bg-theme-secondary/30 p-4 rounded-lg border border-theme-primary/10">
                                        <h3 class="font-bold mb-2 capitalize">${key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                        <p class="text-theme-light/80">${value}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${project.details ? `
                        <div class="space-y-4">
                            <h2 class="text-2xl font-bold text-theme-primary">Project Details</h2>
                            ${project.details.map(detail => `
                                <div class="bg-theme-secondary/30 p-4 rounded-lg border border-theme-primary/10">
                                    <h3 class="font-bold mb-2">${detail.title}</h3>
                                    <p class="text-theme-light/80 whitespace-pre-line">${detail.content}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${project.software ? `
                        <div class="space-y-4">
                            <h2 class="text-2xl font-bold text-theme-primary">Software Used</h2>
                            <div class="flex flex-wrap gap-4">
                                ${project.software.map(software => `
                                    <div class="flex items-center gap-2 bg-theme-secondary/30 px-4 py-2 rounded-lg border border-theme-primary/10">
                                        <img src="${getSoftwareIcon(software)}" alt="${software}" class="w-6 h-6">
                                        <span class="text-theme-light/80">${software}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            ${project.gallery ? `
                <!-- Project Gallery -->
                <div class="space-y-6">
                    <h2 class="text-2xl font-bold text-theme-primary">Gallery</h2>
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${project.gallery.map((image, index) => `
                            <div class="bg-theme-secondary/50 rounded-lg overflow-hidden border border-theme-primary/10">
                                <img src="${image.url}" alt="${image.caption}" 
                                     class="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                     data-image-index="${index + 1}">
                                ${image.caption ? `
                                    <div class="p-3 bg-theme-dark/80">
                                        <p class="text-sm text-theme-light/80">${image.caption}</p>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;

        // Add click handlers for all images
        const allImages = [...projectContent.querySelectorAll('img')];
        console.log('Found images:', allImages.length);
        allImages.forEach((img) => {
            img.addEventListener('click', () => {
                const index = parseInt(img.getAttribute('data-image-index'));
                console.log('Image clicked:', index);
                lightboxInstance.showLightbox(index);
            });
        });

        // Initialize animations
        initializeAnimations();

    } catch (error) {
        console.error('Error loading project details:', error);
        window.location.href = 'portfolio.html';
    }
}

// Function to initialize GSAP animations
function initializeAnimations() {
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadProjectDetails); 