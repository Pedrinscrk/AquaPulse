// Dados das notificações (para o modal)
const notificacoes = [
  {
    titulo: "Marketing",
    descricao: "Agora o Aquapulse está presente nas redes sociais. Acompanhe nossas atualizações! siga o link:",
    imagem: "img/instagramAQ.png"
  },
  {
    titulo: "Novo Membro",
    descricao: "Temos um novo integrante na equipe Aquapulse! Bem-vindo ao time!",
    imagem: "img/novoMembro.jpeg"
  },
  {
    titulo: "AquaPulse em destaque",
    descricao: "O projeto AquaPulse foi destaque na banca de 2024 do IFMT. Parabéns à equipe!",
    imagem: "img/Banca.jpeg"
  }
];

// Abrir o modal com os dados da notificação
function abrirModal(index) {
  document.getElementById("modal-title").textContent = notificacoes[index].titulo;
  document.getElementById("modal-text").textContent = notificacoes[index].descricao;
  document.getElementById("modal-image").src = notificacoes[index].imagem;
  document.getElementById("modal").style.display = "flex";
  document.body.style.overflow = "hidden"; // Bloqueia scroll
}

// Fechar o modal
function fecharModal() {
  document.getElementById("modal").style.display = "none";
  document.body.style.overflow = "auto"; // Libera scroll
}

// Escutadores para fechar modal
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector(".close").addEventListener("click", fecharModal);
  document.getElementById("modal").style.display = "none";
});

window.addEventListener("click", function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) fecharModal();
});

// Scroll animation em blocos definidos
document.addEventListener('DOMContentLoaded', () => {
  const elementosAnimados = [
    ...document.querySelectorAll('.chamada-imagem'),
    ...document.querySelectorAll('.Textos-animados-container'),
    ...document.querySelectorAll('.controle-imagem'),
    ...document.querySelectorAll('.Textos-controle-container')
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('animate');
      } else {
        el.classList.remove('animate');
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-50px 0px'
  });

  elementosAnimados.forEach(el => observer.observe(el));
});

// Bloquear clique direito
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  console.log('Clique direito bloqueado!');
  return false;
});

// Progress bar circular animada
document.addEventListener('DOMContentLoaded', function() {
  animateStepsProgress();
  setupTouchFeedback();
});

function animateStepsProgress() {
  const stepCounter = document.getElementById('step-counter');
  const progressRing = document.getElementById('progress-ring');
  if (!stepCounter || !progressRing) return;

  const maxSteps = 100;
  const currentSteps = 100;
  let displayedSteps = 0;

  const circumference = 2 * Math.PI * 88;
  progressRing.style.strokeDasharray = circumference;
  progressRing.style.strokeDashoffset = circumference;

  const stepInterval = setInterval(() => {
    displayedSteps += Math.ceil(currentSteps / 60);
    if (displayedSteps >= currentSteps) {
      displayedSteps = currentSteps;
      clearInterval(stepInterval);
    }

    stepCounter.textContent = displayedSteps.toLocaleString();
    const offset = circumference - (displayedSteps / maxSteps) * circumference;
    progressRing.style.strokeDashoffset = offset;
  }, 20);
}

// Feedback visual ao toque em elementos interativos
function setupTouchFeedback() {
  const interactiveElements = document.querySelectorAll(
    '.workout-card, .achievement, .chart-bar, .recommendation-action, .nav-item'
  );

  interactiveElements.forEach(element => {
    element.addEventListener('touchstart', () => {
      element.classList.add('touch-active');
    });

    ['touchend', 'touchcancel'].forEach(event => {
      element.addEventListener(event, () => {
        element.classList.remove('touch-active');
      });
    });
  });
}

  // Intersection Observer para detectar quando as caixinhas entram na tela
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const boxes = entry.target.querySelectorAll('.fade-in-up');
        boxes.forEach((box, index) => {
          setTimeout(() => {
            box.style.transform = "translateX(0)"; // Anima a caixa de dentro da tela
            box.style.opacity = "1"; // Faz a caixa aparecer
          }, index * 300); // Intervalo de animação entre as caixas
        });
        observer.unobserve(entry.target); // Para de observar a seção após a animação
      }
    });
  }, {
    threshold: 0.5 // A animação é acionada quando 50% da seção estiver visível
  });

  // Inicia o Observer para a seção com as caixinhas
  observer.observe(document.getElementById('animated-boxes'));

  // Função para alternar a abertura das caixinhas
  function toggleAccordion(el) {
    const content = el.querySelector('.accordion-content');
    const icon = el.querySelector('.toggle-icon');
    const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px";

    // Fechar todas as outras caixas
    const allBoxes = document.querySelectorAll('.accordion-content');
    allBoxes.forEach(box => {
      if (box !== content) {
        box.style.maxHeight = "0";
      }
    });

    // Controlar o ícone de abrir/fechar
    if (isOpen) {
      content.style.maxHeight = "0";
      icon.className = "bi bi-chevron-down toggle-icon";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      icon.className = "bi bi-chevron-up toggle-icon";
    }
  }


  