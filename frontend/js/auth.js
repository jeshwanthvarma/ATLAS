// ======================================================
// ATLAS Authentication
// frontend/js/auth.js
// ======================================================

import { auth, googleProvider } from "./firebase.js";
import API from "./api.js";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ======================================================
// DOM Elements
// ======================================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const googleLoginBtn = document.getElementById("googleLoginBtn");
const googleRegisterBtn = document.getElementById("googleRegisterBtn");

const forgotPassword = document.getElementById("forgotPassword");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");

const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorMessage");

const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

// ======================================================
// Helper Functions
// ======================================================

function showLoading(show) {

    if (loading) {

        loading.style.display = show ? "block" : "none";

    }

}

function showError(message) {

    if (!errorBox) return;

    errorBox.style.display = "block";
    errorBox.innerHTML = message;

}

function hideError() {

    if (!errorBox) return;

    errorBox.style.display = "none";

}

function redirectDashboard() {

    window.location.href = "dashboard.html";

}

// ======================================================
// Password Toggle
// ======================================================

if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            if (eyeIcon) {

                eyeIcon.classList.replace(
                    "fa-eye",
                    "fa-eye-slash"
                );

            }

        } else {

            passwordInput.type = "password";

            if (eyeIcon) {

                eyeIcon.classList.replace(
                    "fa-eye-slash",
                    "fa-eye"
                );

            }

        }

    });

}

// ======================================================
// Email Login
// ======================================================

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        hideError();

        showLoading(true);

        try {

            await setPersistence(

                auth,

                rememberMe && rememberMe.checked

                    ? browserLocalPersistence

                    : browserSessionPersistence

            );

            const credential = await signInWithEmailAndPassword(

    auth,

    emailInput.value.trim(),

    passwordInput.value

);

// Sync user with backend
await API.syncUser();

// Redirect only after successful sync
redirectDashboard();

        }

        catch (error) {

            console.error(error);

            showError(error.message);

        }

        finally {

            showLoading(false);

        }

    });

}

// ======================================================
// Google Login
// ======================================================

if (googleLoginBtn) {

    googleLoginBtn.addEventListener("click", async () => {

        hideError();

        showLoading(true);

        try  {

            const credential = await signInWithPopup(

    auth,

    googleProvider

);

// Sync user with backend
await API.syncUser();

// Redirect after successful sync
        redirectDashboard();
        }

        catch (error) {

            console.error(error);

            showError(error.message);

        }

        finally {

            showLoading(false);

        }

    });

}

// ======================================================
// Forgot Password
// ======================================================

if (forgotPassword) {

    forgotPassword.addEventListener("click", async (e) => {

        e.preventDefault();

        hideError();

        const email = emailInput.value.trim();

        if (!email) {

            showError(

                "Please enter your email first."

            );

            return;

        }

        try {

            await sendPasswordResetEmail(

                auth,

                email

            );

            alert("Password reset email sent.");

        }

        catch (error) {

            console.error(error);

            showError(error.message);

        }

    });

}

// ======================================================
// Registration
// ======================================================

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        hideError();

        showLoading(true);

        try {

            const fullName = document
                .getElementById("fullName")
                .value
                .trim();

            const email = document
                .getElementById("email")
                .value
                .trim();

            const password = document
                .getElementById("password")
                .value;

            const confirmPassword = document
                .getElementById("confirmPassword")
                .value;

            if (password !== confirmPassword) {

                throw new Error(
                    "Passwords do not match."
                );

            }

            const credential =

    await createUserWithEmailAndPassword(

        auth,

        email,

        password

    );

await updateProfile(

    credential.user,

    {

        displayName: fullName

    }

);

// Sync user with backend
await API.syncUser();

alert("Registration Successful");

redirectDashboard();

        }

        catch (error) {

            console.error(error);

            showError(error.message);

        }

        finally {

            showLoading(false);

        }

    });

}

// ======================================================
// Google Registration
// ======================================================

if (googleRegisterBtn) {

    googleRegisterBtn.addEventListener("click", async () => {

        hideError();

        showLoading(true);

        try {

            const credential = await signInWithPopup(

    auth,

    googleProvider

);

// Sync user with backend
await API.syncUser();

// Redirect after successful sync
redirectDashboard();

        }

        catch (error) {

            console.error(error);

            showError(error.message);

        }

        finally {

            showLoading(false);

        }

    });

}