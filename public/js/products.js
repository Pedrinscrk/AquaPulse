/* ========= CONFIGURAÇÃO DAS IMAGENS ========= */
/* Ajuste os caminhos para os arquivos que REALMENTE existem em /img */
const productImages = {
  pivotCentral: [
    "img/novo1.png",
    "img/novo1-2.png",
    "img/novo1-3.png",
    "img/novo1-4.png",
    "img/novo1-5.png"
  ],
  linear: [
    "img/produto2.png",
    "img/produto2-2.png",
    "img/produto2-3.png",
    "img/produto2-4.png",
    "img/produto2-5.png"
  ]
};

/* ========= ESTADO ========= */
const resolvedImages = {};        // imagens válidas por produto (após preload)
const galleryCurrentIndex = {};   // índice atual por produto
const galleryIntervals = {};      // setInterval por produto
const AUTOPLAY_MS = 10000;

/* ========= PRELOAD & UTIL ========= */
function preloadAndFilter(srcList) {
  return Promise.all(
    srcList.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);
      img.src = src;
    }))
  ).then(results => results.filter(Boolean));
}

function setActiveThumb(strip, index) {
  const thumbs = strip.querySelectorAll('img');
  thumbs.forEach((t, i) => t.classList.toggle('active-thumb', i === index));
}

function centerThumb(strip, index) {
  const thumbs = strip.querySelectorAll('img');
  const thumb = thumbs[index];
  if (!thumb) return;
  const target = thumb.offsetLeft - (strip.clientWidth / 2 - thumb.clientWidth / 2);
  strip.scrollTo({ left: Math.max(target, 0), behavior: 'smooth' });
}

function changeMainImage(productKey, index, mainImg, strip) {
  const images = resolvedImages[productKey] || [];
  if (!images.length || index < 0 || index >= images.length) return;

  galleryCurrentIndex[productKey] = index;

  // animação simples
  mainImg.classList.remove('fade-in');
  mainImg.classList.add('fade-out');

  setTimeout(() => {
    mainImg.src = images[index];
    mainImg.classList.remove('fade-out');
    mainImg.classList.add('fade-in');

    setActiveThumb(strip, index);
    centerThumb(strip, index);
  }, 120);
}

function startAutoplay(productKey, mainImg, strip) {
  const images = resolvedImages[productKey] || [];
  if (images.length <= 1) return;

  if (galleryIntervals[productKey]) clearInterval(galleryIntervals[productKey]);
  galleryIntervals[productKey] = setInterval(() => {
    const current = galleryCurrentIndex[productKey] ?? 0;
    const next = (current + 1) % images.length;
    changeMainImage(productKey, next, mainImg, strip);
  }, AUTOPLAY_MS);
}

/* ========= INICIALIZAÇÃO ========= */
function initProductGalleries() {
  const containers = document.querySelectorAll('.image-container[data-product]');

  containers.forEach(async (container) => {
    const productKey = container.dataset.product;
    const mainImg = container.querySelector('.product-main-image');
    const strip = container.querySelector('.thumb-strip');
    if (!mainImg || !strip) return;

    // 1) Pré-carrega e filtra imagens válidas
    const valid = await preloadAndFilter(productImages[productKey] || []);
    if (!valid.length) return; // nada válido → não monta a galeria

    resolvedImages[productKey] = valid;

    // 2) Monta thumbs SOMENTE com as válidas
    strip.innerHTML = "";
    valid.forEach((src, index) => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.alt = `Imagem ${index + 1} - ${productKey}`;
      thumb.addEventListener('click', () => {
        // troca imediata e reinicia autoplay
        changeMainImage(productKey, index, mainImg, strip);
        startAutoplay(productKey, mainImg, strip);
      });
      strip.appendChild(thumb);
    });

    // 3) Primeira imagem
    galleryCurrentIndex[productKey] = 0;
    mainImg.src = valid[0];
    mainImg.classList.add('fade-in');
    setActiveThumb(strip, 0);
    centerThumb(strip, 0);

    // 4) Autoplay
    startAutoplay(productKey, mainImg, strip);

    // 5) Recentrar ao redimensionar
    window.addEventListener('resize', () => {
      centerThumb(strip, galleryCurrentIndex[productKey] ?? 0);
    }, { passive: true });
  });
}

/* ========= MODAL + TABS ========= */
const tabIcons = {
  "Geral": "bi bi-info-circle",
  "Estrutura & Materiais": "bi bi-collection",
  "Automação & Controle": "bi bi-motherboard",
  "Garantia & Suporte": "bi bi-shield-check"
};

const productTabs = {
  pivotCentral: {
    title: "Irrigador Aquapulse B45 - Pequenas Áreas",
    tabs: {
      "Geral": [
        "Pressão de Operação: ... PSI",
        "Área de Cobertura: até ...",
        "Tecnologia de Pulverização: ... "
      ],
      "Estrutura & Materiais": [
        "Material Principal: ...",
        "Revestimento: ...",
        "Aspersores: ... "
      ],
      "Automação & Controle": [
        "Sistema de Controle: ...",
        "Monitoramento Remoto: ...",
        "Alertas e Relatórios: ..."
      ],
      "Garantia & Suporte": [
        "Garantia de ...",
        "Suporte Técnico: ...",
        "Peças de Reposição: ..."
      ]
    }
  },
  linear: {
    title: "Irrigador Aquapulse G100 - Grandes Áreas",
    tabs: {
      "Geral": [
        "Pressão de Operação: ... PSI",
        "Área de Cobertura: até ...",
        "Tecnologia de Pulverização: ... "
      ],
      "Estrutura & Materiais": [
        "Material Principal: ...",
        "Revestimento: ...",
        "Aspersores: ... "
      ],
      "Automação & Controle": [
        "Sistema de Controle: ...",
        "Monitoramento Remoto: ...",
        "Alertas e Relatórios: ..."
      ],
      "Garantia & Suporte": [
        "Garantia de ...",
        "Suporte Técnico: ...",
        "Peças de Reposição: ..."
      ]
    }
  }
};

const body = document.body;
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalTabs = document.getElementById('modalTabs');
const modalTabContents = document.getElementById('modalTabContents');

let currentProductKey = null;
let currentTab = null;

function openModal(productKey) {
  currentProductKey = productKey;
  const productData = productTabs[productKey];
  if (!productData) return;

  modalTitle.textContent = productData.title;
  modalTabs.innerHTML = "";
  modalTabContents.innerHTML = "";

  const tabNames = Object.keys(productData.tabs);

  tabNames.forEach((tabName, index) => {
    const tabBtn = document.createElement('div');
    tabBtn.classList.add('modal-tab');

    const iconClass = tabIcons[tabName] || "bi bi-file-earmark";
    tabBtn.innerHTML = `<i class="${iconClass}"></i> ${tabName}`;
    tabBtn.onclick = () => changeTab(tabName);

    if (index === 0) {
      tabBtn.classList.add('active-tab');
      currentTab = tabName;
    }
    modalTabs.appendChild(tabBtn);

    const tabContentDiv = document.createElement('div');
    tabContentDiv.classList.add('tab-content');
    if (index === 0) tabContentDiv.classList.add('active-content');

    const ul = document.createElement('ul');
    productData.tabs[tabName].forEach(spec => {
      const li = document.createElement('li');
      li.textContent = spec;
      ul.appendChild(li);
    });
    tabContentDiv.appendChild(ul);
    modalTabContents.appendChild(tabContentDiv);
  });

  body.classList.add('no-scroll');
  modalOverlay.classList.add('active');
}

function closeModal() {
  modalOverlay.classList.remove('active');
  body.classList.remove('no-scroll');
}

function changeTab(tabName) {
  currentTab = tabName;
  const productData = productTabs[currentProductKey];
  if (!productData) return;

  const allTabs = modalTabs.querySelectorAll('.modal-tab');
  allTabs.forEach(btn => btn.classList.remove('active-tab'));

  const targetIndex = Object.keys(productData.tabs).indexOf(tabName);
  if (allTabs[targetIndex]) allTabs[targetIndex].classList.add('active-tab');

  const allContents = modalTabContents.querySelectorAll('.tab-content');
  allContents.forEach(div => div.classList.remove('active-content'));
  if (allContents[targetIndex]) allContents[targetIndex].classList.add('active-content');
}

/* ========= SCROLL ANIM DAS SEÇÕES + INIT ========= */
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');

  function handleScroll() {
    sections.forEach(section => {
      const r = section.getBoundingClientRect();
      const vis = r.top <= window.innerHeight / 2 && r.bottom >= window.innerHeight / 2;
      section.classList.toggle('active', vis);
    });
  }

  if (sections.length) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  initProductGalleries();
});
