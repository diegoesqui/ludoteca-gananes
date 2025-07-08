const searchInput = document.getElementById('search-input');
const playersInput = document.getElementById('players-input'); // Keep for custom input if needed

const complexityPopover = document.getElementById('complexity-filter-popover');

const clearFiltersBtn = document.getElementById('clear-filters-btn');

const complexityFilterBtn = document.getElementById('complexity-filter-btn');

const playersFilterBtn = document.getElementById('players-filter-btn');
const timeFilterBtn = document.getElementById('time-filter-btn');

const playersPopover = document.getElementById('players-filter-popover');
const timePopover = document.getElementById('time-filter-popover');

// Toggle popover visibility
complexityFilterBtn.addEventListener('click', () => {
    complexityPopover.classList.toggle('hidden');
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

    let selectedTime = null;
    const timeRadios = timePopover.querySelectorAll('input[name="time"]');
    timeRadios.forEach(radio => {
        if (radio.checked) {
            selectedTime = radio.value;
        }
    });

    
    
    // Complexity Filter Logic (Multi-select)
    const selectedComplexities = Array.from(complexityPopover.querySelectorAll('input[name="complexity"]:checked')).map(cb => cb.value);
    
    

    let filteredGames = masterGameList.filter(game => {
        const nameMatch = game.name.toLowerCase().includes(searchTerm);
        
        const playersMatch = !players || (game.players_min <= players && game.players_max >= players) || (selectedPlayers === '5+' && game.players_max >= 5);
        const timeMatch = selectedTime === 'Todos' ||
                          (selectedTime === '<30' && game.time_max <= 30) ||
                          (selectedTime === '30-60' && game.time_max > 30 && game.time_max <= 60) ||
                          (selectedTime === '60-90' && game.time_max > 60 && game.time_max <= 90) ||
                          (selectedTime === '>90' && game.time_max > 90);
        
        const complexityMatch = selectedComplexities.includes('Todos') || selectedComplexities.length === 0 || selectedComplexities.includes(game.complexity);
        
        
        return nameMatch && playersMatch && timeMatch && complexityMatch;
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

    

    
};

export { applyFilters, populateFilters, clearFiltersBtn, searchInput, playersInput, complexityPopover, playersPopover, timePopover };