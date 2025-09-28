// Элементы DOM
const userAvatar = document.getElementById('user-avatar');
const usernameElement = document.getElementById('username');
const userBalance = document.getElementById('user-balance');
const logoutBtn = document.getElementById('logout-btn');
const depositBtn = document.getElementById('deposit-btn');
const withdrawBtn = document.getElementById('withdraw-btn');
const depositModal = document.getElementById('deposit-modal');
const withdrawModal = document.getElementById('withdraw-modal');
const closeButtons = document.querySelectorAll('.close');
const depositOptions = document.querySelectorAll('.deposit-option');
const confirmDepositBtn = document.getElementById('confirm-deposit');
const openCaseButtons = document.querySelectorAll('.open-case');
const historyItems = document.getElementById('history-items');
const caseAnimation = document.getElementById('case-animation');
const caseReward = document.getElementById('case-reward');
const rewardText = document.getElementById('reward-text');
const closeAnimationBtn = document.getElementById('close-animation');
const codeModal = document.getElementById('code-modal');
const codeInput = document.getElementById('code-input');
const codeError = document.getElementById('code-error');
const confirmCodeBtn = document.getElementById('confirm-code');
const botButton = document.getElementById('bot-button');
const withdrawAmountInput = document.getElementById('withdraw-amount');
const robloxUsernameInput = document.getElementById('roblox-username');
const confirmWithdrawBtn = document.getElementById('confirm-withdraw');
const availableBalanceSpan = document.getElementById('available-balance');

// Список допустимых кодов
const validCodes = [
    "uMKavm3mQ_", "70r0-kyveC", "e7CN8t_jiH", "8_-cwSf-_9", "56i5HRXNG_",
    "S8WFrmIWQ-", "wIjJv_y6KU", "G41sAkJ0_o", "56pB5T-VNL", "V5_CoV7dVn",
    "2Oeqawil-3", "CXw_114Jni", "6DB_8PnJma", "-x294E6XMd", "n-zvGRsM3f",
    "yD-6IHuqEq", "iSmPH-X5Sr", "Wso-IqbrX8", "LkM5J_xR3o", "1D_mnbZdmH",
    "ZogiGCh_l6", "7GyEbssV-V", "L_G2xZZCnR", "Q-54B3GSuT", "gz-dVlb7Md",
    "NaO-Z2g1UQ", "z1o-1N_LNy", "_KSp87Y8qN", "5aqDADv-qC", "DIF_uaEx0p",
    "X_BL9zi2_J", "gE8bLY-T5Q", "b-he6k9-dQ", "06FFp3iI_e", "1MeM2GwKa-",
    "lMy-hIzoe1", "bQ7-p_oEIS", "s9L-Y9oicB", "RycI86U_53", "96R_Usi5L8",
    "-zPjKGwD16", "8_-G25cZlz", "jrRew8W_N-", "z3iHBvA8-t", "pAbngo-40l",
    "c6-_GdvNO4", "QLH3817_bm", "sAB1Gsy-jz", "MiPIsa--6d", "4BcgP5z8-5"
];

// Текущий пользователь и выбранная сумма пополнения
let currentUser = null;
let selectedDepositAmount = 0;
let currentCasePrice = 0;

// Инициализация страницы
function initPage() {
    // Получаем текущего пользователя из localStorage
    const userData = localStorage.getItem('currentUser');
    
    if (!userData) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    
    // Инициализируем массив использованных кодов, если его нет
    if (!currentUser.usedCodes) {
        currentUser.usedCodes = [];
        // Сохраняем обновленные данные пользователя
        updateUserData();
    }
    
    // Обновляем информацию о пользователе
    userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
    usernameElement.textContent = currentUser.username;
    userBalance.textContent = `${currentUser.balance} Robux`;
    
    // Загружаем историю игр
    loadHistory();
}

// Обновление данных пользователя в localStorage
function updateUserData() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Загрузка истории игр
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
    
    // Очищаем контейнер истории
    historyItems.innerHTML = '';
    
    if (history.length === 0) {
        historyItems.innerHTML = '<div class="history-item">История игр пуста</div>';
        return;
    }
    
    // Добавляем элементы истории
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span>${item.text}</span>
            <span class="${item.win ? 'win' : 'loss'}">${item.win ? '+' : '-'}${item.amount}</span>
        `;
        historyItems.appendChild(historyItem);
    });
}

// Сохранение истории игр
function saveHistory(text, amount, win) {
    const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
    
    // Добавляем новую запись в начало
    history.unshift({
        text,
        amount,
        win,
        date: new Date().toISOString()
    });
    
    // Сохраняем историю (ограничиваем до 50 последних записей)
    localStorage.setItem('gameHistory', JSON.stringify(history.slice(0, 50)));
    
    // Обновляем отображение истории
    loadHistory();
}

// Обновление баланса пользователя
function updateBalance(amount) {
    currentUser.balance += amount;
    userBalance.textContent = `${currentUser.balance} Robux`;
    
    // Сохраняем обновленные данные пользователя
    updateUserData();
}

// Выход из системы
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

// Открытие модального окна пополнения
depositBtn.addEventListener('click', () => {
    depositModal.style.display = 'flex';
});

// Открытие модального окна вывода
withdrawBtn.addEventListener('click', () => {
    availableBalanceSpan.textContent = currentUser.balance;
    withdrawModal.style.display = 'flex';
});

// Закрытие модальных окон
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        depositModal.style.display = 'none';
        withdrawModal.style.display = 'none';
        codeModal.style.display = 'none';
        codeError.style.display = 'none';
        codeInput.value = '';
        // Сбрасываем выбранную сумму
        depositOptions.forEach(opt => opt.classList.remove('selected'));
        selectedDepositAmount = 0;
    });
});

// Выбор суммы пополнения
depositOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Убираем выделение у всех вариантов
        depositOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Выделяем выбранный вариант
        option.classList.add('selected');
        
        // Сохраняем выбранную сумму
        selectedDepositAmount = parseInt(option.getAttribute('data-amount'));
    });
});

// Подтверждение пополнения
confirmDepositBtn.addEventListener('click', () => {
    if (selectedDepositAmount > 0) {
        // Закрываем модальное окно пополнения
        depositModal.style.display = 'none';
        
        // Открываем модальное окно для ввода кода
        codeModal.style.display = 'flex';
    } else {
        alert('Выберите сумму пополнения!');
    }
});

// Подтверждение кода
confirmCodeBtn.addEventListener('click', () => {
    const enteredCode = codeInput.value.trim();
    
    // Проверяем код
    if (validCodes.includes(enteredCode)) {
        // Проверяем, не использовался ли код ранее
        if (currentUser.usedCodes.includes(enteredCode)) {
            codeError.textContent = 'Этот код уже был использован!';
            codeError.style.display = 'block';
            return;
        }
        
        // Код верный и не использовался, пополняем баланс
        updateBalance(selectedDepositAmount);
        
        // Добавляем код в список использованных
        currentUser.usedCodes.push(enteredCode);
        updateUserData();
        
        // Сохраняем в историю транзакций
        saveHistory(`Пополнение баланса`, selectedDepositAmount, true);
        
        // Закрываем модальное окно
        codeModal.style.display = 'none';
        codeError.style.display = 'none';
        codeInput.value = '';
        
        // Сбрасываем выбранную сумму
        depositOptions.forEach(opt => opt.classList.remove('selected'));
        selectedDepositAmount = 0;
        
        alert(`Баланс успешно пополнен на ${selectedDepositAmount} Robux!`);
    } else {
        // Неверный код
        codeError.textContent = 'Неверный код. Пожалуйста, проверьте и попробуйте снова.';
        codeError.style.display = 'block';
    }
});

// Подтверждение вывода
confirmWithdrawBtn.addEventListener('click', () => {
    const amount = parseInt(withdrawAmountInput.value);
    const username = robloxUsernameInput.value.trim();
    
    if (!amount || amount < 30) {
        alert('Минимальная сумма вывода - 30 Robux');
        return;
    }
    
    if (amount > currentUser.balance) {
        alert('Недостаточно средств для вывода');
        return;
    }
    
    if (!username) {
        alert('Введите имя пользователя Roblox');
        return;
    }
    
    // Вычитаем сумму вывода из баланса
    updateBalance(-amount);
    
    // Сохраняем в историю транзакций
    saveHistory(`Вывод средств на аккаунт ${username}`, amount, false);
    
    // Закрываем модальное окно
    withdrawModal.style.display = 'none';
    withdrawAmountInput.value = '';
    robloxUsernameInput.value = '';
    
    alert(`Запрос на вывод ${amount} Robux на аккаунт ${username} отправлен!`);
});

// Открытие кейса
openCaseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const price = parseInt(button.getAttribute('data-price'));
        currentCasePrice = price;
        
        // Проверяем достаточно ли средств
        if (currentUser.balance < price) {
            alert('Недостаточно средств для открытия кейса!');
            return;
        }
        
        // Вычитаем стоимость кейса
        updateBalance(-price);
        
        // Отображаем анимацию открытия
        showCaseAnimation();
    });
});

// Показать анимацию открытия кейса
function showCaseAnimation() {
    caseAnimation.classList.add('active');
    caseReward.className = 'case-reward spinning';
    caseReward.innerHTML = '<i class="fas fa-spinner"></i>';
    rewardText.textContent = 'Открываем кейс...';
    
    // Симулируем задержку открытия кейса
    setTimeout(() => {
        // Определяем выигрыш
        const winAmount = calculateWinAmount(currentCasePrice);
        const win = winAmount > 0;
        
        // Обновляем анимацию с результатом
        caseReward.className = 'case-reward';
        caseReward.innerHTML = win ? '<i class="fas fa-gift" style="color: #4ade80;"></i>' : '<i class="fas fa-times" style="color: #f87171;"></i>';
        rewardText.textContent = win ? `Поздравляем! Вы выиграли ${winAmount} Robux!` : 'К сожалению, вы ничего не выиграли';
        
        // Обновляем баланс если выиграли
        if (win) {
            updateBalance(winAmount);
        }
        
        // Сохраняем в историю
        saveHistory(`Открытие кейса за ${currentCasePrice} Robux`, win ? winAmount : currentCasePrice, win);
    }, 2000);
}

// Расчет выигрыша
function calculateWinAmount(price) {
    // Вероятности выигрыша зависят от цены кейса
    const winChance = Math.random() * 100;
    
    if (price === 10) {
        // Стартовый кейс: 70% шанс выиграть
        if (winChance < 70) {
            return Math.floor(price * (1 + Math.random() * 2)); // 1x-3x
        }
    } else if (price === 50) {
        // Обычный кейс: 60% шанс выиграть
        if (winChance < 60) {
            return Math.floor(price * (1 + Math.random() * 3)); // 1x-4x
        }
    } else if (price === 100) {
        // Премиум кейс: 50% шанс выиграть
        if (winChance < 50) {
            return Math.floor(price * (1 + Math.random() * 4)); // 1x-5x
        }
    } else if (price === 200) {
        // Золотой кейс: 40% шанс выиграть
        if (winChance < 40) {
            return Math.floor(price * (1 + Math.random() * 5)); // 1x-6x
        }
    } else if (price === 500) {
        // Бриллиантовый кейс: 30% шанс выиграть
        if (winChance < 30) {
            return Math.floor(price * (1 + Math.random() * 6)); // 1x-7x
        }
    } else if (price === 1000) {
        // Легендарный кейс: 20% шанс выиграть
        if (winChance < 20) {
            return Math.floor(price * (1 + Math.random() * 7)); // 1x-8x
        }
    } else if (price === 2000) {
        // Ультимейт кейс: 15% шанс выиграть
        if (winChance < 15) {
            return Math.floor(price * (1 + Math.random() * 8)); // 1x-9x
        }
    } else if (price === 5000) {
        // Эпический кейс: 10% шанс выиграть
        if (winChance < 10) {
            return Math.floor(price * (1 + Math.random() * 9)); // 1x-10x
        }
    } else if (price === 10000) {
        // Мифический кейс: 5% шанс выиграть
        if (winChance < 5) {
            return Math.floor(price * (1 + Math.random() * 10)); // 1x-11x
        }
    }
    
    return 0; // Проигрыш
}

// Закрытие анимации
closeAnimationBtn.addEventListener('click', () => {
    caseAnimation.classList.remove('active');
});

// Кнопка "Получить код"
botButton.addEventListener('click', () => {
    alert('Инструкция по получению кода:\n\n1. Создайте пасс в Roblox на 1 Robux\n2. Зайдите в плейс "Please donate"\n3. Нажмите на иконку с подарком\n4. В первую строку впишите: Robux_caseTop\n5. Во вторую строку впишите свой ник в Roblox\n6. Нажмите "Gift"\n7. Выберите пасс на нужную сумму\n8. Купите пасс\n9. Код придёт в течение 24 часов');
});

// Закрытие модальных окон при клике вне их
window.addEventListener('click', (e) => {
    if (e.target === depositModal) {
        depositModal.style.display = 'none';
    }
    if (e.target === withdrawModal) {
        withdrawModal.style.display = 'none';
    }
    if (e.target === codeModal) {
        codeModal.style.display = 'none';
        codeError.style.display = 'none';
        codeInput.value = '';
    }
});

// Инициализация страницы при загрузке
document.addEventListener('DOMContentLoaded', initPage);
