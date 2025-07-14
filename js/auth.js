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
const userEmailDisplay = document.getElementById('user-email-display');
const editProfileBtn = document.getElementById('edit-profile-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginBtn = document.getElementById('login-btn');
const addGameBtn = document.getElementById('add-game-btn');

const updateAuthUI = async (user) => {
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

        // Update content and visibility for logged-in state
        userEmailDisplay.textContent = currentUser.email;
        userEmailDisplay.classList.remove('hidden');

        editProfileBtn.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        loginBtn.classList.add('hidden'); // Hide login button

        addGameBtn.classList.remove('hidden'); // Show add game button

    } else {
        currentUser = null;

        // Update visibility for logged-out state
        userEmailDisplay.classList.add('hidden');
        editProfileBtn.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        loginBtn.classList.remove('hidden'); // Show login button

        addGameBtn.classList.add('hidden'); // Hide add game button
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

logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
});

export { currentUser, updateAuthUI };
