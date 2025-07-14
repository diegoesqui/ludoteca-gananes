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

const updateAuthUI = async (user) => {
    const editProfileBtn = document.getElementById('edit-profile-btn'); // Get reference before clearing authContainer

    if (user) {
        // Fetch user profile data
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            currentUser = user; // Still set user even if profile fetch fails
        } else {
            currentUser = { ...user, ...profile }; // Merge user and profile data
        }

        // Clear authContainer first to avoid duplicate buttons
        authContainer.innerHTML = '';

        const userDisplay = document.createElement('span');
        userDisplay.className = 'text-sm text-slate-400';
        userDisplay.textContent = currentUser.email;

        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.className = 'btn bg-transparent border-slate-600 hover:bg-slate-800 hover:border-violet-400 text-slate-300 py-1 px-3 rounded-lg text-sm';
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
        });

        editProfileBtn.classList.remove('hidden'); // Show edit profile button

        const loggedInContainer = document.createElement('div');
        loggedInContainer.className = 'flex items-center gap-2';
        loggedInContainer.appendChild(userDisplay);
        loggedInContainer.appendChild(editProfileBtn); // Append the existing button
        loggedInContainer.appendChild(logoutBtn);
        authContainer.appendChild(loggedInContainer);

    } else {
        currentUser = null;
        authContainer.innerHTML = ''; // Clear authContainer

        const loginBtn = document.createElement('button');
        loginBtn.id = 'login-btn';
        loginBtn.className = 'btn bg-transparent border-slate-600 hover:bg-slate-800 hover:border-violet-400 text-slate-300 py-1 px-3 rounded-lg text-sm';
        loginBtn.textContent = 'Login';
        loginBtn.addEventListener('click', () => {
            showModal('login-modal');
        });
        authContainer.appendChild(loginBtn);

        dynamicControls.innerHTML = '';
        document.getElementById('add-game-btn').classList.add('hidden'); // Hide add game button
        editProfileBtn.classList.add('hidden'); // Hide edit profile button
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
