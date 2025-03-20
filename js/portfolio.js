let currentCategory = 'all';
let projects = [];
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
    projectsGrid.innerHTML = filteredProjects.map(project => `
        <div class="group relative" data-animate>
            <div class="aspect-square bg-theme-secondary/50 rounded-lg overflow-hidden border border-theme-primary/10 hover:border-theme-primary/30 transition-all">
                <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover">
                
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
                    <a href="project-details.html?id=${project.id}" 
                       class="project-link mt-4 w-full py-2 px-4 bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary border border-theme-primary/50 rounded transition-all text-center pointer-events-auto z-10">
                        View Details
                    </a>
                </div>
            </div>
            
            <!-- Static Info (Hidden on Hover) -->
            <div class="mt-4 group-hover:opacity-0 transition-opacity duration-300">
                <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                <p class="text-theme-light/60">${project.category}</p>
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