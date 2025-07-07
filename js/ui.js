const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const viewContainers = document.querySelectorAll('.view-container');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const gameModal = document.getElementById('game-modal');
const closeGameModalBtn = document.getElementById('close-game-modal-btn');
const gameDetailsModal = document.getElementById('game-details-modal');
const closeDetailsModalBtn = document.getElementById('close-details-modal-btn');

const switchView = (viewId) => {
    viewContainers.forEach(container => {
        container.classList.toggle('hidden', container.id !== viewId);
    });
    sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewId.replace('view-', ''));
    });
    if (sidebar.classList.contains('md:translate-x-0')) {
        sidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.add('hidden');
    }
};

menuToggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    sidebarOverlay.classList.toggle('hidden');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
});

sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = `view-${link.dataset.view}`;
        switchView(viewId);
    });
});

closeGameModalBtn.addEventListener('click', () => gameModal.classList.add('hidden'));
closeDetailsModalBtn.addEventListener('click', () => gameDetailsModal.classList.add('hidden'));

export { switchView };
