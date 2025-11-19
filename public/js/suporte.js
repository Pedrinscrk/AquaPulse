// suporte.js

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================
     FAQ ACCORDION
  =========================== */
  document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.parentElement;
      const answer = parent.querySelector('.faq-answer');
      parent.classList.toggle('active');
      answer.style.maxHeight = parent.classList.contains('active')
        ? answer.scrollHeight + 'px'
        : '0';
    });
  });

  /* ==========================
     BOTÃO DE TICKET
  =========================== */
  const ticketButton = document.getElementById('ticket-button');
  if (ticketButton) {
    ticketButton.addEventListener('click', () => {
      alert('Ticket enviado com sucesso! Você receberá uma resposta em breve.');
    });
  }

  /* ==========================
     BOTÃO DE CONTATO (WHATSAPP)
  =========================== */
  const contactButton = document.getElementById('contact-button');
  if (contactButton) {
    contactButton.addEventListener('click', () => {
      window.open('https://api.whatsapp.com/send?phone=5566992524707', '_blank');
    });
  }

  /* ==========================
     CHATBOT CLASS
  =========================== */
  class Chatbot {
    constructor() {
      // Elementos principais
      this.chatButton = document.getElementById('chat-button');
      this.chatbotContainer = document.getElementById('chatbot-container');
      this.chatBody = document.getElementById('chatBody');
      this.messageInput = document.getElementById('messageInput');
      this.sendButton = document.getElementById('sendButton');
      this.chatbotOverlay = document.getElementById('chatbot-overlay');
      this.closeChatButton = document.getElementById('close-chat-button');
      this.faqCategoriesContainer = document.getElementById('faqCategories');
      this.faqButtonsContainer = document.getElementById('faqButtons');
      this.backButtonContainer = document.getElementById('backButtonContainer');
      this.searchInput = document.getElementById('searchQuestions');
      this.typingIndicator = document.getElementById('typing-indicator');
      this.localStorageKey = 'aquapulseChatHistory';
      this.currentCategory = null;
      this.timer = null;

      // =======================
      // BASE DE CONHECIMENTO
      // =======================
      this.respostas = [
        {
          keywords: ['umidade', 'nível de umidade', 'ajustar umidade', 'molhado', 'seco'],
          respostas: [
            {
              text: `
<strong>Controle de umidade</strong><br>
• Acesse o app AquaPulse → painel principal → carta "Umidade"<br>
• Ajuste o nível alvo (em %) para cada zona de irrigação.<br>
• O sistema liga e desliga automaticamente para manter a faixa configurada.<br><br>
<strong>Dica:</strong> para plantas mais sensíveis, use faixas menores (ex.: 35–45%).
              `
            },
            {
              text: `
O nível ideal de umidade varia por cultura:<br>
• Hortaliças: 35–50%<br>
• Frutíferas: 25–40%<br>
• Plantas ornamentais: 30–45%<br><br>
Recomendo consultar o agrônomo responsável ou o manual técnico da sua cultura.
              `
            }
          ]
        },
        {
          keywords: ['vazão', 'vazao', 'controlar vazão', 'problemas de vazão', 'pressão baixa', 'pressao baixa'],
          respostas: [
            {
              text: `
<strong>Para ajustar a vazão:</strong><br>
1. Abra o app → menu <em>Configurações &gt; Hidráulica</em>.<br>
2. Selecione o setor / válvula.<br>
3. Ajuste o limite de vazão (L/h) e a pressão mínima.<br><br>
O sistema desliga automaticamente se identificar vazão fora da faixa configurada.
              `
            },
            {
              text: `
Se a vazão estiver estranha:<br>
• Verifique se não há vazamento ou tubulação amassada.<br>
• Confira se o filtro está limpo.<br>
• Veja se a bomba está ligando normalmente e sem ruídos incomuns.
              `
            }
          ]
        },
        {
          keywords: ['ligar sistema', 'desligar sistema', 'modo de pausa', 'agendar irrigações', 'agendar irrigacoes', 'programar irrigação'],
          respostas: [
            {
              text: `
<strong>Ligar / desligar o sistema:</strong><br>
• No app, toque no botão de liga/desliga na parte superior do painel.<br>
• No módulo físico, use o botão POWER por 3 segundos.<br><br>
O modo <em>Pausa</em> interrompe temporariamente todas as irrigações sem apagar os agendamentos.
              `
            },
            {
              text: `
<strong>Agendar irrigações:</strong><br>
1. App → menu <em>Programação</em>.<br>
2. Selecione o setor desejado.<br>
3. Defina dias da semana, horário inicial e duração.<br>
4. Salve para ativar o cronograma.
              `
            }
          ]
        },
        {
          keywords: ['previsão do tempo', 'ver previsão', 'chuva', 'clima', 'tempo'],
          respostas: [
            {
              text: `
A previsão do tempo aparece no topo do app (ícone de nuvem).<br>
Ela é usada para:<br>
• Reduzir ou cancelar irrigações se houver chuva prevista;<br>
• Proteger contra estresse hídrico em ondas de calor.<br><br>
Você pode configurar a sensibilidade dessa função em <em>Configurações &gt; Inteligência Climática</em>.
              `
            }
          ]
        },
        {
          keywords: ['gráficos', 'graficos', 'histórico de regas', 'historico de regas', 'dados', 'consumo de água', 'log de irrigação'],
          respostas: [
            {
              text: `
Para ver gráficos e histórico:<br>
1. Abra o app → aba <em>Dados</em> ou ícone de gráfico.<br>
2. Escolha o período (7, 15, 30 dias ou personalizado).<br>
3. Veja:<br>
   • Volume irrigado por setor;<br>
   • Horários das irrigações;<br>
   • Comparação com a média histórica.<br><br>
O histórico padrão é armazenado por 30 dias. Em alguns planos, esse tempo pode ser maior.
              `
            }
          ]
        },
        {
          keywords: ['configurações', 'configuracoes', 'personalizar', 'unidades de medida', 'wi-fi', 'wifi', 'rede', 'senha wifi'],
          respostas: [
            {
              text: `
<strong>Configurações gerais:</strong><br>
App → <em>Configurações</em>, você pode:<br>
• Trocar unidade (°C/°F, bar/psi, L/m³);<br>
• Ajustar idioma;<br>
• Configurar notificações.<br><br>
<strong>Wi-Fi:</strong><br>
• Vá em <em>Conectividade &gt; Wi-Fi</em>;<br>
• Escolha a rede e informe a senha;<br>
• Aguarde o status ficar <strong>Conectado</strong>.
              `
            }
          ]
        },
        {
          keywords: ['sensor', 'sensores', 'umidade do solo', 'falha no sensor', 'erro sensor'],
          respostas: [
            {
              text: `
<strong>Sensores de umidade:</strong><br>
• O app mostra o status de cada sensor (OK, Alerta, Falha).<br>
• Se aparecer <em>Falha</em>, verifique:<br>
  – Cabo desconectado ou danificado;<br>
  – Conectores molhados;<br>
  – Calibração em <em>Configurações &gt; Sensores</em>.<br><br>
Se o problema persistir, registre um ticket com foto da instalação.
              `
            }
          ]
        },
        {
          keywords: ['bateria', 'energia', 'queda de energia', 'no-break', 'nobreak'],
          respostas: [
            {
              text: `
O AquaPulse possui sistema de proteção para quedas de energia.<br><br>
• Se há bateria / no-break:<br>
  – O sistema entra em modo seguro e registra o evento.<br>
• Sem bateria:<br>
  – O sistema desliga e, ao voltar a energia, restaura os agendamentos salvos.<br><br>
Você pode ver o histórico de falhas de energia em <em>Logs do Sistema</em>.
              `
            }
          ]
        },
        {
          keywords: ['vazamento', 'leak', 'fuga de água', 'alarme vazão', 'alarme vazamento'],
          respostas: [
            {
              text: `
Se o sistema detecta vazamento, ele:<br>
• Interrompe a irrigação no setor afetado;<br>
• Envia notificação para o app;<br>
• Registra o evento em <em>Histórico &gt; Alertas</em>.<br><br>
Verifique mangueiras, conexões e registro principal e, após corrigir, toque em <em>Confirmar resolvido</em> no app.
              `
            }
          ]
        },
        {
          keywords: ['instalação', 'instalacao', 'instalar', 'montagem', 'guia de instalação'],
          respostas: [
            {
              text: `
O guia de instalação completo está disponível em:<br>
• Página de suporte → seção <strong>Documentação</strong>;<br>
• Botão <strong>Guia de Instalação</strong>.<br><br>
Ele traz passo a passo de:<br>
• Posicionamento da central;<br>
• Ligação hidráulica e elétrica;<br>
• Primeira configuração no app.
              `
            }
          ]
        },
        {
          keywords: ['manual', 'suporte', 'garantia', 'contato', 'atendimento', 'falar com humano', 'falar com atendente', 'humano'],
          respostas: [
            {
              text: `
<strong>Manual e documentação:</strong><br>
• Baixe em "Documentação" aqui na página.<br><br>
<strong>Suporte humano:</strong><br>
• WhatsApp: <a href="https://api.whatsapp.com/send?phone=5566992524707" target="_blank">clique aqui para falar com um atendente</a>.<br>
• Envie também prints da tela e fotos da instalação para agilizar o diagnóstico.<br><br>
<strong>Garantia:</strong> 1 ano contra defeitos de fabricação (consulte o termo completo no manual).
              `
            }
          ]
        },
        {
          keywords: ['olá', 'ola', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'eai', 'eaí'],
          respostas: [
            { text: 'Olá! 🌱 Como posso te ajudar com o AquaPulse hoje?' }
          ]
        },
        {
          keywords: ['tchau', 'até logo', 'até mais', 'obrigado', 'valeu'],
          respostas: [
            { text: 'De nada! Se precisar, é só chamar aqui no chat. 💧' }
          ]
        }
      ];

      // Fuse.js
      this.fuseOptions = {
        keys: ['keywords'],
        threshold: 0.45,
        ignoreLocation: true
      };
      this.fuse = new Fuse(this.respostas, this.fuseOptions);

      // FAQ agrupado
      this.categorizedQuestions = {
        'Umidade': [
          'Como ajustar a umidade?',
          'Qual o nível ideal de umidade?',
          'O que fazer se a umidade estiver muito alta/baixa?'
        ],
        'Vazão': [
          'Como controlar a vazão?',
          'Qual a vazão ideal para minhas plantas?',
          'Como solucionar problemas de vazão?'
        ],
        'Sistema': [
          'Como ligo/desligo o sistema?',
          'O que significa o modo de pausa?',
          'Como agendar irrigações?'
        ],
        'Previsão do Tempo': [
          'Onde vejo a previsão do tempo?',
          'Como a previsão afeta a irrigação?',
          'O app considera a chuva?'
        ],
        'Dados e Histórico': [
          'Como acesso os gráficos?',
          'O que os gráficos mostram?',
          'Onde está o histórico de regas?',
          'Por quanto tempo o histórico é armazenado?'
        ],
        'Configurações': [
          'Posso personalizar algo?',
          'Como alterar as unidades de medida?',
          'Como conectar o Wi-Fi?'
        ],
        'Sensores': [
          'Como saber se um sensor está com falha?',
          'Onde vejo o status dos sensores?'
        ],
        'Geral': [
          'Onde encontro o manual?',
          'Como entro em contato com o suporte?',
          'Qual a garantia do produto?'
        ]
      };

      this.initialize();
    }

    /* ==========================
       INIT
    =========================== */
    initialize() {
      // Listeners básicos
      if (this.chatButton)
        this.chatButton.addEventListener('click', this.openChatbot.bind(this));

      if (this.closeChatButton)
        this.closeChatButton.addEventListener('click', this.closeChatbot.bind(this));

      if (this.chatbotOverlay)
        this.chatbotOverlay.addEventListener('click', this.handleOverlayClick.bind(this));

      if (this.sendButton)
        this.sendButton.addEventListener('click', () => this.sendMessage());

      if (this.messageInput)
        this.messageInput.addEventListener('keypress', this.handleEnterPress.bind(this));

      if (this.searchInput)
        this.searchInput.addEventListener('input', this.debounceFilterQuestions.bind(this));

      // Acessibilidade ARIA
      if (this.chatbotContainer) {
        this.chatbotContainer.setAttribute('aria-modal', 'true');
        this.chatbotContainer.setAttribute('role', 'dialog');
        this.chatbotContainer.setAttribute('aria-label', 'Chat ao Vivo com AquaPulse');
      }
      if (this.messageInput)
        this.messageInput.setAttribute('aria-label', 'Digite sua mensagem');
      if (this.sendButton)
        this.sendButton.setAttribute('aria-label', 'Enviar mensagem');
      if (this.closeChatButton)
        this.closeChatButton.setAttribute('aria-label', 'Fechar chat');
      if (this.searchInput)
        this.searchInput.setAttribute('aria-label', 'Buscar perguntas frequentes');

      // Garante que o "Digitando..." COMEÇA escondido
      if (this.typingIndicator) {
        this.typingIndicator.style.display = 'none';
      }

      // Render categorias de FAQ
      this.renderFaqCategories();

      // Clique em ações do bot (botões dentro das respostas)
      if (this.chatBody) {
        this.chatBody.addEventListener(
          'click',
          this.handleBotActionClick.bind(this)
        );
      }
    }

    /* ==========================
       CONTROLE DO MODAL
    =========================== */
    openChatbot() {
      if (!this.chatbotContainer || !this.chatbotOverlay) return;

      this.chatbotContainer.style.display = 'flex';
      this.chatbotOverlay.style.display = 'block';

      // Recarrega histórico
      this.loadChatHistory();

      // Se não tiver histórico, manda mensagem de boas-vindas
      if (!localStorage.getItem(this.localStorageKey)) {
        this.addMessage(
          'Olá! 👋 Eu sou o assistente AquaPulse. Posso te ajudar com umidade, vazão, sensores, horários de irrigação, consumo de água, instalação e muito mais. O que você quer configurar ou entender primeiro?',
          false
        );
      }

      if (this.messageInput) {
        this.messageInput.focus();
      }
    }

    closeChatbot() {
      if (!this.chatbotContainer || !this.chatbotOverlay) return;
      this.chatbotContainer.style.display = 'none';
      this.chatbotOverlay.style.display = 'none';
    }

    handleOverlayClick(event) {
      if (event.target === this.chatbotOverlay) {
        this.closeChatbot();
      }
    }

    /* ==========================
       MENSAGENS
    =========================== */
    addMessage(text, isUser) {
      if (!this.chatBody) return;

      const messageDiv = document.createElement('div');
      messageDiv.classList.add('chatbot-message', isUser ? 'user' : 'bot');
      messageDiv.innerHTML = text;

      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      const timestampSpan = document.createElement('span');
      timestampSpan.classList.add('message-timestamp');
      timestampSpan.style.fontSize = '0.7rem';
      timestampSpan.style.color = '#777';
      timestampSpan.style.marginLeft = '0.5rem';
      timestampSpan.textContent = timestamp;

      messageDiv.appendChild(timestampSpan);

      // Insere sempre antes do indicador de digitação (se existir)
      if (this.typingIndicator && this.typingIndicator.parentNode === this.chatBody) {
        this.chatBody.insertBefore(messageDiv, this.typingIndicator);
      } else {
        this.chatBody.appendChild(messageDiv);
      }

      this.chatBody.scrollTop = this.chatBody.scrollHeight;
      this.saveChatHistory();
    }

    normalizeText(text) {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    getBotResponse(userMessage) {
      const normalized = this.normalizeText(userMessage);
      const results = this.fuse.search(normalized);

      if (results.length > 0) {
        const bestMatch = results[0].item;
        const resposta =
          bestMatch.respostas[
            Math.floor(Math.random() * bestMatch.respostas.length)
          ];
        return resposta;
      }

      // Fallback: não achou nada pelo Fuse
      return {
        text: `
Não encontrei uma resposta direta para isso 😕, mas posso te ajudar com:<br>
• Umidade do solo<br>
• Vazão e pressão<br>
• Programação de horários<br>
• Sensores e alertas<br>
• Consumo de água<br>
• Instalação e Wi-Fi<br><br>
Toque em uma sugestão abaixo ou tente reformular sua pergunta:
<div class="bot-suggestions">
  <button class="bot-suggestion" data-question="Como ajustar a umidade?">Umidade</button>
  <button class="bot-suggestion" data-question="Como controlar a vazão?">Vazão</button>
  <button class="bot-suggestion" data-question="Como agendar irrigações?">Agendamentos</button>
  <button class="bot-suggestion" data-question="Como conectar o Wi-Fi?">Wi-Fi</button>
</div>
        `
      };
    }

    sendMessage(forcedText) {
      if (!this.messageInput && !forcedText) return;

      const messageText = (forcedText || this.messageInput.value).trim();
      if (!messageText) return;

      this.addMessage(messageText, true);

      if (this.messageInput) {
        this.messageInput.value = '';
      }

      this.showTypingIndicator();

      setTimeout(() => {
        const botResponseObj = this.getBotResponse(messageText);
        this.hideTypingIndicator();

        let botResponseHTML = botResponseObj && botResponseObj.text
          ? botResponseObj.text
          : 'Desculpe, não encontrei uma resposta para sua pergunta.';

        if (botResponseObj.image) {
          botResponseHTML += `<br><img src="${botResponseObj.image}" alt="Imagem da Resposta" style="max-width: 100%;">`;
        }

        if (botResponseObj.action) {
          botResponseHTML += `<br><button class="bot-response-action">${botResponseObj.action}</button>`;
        }

        this.addMessage(botResponseHTML, false);
      }, 700);
    }

    showTypingIndicator() {
      if (this.typingIndicator) {
        this.typingIndicator.style.display = 'block';
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
      }
    }

    hideTypingIndicator() {
      if (this.typingIndicator) {
        this.typingIndicator.style.display = 'none';
      }
    }

    /* ==========================
       HISTÓRICO (LOCALSTORAGE)
    =========================== */
    saveChatHistory() {
      if (!this.chatBody) return;
      const messages = Array.from(
        this.chatBody.querySelectorAll('.chatbot-message.user, .chatbot-message.bot')
      ).map(msg => ({
        html: msg.innerHTML,
        isUser: msg.classList.contains('user')
      }));
      localStorage.setItem(this.localStorageKey, JSON.stringify(messages));
    }

    loadChatHistory() {
      const saved = localStorage.getItem(this.localStorageKey);
      if (!saved || !this.chatBody) return;

      try {
        const messages = JSON.parse(saved);
        // Remove mensagens anteriores (mas mantém search/FAQ/typingIndicator)
        this.chatBody
          .querySelectorAll('.chatbot-message.user, .chatbot-message.bot')
          .forEach(el => {
            if (el !== this.typingIndicator) el.remove();
          });

        messages.forEach(msg => {
          const div = document.createElement('div');
          div.classList.add('chatbot-message', msg.isUser ? 'user' : 'bot');
          div.innerHTML = msg.html;
          if (this.typingIndicator && this.typingIndicator.parentNode === this.chatBody) {
            this.chatBody.insertBefore(div, this.typingIndicator);
          } else {
            this.chatBody.appendChild(div);
          }
        });

        // Reatacha referência do typing-indicator (caso tenha sido re-renderizado)
        this.typingIndicator = document.getElementById('typing-indicator');

        // GARANTE que volta escondido ao abrir o chat
        if (this.typingIndicator) {
          this.typingIndicator.style.display = 'none';
        }

        this.chatBody.scrollTop = this.chatBody.scrollHeight;
      } catch (e) {
        console.error('Erro ao carregar histórico do chat:', e);
      }
    }

    /* ==========================
       FAQ DENTRO DO CHAT
    =========================== */
    renderFaqCategories() {
      if (!this.faqCategoriesContainer) return;
      this.faqCategoriesContainer.innerHTML = '';

      for (const category in this.categorizedQuestions) {
        const categoryButton = document.createElement('button');
        categoryButton.textContent = category;
        categoryButton.addEventListener('click', () =>
          this.showQuestions(category)
        );
        this.faqCategoriesContainer.appendChild(categoryButton);
      }
    }

    showQuestions(category) {
      if (!this.faqButtonsContainer || !this.faqCategoriesContainer || !this.backButtonContainer) return;

      this.faqButtonsContainer.innerHTML = '';
      this.categorizedQuestions[category].forEach(question => {
        const button = document.createElement('button');
        button.textContent = question;
        button.addEventListener('click', () => this.sendMessage(question));
        this.faqButtonsContainer.appendChild(button);
      });

      this.faqCategoriesContainer.style.display = 'none';
      this.faqButtonsContainer.style.display = 'flex';
      this.backButtonContainer.style.display = 'block';
      this.currentCategory = category;
    }

    showCategories() {
      if (!this.faqButtonsContainer || !this.faqCategoriesContainer || !this.backButtonContainer) return;

      this.faqCategoriesContainer.style.display = 'flex';
      this.faqButtonsContainer.style.display = 'none';
      this.backButtonContainer.style.display = 'none';
      this.currentCategory = null;

      if (this.searchInput) {
        this.searchInput.value = '';
      }
      this.filterQuestions();
    }

    filterQuestions() {
      if (!this.searchInput || !this.faqButtonsContainer || !this.faqCategoriesContainer || !this.backButtonContainer) return;

      const searchTerm = this.searchInput.value.toLowerCase();
      this.faqButtonsContainer.innerHTML = '';

      if (searchTerm) {
        this.faqCategoriesContainer.style.display = 'none';
        this.faqButtonsContainer.style.display = 'flex';
        this.backButtonContainer.style.display = 'block';

        let foundQuestions = false;
        for (const category in this.categorizedQuestions) {
          this.categorizedQuestions[category].forEach(question => {
            if (question.toLowerCase().includes(searchTerm)) {
              const button = document.createElement('button');
              button.textContent = question;
              button.addEventListener('click', () =>
                this.sendMessage(question)
              );
              this.faqButtonsContainer.appendChild(button);
              foundQuestions = true;
            }
          });
        }

        if (!foundQuestions) {
          const noResultDiv = document.createElement('div');
          noResultDiv.classList.add('chatbot-message', 'bot');
          noResultDiv.innerHTML = 'Nenhuma pergunta encontrada para sua busca.';
          this.faqButtonsContainer.appendChild(noResultDiv);
        }
      } else if (this.currentCategory) {
        this.showQuestions(this.currentCategory);
      } else {
        this.faqButtonsContainer.style.display = 'none';
        this.faqCategoriesContainer.style.display = 'flex';
        this.backButtonContainer.style.display = 'none';
      }
    }

    debounceFilterQuestions() {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.filterQuestions.bind(this), 300);
    }

    handleEnterPress(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.sendMessage();
      }
    }

    handleBotActionClick(event) {
      const actionBtn = event.target.closest('.bot-response-action');
      const suggestionBtn = event.target.closest('.bot-suggestion');

      if (actionBtn) {
        const action = actionBtn.textContent;
        this.addMessage(`Você clicou em: ${action}`, true);
      }

      if (suggestionBtn) {
        const question = suggestionBtn.getAttribute('data-question');
        if (question) {
          this.sendMessage(question);
        }
      }
    }
  }

  // Instanciar chatbot e expor função global para o botão "Buscar" do HTML
  const chatbot = new Chatbot();
  window.filterQuestions = () => chatbot.filterQuestions();
  window.showCategories = () => chatbot.showCategories();
});
