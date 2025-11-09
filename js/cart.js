class Cart {
  constructor() {
    this.cart = [];
    this.cartItemsContainer = document.querySelector('.cart-items');
    this.cartTotal = document.querySelector('.cart-total');
    this.emptyCartMessage = document.querySelector('.empty-cart-message');
    this.cartSummary = document.querySelector('.cart-summary');
    
    this.loadCart();
    this.renderCart();
    this.setupEventListeners();
    this.checkoutButtonListener(); // Initialize checkout button listener
  }
  
  loadCart() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
  }
  
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    updateCartCount();
  }
  
  renderCart() {
    if (!this.cartItemsContainer) return;
    
    if (this.cart.length === 0) {
      if (this.emptyCartMessage) this.emptyCartMessage.style.display = 'block';
      if (this.cartSummary) this.cartSummary.style.display = 'none';
      this.cartItemsContainer.innerHTML = '';
      return;
    }
    
    if (this.emptyCartMessage) this.emptyCartMessage.style.display = 'none';
    if (this.cartSummary) this.cartSummary.style.display = 'block';
    
    this.cartItemsContainer.innerHTML = this.cart.map(item => {
      // Handle image paths
      let imageSrc = 'images/placeholder.svg';
      
      if (item.image) {
        // If it's already a full URL or data URL, use it directly
        if (item.image.startsWith('http') || item.image.startsWith('data:')) {
          imageSrc = item.image;
        } 
        // If it's a relative path, ensure it's correctly formatted
        else if (!item.image.startsWith('images/')) {
          imageSrc = 'images/' + item.image.split('/').pop();
        } else {
          imageSrc = item.image;
        }
      }
      
      const formattedPrice = Number(parseFloat(item.price || 0).toFixed(2));
      
      return `
      <div class="cart-item" data-id="${item.id}">
        <img src="${imageSrc}" 
             alt="${item.name}" 
             class="cart-item-image" 
             onerror="this.onerror=null; this.src='images/placeholder.svg'" 
             style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="price">$${formattedPrice}</p>
          <div class="quantity-controls">
            <button class="quantity-btn minus">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus">+</button>
          </div>
        </div>
        <button class="remove-item">×</button>
      </div>`;
    }).join('');
    
    this.updateTotals();
  }
  
  updateTotals() {
    if (!this.cartTotal) return;
    
    const subtotal = this.cart.reduce((sum, item) => {
      const price = Number(parseFloat(item.price || 0).toFixed(2));
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
    
    const tax = subtotal * 0.01; // 1% tax
    const total = subtotal + tax;
    
    this.cartTotal.innerHTML = `
      <div class="total-row">
        <span>Subtotal:</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>Tax (1%):</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="total-row total">
        <span>Total:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (!this.cartItemsContainer) return;
    
    // Quantity controls
    this.cartItemsContainer.addEventListener('click', (e) => {
      const itemElement = e.target.closest('.cart-item');
      if (!itemElement) return;
      
      const itemId = itemElement.dataset.id;
      const item = this.cart.find(item => item.id === itemId);
      
      if (e.target.classList.contains('plus')) {
        item.quantity += 1;
      } else if (e.target.classList.contains('minus')) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          if (confirm('Are you sure you want to remove this product from the cart?')) {
            this.removeItem(itemId);
          } else {
            return;
          }
        }
      } else if (e.target.classList.contains('remove-item')) {
        e.preventDefault();
        if (confirm('Are you sure you want to remove this product from the cart?')) {
          this.removeItem(itemId);
        } else {
          return;
        }
      } else {
        return;
      }
      
      this.saveCart();
      this.renderCart();
    });
  }
  
  removeItem(itemId) {
    // Find the item index
    const itemIndex = this.cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      // Remove the item from the cart array
      this.cart.splice(itemIndex, 1);
      
      // Update localStorage
      this.saveCart();
      
      // Show feedback to user
      this.showRemovalFeedback();
      
      // Re-render the cart
      this.renderCart();
      
      // Update cart count in header
      updateCartCount();
    }
  }
  
  showRemovalFeedback() {
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback removal';
    feedback.innerHTML = 'Product removed from cart';
    document.body.appendChild(feedback);
    
    // Trigger reflow
    void feedback.offsetWidth;
    
    // Show feedback
    feedback.classList.add('show');
    
    // Hide after 2 seconds
    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  }
  
  // Clear the entire cart
  clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cart = [];
      this.saveCart();
      this.renderCart();
      updateCartCount();
      
      // Show feedback
      const feedback = document.createElement('div');
      feedback.className = 'cart-feedback removal';
      feedback.innerHTML = 'Cart cleared successfully';
      document.body.appendChild(feedback);
      
      setTimeout(() => {
        feedback.classList.add('show');
        setTimeout(() => {
          feedback.classList.remove('show');
          setTimeout(() => feedback.remove(), 300);
        }, 2000);
      }, 100);
    }
  }
  
  checkoutButtonListener() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.cart.length === 0) {
          alert('السلة فارغة. أضف منتجات للمتابعة.');
          return;
        }
        
        // Here you would typically redirect to a checkout page
        alert('سيتم توجيهك إلى صفحة الدفع قريبًا!');
      });
    }
    
    // Add event listener for clear cart button
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => {
        this.clearCart();
      });
    }
  }
}

// Global function to update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

// Initialize cart when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on cart page
  if (document.querySelector('.cart-items')) {
    window.cart = new Cart();
    
    // Make functions available globally
    window.renderCart = () => window.cart.renderCart();
    window.updateCartCount = updateCartCount;
  }
});
