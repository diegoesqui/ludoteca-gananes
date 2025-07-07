const searchInput = document.getElementById('search-input');
const playersInput = document.getElementById('players-input');
const timeInput = document.getElementById('time-input');
const complexityPopover = document.getElementById('complexity-filter-popover');
const recommenderPopover = document.getElementById('recommender-filter-popover');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

const applyFilters = (masterGameList, renderGames) => {
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
        const recommenderMatch = recommender === 'Todos' || game.recommended_by.includes(recommender);
        return nameMatch && playersMatch && timeMatch && complexityMatch && recommenderMatch;
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