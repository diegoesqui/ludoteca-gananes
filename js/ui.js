const gameModal = document.getElementById('game-modal');
const closeGameModalBtn = document.getElementById('close-game-modal-btn');
const gameDetailsModal = document.getElementById('game-details-modal');
const closeDetailsModalBtn = document.getElementById('close-details-modal-btn');

closeGameModalBtn.addEventListener('click', () => gameModal.classList.add('hidden'));
closeDetailsModalBtn.addEventListener('click', () => gameDetailsModal.classList.add('hidden'));

// --- SCROLL BEHAVIOR FOR FILTER BAR ---
let lastScrollY = window.scrollY;
const filterBar = document.getElementById('filter-bar');

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 200) {
        // Scrolling down & past a certain point
        filterBar.classList.add('hidden-bar');
    } else {
        // Scrolling up
        filterBar.classList.remove('hidden-bar');
    }
    lastScrollY = window.scrollY;
});