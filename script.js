// E-commerce Website JavaScript
class EcommerceApp {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.cart = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.searchTerm = '';
        this.filters = {
            categories: [],
            priceRange: { min: 0, max: 50000 },
            ratings: []
        };
        this.sortBy = 'name';

        this.initializeApp();
        this.setupEventListeners();
        this.generateSampleProducts();
        this.renderProducts();
    }

    initializeApp() {
        // Initialize cart from localStorage if available
        const savedCart = localStorage.getItem('shopEaseCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartCount();
        }
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Filters
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateFilters());
        });

        document.querySelectorAll('.rating-filter').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateFilters());
        });

        document.getElementById('minPrice').addEventListener('input', () => this.updatePriceRange());
        document.getElementById('maxPrice').addEventListener('input', () => this.updatePriceRange());

        document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());

        // Sorting
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFiltersAndSort();
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => this.changePage(-1));
        document.getElementById('nextPage').addEventListener('click', () => this.changePage(1));

        // Cart modal
        document.getElementById('cartBtn').addEventListener('click', () => this.showCartModal());
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeModals());
        });

        // Checkout
        document.getElementById('checkoutBtn').addEventListener('click', () => this.showCheckoutModal());
        document.getElementById('nextToPayment').addEventListener('click', () => this.nextCheckoutStep());
        document.getElementById('backToShipping').addEventListener('click', () => this.previousCheckoutStep());
        document.getElementById('checkoutForm').addEventListener('submit', (e) => this.processOrder(e));

        // Continue shopping buttons
        document.getElementById('continueShopping').addEventListener('click', () => this.closeModals());
        document.getElementById('closeSuccess').addEventListener('click', () => {
            document.getElementById('successModal').style.display = 'none';
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
    }

    generateSampleProducts() {
        this.products = [
            {
                id: 1,
                name: "boAt Rockerz 450 Bluetooth Headphones",
                price: 1499,
                category: "electronics",
                rating: 4.1,
                reviews: 2847,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
                description: "Wireless Bluetooth Headphones with 40mm drivers, 15 hours battery life"
            },
            {
                id: 2,
                name: "Apple Watch Series 8 GPS",
                price: 41900,
                category: "electronics",
                rating: 4.6,
                reviews: 892,
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
                description: "GPS + Cellular, 45mm Space Gray Aluminium Case with Black Sport Band"
            },
            {
                id: 3,
                name: "Allen Solly Men's Regular Fit Polo",
                price: 899,
                category: "clothing",
                rating: 4.0,
                reviews: 1245,
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop",
                description: "Solid Polo Collar T-shirt, Regular Fit, Cotton Blend"
            },
            {
                id: 4,
                name: "Eloquent JavaScript, 3rd Edition",
                price: 1499,
                category: "books",
                rating: 4.7,
                reviews: 567,
                image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop",
                description: "A Modern Introduction to Programming by Marijn Haverbeke"
            },
            {
                id: 5,
                name: "Gardena Comfort Flex Hose Pipe",
                price: 2499,
                category: "home",
                rating: 4.2,
                reviews: 334,
                image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
                description: "15m Hose Pipe with 7 Pattern Spray Nozzle, Flexible and Kink-Free"
            },
            {
                id: 6,
                name: "Yonex Muscle Power 29 Badminton Racquet",
                price: 1899,
                category: "sports",
                rating: 4.3,
                reviews: 892,
                image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop",
                description: "Graphite Badminton Racquet with Full Cover, Ideal for Beginners"
            },
            {
                id: 7,
                name: "Logitech G305 Lightspeed Wireless Mouse",
                price: 3999,
                category: "electronics",
                rating: 4.4,
                reviews: 1234,
                image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=200&fit=crop",
                description: "Wireless Gaming Mouse, 12,000 DPI, 250 Hours Battery Life"
            },
            {
                id: 8,
                name: "Levi's Men's 512 Slim Fit Jeans",
                price: 2999,
                category: "clothing",
                rating: 4.1,
                reviews: 756,
                image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=200&fit=crop",
                description: "Slim Fit Jeans, Stretchable, 5 Pocket Design"
            },
            {
                id: 9,
                name: "The Pragmatic Programmer",
                price: 2199,
                category: "books",
                rating: 4.8,
                reviews: 445,
                image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=200&fit=crop",
                description: "Your Journey to Mastery by David Thomas and Andrew Hunt"
            },
            {
                id: 10,
                name: "Philips HD6975/00 Electric Kettle",
                price: 2299,
                category: "home",
                rating: 4.3,
                reviews: 2156,
                image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop",
                description: "1.7L Electric Kettle with Cordless Pouring, 2400W"
            },
            {
                id: 11,
                name: "Lifelong LLTM09 Treadmill",
                price: 14999,
                category: "sports",
                rating: 4.0,
                reviews: 234,
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
                description: "Motorized Treadmill, 2.5HP, Max Speed 12km/h, LCD Display"
            },
            {
                id: 12,
                name: "Wipro Garnet 9W LED Bulb",
                price: 149,
                category: "home",
                rating: 4.2,
                reviews: 3456,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
                description: "Pack of 2 LED Bulbs, Cool White, 9 Watts, B22 Pin Type"
            },
            {
                id: 13,
                name: "Nike Air Zoom Pegasus 39",
                price: 8999,
                category: "sports",
                rating: 4.5,
                reviews: 678,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
                description: "Men's Running Shoes with React Foam, Breathable Mesh Upper"
            },
            {
                id: 14,
                name: "Sony WF-1000XM4 Wireless Earbuds",
                price: 19990,
                category: "electronics",
                rating: 4.6,
                reviews: 1234,
                image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=200&fit=crop",
                description: "Industry Leading Noise Cancellation, 8 Hours Battery Life"
            },
            {
                id: 15,
                name: "Adidas Men's Regular Fit T-Shirt",
                price: 1299,
                category: "clothing",
                rating: 4.2,
                reviews: 892,
                image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=200&fit=crop",
                description: "Regular Fit Crew Neck T-Shirt, 100% Cotton, Moisture Wicking"
            }
        ];
        this.filteredProducts = [...this.products];
    }

    handleSearch() {
        this.searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        this.applyFiltersAndSort();
    }

    updateFilters() {
        // Update category filters
        this.filters.categories = Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(checkbox => checkbox.value);

        // Update rating filters
        this.filters.ratings = Array.from(document.querySelectorAll('.rating-filter:checked'))
            .map(checkbox => parseInt(checkbox.value));

        this.applyFiltersAndSort();
    }

    updatePriceRange() {
        const minPrice = parseInt(document.getElementById('minPrice').value);
        const maxPrice = parseInt(document.getElementById('maxPrice').value);

        // Ensure min doesn't exceed max
        if (minPrice > maxPrice) {
            document.getElementById('minPrice').value = maxPrice;
            this.filters.priceRange.min = maxPrice;
        } else {
            this.filters.priceRange.min = minPrice;
        }

        this.filters.priceRange.max = maxPrice;

        // Update display
        document.getElementById('minPriceDisplay').textContent = `₹${this.filters.priceRange.min}`;
        document.getElementById('maxPriceDisplay').textContent = `₹${this.filters.priceRange.max}`;

        this.applyFiltersAndSort();
    }

    clearFilters() {
        // Clear category filters
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Clear rating filters
        document.querySelectorAll('.rating-filter').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset price range
        document.getElementById('minPrice').value = 0;
        document.getElementById('maxPrice').value = 50000;
        this.filters.priceRange = { min: 0, max: 50000 };
        document.getElementById('minPriceDisplay').textContent = '₹0';
        document.getElementById('maxPriceDisplay').textContent = '₹50000';

        // Clear search
        document.getElementById('searchInput').value = '';
        this.searchTerm = '';

        this.filters.categories = [];
        this.filters.ratings = [];

        this.applyFiltersAndSort();
    }

    applyFiltersAndSort() {
        let filtered = [...this.products];

        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(this.searchTerm) ||
                product.description.toLowerCase().includes(this.searchTerm)
            );
        }

        // Apply category filter
        if (this.filters.categories.length > 0) {
            filtered = filtered.filter(product =>
                this.filters.categories.includes(product.category)
            );
        }

        // Apply price filter
        filtered = filtered.filter(product =>
            product.price >= this.filters.priceRange.min &&
            product.price <= this.filters.priceRange.max
        );

        // Apply rating filter
        if (this.filters.ratings.length > 0) {
            filtered = filtered.filter(product =>
                this.filters.ratings.some(rating => product.rating >= rating)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return b.id - a.id; // Assuming higher ID means newer
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
    }

    renderProducts() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
        } else {
            productsToShow.forEach(product => {
                const productCard = this.createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        }

        this.updateResultsCount();
        this.renderPagination();
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';

        const stars = this.generateStars(product.rating);

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <span class="product-category">${this.capitalizeFirst(product.category)}</span>
                <button class="add-to-cart-btn" onclick="app.addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;

        return card;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        // Half star
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    updateResultsCount() {
        const count = this.filteredProducts.length;
        document.getElementById('resultsText').textContent =
            `Showing ${count} product${count !== 1 ? 's' : ''}`;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const pageNumbers = document.getElementById('pageNumbers');

        pageNumbers.innerHTML = '';

        // Previous button state
        document.getElementById('prevPage').disabled = this.currentPage === 1;

        // Next button state
        document.getElementById('nextPage').disabled = this.currentPage === totalPages;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => this.goToPage(i));
            pageNumbers.appendChild(pageBtn);
        }
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const newPage = this.currentPage + direction;

        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.renderProducts();
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.updateCartCount();
        this.saveCart();
        this.showAddToCartNotification(product.name);
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }

    saveCart() {
        localStorage.setItem('shopEaseCart', JSON.stringify(this.cart));
    }

    showAddToCartNotification(productName) {
        // Simple notification - you could enhance this
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = `${productName} added to cart!`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showCartModal() {
        const modal = document.getElementById('cartModal');
        const cartItems = document.getElementById('cartItems');

        cartItems.innerHTML = '';

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            this.cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="app.removeFromCart(${item.id})">Remove</button>
                `;
                cartItems.appendChild(cartItem);
            });
        }

        this.updateCartTotal();
        modal.style.display = 'block';
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.updateCartCount();
            this.saveCart();
            this.showCartModal(); // Refresh modal
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartCount();
        this.saveCart();
        this.showCartModal(); // Refresh modal
    }

    updateCartTotal() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotal').textContent = total.toLocaleString();
    }

    showCheckoutModal() {
        if (this.cart.length === 0) {
            alert('Your cart is empty. Add some products first!');
            return;
        }

        document.getElementById('cartModal').style.display = 'none';
        document.getElementById('checkoutModal').style.display = 'block';
        document.getElementById('step1').style.display = 'block';
        document.getElementById('step2').style.display = 'none';
    }

    nextCheckoutStep() {
        // Basic validation
        const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'zipCode'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                field.style.borderColor = '#e2e8f0';
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }

        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
    }

    previousCheckoutStep() {
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step1').style.display = 'block';
    }

    processOrder(e) {
        e.preventDefault();

        // Basic card validation
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        if (cardNumber.length < 13 || cardNumber.length > 19) {
            alert('Please enter a valid card number.');
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            alert('Please enter a valid expiry date (MM/YY).');
            return;
        }

        if (cvv.length < 3 || cvv.length > 4) {
            alert('Please enter a valid CVV.');
            return;
        }

        // Simulate order processing
        const orderId = 'ORD-' + Date.now();

        // Clear cart
        this.cart = [];
        this.updateCartCount();
        this.saveCart();

        // Show success modal
        document.getElementById('checkoutModal').style.display = 'none';
        document.getElementById('successModal').style.display = 'block';
        document.getElementById('orderId').textContent = orderId;

        // Reset form
        document.getElementById('checkoutForm').reset();
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new EcommerceApp();
});