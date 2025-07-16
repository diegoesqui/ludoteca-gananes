const gameGrid = document.getElementById('game-grid');
const gameCount = document.getElementById('game-count');
const noResultsMessage = document.getElementById('no-results');
const loaderContainer = document.getElementById('loader-container');
const errorMessage = document.getElementById('error-message');
const rlsTip = document.getElementById('rls-tip');

const renderGames = (games) => {
    gameGrid.innerHTML = '';
    if (games.length === 0) {
        noResultsMessage.classList.remove('hidden');
    } else {
        noResultsMessage.classList.add('hidden');
    }
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card rounded-lg shadow-lg overflow-hidden';
        gameCard.dataset.gameId = game.id;
        const imageUrl = game.image_url || 'https://placehold.co/400x300/0f172a/a78bfa?text=' + encodeURIComponent(game.name);

        gameCard.innerHTML = `
            <img src="${imageUrl}" alt="Imagen de ${game.name}" class="w-full h-64 object-contain">
            <div class="p-4">
                <h3 class="text-xl font-bold">${game.name}</h3>
                <div class="flex justify-between items-center mt-2 text-slate-400">
                    <span><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>${game.players_min === game.players_max ? game.players_min : `${game.players_min}-${game.players_max}`} jug.</span>
                    <span><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V7z" clip-rule="evenodd" /></svg>${game.time_min === game.time_max ? game.time_max : `${game.time_min}-${game.time_max}`} min</span>
                    <span class="complexity-badge complexity-${game.complexity}">${game.complexity}</span>
                </div>
            </div>
        `;
        gameGrid.appendChild(gameCard);
    });
    gameCount.textContent = games.length;
};

const openGameDetailsModal = (game, currentUser) => {
    document.getElementById('modal-game-image').src = game.image_url || '';
    document.getElementById('modal-game-image').alt = `Carátula de ${game.name}`;
    document.getElementById('modal-game-title').textContent = game.name;
    document.getElementById('modal-game-players').innerHTML = `<span><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg> ${game.players_min === game.players_max ? game.players_min : `${game.players_min}-${game.players_max}`} Jugadores</span>`;
    document.getElementById('modal-game-time').innerHTML = `<span><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V7z" clip-rule="evenodd" /></svg> ${game.time_min === game.time_max ? game.time_max : `${game.time_min}-${game.time_max}`} min</span>`;
    document.getElementById('modal-game-complexity').innerHTML = `<span class="complexity-badge complexity-${game.complexity}">${game.complexity}</span>`;

    // Display Tags
    const tagsContainer = document.getElementById('modal-game-tags');
    tagsContainer.innerHTML = '';
    if (game.tags) {
        // Ensure game.tags is an array, converting from string if necessary
        const gameTagsArray = Array.isArray(game.tags)
            ? game.tags
            : String(game.tags).split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        if (gameTagsArray.length > 0) {
            gameTagsArray.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full';
                tagSpan.textContent = tag;
                tagsContainer.appendChild(tagSpan);
            });
        }
    }

    document.getElementById('modal-game-description').textContent = game.description || 'No hay descripción disponible.';
    document.getElementById('modal-game-creator').textContent = game.profiles?.username || 'Desconocido';

    // Action Buttons
    const actionButtonsContainer = document.getElementById('modal-action-buttons');
    let buttonsHTML = '';
    if (game.bgg_url) {
        buttonsHTML += `<a href="${game.bgg_url}" target="_blank" rel="noopener noreferrer" class="btn bg-transparent border-slate-600 hover:bg-slate-800 hover:border-violet-400 text-slate-300 py-2 px-4 rounded-lg inline-flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>Ver en BGG</a>`;
    }
    if (currentUser) {
        buttonsHTML += `<button class="edit-game-btn btn bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg text-sm" data-id="${game.id}">Editar</button>`;
        buttonsHTML += `<button class="delete-game-btn btn bg-transparent border-slate-600 hover:border-red-500 hover:text-red-400 text-slate-300 py-2 px-4 rounded-lg text-sm" data-id="${game.id}">Eliminar</button>`;
    }
    actionButtonsContainer.innerHTML = buttonsHTML;

    // Comments
    const commentsContainer = document.getElementById('modal-comments-container');
    const comments = (Array.isArray(game.comentarios) ? game.comentarios : []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    commentsContainer.innerHTML = comments.length > 0
        ? comments.map(comment => {
            const isOwner = currentUser && currentUser.id === comment.user_id;
            const date = comment.updated_at || comment.created_at;
            const timestamp = new Date(date).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            const editedMark = comment.updated_at ? ' (editado)' : '';
            
            const ownerActions = isOwner ? `
                <div class="text-xs text-slate-400 flex-shrink-0 ml-2">
                    <button class="edit-comment-btn hover:text-cyan-400" data-comment-id="${comment.id}">Editar</button>
                    <span class="mx-1">·</span>
                    <button class="delete-comment-btn hover:text-red-400" data-comment-id="${comment.id}">Eliminar</button>
                </div>
            ` : '';

            return `
            <div class="comment-wrapper bg-slate-900/50 p-3 rounded-lg" data-comment-id="${comment.id}">
                <div class="flex justify-between items-start">
                    <div class="flex-grow">
                        <span class="font-semibold text-slate-300">${comment.profiles?.username || 'Anónimo'}</span>
                        <div class="comment-content text-slate-400 italic my-1">“${comment.content}”</div>
                    </div>
                    ${ownerActions}
                </div>
                <div class="text-right text-xs text-slate-500 mt-1">${timestamp}${editedMark}</div>
            </div>
            `;
        }).join('')
        : '<p class="text-xs text-slate-500">No hay comentarios todavía. ¡Sé el primero!</p>';

    // Comment Form
    const commentFormContainer = document.getElementById('modal-comment-form-container');
    commentFormContainer.innerHTML = currentUser ? `
    <form class="add-comment-form mt-3" data-game-id="${game.id}">
        <div class="flex items-center gap-2">
            <textarea class="flex-grow p-2 bg-slate-900 border border-slate-600 rounded-lg text-sm" rows="1" placeholder="Añadir un comentario..." required></textarea>
            <button type="submit" class="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-3 rounded-lg transition-colors flex-shrink-0">Publicar</button>
        </div>
    </form>
    ` : '<p class="text-sm text-slate-500 mt-3"><a href="#" id="login-to-comment" class="underline hover:text-violet-400">Inicia sesión</a> para dejar un comentario.</p>';

        document.getElementById('game-details-modal').classList.remove('hidden');
};

export { renderGames, openGameDetailsModal, gameGrid, loaderContainer, noResultsMessage, errorMessage, rlsTip };
