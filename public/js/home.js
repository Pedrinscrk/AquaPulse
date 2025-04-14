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
  
  
    const animatedList = document.querySelector('.animated-list');
    const section = document.querySelector('.secao-prototipo-app');
    let animationTriggered = false;
  
    function checkScroll() {
      if (!section || animationTriggered) {
        return;
      }
  
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
  
      // Verifica se o topo da seção está visível na janela
      if (scrollPosition + windowHeight > sectionTop + (sectionHeight / 4)) {
        animatedList.classList.add('animate');
        animationTriggered = true;
        // Remove o listener para não executar a animação novamente
        window.removeEventListener('scroll', checkScroll);
      }
    }
  
    // Adiciona o listener de scroll
    window.addEventListener('scroll', checkScroll);
  
    // Verifica na carga da página caso a seção já esteja visível
    document.addEventListener('DOMContentLoaded', checkScroll);


        // === INÍCIO DO JAVASCRIPT EMBUTIDO ===
        // Este script deve rodar DEPOIS que o HTML acima for carregado pelo navegador.
        // Ele depende que o GSAP já esteja carregado globalmente na página.
    
        (function() { // Função auto-executável para criar um escopo local e evitar poluir o global
            'use strict'; // Habilita modo estrito para boas práticas
    
            console.log("Tentando inicializar Aquapulse GSAP v2 (Embutido)...");
    
            // Verifica se GSAP está disponível (essencial!)
            if (typeof gsap === 'undefined') {
                console.error("GSAP não foi carregado globalmente. A animação Aquapulse não funcionará.");
                // Considerar adicionar uma mensagem visual discreta dentro do próprio componente, se possível
                const container = document.querySelector('aquapulse-super-container');
                if(container) {
                     container.insertAdjacentHTML('afterbegin', '<p style="color:red; text-align:center; padding: 10px; background: #333; border-radius: 5px; margin: 10px;">Erro: GSAP não encontrado.</p>');
                }
                return; // Aborta se GSAP não existe
            }
    
            // Seleciona os elementos DENTRO do componente específico
            // É crucial que o ID 'minhaLinhaTempo' seja ÚNICO na página inteira.
            const linhaTempoContainer = document.getElementById('minhaLinhaTempo');
    
            // Se o container da linha do tempo não for encontrado, não faz nada.
            if (!linhaTempoContainer) {
                 console.error("Erro: Container da linha do tempo (#minhaLinhaTempo) não encontrado no HTML.");
                 // Poderia adicionar uma mensagem dentro de 'aquapulse-super-container' se ele existir
                  const superContainer = document.querySelector('aquapulse-super-container');
                  if(superContainer) {
                     superContainer.insertAdjacentHTML('afterbegin', '<p style="color:orange; text-align:center; padding: 10px; background: #333; border-radius: 5px; margin: 10px;">Aviso: Componente da linha do tempo não encontrado.</p>');
                  }
                 return;
            }
    
            // Seleciona elementos internos a partir do container encontrado
            const linhaColorida = linhaTempoContainer.querySelector('linha-central-colorida');
            const conectores = linhaTempoContainer.querySelectorAll('conector-vertical');
            const etapas = linhaTempoContainer.querySelectorAll('etapa-aquapulse'); // Seleciona todas as etapas DENTRO deste container
    
            // Verifica se todos os elementos essenciais da linha do tempo foram encontrados DENTRO do container
            if (!linhaColorida || !conectores?.length || !etapas?.length) {
                console.error("Erro: Elementos internos essenciais da linha do tempo não encontrados.");
                 linhaTempoContainer.insertAdjacentHTML('beforebegin', '<p style="color:orange; text-align:center; padding: 10px; background: #333; border-radius: 5px; margin: 10px;">Aviso: Faltam partes internas da linha do tempo.</p>');
                return; // Aborta se elementos essenciais faltam
            }
    
            // --- Animação de Entrada com GSAP (Timeline Principal) ---
            const masterTimeline = gsap.timeline({ paused: true });
    
            masterTimeline.to(linhaColorida, {
                scaleX: 1, duration: 3.5, ease: "power3.out"
            });
            masterTimeline.to(conectores, {
                opacity: 1, scaleY: 1, duration: 1, ease: "power2.out", stagger: 0.1
            }, "-=0.8");
            masterTimeline.to(etapas, {
                opacity: 1, y: 0, duration: 1, ease: "back.out(1.4)", stagger: 0.15
            }, "-=0.7");
    
            // --- Observer para disparar a Animação de Entrada ---
            if ('IntersectionObserver' in window) {
                const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
                const observerCallback = (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            console.log("Linha do tempo Aquapulse entrou na viewport. Iniciando animação...");
                            masterTimeline.play();
                            observer.unobserve(entry.target);
                        }
                    });
                };
                const timelineObserver = new IntersectionObserver(observerCallback, observerOptions);
                timelineObserver.observe(linhaTempoContainer); // Observa o container específico
                console.log("Intersection Observer configurado para #minhaLinhaTempo.");
            } else {
                console.warn("IntersectionObserver não suportado. Iniciando animação Aquapulse imediatamente.");
                masterTimeline.play();
            }
    
            // --- Lógica de Tooltip Animado e Parallax com GSAP ---
            etapas.forEach((etapa) => {
                const tooltipElement = etapa.querySelector('.tooltip-dinamico');
                const tooltipText = etapa.dataset.tooltip;
                const conteudoEtapa = etapa.querySelector('conteudo-etapa');
    
                if (!tooltipElement || !tooltipText || !conteudoEtapa) {
                    console.warn("Elemento de tooltip, texto ou conteúdo não encontrado para uma etapa Aquapulse:", etapa);
                    return;
                }
    
                tooltipElement.textContent = tooltipText;
                const initialY = etapa.classList.contains('posicao-inferior') ? -15 : 15;
                const finalY = 0;
    
                const tooltipAnimation = gsap.fromTo(tooltipElement,
                    { opacity: 0, y: initialY, scale: 0.85, visibility: 'hidden' },
                    { opacity: 1, y: finalY, scale: 1, visibility: 'visible', duration: 0.3, ease: 'power2.out', paused: true }
                );
    
                etapa.addEventListener('mouseenter', () => tooltipAnimation.play());
                etapa.addEventListener('mouseleave', () => tooltipAnimation.reverse());
    
                // Parallax no conteúdo da etapa
                etapa.addEventListener('mousemove', (e) => {
                     const rect = conteudoEtapa.getBoundingClientRect();
                     const x = e.clientX - rect.left - rect.width / 2;
                     const y = e.clientY - rect.top - rect.height / 2;
                     const moveX = gsap.utils.clamp(-4, 4, -x * 0.06);
                     const moveY = gsap.utils.clamp(-4, 4, -y * 0.06);
                     gsap.to(conteudoEtapa, { x: moveX, y: moveY, duration: 0.4, ease: "power1.out" });
                 });
    
                 etapa.addEventListener('mouseleave', () => {
                     gsap.to(conteudoEtapa, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.6)" });
                     // O tooltip já é escondido pelo outro listener 'mouseleave'
                 });
            });
    
            console.log("Tooltips e Parallax GSAP configurados para as etapas Aquapulse.");
    
            // Função de ajuste de layout em resize (mantida, mas pode não ser necessária)
            function ajustarLayoutAquapulse() {
                // console.log("Janela redimensionada, verificando layout Aquapulse...");
                // Adicionar lógica de ajuste específica do componente aqui, se necessário
            }
            // Usar um listener com throttling/debouncing seria ideal para performance em produção
            window.addEventListener('resize', ajustarLayoutAquapulse);
    
            console.log("Aquapulse JS setup v2 (Embutido) completo.");
    
        })(); // Fim da função auto-executável
    
        // === FIM DO JAVASCRIPT EMBUTIDO ===
    