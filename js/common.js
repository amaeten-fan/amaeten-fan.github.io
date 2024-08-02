document.addEventListener('DOMContentLoaded', function() {

  const body = document.body;

  // themeChange

  const themeChange = document.getElementById('theme-change');

  themeChange.addEventListener('click', function() {
    body.classList.toggle('dark-mode');

    const currentMode = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('themeMode', currentMode);
  });

  const savedMode = localStorage.getItem('themeMode');
  if (savedMode === 'dark') {
    body.classList.add('dark-mode');
  }

  // menuList hamburgerList

  const menuList = document.getElementById('menu-list');
  const hamburgerList = document.getElementById('hamburger-list');

  fetchJson('json/menu.json').then(menuData => {
    createMenuItems(menuData, menuList, "menu");
    createMenuItems(menuData, hamburgerList, "hamburger");

    const headerTitle = document.getElementById('header-title');
    const menuContainer = $('.menu-container');

    const headerTitleRect = headerTitle.getBoundingClientRect();
    const menuContainerRect = menuContainer.getBoundingClientRect();

    headerWidth = headerTitleRect.width + menuContainerRect.width;
    checkOverlap();
  })
  .catch(error => console.error('Error loading menu:', error));

  // hamburgerBtn

  const hamburgerBtn = document.getElementById('hamburger-btn');
  const hamburgerMenu = $('.hamburger-menu');

  hamburgerBtn.addEventListener('click', function() {
    hamburgerMenu.classList.toggle('show-menu');
    body.style.overflow = 'hidden';
  });

  hamburgerMenu.addEventListener('click', function() {
    hamburgerMenu.classList.remove('show-menu');
    body.style.overflow = '';
  });

  // sidenav

  const sidenavToggle = $('.sidenav-toggle');
  const sidenavList = $('.sidenav-title');

  if (sidenavToggle) {
    sidenavToggle.addEventListener('click', function(event) {
      event.stopPropagation();
      sidenavList.classList.toggle('open');
      sidenavToggle.classList.toggle('open');
    });
  }

  const titles = document.querySelectorAll('.s-title');

  titles.forEach(title => {
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = `#${title.id}`;
    anchor.textContent = title.textContent;
    listItem.appendChild(anchor);
    sidenavList.appendChild(listItem);
  });

  document.addEventListener('click', function(event) {
    if (!sidenavToggle.contains(event.target) &&
        !sidenavList.contains(event.target) &&
        !themeChange.contains(event.target)) {
      sidenavList.classList.remove('open');
      sidenavToggle.classList.remove('open');
    }
  });

});

const $ = (selector) => document.querySelector(selector);
const cs = (consolelog) => console.log(consolelog);

function fetchJson(url) {
  return fetch(url).then(response => response.json());
}

const userLanguage = navigator.language || 'ja';

function formatDateString(date) {
  return new Date(date).toLocaleDateString(userLanguage, { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function convertToSeconds(timeString) {
  const [hours, minutes, seconds] = timeString.split(':');
  return (+hours * 3600) + (+minutes * 60) + (+seconds);
}

function youtubeThumbnailUrl(videoID) {
  return `https://i.ytimg.com/vi/${videoID}/maxresdefault.jpg`;
}

function createMenuItems(data, container, filter) {
  const currentURL = window.location.href;
  data.forEach(item => {
    if (item.only === filter || item.only === "") {
      const li = document.createElement('li');
      if (item.href) {
        const a = document.createElement('a');
        a.textContent = item.text;
        a.href = item.href;
        if (item.target) {
          a.target = '_blank';
          const exLink = document.createElement('span');
          exLink.className = 'ex-link';
          a.appendChild(exLink);
        }
        a.className = 'menu-link';

        const fullURL = new URL(item.href, currentURL).href;
        if (fullURL === currentURL) {
          a.classList.add('disabled');
          a.addEventListener('click', function(event) {
            event.preventDefault();
          });
        }

        li.appendChild(a);
      } else {
        li.textContent = item.text;
      }
      container.appendChild(li);
    }
  });
}

let headerWidth = 768;
const PADDING = 24;

function checkOverlap() {
  const headerContent = $('.header-content');
  const headerContentRect = headerContent.getBoundingClientRect();

  if (headerContentRect.width - PADDING < headerWidth) {
    $('.menu').classList.add('hidden');
    $('.hamburger').classList.remove('hidden');
  } else {
    $('.menu').classList.remove('hidden');
    $('.hamburger').classList.add('hidden');
  }
}

window.addEventListener('resize', checkOverlap);

window.addEventListener('scroll', function() {
  const backToTopButton = document.getElementById('back-to-top');
  if (window.pageYOffset > 100) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});

document.getElementById('back-to-top').addEventListener('click', function() {
  // 點擊回到頂部按鈕時，使用平滑的滾動效果將頁面滾動至頂部
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
