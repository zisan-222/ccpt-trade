const sView = document.getElementById('signin-view');
const rView = document.getElementById('register-view');

// Create Account এ ক্লিক করলে রেজিস্টার পেজ আসবে
document.getElementById('go-to-register').addEventListener('click', (e) => {
    e.preventDefault();
    sView.classList.add('hidden');
    rView.classList.remove('hidden');
});

// Go to Sign In এ ক্লিক করলে লগইন পেজ আসবে
document.getElementById('go-to-signin').addEventListener('click', (e) => {
    e.preventDefault();
    rView.classList.add('hidden');
    sView.classList.remove('hidden');
});

// পাসওয়ার্ড দেখা এবং লুকানোর জন্য চোখ (Eye) আইকনের কাজ
function togglePass() {
    const input = document.getElementById('login-pass');
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}
