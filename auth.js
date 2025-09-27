// Элементы DOM для страницы входа
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

// Элементы DOM для страницы регистрации
const registerUsername = document.getElementById('register-username');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerConfirm = document.getElementById('register-confirm');
const registerBtn = document.getElementById('register-btn');
const registerError = document.getElementById('register-error');

// Функция для получения списка пользователей
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Функция для сохранения пользователей
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Обработчик входа
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();
        
        if (!email || !password) {
            loginError.textContent = 'Заполните все поля';
            loginError.style.display = 'block';
            return;
        }
        
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Сохраняем текущего пользователя
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Перенаправляем на главную страницу
            window.location.href = 'index.html';
        } else {
            loginError.textContent = 'Неверный email или пароль';
            loginError.style.display = 'block';
        }
    });
}

// Обработчик регистрации
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        const username = registerUsername.value.trim();
        const email = registerEmail.value.trim();
        const password = registerPassword.value.trim();
        const confirm = registerConfirm.value.trim();
        
        if (!username || !email || !password || !confirm) {
            registerError.textContent = 'Заполните все поля';
            registerError.style.display = 'block';
            return;
        }
        
        if (password !== confirm) {
            registerError.textContent = 'Пароли не совпадают';
            registerError.style.display = 'block';
            return;
        }
        
        if (password.length < 6) {
            registerError.textContent = 'Пароль должен содержать минимум 6 символов';
            registerError.style.display = 'block';
            return;
        }
        
        const users = getUsers();
        
        // Проверяем, существует ли пользователь с таким email
        if (users.find(u => u.email === email)) {
            registerError.textContent = 'Пользователь с таким email уже существует';
            registerError.style.display = 'block';
            return;
        }
        
        // Создаем нового пользователя
        const newUser = {
            username,
            email,
            password,
            balance: 0,
            registrationDate: new Date().toISOString()
        };
        
        users.push(newUser);
        saveUsers(users);
        
        // Автоматически входим под новым пользователем
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Перенаправляем на главную страницу
        window.location.href = 'index.html';
    });
}

// Проверка авторизации на главной странице
if (window.location.pathname.includes('index.html')) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

// Проверка, если пользователь уже авторизован, перенаправляем на главную
if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
}