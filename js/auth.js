import { supabase } from './supabase.js';

let currentUser = null;

const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const closeLoginModalBtn = document.getElementById('close-login-modal-btn');
const loginError = document.getElementById('login-error');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authContainer = document.getElementById('auth-container');
const dynamicControls = document.getElementById('dynamic-controls');

const updateAuthUI = (user) => {
    currentUser = user;
    if (user) {
        authContainer.innerHTML = `
            <div class="flex items-center">
                <span class="text-sm mr-4">Hola, ${user.email}</span>
                <button id="logout-btn" class="btn bg-red-600 hover:bg-red-500 !text-white font-bold py-2 px-4 rounded-lg">Salir</button>
            </div>
        `;
        document.getElementById('logout-btn').addEventListener('click', async () => {
            await supabase.auth.signOut();
        });
        dynamicControls.innerHTML = '<button id="add-game-btn" class="btn bg-green-600 hover:bg-green-500 !text-white font-bold py-2 px-4 rounded-lg">Añadir Juego</button>';
        document.getElementById('add-game-btn').addEventListener('click', () => {
            document.getElementById('game-modal-title').textContent = 'AÑADIR NUEVO JUEGO';
            document.getElementById('game-form').reset();
            document.getElementById('game-id').value = '';
            document.getElementById('game-error').classList.add('hidden');
            document.getElementById('game-modal').classList.remove('hidden');
        });
    } else {
        authContainer.innerHTML = '<button id="login-btn" class="btn bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg">Entrar</button>';
        document.getElementById('login-btn').addEventListener('click', () => {
            loginModal.classList.remove('hidden');
        });
        dynamicControls.innerHTML = '';
    }
};

supabase.auth.onAuthStateChange((_event, session) => {
    updateAuthUI(session?.user);
});

closeLoginModalBtn.addEventListener('click', () => loginModal.classList.add('hidden'));
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');
    const { error } = await supabase.auth.signInWithPassword({ email: emailInput.value, password: passwordInput.value });
    if (error) {
        console.error('Login failed:', error);
        loginError.textContent = error.message;
        loginError.classList.remove('hidden');
    } else {
        loginModal.classList.add('hidden');
        loginForm.reset();
    }
});

export { currentUser, updateAuthUI };
