// ===== Fade Effect =====
// ===== Fade Animation on Scroll =====
window.addEventListener('scroll', () => {
  document.querySelectorAll('.fade-item').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) el.classList.add('show');
  });
});

// ===== Elements =====
const searchBox = document.getElementById('searchBox');
const filterBtn = document.getElementById('filterBtn');
const categories = document.querySelectorAll('.category');

// Global cart functions
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

// Show feedback when adding to cart
function showCartFeedback() {
  const feedback = document.createElement('div');
  feedback.className = 'cart-feedback';
  feedback.textContent = 'تمت الإضافة إلى السلة';
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

// Add to cart function - accessible globally
window.addToCart = function(product) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCartFeedback();
  
  // If we're on the cart page, refresh the cart display
  if (typeof window.renderCart === 'function') {
    window.renderCart();
  }
};

// ===== Search (Live) + Filter Button =====
const filterCategories = () => {
  const term = searchBox.value.trim().toLowerCase();
  let hasResults = false;
  const noResultsElement = document.getElementById('noResults');
  
  if (term === '') {
    categories.forEach(cat => {
      cat.style.display = 'block';
      cat.style.animation = 'fadeIn 0.6s ease';
      // Reset all cards to be visible
      const cards = cat.querySelectorAll('.card');
      cards.forEach(card => {
        card.style.display = 'block';
      });
    });
    noResultsElement.style.opacity = '0';
    noResultsElement.style.transform = 'translateY(20px)';
    return;
  }

  categories.forEach(cat => {
    const categoryName = cat.dataset.category.toLowerCase();
    const productCards = cat.querySelectorAll('.card');
    let categoryHasVisibleProducts = false;
    
    // Search in product names and descriptions
    productCards.forEach(card => {
      const productName = card.querySelector('h3')?.textContent?.toLowerCase() || '';
      const productDesc = card.querySelector('p')?.textContent?.toLowerCase() || '';
      
      // Always reset display to block first
      card.style.display = 'block';
      
      // Then hide if it doesn't match search
      if (!(productName.includes(term) || productDesc.includes(term) || categoryName.includes(term))) {
        card.style.display = 'none';
      } else {
        categoryHasVisibleProducts = true;
        hasResults = true;
      }
    });

    // Show/hide category based on search results
    if (categoryHasVisibleProducts || categoryName.includes(term)) {
      cat.style.display = 'block';
      cat.style.animation = 'fadeIn 0.6s ease';
      hasResults = true;
    } else {
      cat.style.display = 'none';
    }
  });

  // Show/hide no results message
  if (!hasResults) {
    noResultsElement.style.display = 'block';
    noResultsElement.style.opacity = '1';
    noResultsElement.style.transform = 'translateY(0)';
  } else {
    noResultsElement.style.opacity = '0';
    noResultsElement.style.transform = 'translateY(20px)';
    // Don't hide it completely, just make it invisible
    // This ensures it stays in the DOM but is not visible
  }
};

// البحث الحي أثناء الكتابة
searchBox.addEventListener('input', filterCategories);

// تصفية بعد الضغط على الزر
filterBtn.addEventListener('click', filterCategories);

// ===== Electric Sparks Effect =====
document.querySelectorAll('.category').forEach(cat => {
  const color = cat.dataset.color;

  cat.querySelectorAll('.card').forEach(card => {
    setInterval(() => {
      const spark = document.createElement('div');
      spark.classList.add('spark');

      // توليد شرارات بألوان قوية ومتفرعة
      spark.style.background = `radial-gradient(circle, ${color} 40%, transparent 70%)`;
      const x = Math.random() * card.offsetWidth;
      const y = Math.random() * card.offsetHeight;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.boxShadow = `0 0 15px ${color}, 0 0 30px white`;

      card.appendChild(spark);
      setTimeout(() => spark.remove(), 400);
    }, 200 + Math.random() * 500);
  });
});

// ====== Fade In Animation ======
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.spark {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  opacity: 0.9;
  pointer-events: none;
  animation: flicker 0.4s linear;
}

@keyframes flicker {
  0% { opacity: 0.2; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.5); }
  100% { opacity: 0; transform: scale(0.2); }
}`;
document.head.appendChild(style);


