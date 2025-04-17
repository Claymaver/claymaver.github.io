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
    const existingLightbox = document.getElementById('lightbox');
    if (existingLightbox) existingLightbox.remove();

    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'fixed inset-0 bg-black/95 z-50 hidden flex items-center justify-center';
    lightbox.innerHTML = `
        <button class="absolute top-4 right-4 text-white hover:text-theme-primary transition-colors text-2xl" id="closeLightbox">×</button>
        <button class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-theme-primary transition-colors text-2xl" id="prevImage">‹</button>
        <button class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-theme-primary transition-colors text-2xl" id="nextImage">›</button>
        <div class="relative max-w-[90vw] max-h-[90vh] space-y-4 text-center">
            <img id="lightboxImage" class="max-w-full max-h-[80vh] object-contain hidden mx-auto" src="" alt="">
            <video id="lightboxVideo" class="max-w-full max-h-[80vh] object-contain hidden mx-auto" controls autoplay muted>
                <source src="" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p id="lightboxCaption" class="text-theme-light text-sm"></p>
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
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    let currentIndex = 0;
    let mediaItems = [];

    if (project.image) {
        mediaItems.push({ url: project.image, caption: project.title, type: 'image' });
    }
    if (project.gallery) {
        mediaItems = [...mediaItems, ...project.gallery];
    }

    console.log('Combined media array:', mediaItems);

    function showMedia(index) {
        if (index >= 0 && index < mediaItems.length) {
            currentIndex = index;
            const media = mediaItems[index];

            lightboxImage.classList.add('hidden');
            lightboxVideo.classList.add('hidden');
            lightboxVideo.pause();

            lightboxCaption.textContent = media.caption || '';

            if (media.type === 'video') {
                lightboxVideo.querySelector('source').src = media.url;
                lightboxVideo.load();
                lightboxVideo.classList.remove('hidden');
                console.log('Showing video:', media.url, 'at index:', index);
            } else {
                lightboxImage.src = media.url;
                lightboxImage.alt = media.caption || '';
                lightboxImage.classList.remove('hidden');
                console.log('Showing image:', media.url, 'at index:', index);
            }
        }
    }

    function showLightbox(index) {
        showMedia(index);
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function hideLightbox() {
        lightbox.classList.add('hidden');
        lightboxVideo.pause();
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', hideLightbox);
    prevBtn.addEventListener('click', () => showMedia(currentIndex - 1));
    nextBtn.addEventListener('click', () => showMedia(currentIndex + 1));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) hideLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') hideLightbox();
            if (e.key === 'ArrowLeft') showMedia(currentIndex - 1);
            if (e.key === 'ArrowRight') showMedia(currentIndex + 1);
        }
    });

    // Swipe support (basic)
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        const swipeDistance = touchEndX - touchStartX;
        if (swipeDistance > 50) {
            showMedia(currentIndex - 1); // Swipe right
        } else if (swipeDistance < -50) {
            showMedia(currentIndex + 1); // Swipe left
        }
    }

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
                        ${project.gallery.map((media, index) => `
                            <div class="bg-theme-secondary/50 rounded-lg overflow-hidden border border-theme-primary/10">
                                ${media.type === 'video' ? `
                                    <video controls class="w-full h-64 object-cover cursor-pointer" data-media-index="${index + 1}">
                                        <source src="${media.url}" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                ` : `
                                    <img src="${media.url}" alt="${media.caption}" 
                                         class="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                         data-media-index="${index + 1}">
                                `}
                                ${media.caption ? `
                                    <div class="p-3 bg-theme-dark/80">
                                        <p class="text-sm text-theme-light/80">${media.caption}</p>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    
        // Add click handlers for all images and videos
        const allMedia = [...projectContent.querySelectorAll('img, video')];
        console.log('Found media items:', allMedia.length);
        allMedia.forEach((media) => {
            media.addEventListener('click', () => {
                const index = parseInt(media.getAttribute('data-media-index'));
                console.log('Media clicked:', index);
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