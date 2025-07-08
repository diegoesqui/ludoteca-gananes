const searchInput = document.getElementById('search-input');
const playersInput = document.getElementById('players-input'); // Keep for custom input if needed
const timeInput = document.getElementById('time-input');
const complexityPopover = document.getElementById('complexity-filter-popover');
const recommenderPopover = document.getElementById('recommender-filter-popover');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

const complexityFilterBtn = document.getElementById('complexity-filter-btn');
const recommenderFilterBtn = document.getElementById('recommender-filter-btn');
const playersFilterBtn = document.getElementById('players-filter-btn');
const timeFilterBtn = document.getElementById('time-filter-btn');

const playersPopover = document.getElementById('players-filter-popover');
const timePopover = document.getElementById('time-filter-popover');

// Toggle popover visibility
complexityFilterBtn.addEventListener('click', () => {
    complexityPopover.classList.toggle('hidden');
});
recommenderFilterBtn.addEventListener('click', () => {
    recommenderPopover.classList.toggle('hidden');
});
playersFilterBtn.addEventListener('click', () => {
    playersPopover.classList.toggle('hidden');
});
timeFilterBtn.addEventListener('click', () => {
    timePopover.classList.toggle('hidden');
});

// Close popovers when clicking outside
document.addEventListener('click', (event) => {
    if (!complexityFilterBtn.contains(event.target) && !complexityPopover.contains(event.target)) {
        complexityPopover.classList.add('hidden');
    }
    if (!recommenderFilterBtn.contains(event.target) && !recommenderPopover.contains(event.target)) {
        recommenderPopover.classList.add('hidden');
    }
    if (!playersFilterBtn.contains(event.target) && !playersPopover.contains(event.target)) {
        playersPopover.classList.add('hidden');
    }
    if (!timeFilterBtn.contains(event.target) && !timePopover.contains(event.target)) {
        timePopover.classList.add('hidden');
    }
});

const applyFilters = (masterGameList, renderGames, sortOrder) => {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Players Filter Logic
    let selectedPlayers = null;
    const playersRadios = playersPopover.querySelectorAll('input[name="players"]');
    playersRadios.forEach(radio => {
        if (radio.checked) {
            selectedPlayers = radio.value;
        }
    });

    let players = null;
    if (selectedPlayers === 'Todos') {
        players = null; // No filter applied
    } else if (selectedPlayers === '5+') {
        players = 5; // Filter for 5 or more players
    } else if (selectedPlayers) {
        players = parseInt(selectedPlayers);
    }

    const time = parseInt(timeInput.value);
    
    // Complexity Filter Logic (Multi-select)
    const selectedComplexities = Array.from(complexityPopover.querySelectorAll('input[name="complexity"]:checked')).map(cb => cb.value);
    
    // Recommender Filter Logic (Multi-select)
    const selectedRecommenders = Array.from(recommenderPopover.querySelectorAll('input[name="recommender"]:checked')).map(cb => cb.value);

    let filteredGames = masterGameList.filter(game => {
        const nameMatch = game.name.toLowerCase().includes(searchTerm);
        
        const playersMatch = !players || (game.players_min <= players && game.players_max >= players) || (selectedPlayers === '5+' && game.players_max >= 5);
        const timeMatch = !time || (game.time_max <= time);
        
        const complexityMatch = selectedComplexities.includes('Todos') || selectedComplexities.length === 0 || selectedComplexities.includes(game.complexity);
        const recommenderMatch = selectedRecommenders.includes('Todos') || selectedRecommenders.length === 0 || (Array.isArray(game.recommended_by) && game.recommended_by.some(r => selectedRecommenders.includes(r)));
        
        return nameMatch && playersMatch && timeMatch && complexityMatch && recommenderMatch;
    });

    // Sorting logic
    filteredGames.sort((a, b) => {
        switch (sortOrder) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'players-min-asc':
                return a.players_min - b.players_min;
            case 'players-min-desc':
                return b.players_min - a.players_min;
            case 'time-min-asc':
                return a.time_min - b.time_min;
            case 'time-min-desc':
                return b.time_min - a.time_min;
            case 'complexity-asc':
                const complexityOrder = { 'facil': 1, 'medio': 2, 'avanzado': 3 };
                return complexityOrder[a.complexity] - complexityOrder[b.complexity];
            case 'complexity-desc':
                const complexityOrderDesc = { 'facil': 1, 'medio': 2, 'avanzado': 3 };
                return complexityOrderDesc[b.complexity] - complexityOrderDesc[a.complexity];
            default:
                return 0;
        }
    });

    renderGames(filteredGames);
};

const populateFilters = (games) => {
    // Complexity Filter (Checkboxes)
    const complexities = [...new Set(games.map(g => g.complexity))];
    const orderedComplexities = ['facil', 'medio', 'avanzado'].filter(c => complexities.includes(c));
    complexityPopover.innerHTML = `
        ${orderedComplexities.map(c => `
            <label class="flex items-center text-slate-400 hover:text-violet-400 cursor-pointer">
                <input type="checkbox" name="complexity" value="${c}" class="mr-2 form-checkbox text-violet-600 rounded focus:ring-violet-500"> ${c}
            </label>
        `).join('')}
    `;

    // Recommender Filter (Checkboxes)
    const recommenders = [...new Set(games.flatMap(g => g.recommended_by))];
    recommenderPopover.innerHTML = `
        <label class="flex items-center text-slate-400 hover:text-violet-400 cursor-pointer">
            <input type="checkbox" name="recommender" value="Todos" class="mr-2 form-checkbox text-violet-600 rounded focus:ring-violet-500"> Todos
        </label>
        ${recommenders.map(r => `
            <label class="flex items-center text-slate-400 hover:text-violet-400 cursor-pointer">
                <input type="checkbox" name="recommender" value="${r}" class="mr-2 form-checkbox text-violet-600 rounded focus:ring-violet-500"> ${r}
            </label>
        `).join('')}
    `;

    // Event listener for players radio buttons to show/hide custom input
    playersPopover.addEventListener('change', (event) => {
        const customPlayersInput = document.getElementById('players-custom-input');
        if (event.target.value === '5+') {
            customPlayersInput.classList.remove('hidden');
        } else {
            customPlayersInput.classList.add('hidden');
            customPlayersInput.value = ''; // Clear custom input when not in use
        }
    });
};

export { applyFilters, populateFilters, clearFiltersBtn, searchInput, playersInput, timeInput, complexityPopover, recommenderPopover, playersPopover, timePopover };