const searchInput = document.getElementById('search-input');
const playersInput = document.getElementById('players-input');
const timeInput = document.getElementById('time-input');
const complexityPopover = document.getElementById('complexity-filter-popover');
const recommenderPopover = document.getElementById('recommender-filter-popover');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

const applyFilters = (masterGameList, renderGames, sortOrder) => {
    const searchTerm = searchInput.value.toLowerCase();
    const players = parseInt(playersInput.value);
    const time = parseInt(timeInput.value);
    const complexity = complexityPopover.querySelector('input:checked').value;
    const recommender = recommenderPopover.querySelector('input:checked').value;

    let filteredGames = masterGameList.filter(game => {
        const nameMatch = game.name.toLowerCase().includes(searchTerm);
        const playersMatch = !players || (game.players_min <= players && game.players_max >= players);
        const timeMatch = !time || (game.time_max <= time);
        const complexityMatch = complexity === 'Todos' || game.complexity === complexity;
        const recommenderMatch = recommender === 'Todos' || (Array.isArray(game.recommended_by) && game.recommended_by.includes(recommender));
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
    const complexities = [...new Set(games.map(g => g.complexity))];
    complexityPopover.innerHTML = '<label><input type="radio" name="complexity" value="Todos" checked> Todos</label>' +
        complexities.map(c => `<label><input type="radio" name="complexity" value="${c}"> ${c}</label>`).join('');

    const recommenders = [...new Set(games.flatMap(g => g.recommended_by))];
    recommenderPopover.innerHTML = '<label><input type="radio" name="recommender" value="Todos" checked> Todos</label>' +
        recommenders.map(r => `<label><input type="radio" name="recommender" value="${r}"> ${r}</label>`).join('');
};

export { applyFilters, populateFilters, clearFiltersBtn, searchInput, playersInput, timeInput, complexityPopover, recommenderPopover };