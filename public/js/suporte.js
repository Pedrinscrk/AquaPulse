// Accordion FAQ
document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.parentElement;
      const answer = parent.querySelector('.faq-answer');
      parent.classList.toggle('active');
      answer.style.maxHeight = parent.classList.contains('active') ? answer.scrollHeight + 'px' : '0';
    });
  });
  
    // Botão de Ticket
    const ticketButton = document.getElementById("ticket-button");
    if (ticketButton) {
      ticketButton.addEventListener("click", () => {
        alert("Ticket enviado com sucesso! Você receberá uma resposta em breve.");
      });
    }
  
 
  
    // Botão de Contato
    const contactButton = document.getElementById("contact-button");
    if (contactButton) {
      contactButton.addEventListener("click", () => {
        window.open('https://api.whatsapp.com/send?phone=5566992524707', '_blank');
      });
    }

    class Chatbot {
      constructor() {
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
    
        this.respostas = [
          { keywords: ['umidade', 'nível de umidade', 'ajustar umidade'], respostas: [{ text: 'Para ajustar a umidade, você pode usar os controles no painel principal.' }, { text: 'O nível ideal de umidade depende do tipo de planta. Consulte o manual para mais informações.' }] },
          { keywords: ['vazão', 'controlar vazão', 'problemas de vazão'], respostas: [{ text: 'A vazão pode ser controlada através das configurações do sistema.' }, { text: 'Se você estiver tendo problemas com a vazão, verifique se não há obstruções nas tubulações.' }] },
          { keywords: ['ligar sistema', 'desligar sistema', 'modo de pausa', 'agendar irrigações'], respostas: [{ text: 'Você pode ligar e desligar o sistema usando o botão de energia no aplicativo.' }, { text: 'O modo de pausa interrompe temporariamente a irrigação. As irrigações podem ser agendadas na seção de configurações.' }] },
          { keywords: ['previsão do tempo', 'ver previsão', 'chuva'], respostas: [{ text: 'A previsão do tempo é exibida no painel principal do aplicativo.' }, { text: 'O sistema considera a previsão de chuva para ajustar a irrigação automaticamente.' }] },
          { keywords: ['gráficos', 'histórico de regas', 'dad5os'], respostas: [{ text: 'Você pode acessar os gráficos e o histórico de regas na seção de dados do aplicativo.' }, { text: 'O histórico de regas é armazenado por 30 dias.' }] },
          { keywords: ['configurações', 'personalizar', 'unidades de medida', 'wi-fi'], respostas: [{ text: 'Sim, você pode personalizar várias configurações no aplicativo, como unidades de medida e conexão Wi-Fi.' }] },
          { keywords: ['manual', 'suporte', 'garantia'], respostas: [{ text: 'O manual do produto pode ser encontrado em nosso site na seção de downloads.' }, { text: 'Para entrar em contato com o suporte, você pode usar o chat ao vivo ou enviar um e-mail para suporte@aquapulse.com.' }, { text: 'Nosso produto tem garantia de 1 ano contra defeitos de fabricação.' }] },
          { keywords: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite'], respostas: [{ text: 'Olá! Como posso ajudar hoje?' }] },
          { keywords: ['tchau', 'até logo', 'obrigado'], respostas: [{ text: 'De nada! Tenha um ótimo dia!' }] },
        ];
    
        this.fuseOptions = {
          keys: ['keywords'],
          threshold: 0.6
        };
    
        this.fuse = new Fuse(this.respostas, this.fuseOptions);
    
        this.initialize();
      }
    
      initialize() {
        // Event listeners
        if (this.chatButton) this.chatButton.addEventListener('click', this.openChatbot.bind(this));
        if (this.closeChatButton) this.closeChatButton.addEventListener('click', this.closeChatbot.bind(this));
        if (this.chatbotOverlay) this.chatbotOverlay.addEventListener('click', this.handleOverlayClick.bind(this));
        if (this.sendButton) this.sendButton.addEventListener('click', this.sendMessage.bind(this));
        if (this.messageInput) this.messageInput.addEventListener('keypress', this.handleEnterPress.bind(this));
        if (this.searchInput) this.searchInput.addEventListener('input', this.debounceFilterQuestions.bind(this));
    
        // Adicionar atributos ARIA
        this.chatbotContainer.setAttribute('aria-modal', 'true');
        this.chatbotContainer.setAttribute('role', 'dialog');
        this.chatbotContainer.setAttribute('aria-label', 'Chat ao Vivo com AquaPulse');
        this.messageInput.setAttribute('aria-label', 'Digite sua mensagem');
        this.sendButton.setAttribute('aria-label', 'Enviar mensagem');
        this.closeChatButton.setAttribute('aria-label', 'Fechar chat');
        this.searchInput.setAttribute('aria-label', 'Buscar perguntas frequentes');
    
        // Inicializar FAQ Categories
        this.renderFaqCategories();
    
        // Carregar histórico ao inicializar se o chat já estiver aberto
        if (this.chatbotContainer && this.chatbotContainer.style.display === 'flex') {
          this.loadChatHistory();
        }
      }
    
      // Funções de controle do modal
      openChatbot() {
        this.chatbotContainer.style.display = 'flex';
        this.chatbotOverlay.style.display = 'block';
        this.loadChatHistory();
      }
    
      closeChatbot() {
        this.chatbotContainer.style.display = 'none';
        this.chatbotOverlay.style.display = 'none';
      }
    
      handleOverlayClick(event) {
        if (event.target === this.chatbotOverlay) {
          this.closeChatbot();
        }
      }
    
      // Função para adicionar uma mensagem ao chat e salvar o histórico
      addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', isUser ? 'user' : 'bot');
        messageDiv.innerHTML = text;
    
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timestampSpan = document.createElement('span');
        timestampSpan.classList.add('message-timestamp');
        timestampSpan.style.fontSize = '0.7rem';
        timestampSpan.style.color = '#777';
        timestampSpan.style.marginLeft = '0.5rem';
        timestampSpan.textContent = timestamp;
    
        messageDiv.appendChild(timestampSpan);
        this.chatBody.appendChild(messageDiv);
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
        this.saveChatHistory();
      }
    
      // Obter resposta do bot
      getBotResponse(userMessage) {
        const results = this.fuse.search(userMessage);
        if (results.length > 0) {
          const bestMatch = results[0].item;
          return bestMatch.respostas[Math.floor(Math.random() * bestMatch.respostas.length)];
        } else {
          return { text: 'Desculpe, não encontrei uma resposta para sua pergunta.' };
        }
      }
    
      // Enviar mensagem
      sendMessage() {
        const messageText = this.messageInput.value.trim();
        if (messageText) {
          this.addMessage(messageText, true);
          this.messageInput.value = '';
          this.showTypingIndicator();
    
          setTimeout(() => {
            const botResponseObj = this.getBotResponse(messageText);
            this.hideTypingIndicator();
            let botResponseHTML = '';
            if (botResponseObj && botResponseObj.text) {
              botResponseHTML = botResponseObj.text;
              if (botResponseObj.image) {
                botResponseHTML += `<br><img src="${botResponseObj.image}" alt="Imagem da Resposta" style="max-width: 100%;">`;
              }
              if (botResponseObj.action) {
                botResponseHTML += `<br><button class="bot-response-action">${botResponseObj.action}</button>`;
              }
            } else {
              botResponseHTML = 'Desculpe, não encontrei uma resposta para sua pergunta.';
            }
            this.addMessage(botResponseHTML, false);
          }, 800);
        }
      }
    
      // Funções para mostrar/esconder o indicador de digitação
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
    
      // Funções para salvar e carregar o histórico do chat
      saveChatHistory() {
        const chatMessages = this.chatBody.innerHTML;
        localStorage.setItem(this.localStorageKey, chatMessages);
      }
    
      loadChatHistory() {
        const savedMessages = localStorage.getItem(this.localStorageKey);
        if (savedMessages) {
          this.chatBody.innerHTML = savedMessages;
          this.chatBody.scrollTop = this.chatBody.scrollHeight;
        }
      }
    
      // Lógica do FAQ
      categorizedQuestions = {
        "Umidade": [
          "Como ajustar a umidade?",
          "Qual o nível ideal de umidade?",
          "O que fazer se a umidade estiver muito alta/baixa?"
        ],
        "Vazão": [
          "Como controlar a vazão?",
          "Qual a vazão ideal para minhas plantas?",
          "Como solucionar problemas de vazão?"
        ],
        "Sistema": [
          "Como ligo/desligo o sistema?",
          "O que significa o modo de pausa?",
          "Como agendar irrigações?"
        ],
        "Previsão do Tempo": [
          "Onde vejo a previsão do tempo?",
          "Como a previsão afeta a irrigação?",
          "O app considera a chuva?"
        ],
        "Dados e Histórico": [
          "Como acesso os gráficos?",
          "O que os gráficos mostram?",
          "Onde está o histórico de regas?",
          "Por quanto tempo o histórico é armazenado?"
        ],
        "Configurações": [
          "Posso personalizar algo?",
          "Como alterar as unidades de medida?",
          "Como conectar o Wi-Fi?"
        ],
        "Geral": [
          "Onde encontro o manual?",
          "Como entro em contato com o suporte?",
          "Qual a garantia do produto?"
        ]
      };
    
      renderFaqCategories() {
        this.faqCategoriesContainer.innerHTML = '';
        for (const category in this.categorizedQuestions) {
          const categoryButton = document.createElement('button');
          categoryButton.textContent = category;
          categoryButton.addEventListener('click', () => this.showQuestions(category));
          this.faqCategoriesContainer.appendChild(categoryButton);
        }
      }
    
      showQuestions(category) {
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
        this.faqCategoriesContainer.style.display = 'flex';
        this.faqButtonsContainer.style.display = 'none';
        this.backButtonContainer.style.display = 'none';
        this.currentCategory = null;
        this.searchInput.value = '';
        this.filterQuestions();
      }
    
      filterQuestions() {
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
                button.addEventListener('click', () => this.sendMessage(question));
                this.faqButtonsContainer.appendChild(button);
                foundQuestions = true;
              }
            });
          }
          if (!foundQuestions) {
            this.faqButtonsContainer.innerHTML = '<div class="chatbot-message bot">Nenhuma pergunta encontrada para sua busca.</div>';
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
          this.sendMessage();
        }
      }
    
      handleBotActionClick(event) {
        if (event.target.classList.contains('bot-response-action')) {
          const action = event.target.textContent;
          console.log('Ação do bot clicada:', action);
          this.addMessage(`Você clicou em: ${action}`, true);
        }
      }
    }
    
    document.addEventListener("DOMContentLoaded", () => {
      const chatbot = new Chatbot();
    
      // Event listener para o botão de Ticket
      const ticketButton = document.getElementById("ticket-button");
      if (ticketButton) ticketButton.addEventListener("click", () => { alert("Ticket enviado com sucesso! Você receberá uma resposta em breve."); });
    
      // Event listener para o botão de Contato
      const contactButton = document.getElementById("contact-button");
      if (contactButton) contactButton.addEventListener("click", () => { window.open('https://api.whatsapp.com/send?phone=5566992524707', '_blank'); });
    
      // Event listener para cliques no corpo do chat (para ações do bot)
      chatbot.chatBody.addEventListener('click', chatbot.handleBotActionClick.bind(chatbot));
    });