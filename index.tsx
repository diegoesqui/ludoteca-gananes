
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Since Chart.js is loaded from a CDN, we need to tell TypeScript what `Chart` is.
declare var Chart: any;

// --- Type Definitions for Clarity and Safety ---
type ComplexityLevel = 'Ligeros' | 'Medios' | 'Duros';

interface Opinion {
    author: string;
    quote: string;
}

interface Game {
    name: string;
    bgg_url: string;
    players_min: number;
    players_max: number;
    time_min: number;
    time_max: number;
    complexity: ComplexityLevel;
    recommended_by: string[];
    opinions: Opinion[];
}

// --- Main Application Logic ---
document.addEventListener('DOMContentLoaded', () => {

    const gamesData: Game[] = [
        { name: 'Un Día en las Carreras', bgg_url: 'https://boardgamegeek.com/boardgame/351040/ready-set-bet', players_min: 1, players_max: 8, time_min: 25, time_max: 25, complexity: 'Ligeros', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: '"Con el que te partes el culo", "simula perfectamente apuestas a carreras de caballos. Espectacular". Lo recomienda como una de sus opciones finales.' }] },
        { name: 'Los Castillos del Rey Loco Ludwig', bgg_url: 'https://boardgamegeek.com/boardgame/155426/castles-mad-king-ludwig', players_min: 1, players_max: 4, time_min: 90, time_max: 90, complexity: 'Ligeros', recommended_by: ['Jose Manuel', 'Rubén'], opinions: [{ author: 'Jose Manuel', quote: '"Uno ligero que me gusta mucho", "muy familiar, incluso para incluir a los padres".' }, { author: 'Rubén', quote: '"Más sencillo de explicar, y juegas con lo que tienes delante... más divertido jugar con gente nueva".' }] },
        { name: 'Hellapagos', bgg_url: 'https://boardgamegeek.com/boardgame/224272/hellapagos', players_min: 3, players_max: 12, time_min: 20, time_max: 20, complexity: 'Ligeros', recommended_by: ['Diego'], opinions: [{ author: 'Diego', quote: '"Bastante troll y facil de jugar (y corto). Para todo público".' }] },
        { name: 'Dice Forge', bgg_url: 'https://boardgamegeek.com/boardgame/194594/dice-forge', players_min: 2, players_max: 4, time_min: 45, time_max: 45, complexity: 'Ligeros', recommended_by: ['Javier'], opinions: [{ author: 'Javier', quote: '"Es sencillo y rápido... Consiste en ir cambiando las caras a d6 para mejorarlos".' }] },
        { name: 'The Gang', bgg_url: 'https://boardgamegeek.com/boardgame/346034/gang', players_min: 0, players_max: 0, time_min: 0, time_max: 0, complexity: 'Ligeros', recommended_by: ['Diego'], opinions: [{ author: 'Diego', quote: '"Poker colaborativo todo público".' }] },
        { name: 'Lost Ruins of Arnak', bgg_url: 'https://boardgamegeek.com/boardgame/312484/lost-ruins-arnak', players_min: 1, players_max: 4, time_min: 30, time_max: 120, complexity: 'Medios', recommended_by: ['Jose Manuel', 'Diego'], opinions: [{ author: 'Jose Manuel', quote: '"Euros medios no excesivamente complicados".' }, { author: 'Diego', quote: 'Lo clasifica como "Avanzado" y le da el visto bueno (👍).' }] },
        { name: 'Ankh: Dioses de Egipto', bgg_url: 'https://boardgamegeek.com/boardgame/285967/ankh-gods-egypt', players_min: 2, players_max: 5, time_min: 90, time_max: 90, complexity: 'Medios', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: '"Control de áreas y minis", "escala genial de 2 a 5".' }, { author: 'Alejandro', quote: '"Jugar con moñecos siempre mola" 😂.' }] },
        { name: 'Arquitectos del Reino del Oeste', bgg_url: 'https://boardgamegeek.com/boardgame/236457/architects-west-kingdom', players_min: 1, players_max: 5, time_min: 60, time_max: 80, complexity: 'Medios', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: '"No lo he probado, pero... también está muy bien en el rango de 2 a 4".' }] },
        { name: 'La Búsqueda del Planeta X', bgg_url: 'https://boardgamegeek.com/boardgame/279537/the-search-for-planet-x', players_min: 1, players_max: 4, time_min: 60, time_max: 75, complexity: 'Medios', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: '"Me gustó mucho. Hasta 4, es de deducción".' }] },
        { name: 'Piratas de Maracaibo', bgg_url: 'https://boardgamegeek.com/boardgame/276025/maracaibo', players_min: 1, players_max: 4, time_min: 60, time_max: 150, complexity: 'Medios', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: 'Lo menciona como una de sus "dos últimas recomendaciones" y lo clasifica como "medio".' }] },
        { name: 'Thunder Road: Vendetta', bgg_url: 'https://boardgamegeek.com/boardgame/342070/thunder-road-vendetta', players_min: 2, players_max: 4, time_min: 45, time_max: 75, complexity: 'Medios', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: '"No lo he probado, pero la gente dice que es una puta pasada".' }] },
        { name: '7 Wonders: Duel', bgg_url: 'https://boardgamegeek.com/boardgame/173346/7-wonders-duel', players_min: 2, players_max: 2, time_min: 30, time_max: 30, complexity: 'Medios', recommended_by: ['Diego'], opinions: [{ author: 'Diego', quote: '"La version 2 jugadores me parece la mejor".' }] },
        { name: 'Paleo', bgg_url: 'https://boardgamegeek.com/boardgame/300531/paleo', players_min: 1, players_max: 4, time_min: 45, time_max: 60, complexity: 'Medios', recommended_by: ['Diego'], opinions: [{ author: 'Diego', quote: 'Lo clasifica como "Algo mas simple" y "colaborativo".' }] },
        { name: 'Blood Rage', bgg_url: 'https://boardgamegeek.com/boardgame/170216/blood-rage', players_min: 2, players_max: 4, time_min: 60, time_max: 90, complexity: 'Medios', recommended_by: ['Javier'], opinions: [{ author: 'Javier', quote: '"Competitivo, profundo y ambientado en el Ragnarok".' }] },
        { name: 'Brass: Birmingham', bgg_url: 'https://boardgamegeek.com/boardgame/224517/brass-birmingham', players_min: 2, players_max: 4, time_min: 60, time_max: 120, complexity: 'Duros', recommended_by: ['Alejandro', 'Diego'], opinions: [{ author: 'Alejandro', quote: '"Genial, complejidad limite para explicar a mucha gente".' }, { author: 'Diego', quote: 'Lo clasifica como "Avanzado" y le da el visto bueno (👍).' }] },
        { name: 'Terraforming Mars', bgg_url: 'https://boardgamegeek.com/boardgame/167791/terraforming-mars', players_min: 1, players_max: 5, time_min: 120, time_max: 120, complexity: 'Duros', recommended_by: ['Alejandro', 'Jose Manuel'], opinions: [{ author: 'Alejandro', quote: '"Tengo el ojo echao", "la tematica mola y tiene fama de sobra".' }, { author: 'Jose Manuel', quote: 'Lo lista en la categoría de juegos duros.' }] },
        { name: 'Twilight Struggle', bgg_url: 'https://boardgamegeek.com/boardgame/12333/twilight-struggle', players_min: 2, players_max: 2, time_min: 120, time_max: 180, complexity: 'Duros', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: '"Sólo para 2. Es EL juego para enfrentamientos. Es serio".' }, { author: 'Rubén', quote: '"Alguien que juega por primera vez contra alguien que conoce el juego no tiene nada que hacer".' }] },
        { name: 'Barrage', bgg_url: 'https://boardgamegeek.com/boardgame/251247/barrage', players_min: 1, players_max: 4, time_min: 60, time_max: 120, complexity: 'Duros', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: '"Las puñaladas están a la orden del día por la puta agua".' }] },
        { name: 'Food Chain Magnate', bgg_url: 'https://boardgamegeek.com/boardgame/175914/food-chain-magnate', players_min: 2, players_max: 5, time_min: 120, time_max: 240, complexity: 'Duros', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: 'Lo recomienda como juego duro de "Gestión y económico".' }] },
        { name: 'Dune: Imperium', bgg_url: 'https://boardgamegeek.com/boardgame/316554/dune-imperium', players_min: 1, players_max: 4, time_min: 60, time_max: 120, complexity: 'Duros', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: 'Lo lista como juego duro y menciona su secuela/expansión "Uprising".' }] },
        { name: 'Eclipse: Segundo Amanecer para la Galaxia', bgg_url: 'https://boardgamegeek.com/boardgame/246900/eclipse-second-dawn-galaxy', players_min: 2, players_max: 6, time_min: 60, time_max: 200, complexity: 'Duros', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: 'Lo recomienda como juego duro de "Temática espacial".' }] },
        { name: 'Tainted Grail: La Caída de Ávalon', bgg_url: 'https://boardgamegeek.com/boardgame/264220/tainted-grail-fall-avalon', players_min: 1, players_max: 4, time_min: 60, time_max: 120, complexity: 'Duros', recommended_by: ['Javier'], opinions: [{ author: 'Javier', quote: '"Oscuro, jodido y con campaña".' }] },
        { name: 'ISS Vanguard', bgg_url: 'https://boardgamegeek.com/boardgame/325494/iss-vanguard', players_min: 1, players_max: 4, time_min: 90, time_max: 120, complexity: 'Duros', recommended_by: ['Javier'], opinions: [{ author: 'Javier', quote: '"También jodido y también de campaña. Exploración espacial".' }] },
        { name: 'Némesis', bgg_url: 'https://boardgamegeek.com/boardgame/167355/nemesis', players_min: 1, players_max: 5, time_min: 60, time_max: 120, complexity: 'Duros', recommended_by: ['Jose Manuel'], opinions: [{ author: 'Jose Manuel', quote: '"Alien hacendado, temático".' }] },
        { name: 'Tyrants of the Underdark', bgg_url: 'https://boardgamegeek.com/boardgame/189932/tyrants-underdark', players_min: 2, players_max: 4, time_min: 60, time_max: 60, complexity: 'Duros', recommended_by: ['Diego'], opinions: [{ author: 'Diego', quote: 'Lo clasifica como "Avanzado", "deck builder" y le da el visto bueno (👍).' }] },
    ];

    const playersInput = document.getElementById('players') as HTMLInputElement;
    const timeInput = document.getElementById('time') as HTMLInputElement;
    const complexityFilter = document.getElementById('complexity-filter') as HTMLElement;
    const gameGrid = document.getElementById('game-grid') as HTMLElement;
    const gameCount = document.getElementById('game-count') as HTMLSpanElement;

    let playerTimeChart: any | null = null;
    let recommenderChart: any | null = null;
    
    const complexityColors: { [key in ComplexityLevel]: string } = {
        'Ligeros': 'rgba(74, 222, 128, 0.7)',
        'Medios': 'rgba(250, 204, 21, 0.7)',
        'Duros': 'rgba(248, 113, 113, 0.7)'
    };
    const textColor = '#cbd5e1'; // slate-300
    const gridColor = 'rgba(71, 85, 105, 0.5)'; // slate-600 with opacity

    const renderGames = (games: Game[]) => {
        gameGrid.innerHTML = '';
        games.forEach(game => {
            if (game.time_max === 0) return; 
            const opinionsHTML = game.opinions.map(op => `
                <p class="text-sm text-slate-400 italic">“${op.quote}” <span class="font-semibold not-italic text-slate-300">- ${op.author}</span></p>
            `).join('');

            const titleHTML = game.bgg_url
                ? `<a href="${game.bgg_url}" target="_blank" rel="noopener noreferrer" class="hover:underline hover:text-violet-400 transition-colors">${game.name}</a>`
                : game.name;

            const card = `
                <div class="game-card p-6 rounded-xl flex flex-col">
                    <div class="flex-grow">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-xl font-bold text-slate-100">${titleHTML}</h3>
                            <span class="complexity-badge complexity-${game.complexity}">${game.complexity}</span>
                        </div>
                        <div class="flex items-center text-slate-400 text-sm mb-4 space-x-4">
                            <span><span aria-hidden="true">🎮</span> ${game.players_min}-${game.players_max} Jug.</span>
                            <span><span aria-hidden="true">⏳</span> ${game.time_min === game.time_max ? game.time_max : `${game.time_min}-${game.time_max}`} min</span>
                        </div>
                        <div class="space-y-2 mb-4">
                            ${opinionsHTML}
                        </div>
                    </div>
                    <div class="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-700">
                        Recomendado por: <span class="font-semibold text-slate-400">${game.recommended_by.join(', ')}</span>
                    </div>
                </div>
            `;
            gameGrid.innerHTML += card;
        });
        gameCount.textContent = games.length.toString();
    };

    const applyFilters = () => {
        const players = parseInt(playersInput.value, 10);
        const time = parseInt(timeInput.value, 10);
        const activeComplexity = complexityFilter.querySelector('.active')?.getAttribute('data-filter');

        let filteredGames = gamesData.filter(game => {
            if (game.time_max === 0) return false;

            const playersMatch = !players || (players >= game.players_min && players <= game.players_max);
            const timeMatch = !time || (game.time_max <= time);
            const complexityMatch = activeComplexity === 'Todos' || game.complexity === activeComplexity;
            
            return playersMatch && timeMatch && complexityMatch;
        });

        renderGames(filteredGames);
        updateCharts(filteredGames);
    };

    const initCharts = () => {
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor } } }
        };
        
        const ptCtx = (document.getElementById('playerTimeChart') as HTMLCanvasElement).getContext('2d');
        if (!ptCtx) return;
        playerTimeChart = new Chart(ptCtx, {
            type: 'bubble',
            data: { datasets: [] },
            options: { ...chartOptions,
                scales: {
                    x: { title: { display: true, text: 'Tiempo Máximo (min)', color: textColor }, ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { title: { display: true, text: 'Máximo de Jugadores', color: textColor }, ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true }
                },
                plugins: { ...chartOptions.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context: any) {
                                const label = context.raw.label || '';
                                return `${label}: ${context.raw.x} min, ${context.raw.y} jug.`;
                            }
                        }
                    }
                }
            }
        });

        const rCtx = (document.getElementById('recommenderChart') as HTMLCanvasElement).getContext('2d');
        if (!rCtx) return;
        recommenderChart = new Chart(rCtx, {
            type: 'bar',
            data: { labels: [], datasets: [] },
            options: { ...chartOptions,
                indexAxis: 'y',
                scales: { 
                    x: { beginAtZero: true, ticks: { color: textColor, stepSize: 1 }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor } }
                },
                plugins: { legend: { display: false } }
            }
        });
    };

    const updateCharts = (games: Game[]) => {
        if (!playerTimeChart || !recommenderChart) return;
        
        // Player-Time Chart
        const chartData = games.map(game => ({
            x: game.time_max,
            y: game.players_max,
            r: 8,
            backgroundColor: complexityColors[game.complexity],
            label: game.name
        }));
        playerTimeChart.data.datasets = [{
            label: 'Juegos',
            data: chartData
        }];
        playerTimeChart.update();

        // Recommender Chart
        const recommenderCounts: { [key: string]: number } = {};
        games.forEach(game => {
            game.recommended_by.forEach(person => {
                recommenderCounts[person] = (recommenderCounts[person] || 0) + 1;
            });
        });
        const sortedRecommenders = Object.entries(recommenderCounts).sort((a, b) => b[1] - a[1]);
        recommenderChart.data.labels = sortedRecommenders.map(e => e[0]);
        recommenderChart.data.datasets = [{
            label: 'Nº de Recomendaciones',
            data: sortedRecommenders.map(e => e[1]),
            backgroundColor: '#8b5cf6' // violet-500
        }];
        recommenderChart.update();
    };

    playersInput.addEventListener('input', applyFilters);
    timeInput.addEventListener('input', applyFilters);
    
    complexityFilter.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'BUTTON') {
            const currentActive = complexityFilter.querySelector('.active');
            if (currentActive) {
                currentActive.classList.remove('active');
                currentActive.setAttribute('aria-pressed', 'false');
            }
            target.classList.add('active');
            target.setAttribute('aria-pressed', 'true');
            applyFilters();
        }
    });

    initCharts();
    applyFilters();
});
