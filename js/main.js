import { supabase } from './supabase.js';
import { currentUser, updateAuthUI } from './auth.js';
import { debounce } from './utils.js';
import { applyFilters, populateFilters, clearFiltersBtn, searchInput, playersInput, timeInput, complexityPopover, recommenderPopover } from './filters.js';
import { renderGames, openGameDetailsModal, gameGrid, loaderContainer, noResultsMessage, errorMessage, rlsTip } from './dom.js';

// --- GLOBAL STATE ---
let masterGameList = [];
let currentSort = 'name-asc'; // Default sort

// --- GAME FORM ELEMENTS ---
const gameModal = document.getElementById('game-modal');
const gameForm = document.getElementById('game-form');
const gameError = document.getElementById('game-error');
const gameModalTitle = document.getElementById('game-modal-title');
const gameIdInput = document.getElementById('game-id');
const closeGameModalBtn = document.getElementById('close-game-modal-btn');
const sortBySelect = document.getElementById('sort-by');

// --- CORE APP LOGIC ---
const fetchAllGames = async () => {
    loaderContainer.classList.remove('hidden');
    noResultsMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    gameGrid.innerHTML = '';

    const { data, error } = await supabase.from('juegos').select('*, comentarios(*, profiles(username))').order('name', { ascending: true });

    loaderContainer.classList.add('hidden');
    if (error) {
        console.error('Error fetching games:', error);
        errorMessage.classList.remove('hidden');
        return;
    }
    
    if (data.length === 0) {
        rlsTip.classList.remove('hidden');
    }

    masterGameList = data;
    populateFilters(masterGameList);
    applyFilters(masterGameList, renderGames, currentSort);
};

const refreshModal = async (gameId) => {
    const { data: updatedGame, error: fetchError } = await supabase
        .from('juegos')
        .select('*, comentarios(*, profiles(username))')
        .eq('id', gameId)
        .single();
    
    if (updatedGame) {
        const gameIndex = masterGameList.findIndex(g => g.id == gameId);
        if (gameIndex > -1) {
            masterGameList[gameIndex] = updatedGame;
        }
        openGameDetailsModal(updatedGame, currentUser);
        applyFilters(masterGameList, renderGames); // Re-filter in case a comment change affects filtering
    } else {
        // If the game was deleted, just close the modal and refresh the main grid
        document.getElementById('game-details-modal').classList.add('hidden');
        await fetchAllGames();
    }
};

// --- EVENT LISTENERS ---
const debouncedApplyFilters = debounce(() => applyFilters(masterGameList, renderGames), 300);
searchInput.addEventListener('input', debouncedApplyFilters);
playersInput.addEventListener('input', debouncedApplyFilters);
timeInput.addEventListener('input', debouncedApplyFilters);
complexityPopover.addEventListener('change', () => applyFilters(masterGameList, renderGames));
recommenderPopover.addEventListener('change', () => applyFilters(masterGameList, renderGames, currentSort));

sortBySelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFilters(masterGameList, renderGames, currentSort);
});

clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    playersInput.value = '';
    timeInput.value = '';
    complexityPopover.querySelector('input[value="Todos"]').checked = true;
    recommenderPopover.querySelector('input[value="Todos"]').checked = true;
    applyFilters(masterGameList, renderGames);
});

gameGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.game-card');
    if (card) {
        const gameId = card.dataset.gameId;
        const game = masterGameList.find(g => g.id == gameId);
        if (game) {
            openGameDetailsModal(game, currentUser);
        }
    }
});

closeGameModalBtn.addEventListener('click', () => {
    gameModal.classList.add('hidden');
});

gameForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    gameError.classList.add('hidden');

    const isEditing = !!gameIdInput.value;
    const gameId = gameIdInput.value;

    const gameData = {
        name: document.getElementById('game-name').value,
        players_min: parseInt(document.getElementById('game-players-min').value),
        players_max: parseInt(document.getElementById('game-players-max').value),
        time_min: parseInt(document.getElementById('game-time-min').value),
        time_max: parseInt(document.getElementById('game-time-max').value),
        complexity: document.getElementById('game-complexity').value,
        bgg_url: document.getElementById('game-bgg').value || null,
        image_url: document.getElementById('game-image-url').value || null,
        recommended_by: document.getElementById('game-recommended').value.split(',').map(s => s.trim()).filter(s => s !== ''),
    };

    let error;
    if (isEditing) {
        ({ error } = await supabase.from('juegos').update(gameData).eq('id', gameId));
    } else {
        ({ error } = await supabase.from('juegos').insert([gameData]));
    }

    if (error) {
        console.error('Error saving game:', error);
        gameError.textContent = `Error al guardar el juego: ${error.message}`;
        gameError.classList.remove('hidden');
    } else {
        gameModal.classList.add('hidden');
        await fetchAllGames();
    }
});

document.getElementById('game-details-modal').addEventListener('click', async (e) => {
    if (e.target.closest('#close-details-modal-btn')) {
        document.getElementById('game-details-modal').classList.add('hidden');
        return;
    }

    const editBtn = e.target.closest('.edit-game-btn');
    const deleteBtn = e.target.closest('.delete-game-btn');
    const editCommentBtn = e.target.closest('.edit-comment-btn');
    const deleteCommentBtn = e.target.closest('.delete-comment-btn');
    const saveCommentBtn = e.target.closest('.save-comment-btn');
    const cancelEditBtn = e.target.closest('.cancel-edit-btn');

    if (e.target.id === 'login-to-comment') {
        e.preventDefault();
        document.getElementById('game-details-modal').classList.add('hidden');
        loginModal.classList.remove('hidden');
    }

    // --- Game Actions ---
    if (editBtn) {
        const gameId = editBtn.dataset.id;
        const gameData = masterGameList.find(g => g.id == gameId);
        if (gameData) {
            document.getElementById('game-details-modal').classList.add('hidden');
            gameModalTitle.textContent = 'EDITAR JUEGO';
            gameIdInput.value = gameData.id;
            document.getElementById('game-name').value = gameData.name;
            document.getElementById('game-players-min').value = gameData.players_min;
            document.getElementById('game-players-max').value = gameData.players_max;
            document.getElementById('game-time-min').value = gameData.time_min;
            document.getElementById('game-time-max').value = gameData.time_max;
            document.getElementById('game-complexity').value = gameData.complexity;
            document.getElementById('game-bgg').value = gameData.bgg_url || '';
            document.getElementById('game-image-url').value = gameData.image_url || '';
            document.getElementById('game-recommended').value = (Array.isArray(gameData.recommended_by) ? gameData.recommended_by : []).join(', ');
            gameError.classList.add('hidden');
            gameModal.classList.remove('hidden');
        }
    }
    if (deleteBtn) {
        const gameId = deleteBtn.dataset.id;
        if (confirm('¿Estás seguro de que quieres eliminar este juego? Esta acción es irreversible.')) {
            const { error } = await supabase.from('juegos').delete().eq('id', gameId);
            if (error) { 
                alert(`Error al eliminar: ${error.message}`); 
            } else { 
                document.getElementById('game-details-modal').classList.add('hidden');
                await fetchAllGames(); 
            }
        }
    }

    // --- Comment Actions ---
    if (deleteCommentBtn) {
        const commentId = deleteCommentBtn.dataset.commentId;
        if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            const { error } = await supabase.from('comentarios').delete().eq('id', commentId);
            if (error) {
                alert(`Error al eliminar el comentario: ${error.message}`);
            } else {
                const gameId = document.querySelector('#modal-comment-form-container form').dataset.gameId;
                await refreshModal(gameId);
            }
        }
    }

    if (editCommentBtn) {
        const commentId = editCommentBtn.dataset.commentId;
        const wrapper = document.querySelector(`.comment-wrapper[data-comment-id='${commentId}']`);
        const contentDiv = wrapper.querySelector('.comment-content');
        const originalContent = contentDiv.textContent.trim().slice(1, -1); // Remove quotes
        
        wrapper.dataset.originalContent = originalContent;

        contentDiv.innerHTML = `
            <textarea class="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-sm" rows="3">${originalContent}</textarea>
            <div class="text-right mt-1">
                <button class="save-comment-btn text-xs bg-violet-600 hover:bg-violet-700 text-white font-bold py-1 px-2 rounded-lg" data-comment-id="${commentId}">Guardar</button>
                <button class="cancel-edit-btn text-xs bg-gray-500 hover:bg-gray-400 text-white font-bold py-1 px-2 rounded-lg ml-1">Cancelar</button>
            </div>
        `;
        editCommentBtn.parentElement.style.display = 'none';
    }

    if (cancelEditBtn) {
        const commentId = e.target.closest('.comment-wrapper').dataset.commentId;
        const wrapper = document.querySelector(`.comment-wrapper[data-comment-id='${commentId}']`);
        const contentDiv = wrapper.querySelector('.comment-content');
        contentDiv.innerHTML = `“${wrapper.dataset.originalContent}”`;
        wrapper.querySelector('.edit-comment-btn').parentElement.style.display = 'flex';
    }

    if (saveCommentBtn) {
        const commentId = saveCommentBtn.dataset.commentId;
        const wrapper = document.querySelector(`.comment-wrapper[data-comment-id='${commentId}']`);
        const textarea = wrapper.querySelector('textarea');
        const newContent = textarea.value.trim();

        if (newContent) {
            const { error } = await supabase
                .from('comentarios')
                .update({ content: newContent, updated_at: new Date().toISOString() })
                .eq('id', commentId);

            if (error) {
                alert(`Error al guardar el comentario: ${error.message}`);
            } else {
                const gameId = document.querySelector('#modal-comment-form-container form').dataset.gameId;
                await refreshModal(gameId);
            }
        }
    }
});

document.getElementById('game-details-modal').addEventListener('submit', async (e) => {
    if (e.target.classList.contains('add-comment-form')) {
        e.preventDefault();
        if (!currentUser) {
            alert('Debes iniciar sesión para comentar.');
            return;
        }
        const form = e.target;
        const gameId = form.dataset.gameId;
        const textarea = form.querySelector('textarea');
        const content = textarea.value.trim();

        if (content) {
            form.querySelector('button').disabled = true;
            form.querySelector('textarea').disabled = true;

            const { error } = await supabase.from('comentarios').insert({
                content: content,
                game_id: gameId,
                user_id: currentUser.id
            });

            if (error) {
                alert(`Error al publicar el comentario: ${error.message}`);
                form.querySelector('button').disabled = false;
                form.querySelector('textarea').disabled = false;
            } else {
                await refreshModal(gameId);
            }
        }
    }
});

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    const sessionData = await supabase.auth.getSession();
    updateAuthUI(sessionData.data.session ? sessionData.data.session.user : null);
    await fetchAllGames();
});
