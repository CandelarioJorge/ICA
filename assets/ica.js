const menu = document.querySelector('#menu');
const menuToggle = document.querySelector('[aria-controls="menu"]');

menu.addEventListener('click', (event) => {
  if (event.target.closest('a') && menu.classList.contains('show')) {
    bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
  }
});

menu.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('show')) {
    bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
    menuToggle.focus();
  }
});
