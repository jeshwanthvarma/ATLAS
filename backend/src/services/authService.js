const authRepository = require("../repositories/authRepository");

// ======================================================
// Sync Firebase User
// ======================================================

async function syncFirebaseUser(firebaseUser) {

    let user = await authRepository.findUserByEmail(
        firebaseUser.email
    );

    if (user) {

        await authRepository.updateLastLogin(
            user.user_id
        );

        return user;

    }

    const names = (firebaseUser.name || "").trim().split(" ");

    const firstName = names[0] || "ATLAS";

    const lastName =
        names.slice(1).join(" ") || "";

    const username =
        firebaseUser.email.split("@")[0];

    user = await authRepository.createFirebaseUser({

        firebase_uid: firebaseUser.uid,

        first_name: firstName,

        last_name: lastName,

        username,

        email: firebaseUser.email,

        auth_provider: "firebase"

    });

    return user;

}

module.exports = {

    syncFirebaseUser

};