
// icones gerais
const tabIcons = {
    "Geral": "bi bi-info-circle",
    "Estrutura & Materiais": "bi bi-collection",
    "Automação & Controle": "bi bi-motherboard",
    "Garantia & Suporte": "bi bi-shield-check"
};

// config de cada produto
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
                "Sistema de Controle: ",
                "Monitoramento Remoto: ",
                "Alertas e Relatórios: "
            ],
            "Garantia & Suporte": [
                "Garantia de ... ",
                "Suporte Técnico: ",
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
                "Sistema de Controle: ",
                "Monitoramento Remoto: ",
                "Alertas e Relatórios: "
            ],
            "Garantia & Suporte": [
                "Garantia de ... ",
                "Suporte Técnico: ",
                "Peças de Reposição: ..."
            ]
        }
    },
};
// gerar os modais
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

        if (index === 0) {
            tabContentDiv.classList.add('active-content');
        }

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

    
    const allTabs = modalTabs.querySelectorAll('.modal-tab');
    allTabs.forEach((btn, idx) => {
        btn.classList.remove('active-tab');
    });

    const targetIndex = Object.keys(productData.tabs).indexOf(tabName);
    if (allTabs[targetIndex]) {
        allTabs[targetIndex].classList.add('active-tab');
    }

    
    const allContents = modalTabContents.querySelectorAll('.tab-content');
    allContents.forEach(contentDiv => contentDiv.classList.remove('active-content'));
    if (allContents[targetIndex]) {
        allContents[targetIndex].classList.add('active-content');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');

    function handleScroll() {
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
            if (isVisible) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    if (sections.length) {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); 
    }
});
