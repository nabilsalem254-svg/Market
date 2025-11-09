// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('active');
  document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close menu when clicking outside
window.addEventListener('click', (e) => {
  if (!e.target.closest('.nav') && !e.target.closest('.hamburger')) {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 992) {
    document.body.style.overflow = '';
  }
});

// تأثير ظهور العناصر عند السكروول
const fadeItems = document.querySelectorAll('.fade-item');

const fadeOnScroll = () => {
  fadeItems.forEach(item => {
    const itemTop = item.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight - 100;
    if (itemTop < triggerPoint) {
      item.classList.add('show');
    }
  });
};

window.addEventListener('scroll', fadeOnScroll);
window.addEventListener('load', fadeOnScroll);
