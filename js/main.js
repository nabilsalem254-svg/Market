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
