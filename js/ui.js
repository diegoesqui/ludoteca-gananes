const gameModal = document.getElementById('game-modal');
const closeGameModalBtn = document.getElementById('close-game-modal-btn');
const gameDetailsModal = document.getElementById('game-details-modal');
const closeDetailsModalBtn = document.getElementById('close-details-modal-btn');

closeGameModalBtn.addEventListener('click', () => gameModal.classList.add('hidden'));
closeDetailsModalBtn.addEventListener('click', () => gameDetailsModal.classList.add('hidden'));