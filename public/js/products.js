
/* Ícones para cada aba, se desejar expandir. */
const tabIcons = {
    "Geral": "bi bi-info-circle",
    "Estrutura & Materiais": "bi bi-collection",
    "Automação & Controle": "bi bi-motherboard",
    "Garantia & Suporte": "bi bi-shield-check"
};

/* Dados dos produtos */
const productTabs = {
    pivotCentral: {
        title: "Irrigador Pivot Central - Especificações Avançadas",
        tabs: {
            "Geral": [
                "Pressão de Operação: 80 PSI",
                "Área de Cobertura: até 50 hectares",
                "Tecnologia de Pulverização: Microaspersão"
            ],
            "Estrutura & Materiais": [
                "Material Principal: Aço Inoxidável + Liga de Alumínio",
                "Revestimento: Polímero Anticorrosão",
                "Aspersores: 16 Aspersores de Alta Precisão"
            ],
            "Automação & Controle": [
                "Sistema de Controle: Automação Inteligente Programável",
                "Monitoramento Remoto: Aplicativo Móvel + Painel Web",
                "Alertas e Relatórios: Níveis de Umidade, Vazão e Pressão"
            ],
            "Garantia & Suporte": [
                "Garantia de 2 anos de fábrica",
                "Suporte Técnico 24h (remoto e em campo)",
                "Peças de Reposição: Disponibilidade Imediata"
            ]
        }
    },
    linear: {
        title: "Irrigador Linear - Especificações Avançadas",
        tabs: {
            "Geral": [
                "Pressão de Operação: 60 PSI",
                "Área de Cobertura: até 30 hectares em linha reta",
                "Tecnologia de Bicos: Aspersores de Baixo Perfil"
            ],
            "Estrutura & Materiais": [
                "Material Principal: Aço Carbono com Proteção Epóxi",
                "Design Modular: Extensões para Maior Alcance",
                "Aspersores: 12 Aspersores Linearmente Alinhados"
            ],
            "Automação & Controle": [
                "Sistema de Controle: Semiautomático (opção de ajuste manual)",
                "Monitoramento Remoto: Leitura Básica via App",
                "Relatórios: Vazão e Consumo"
            ],
            "Garantia & Suporte": [
                "Garantia de 1 ano",
                "Suporte Técnico (remoto)",
                "Peças e Acessórios em estoque local"
            ]
        }
    },
    gotejamento: {
        title: "Irrigador Gotejamento - Especificações Avançadas",
        tabs: {
            "Geral": [
                "Pressão de Operação: 40 PSI",
                "Área de Cobertura: Personalizável via tubulação",
                "Tecnologia de Gotejo: Microvalvulado"
            ],
            "Estrutura & Materiais": [
                "Mangueiras: Polietileno de Alta Densidade",
                "Conexões: PVC reforçado",
                "Gotejadores: 25 Pontos Precisos"
            ],
            "Automação & Controle": [
                "Sistema de Controle: Bivolt com Regulagem de Vazão",
                "Monitoramento via App: Relatório de Consumo Diário",
                "Alertas: Notificações de Fuga de Água ou Entupimento"
            ],
            "Garantia & Suporte": [
                "Garantia de 1 ano",
                "Manuais e Tutoriais Online",
                "Assistência Técnica em Todo o País"
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

    // Título do modal
    modalTitle.textContent = productData.title;

    // Limpa tabs e conteúdos antes de recriar
    modalTabs.innerHTML = "";
    modalTabContents.innerHTML = "";

    // Cria as abas dinamicamente
    const tabNames = Object.keys(productData.tabs);
    tabNames.forEach((tabName, index) => {
        const tabBtn = document.createElement('div');
        tabBtn.classList.add('modal-tab');

        /* Verifica se existe ícone mapeado para a aba */
        const iconClass = tabIcons[tabName] || "bi bi-file-earmark";
        tabBtn.innerHTML = `<i class="${iconClass}"></i> ${tabName}`;


        tabBtn.onclick = () => changeTab(tabName);

        // Primeira aba ativa
        if (index === 0) {
            tabBtn.classList.add('active-tab');
            currentTab = tabName;
        }
        modalTabs.appendChild(tabBtn);

        /* Conteúdo de cada Tab */
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

    // Travar scroll do body
    body.classList.add('no-scroll');

    // Exibe o modal
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
    body.classList.remove('no-scroll');
}

function changeTab(tabName) {
    currentTab = tabName;
    const productData = productTabs[currentProductKey];

    /* Atualiza visual dos botões de tab */
    const allTabs = modalTabs.querySelectorAll('.modal-tab');
    allTabs.forEach((btn, idx) => {
        btn.classList.remove('active-tab');
    });

    const targetIndex = Object.keys(productData.tabs).indexOf(tabName);
    if (allTabs[targetIndex]) {
        allTabs[targetIndex].classList.add('active-tab');
    }

    /* Atualiza conteúdos */
    const allContents = modalTabContents.querySelectorAll('.tab-content');
    allContents.forEach(contentDiv => contentDiv.classList.remove('active-content'));
    if (allContents[targetIndex]) {
        allContents[targetIndex].classList.add('active-content');
    }
}

/* Animações de scroll (ativação das seções) */
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
        handleScroll(); // Inicia a checagem no carregamento da página
    }
});
