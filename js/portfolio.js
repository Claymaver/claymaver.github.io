let currentCategory = 'all';
let projects = [];
let categories = [];

// Function to fetch projects data
async function fetchProjects() {
    const portfolioGrid = document.getElementById('projectsGrid');
    if (portfolioGrid) {
        // Only add loading class if it's not already there
        if (!portfolioGrid.classList.contains('loading')) {
            portfolioGrid.classList.add('loading');
        }
    }
    
    try {
        const response = await fetch('./js/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        projects = data.projects;
        categories = data.categories;
        renderCategories();
        filterProjects(currentCategory);
    } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback to static data if fetch fails
        projects = [
            {
                id: 1,
                title: "Sci-Fi Character",
                description: "A detailed sci-fi character model with advanced materials and textures",
                image: "Assets/Projects/Project1.jpg",
                category: "Characters",
                featured: true,
                software: ["Blender", "Substance Painter", "ZBrush"],
                tags: ["Character", "Sci-Fi", "Hard Surface"]
            },
            {
                id: 2,
                title: "Fantasy Environment",
                description: "An immersive fantasy environment with dynamic lighting",
                image: "Assets/Projects/Project2.jpg",
                category: "Environments",
                featured: false,
                software: ["Blender", "Unreal Engine", "Substance Painter"],
                tags: ["Environment", "Fantasy", "Lighting"]
            },
            {
                id: 3,
                title: "Prop Collection",
                description: "A collection of detailed props for game environments",
                image: "Assets/Projects/Project3.jpg",
                category: "Props",
                featured: false,
                software: ["Maya", "Substance Painter", "Unity"],
                tags: ["Props", "Game Assets", "Collection"]
            },
            {
                id: 4,
                title: "Creature Design",
                description: "An original creature design with detailed anatomy",
                image: "Assets/Projects/Project4.jpg",
                category: "Characters",
                featured: true,
                software: ["ZBrush", "Maya", "Substance Painter"],
                tags: ["Creature", "Anatomy", "Design"]
            },
            {
                id: 5,
                title: "Urban Scene",
                description: "A detailed urban environment with modern architecture",
                image: "Assets/Projects/Project5.jpg",
                category: "Environments",
                featured: false,
                software: ["Blender", "Unreal Engine", "Photoshop"],
                tags: ["Environment", "Urban", "Architecture"]
            },
            {
                id: 6,
                title: "Weapon Set",
                description: "A collection of sci-fi weapons with detailed materials",
                image: "Assets/Projects/Project6.jpg",
                category: "Props",
                featured: false,
                software: ["Maya", "Substance Painter", "Unity"],
                tags: ["Weapons", "Sci-Fi", "Collection"]
            }
        ];
        categories = [
            { id: 'all', name: 'All Work' },
            { id: 'Characters', name: 'Characters' },
            { id: 'Environments', name: 'Environments' },
            { id: 'Props', name: 'Props' }
        ];
        renderCategories();
        filterProjects(currentCategory);
    } finally {
        if (portfolioGrid) {
            // Ensure loading class is removed
            portfolioGrid.classList.remove('loading');
        }
    }
}

// Function to render category buttons
function renderCategories() {
    const categoryContainer = document.getElementById('categoryButtons');
    categoryContainer.innerHTML = categories.map(category => `
        <button 
            data-category="${category.id}"
            class="category-btn px-6 py-2 border rounded transition-all ${
                currentCategory === category.id 
                ? 'border-theme-primary text-theme-primary' 
                : 'border-theme-primary/30 text-theme-primary/70'
            } hover:border-theme-primary hover:text-theme-primary"
        >
            ${category.name}
        </button>
    `).join('');

    // Add click event listeners
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentCategory = button.dataset.category;
            updateCategoryButtons();
            filterProjects(currentCategory);
        });
    });
}

// Function to update category button styles
function updateCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(button => {
        if (button.dataset.category === currentCategory) {
            button.classList.remove('border-theme-primary/30', 'text-theme-primary/70');
            button.classList.add('border-theme-primary', 'text-theme-primary');
        } else {
            button.classList.add('border-theme-primary/30', 'text-theme-primary/70');
            button.classList.remove('border-theme-primary', 'text-theme-primary');
        }
    });
}

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

// Function to filter and display projects
function filterProjects(category) {
    const filteredProjects = category === 'all' 
        ? projects 
        : projects.filter(project => project.category === category);
    
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = filteredProjects.map(project => `
        <div class="group relative" data-animate>
            <div class="aspect-square bg-theme-secondary/50 rounded-lg overflow-hidden border border-theme-primary/10 hover:border-theme-primary/30 transition-all">
                <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover rounded-lg portfolio-image cursor-pointer hover:opacity-90 transition-opacity">
                
                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-theme-dark/90 opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col pointer-events-none">
                    <div class="flex-grow flex flex-col justify-center pointer-events-none">
                        <h3 class="text-xl font-bold text-theme-primary mb-2">${project.title}</h3>
                        <h4 class="text-theme-primary/80 mb-4">${project.category}</h4>
                        <p class="text-theme-light/80 mb-4">${project.description}</p>
                        <div class="flex flex-wrap gap-2">
                            ${project.tags.map(tag => `
                                <span class="text-sm px-2 py-1 bg-theme-primary/10 text-theme-primary rounded">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                    <a href="project-details.html?id=${encodeURIComponent(project.id)}" 
                       class="project-link mt-4 w-full py-2 px-4 bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary border border-theme-primary/50 rounded transition-all text-center pointer-events-auto z-10">
                        View Details
                    </a>
                </div>
            </div>
            
            <!-- Static Info (Hidden on Hover) -->
            <div class="mt-4 group-hover:opacity-0 transition-opacity duration-300">
                <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                <p class="text-theme-light/60 mb-2">${project.category}</p>
                <!-- Software Icons -->
                <div class="flex gap-3">
                    ${project.software.map(software => {
                        const iconPath = getSoftwareIcon(software);
                        return `<img src="${iconPath}" alt="${software}" class="software-icon" title="${software}">`;
                    }).join('')}
                </div>
            </div>
        </div>
    `).join('');

    // Reinitialize GSAP animations
    initializeAnimations();
    
    // Reinitialize transitions for new links
    if (window.reinitializeTransitions) {
        window.reinitializeTransitions();
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

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
}); 