// Function to load and display featured projects
async function loadFeaturedProjects() {
    try {
        const response = await fetch('js/projects.json');
        const data = await response.json();
        
        // Filter projects to get only featured ones (you can modify this logic)
        const featuredProjects = data.projects.filter(project => 
            project.id === "1" || project.id === "2" || project.id === "3" // Example: first three projects
        );

        const featuredContainer = document.querySelector('.featured-projects-grid');
        if (!featuredContainer) return;

        featuredContainer.innerHTML = featuredProjects.map(project => `
            <div class="group cursor-pointer" onclick="window.location.href='project-details.html?id=${project.id}'">
                <div class="aspect-video rounded-lg overflow-hidden">
                    <img src="${project.image}" alt="${project.title}" 
                         class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300">
                </div>
                <h3 class="text-xl font-bold mt-4">${project.title}</h3>
                <p class="text-theme-light/60">${project.category}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading featured projects:', error);
    }
}

// Load featured projects when the page loads
document.addEventListener('DOMContentLoaded', loadFeaturedProjects); 