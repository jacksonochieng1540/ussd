document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const ussdInput = document.getElementById('ussd-input');
    const ussdMessages = document.getElementById('ussd-messages');
    const keyButtons = document.querySelectorAll('.key');
    const backBtn = document.getElementById('back-btn');
    const sendBtn = document.getElementById('send-btn');
    const timeDisplay = document.getElementById('current-time');
    
    // Update time
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}`;
    }
    
    setInterval(updateTime, 1000);
    updateTime();
    
    // Keypad functionality
    keyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            ussdInput.value += value;
        });
    });
    
    // Backspace button
    backBtn.addEventListener('click', function() {
        ussdInput.value = ussdInput.value.slice(0, -1);
    });
    
    // Send button
    sendBtn.addEventListener('click', processInput);
    
    // Handle Enter key
    ussdInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processInput();
        }
    });
    
    // USSD menu states
    let currentMenu = 'main';
    let userBalance = 1000; // Example balance
    
    // Process user input
    function processInput() {
        const input = ussdInput.value.trim();
        
        if (!input) return;
        
        // Add user input to messages
        addMessage(input, 'sent');
        ussdInput.value = '';
        
        // Process based on current menu
        switch(currentMenu) {
            case 'main':
                handleMainMenu(input);
                break;
            case 'balance':
                handleBalanceMenu(input);
                break;
            case 'data':
                handleDataMenu(input);
                break;
            case 'airtime':
                handleAirtimeMenu(input);
                break;
            case 'care':
                handleCareMenu(input);
                break;
        }
    }
    
    // Add message to display
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.textContent = text;
        ussdMessages.appendChild(messageDiv);
        ussdMessages.scrollTop = ussdMessages.scrollHeight;
    }
    
    // Menu handlers
    function handleMainMenu(input) {
        switch(input) {
            case '1':
                addMessage(`Your balance is $${userBalance}`, 'received');
                addMessage('1. Back\n2. Main Menu', 'received');
                currentMenu = 'balance';
                break;
            case '2':
                addMessage('Data Bundles:', 'received');
                addMessage('1. Daily - $1 (100MB)\n2. Weekly - $5 (1GB)\n3. Monthly - $15 (5GB)\n4. Back', 'received');
                currentMenu = 'data';
                break;
            case '3':
                addMessage('Airtime Top-up:', 'received');
                addMessage('Enter amount (e.g., 10 for $10)\nOr 0 to go back', 'received');
                currentMenu = 'airtime';
                break;
            case '4':
                addMessage('Customer Care:', 'received');
                addMessage('1. Call us\n2. Email us\n3. Live chat\n4. Back', 'received');
                currentMenu = 'care';
                break;
            default:
                addMessage('Invalid option. Please try again.', 'received');
                showMainMenu();
        }
    }
    
    function handleBalanceMenu(input) {
        switch(input) {
            case '1':
                showMainMenu();
                break;
            case '2':
                showMainMenu();
                break;
            default:
                addMessage('Invalid option. Please try again.', 'received');
                addMessage('1. Back\n2. Main Menu', 'received');
        }
    }
    
    function handleDataMenu(input) {
        switch(input) {
            case '1':
                if (userBalance >= 1) {
                    userBalance -= 1;
                    addMessage('You have purchased Daily bundle (100MB). $1 deducted.', 'received');
                } else {
                    addMessage('Insufficient balance for this bundle.', 'received');
                }
                showMainMenu();
                break;
            case '2':
                if (userBalance >= 5) {
                    userBalance -= 5;
                    addMessage('You have purchased Weekly bundle (1GB). $5 deducted.', 'received');
                } else {
                    addMessage('Insufficient balance for this bundle.', 'received');
                }
                showMainMenu();
                break;
            case '3':
                if (userBalance >= 15) {
                    userBalance -= 15;
                    addMessage('You have purchased Monthly bundle (5GB). $15 deducted.', 'received');
                } else {
                    addMessage('Insufficient balance for this bundle.', 'received');
                }
                showMainMenu();
                break;
            case '4':
                showMainMenu();
                break;
            default:
                addMessage('Invalid option. Please try again.', 'received');
                addMessage('1. Daily - $1 (100MB)\n2. Weekly - $5 (1GB)\n3. Monthly - $15 (5GB)\n4. Back', 'received');
        }
    }
    
    function handleAirtimeMenu(input) {
        if (input === '0') {
            showMainMenu();
            return;
        }
        
        const amount = parseFloat(input);
        if (isNaN(amount) || amount <= 0) {
            addMessage('Invalid amount. Please enter a positive number.', 'received');
            addMessage('Enter amount (e.g., 10 for $10)\nOr 0 to go back', 'received');
            return;
        }
        
        userBalance += amount;
        addMessage(`Success! $${amount} airtime added to your account.`, 'received');
        showMainMenu();
    }
    
    function handleCareMenu(input) {
        switch(input) {
            case '1':
                addMessage('Please call 12345 for assistance. Thank you!', 'received');
                showMainMenu();
                break;
            case '2':
                addMessage('Email us at support@mymobile.com. Thank you!', 'received');
                showMainMenu();
                break;
            case '3':
                addMessage('Live chat is currently unavailable. Please try again later.', 'received');
                showMainMenu();
                break;
            case '4':
                showMainMenu();
                break;
            default:
                addMessage('Invalid option. Please try again.', 'received');
                addMessage('1. Call us\n2. Email us\n3. Live chat\n4. Back', 'received');
        }
    }
    
    function showMainMenu() {
        currentMenu = 'main';
        addMessage('1. Check Balance', 'received');
        addMessage('2. Buy Data', 'received');
        addMessage('3. Airtime Top-up', 'received');
        addMessage('4. Customer Care', 'received');
    }
    
    // Initialize with main menu
    showMainMenu();
});