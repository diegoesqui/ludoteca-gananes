const gameModal = document.getElementById('game-modal');
const closeGameModalBtn = document.getElementById('close-game-modal-btn');
const cancelGameFormBtn = document.getElementById('cancel-game-form-btn');
const gameDetailsModal = document.getElementById('game-details-modal');
const closeDetailsModalBtn = document.getElementById('close-details-modal-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const closeEditProfileModalBtn = document.getElementById('close-edit-profile-modal-btn');

// --- MODAL MANAGEMENT ---
export const showModal = (modalId) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.id === modalId) {
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    });

    if (modalId === 'game-modal') {
        document.getElementById('game-details-modal').classList.add('hidden');
    }
};

closeGameModalBtn.addEventListener('click', () => {
    gameModal.classList.add('hidden');
});

cancelGameFormBtn.addEventListener('click', () => {
    gameModal.classList.add('hidden');
});
closeDetailsModalBtn.addEventListener('click', () => showModal(null)); // Al cerrar el modal de detalles, ocultar todos
closeEditProfileModalBtn.addEventListener('click', () => showModal(null)); // Al cerrar el modal de edición de perfil, ocultar todos

// Close modals on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        showModal(null); // Ocultar todos los modales
    }
});

// --- SCROLL TO TOP ---
export const initializeScrollToTop = () => {
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    if (!scrollToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.remove('hidden');
        } else {
            scrollToTopBtn.classList.add('hidden');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};