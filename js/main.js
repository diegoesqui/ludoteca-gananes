import { supabase } from './supabase.js';
import { currentUser, updateAuthUI } from './auth.js';
import { debounce } from './utils.js';
import { applyFilters, populateFilters, clearFiltersBtn, searchInput, playersInput, complexityPopover, playersPopover, timePopover } from './filters.js';
import { renderGames, openGameDetailsModal, gameGrid, loaderContainer, noResultsMessage, errorMessage, rlsTip } from './dom.js';
import { showModal } from './ui.js';

// --- GLOBAL STATE ---
let masterGameList = [];
let currentSort = 'name-asc'; // Default sort

// --- GAME FORM ELEMENTS ---
const gameModal = document.getElementById('game-modal');
const gameForm = document.getElementById('game-form');
const gameError = document.getElementById('game-error');
const gameModalTitle = document.getElementById('game-modal-title');
const gameIdInput = document.getElementById('game-id');
const gameImageUrlInput = document.getElementById('game-image-url');
const gameImagePreview = document.getElementById('game-image-preview');
const gameImagePlaceholder = document.getElementById('game-image-placeholder');
const closeGameModalBtn = document.getElementById('close-game-modal-btn');
const sortBySelect = document.getElementById('sort-by');
const addGameBtn = document.getElementById('add-game-btn');
const loginBtn = document.getElementById('login-btn');

// --- PROFILE ELEMENTS ---
const editProfileBtn = document.getElementById('edit-profile-btn');
const editProfileForm = document.getElementById('edit-profile-form');
const profileUsernameInput = document.getElementById('profile-username');
const profileError = document.getElementById('profile-error');

// --- CORE APP LOGIC ---
const fetchAllGames = async () => {
    loaderContainer.classList.remove('hidden');
    noResultsMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    gameGrid.innerHTML = '';

    const { data, error } = await supabase.from('juegos').select('*, comentarios(*, profiles(username)), profiles!juegos_created_by_fkey(username), tags').order('name', { ascending: true });

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
playersPopover.addEventListener('change', debouncedApplyFilters); // New event listener for players filter
timePopover.addEventListener('change', debouncedApplyFilters);

complexityPopover.addEventListener('change', () => applyFilters(masterGameList, renderGames));


sortBySelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFilters(masterGameList, renderGames, currentSort);
});

clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    playersPopover.querySelector('input[name="players"][value="Todos"]').checked = true;
    timePopover.querySelector('input[name="time"][value="Todos"]').checked = true;
    complexityPopover.querySelectorAll('input[name="complexity"]').forEach(cb => cb.checked = false);
    
    sortBySelect.value = 'name-asc'; // Reset sort dropdown
    currentSort = 'name-asc'; // Reset sort state variable
    applyFilters(masterGameList, renderGames, currentSort);
});

gameGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.game-card');
    if (card) {
        const gameId = card.dataset.gameId;
        const game = masterGameList.find(g => g.id == gameId);
        if (game) {
            openGameDetailsModal(game, currentUser);
            showModal('game-details-modal');
        }
    }
});

closeGameModalBtn.addEventListener('click', () => {
    gameModal.classList.add('hidden');
});

gameImageUrlInput.addEventListener('input', () => {
    const url = gameImageUrlInput.value.trim();
    if (url) {
        gameImagePreview.src = url;
        gameImagePreview.classList.remove('hidden');
        gameImagePlaceholder.classList.add('hidden');
    } else {
        gameImagePreview.classList.add('hidden');
        gameImagePlaceholder.classList.remove('hidden');
    }
});

gameForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    gameError.classList.add('hidden');

    const isEditing = !!gameIdInput.value;
    const gameId = gameIdInput.value;

    const gameData = {
        name: document.getElementById('game-name').value,
        description: document.getElementById('game-description').value,
        players_min: parseInt(document.getElementById('game-players-min').value),
        players_max: parseInt(document.getElementById('game-players-max').value),
        time_min: parseInt(document.getElementById('game-time-min').value),
        time_max: parseInt(document.getElementById('game-time-max').value),
        complexity: document.getElementById('game-complexity').value,
        bgg_url: document.getElementById('game-bgg').value || null,
        image_url: document.getElementById('game-image-url').value || null,
        tags: document.getElementById('game-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
    };

    let error;
    if (isEditing) {
        ({ error } = await supabase.from('juegos').update(gameData).eq('id', gameId));
    } else {
        gameData.created_by = currentUser.id;
        ({ error } = await supabase.from('juegos').insert([gameData]));
    }

    if (error) {
        console.error('Error saving game:', error);
        gameError.textContent = `Error al guardar el juego: ${error.message}`;
        gameError.classList.remove('hidden');
    } else {
        showModal('game-details-modal'); // Mostrar el modal de detalles actualizado
        await refreshModal(gameId);
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
        showModal('login-modal');
    }

    // --- Game Actions ---
    if (editBtn) {
        const gameId = editBtn.dataset.id;
        const gameData = masterGameList.find(g => g.id == gameId);
        if (gameData) {
            gameModalTitle.textContent = 'EDITAR JUEGO';
            gameIdInput.value = gameData.id;
            document.getElementById('game-name').value = gameData.name;
            document.getElementById('game-description').value = gameData.description || '';
            document.getElementById('game-players-min').value = gameData.players_min;
            document.getElementById('game-players-max').value = gameData.players_max;
            document.getElementById('game-time-min').value = gameData.time_min;
            document.getElementById('game-time-max').value = gameData.time_max;
            document.getElementById('game-complexity').value = gameData.complexity;
            document.getElementById('game-bgg').value = gameData.bgg_url || '';
            gameImageUrlInput.value = gameData.image_url || '';
            const gameTagsArray = Array.isArray(gameData.tags)
                ? gameData.tags
                : String(gameData.tags || '').split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            document.getElementById('game-tags').value = gameTagsArray.join(', ');
            gameError.classList.add('hidden');

            // Update image preview
            const imageUrl = gameImageUrlInput.value.trim();
            if (imageUrl) {
                gameImagePreview.src = imageUrl;
                gameImagePreview.classList.remove('hidden');
                gameImagePlaceholder.classList.add('hidden');
            } else {
                gameImagePreview.src = '';
                gameImagePreview.classList.add('hidden');
                gameImagePlaceholder.classList.remove('hidden');
            }

            showModal('game-modal');
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

// --- PROFILE EDITING LOGIC ---
editProfileBtn.addEventListener('click', () => {
    if (currentUser && currentUser.username) {
        profileUsernameInput.value = currentUser.username;
    } else {
        profileUsernameInput.value = '';
    }
    profileError.classList.add('hidden');
    showModal('edit-profile-modal');
});

editProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    profileError.classList.add('hidden');

    if (!currentUser) {
        profileError.textContent = 'Debes iniciar sesión para editar tu perfil.';
        profileError.classList.remove('hidden');
        return;
    }

    const newUsername = profileUsernameInput.value.trim();

    if (!newUsername) {
        profileError.textContent = 'El nombre de usuario no puede estar vacío.';
        profileError.classList.remove('hidden');
        return;
    }

    // Update the profiles table
    const { data, error } = await supabase
        .from('profiles')
        .update({ username: newUsername, updated_at: new Date().toISOString() })
        .eq('id', currentUser.id);

    if (error) {
        console.error('Error updating profile:', error);
        profileError.textContent = `Error al actualizar el perfil: ${error.message}`;
        profileError.classList.remove('hidden');
    } else {
        // Update the currentUser object in auth.js
        // This will trigger updateAuthUI and refresh the display
        const { data: updatedUser, error: userError } = await supabase.auth.updateUser({
            data: { username: newUsername }
        });

        if (userError) {
            console.error('Error updating user metadata:', userError);
            profileError.textContent = `Error al actualizar metadatos de usuario: ${userError.message}`;
            profileError.classList.remove('hidden');
        } else {
            showModal(null); // Close modal
            // Re-fetch all games to update the creator name if it was changed
            await fetchAllGames();
        }
    }
});

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    const sessionData = await supabase.auth.getSession();
    updateAuthUI(sessionData.data.session ? sessionData.data.session.user : null);
    await fetchAllGames();

    // Event listener for Add Game button
    addGameBtn.addEventListener('click', () => {
        gameModalTitle.textContent = 'AÑADIR NUEVO JUEGO';
        gameForm.reset();
        gameIdInput.value = '';
        gameError.classList.add('hidden');

        // Reset image preview
        gameImagePreview.src = '';
        gameImagePreview.classList.add('hidden');
        gameImagePlaceholder.classList.remove('hidden');

        // Reset tags input
        document.getElementById('game-tags').value = '';

        showModal('game-modal');
    });

    // Event listener for Login button
    loginBtn.addEventListener('click', () => {
        showModal('login-modal');
    });

    // Mobile filter toggle
    const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
    const filterBar = document.getElementById('filter-bar');
    mobileFilterToggle.addEventListener('click', () => {
        filterBar.classList.toggle('hidden');
    });
});
