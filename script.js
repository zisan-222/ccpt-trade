const passwordInput = document.querySelector('input[type="password"]');
const eyeIcon = document.querySelector('.fa-eye-slash');

if (passwordInput && eyeIcon) {
    eyeIcon.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        }
    });
}
