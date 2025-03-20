// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to load project details
async function loadProjectDetails() {
    try {
        const projectId = getUrlParameter('id');
        if (!projectId) {
            window.location.href = 'portfolio.html';
            return;
        }

        const response = await fetch('./js/projects.json');
        const data = await response.json();
        const project = data.projects.find(p => p.id === projectId);

        if (!project) {
            window.location.href = 'portfolio.html';
            return;
        }

        // Update page title
        document.title = `${project.title} - Clay MacDonald`;

        // Render project content
        const projectContent = document.getElementById('projectContent');
        projectContent.innerHTML = `
            <div class="grid lg:grid-cols-2 gap-8 mb-12">
                <!-- Main Project Image -->
                <div class="bg-theme-secondary/50 rounded-lg overflow-hidden border border-theme-primary/10">
                    <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover">
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

                    ${project.details ? `
                        <div class="space-y-4">
                            <h2 class="text-2xl font-bold text-theme-primary">Project Details</h2>
                            ${project.details.map(detail => `
                                <div class="bg-theme-secondary/30 p-4 rounded-lg border border-theme-primary/10">
                                    <h3 class="font-bold mb-2">${detail.title}</h3>
                                    <p class="text-theme-light/80">${detail.content}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>

            ${project.gallery ? `
                <!-- Project Gallery -->
                <div class="space-y-6">
                    <h2 class="text-2xl font-bold text-theme-primary">Gallery</h2>
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${project.gallery.map(image => `
                            <div class="bg-theme-secondary/50 rounded-lg overflow-hidden border border-theme-primary/10">
                                <img src="${image.url}" alt="${image.caption}" class="w-full h-64 object-cover">
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

        // Initialize animations
        initializeAnimations();

    } catch (error) {
        console.error('Error loading project details:', error);
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