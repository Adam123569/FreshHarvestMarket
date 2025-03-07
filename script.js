// Sample user database
const users = [
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" }
];

// Sample product database
const products = [
    { id: 1, name: "Fresh Organic Tomatoes", price: 3.99, image:"tomato-Istock-174932787.jpg", description: "Locally grown organic tomatoes" },
    { id: 2, name: "Leafy Green Spinach", price: 2.49, image: "spinach-1296x728-header.webp", description: "Nutrient-rich organic spinach" },
    { id: 3, name: "Sweet Strawberries", price: 4.99, image: "strawberry.jpg", description: "Hand-picked sweet strawberries" },
    { id: 4, name: "Crunchy Carrots", price: 1.99, image: "64631493.avif", description: "Farm-fresh organic carrots" },
    { id: 5, name: "Creamy Avocados", price: 2.99, image: "images.jpg", description: "Perfectly ripe avocados" },
    { id: 6, name: "Free-Range Eggs", price: 5.49, image: "Jesmond-Fruit-Barn-Styled-Eggs-Free-Range-1.webp", description: "Dozen free-range chicken eggs" }
];

// Global state
let isLoggedIn = false;
let currentUser = null;
let cart = [];

// DOM Elements
const shopLink = document.getElementById('shopLink');
const loginToggle = document.getElementById('loginToggle');
const cartToggle = document.getElementById('cartToggle');
const loginModal = document.getElementById('loginModal');
const cartModal = document.getElementById('cartModal');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const productsContainer = document.getElementById('products');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartMessage = document.getElementById('cartMessage');
const checkoutBtn = document.getElementById('checkoutBtn');
let registerToggle; // Define this variable to use it globally

// Initialize the application
function init() {
    // Create register button and modal first
    createRegisterElements();
    
    // Add event listeners
    setupEventListeners();
    
    // Populate products
    renderProducts();
}

// Create register button and modal
function createRegisterElements() {
    // Create register button if it doesn't exist
    if (!document.getElementById('registerToggle')) {
        const navMenu = loginToggle.parentElement;
        const registerButton = document.createElement('a');
        registerButton.href = '#';
        registerButton.id = 'registerToggle';
        registerButton.textContent = 'Register';
        registerButton.className = loginToggle.className; // Match login button style
        
        // Insert register button next to login button
        navMenu.insertBefore(registerButton, loginToggle.nextSibling);
        
        // Store reference to register toggle
        registerToggle = registerButton;
    }
    
    // Create register modal if it doesn't exist
    if (!document.getElementById('registerModal')) {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'registerModal';
        modalDiv.className = 'modal';
        
        modalDiv.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Create an Account</h2>
                <form id="registerForm">
                    <div class="form-group">
                        <label for="registerUsername">Email:</label>
                        <input type="email" id="registerUsername" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Password:</label>
                        <input type="password" id="registerPassword" required>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password:</label>
                        <input type="password" id="confirmPassword" required>
                    </div>
                    <button type="submit" class="btn">Register</button>
                </form>
                <p id="registerMessage"></p>
            </div>
        `;
        
        document.body.appendChild(modalDiv);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Shop link
    if (shopLink) {
        shopLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('shop').style.display = 'block';
            document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Login toggle
    loginToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(loginModal);
    });

    // Register toggle
    registerToggle = document.getElementById('registerToggle');
    if (registerToggle) {
        registerToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal(document.getElementById('registerModal'));
        });
    }

    // Cart toggle
    cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert("Please login to view your cart");
            toggleModal(loginModal);
            return;
        }
        toggleModal(cartModal);
        renderCart();
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegistration();
        });
    }

    // Close modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Toggle modal visibility
function toggleModal(modal) {
    if (modal) {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    }
}

// Handle user registration
function handleRegistration() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerMessage = document.getElementById('registerMessage');
    
    // Validate inputs
    if (!username || !password || !confirmPassword) {
        registerMessage.textContent = "All fields are required!";
        registerMessage.className = "error-message";
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        registerMessage.textContent = "Passwords do not match!";
        registerMessage.className = "error-message";
        return;
    }
    
    // Check if username already exists
    const userExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
    if (userExists) {
        registerMessage.textContent = "Email already registered!";
        registerMessage.className = "error-message";
        return;
    }
    
    // Add new user
    users.push({ username, password });
    
    // Show success message
    registerMessage.textContent = "Registration successful! You can now login.";
    registerMessage.className = "success-message";
    
    console.log("Users after registration:", users); // For debugging
    
    // Clear form and redirect to login after delay
    setTimeout(() => {
        document.getElementById('registerForm').reset();
        document.getElementById('registerModal').style.display = 'none';
        toggleModal(loginModal);
        
        // Pre-fill username in login form
        document.getElementById('username').value = username;
    }, 1500);
}

// Handle user login
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Find user (case insensitive username comparison)
    const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === password
    );

    if (user) {
        isLoggedIn = true;
        currentUser = user;
        loginMessage.textContent = "Login successful!";
        loginMessage.className = "success-message";
        
        // Update UI for logged in user
        loginToggle.textContent = "Logout";
        
        // Hide register button when logged in
        if (registerToggle) {
            registerToggle.style.display = 'none';
        }
        
        // Remove old event listeners and add logout handler
        const newLoginToggle = loginToggle.cloneNode(true);
        loginToggle.parentNode.replaceChild(newLoginToggle, loginToggle);
        loginToggle = newLoginToggle;
        loginToggle.addEventListener('click', handleLogout);
        
        // Close modal after short delay
        setTimeout(() => {
            loginModal.style.display = 'none';
            loginForm.reset();
            loginMessage.textContent = "";
        }, 1500);
    } else {
        loginMessage.textContent = "Invalid username or password!";
        loginMessage.className = "error-message";
    }
}

// Handle user logout
function handleLogout(e) {
    e.preventDefault();
    isLoggedIn = false;
    currentUser = null;
    cart = [];
    updateCartCount();
    
    // Update UI for logged out user
    loginToggle.textContent = "Login";
    
    // Show register button when logged out
    if (registerToggle) {
        registerToggle.style.display = '';
    }
    
    // Remove old event listeners and add login handler
    const newLoginToggle = loginToggle.cloneNode(true);
    loginToggle.parentNode.replaceChild(newLoginToggle, loginToggle);
    loginToggle = newLoginToggle;
    
    loginToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(loginModal);
    });
}

// Render products to the shop section
function renderProducts() {
    if (!productsContainer) {
        console.error("Products container not found!");
        return;
    }
    
    productsContainer.innerHTML = '';
    
    // Make sure we have products to display
    if (!products || products.length === 0) {
        productsContainer.innerHTML = '<p>No products available at this time.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to all 'Add to Cart' buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    console.log(`Rendered ${products.length} products`); // For debugging
}

// Add product to cart
function addToCart(e) {
    if (!isLoggedIn) {
        alert("Please login to add items to your cart");
        toggleModal(loginModal);
        return;
    }
    
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert("Product not found!");
        return;
    }
    
    // Check if item is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Render cart items
function renderCart() {
    if (!cartItems) {
        console.error("Cart items container not found!");
        return;
    }
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = 'Total: $0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
            <button class="remove-item" data-id="${item.id}">×</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    if (cartTotal) cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Remove item from cart
function removeFromCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    
    updateCartCount();
    renderCart();
}

// Update cart count in header
function updateCartCount() {
    if (!cartCount) return;
    
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Handle checkout process
function handleCheckout() {
    if (cart.length === 0) {
        cartMessage.textContent = "Your cart is empty!";
        cartMessage.className = "error-message";
        return;
    }
    
    // Simulate successful checkout
    cartMessage.textContent = "Order placed successfully! Thank you for shopping with us.";
    cartMessage.className = "success-message";
    
    // Clear cart after successful checkout
    setTimeout(() => {
        cart = [];
        updateCartCount();
        renderCart();
        cartMessage.textContent = "";
        
        // Close modal after short delay
        setTimeout(() => {
            cartModal.style.display = 'none';
        }, 1000);
    }, 2000);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);