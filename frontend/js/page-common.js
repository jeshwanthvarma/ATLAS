// =====================================================
// ATLAS Shared Internal Page Logic
// frontend/js/page-common.js
// =====================================================

import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// =====================================================
// Authentication Protection
// =====================================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "/login.html";
        return;

    }

    // Display authenticated user information
    const userName =
        document.getElementById("userName");

    const userEmail =
        document.getElementById("userEmail");

    if (userName) {

        userName.textContent =
            user.displayName || "ATLAS User";

    }

    if (userEmail) {

        userEmail.textContent =
            user.email || "";

    }

});

// =====================================================
// Logout
// =====================================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();

            try {

                await signOut(auth);

                window.location.href =
                    "/login.html";

            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );

            }

        }
    );

}
