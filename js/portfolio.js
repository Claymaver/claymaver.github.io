let currentCategory = 'all';
let projects = [
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
let categories = [];

// Function to fetch projects data
async function fetchProjects() {
    try {
        const response = await fetch('./js/projects.json');
        const data = await response.json();
        projects = data.projects;
        categories = data.categories;
        renderCategories();
        filterProjects(currentCategory);
    } catch (error) {
        console.error('Error loading projects:', error);
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

// Function to filter and display projects
function filterProjects(category) {
    const filteredProjects = category === 'all' 
        ? projects 
        : projects.filter(project => project.category === category);
    
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = filteredProjects.map(project => {
        // Create project card
        const card = document.createElement('div');
        card.className = 'group relative' + (project.featured ? ' lg:col-span-2' : '');
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-animate', '');

        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'aspect-square bg-theme-secondary/50 rounded-lg overflow-hidden border border-theme-primary/10 hover:border-theme-primary/30 transition-all relative';
        
        // Create image element
        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title;
        img.className = 'w-full h-full object-cover rounded-lg portfolio-image cursor-pointer hover:opacity-90 transition-opacity';
        img.loading = 'lazy';
        
        // Create software icons container
        const softwareIcons = document.createElement('div');
        softwareIcons.className = 'absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300';
        
        // Add software icons based on project.software array
        if (project.software) {
            project.software.forEach(software => {
                const icon = document.createElement('div');
                icon.className = 'bg-theme-secondary/90 p-2 rounded-full backdrop-blur-sm';
                icon.title = software; // Tooltip on hover
                
                // Add appropriate icon based on software name
                switch(software.toLowerCase()) {
                    case 'blender':
                        icon.innerHTML = '<i class="fas fa-cube text-theme-primary"></i>';
                        break;
                    case 'maya':
                        icon.innerHTML = '<i class="fas fa-dice-d20 text-theme-primary"></i>';
                        break;
                    case 'zbrush':
                        icon.innerHTML = '<i class="fas fa-paint-brush text-theme-primary"></i>';
                        break;
                    case 'substance painter':
                        icon.innerHTML = '<i class="fas fa-palette text-theme-primary"></i>';
                        break;
                    case 'unreal engine':
                        icon.innerHTML = '<i class="fas fa-gamepad text-theme-primary"></i>';
                        break;
                    case 'unity':
                        icon.innerHTML = '<i class="fas fa-cube text-theme-accent"></i>';
                        break;
                    case 'photoshop':
                        icon.innerHTML = '<i class="fas fa-image text-theme-primary"></i>';
                        break;
                    default:
                        icon.innerHTML = '<i class="fas fa-tools text-theme-primary"></i>';
                }
                
                softwareIcons.appendChild(icon);
            });
        }
        
        // Create hover overlay
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-gradient-to-t from-theme-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300';
        
        // Create content container
        const content = document.createElement('div');
        content.className = 'absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300';
        
        // Create title
        const title = document.createElement('h3');
        title.className = 'text-xl font-bold mb-2';
        title.textContent = project.title;
        
        // Create description
        const description = document.createElement('p');
        description.className = 'text-sm opacity-80';
        description.textContent = project.description;
        
        // Assemble the card
        content.appendChild(title);
        content.appendChild(description);
        imageContainer.appendChild(img);
        imageContainer.appendChild(softwareIcons);
        imageContainer.appendChild(overlay);
        card.appendChild(imageContainer);
        card.appendChild(content);
        
        return card.outerHTML;
    }).join('');

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