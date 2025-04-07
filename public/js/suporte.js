// Accordion FAQ
document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.parentElement;
      const answer = parent.querySelector('.faq-answer');
      parent.classList.toggle('active');
      answer.style.maxHeight = parent.classList.contains('active') ? answer.scrollHeight + 'px' : '0';
    });
  });
  
  // Banco de respostas
  const respostas = [
    {
      keywords: ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite'],
      respostas: [
        "Olá! Como posso ajudar?",
        "Saudações! Em que posso auxiliar hoje?",
        "Oi! Conte comigo para resolver suas dúvidas.",
        "Bem-vindo ao suporte AquaPulse! Como posso ajudar?",
        "Olá! Estou aqui para ajudar com suas dúvidas."
      ]
    },
    {
      keywords: ['erro', 'problema', 'não funciona', 'quebrado', 'defeito'],
      respostas: [
        "Vamos resolver isso! Verifique a conexão com água e energia.",
        "Por favor, reinicie o dispositivo e tente novamente.",
        "Verifique se há entupimentos nos filtros.",
        "Poderia descrever o problema com mais detalhes?",
        "Vou te ajudar! Qual luz está piscando no painel?"
      ]
    },
    {
      keywords: ['manual', 'instruções', 'documentação'],
      respostas: [
        "📥 Manual completo: [LINK_DOWNLOAD]",
        "Baixe o manual aqui: [LINK_DOWNLOAD]",
        "Documentação disponível em: [LINK_DOWNLOAD]"
      ]
    },
    {
      keywords: ['garantia', 'troca', 'devolução'],
      respostas: [
        "Garantia de 2 anos contra defeitos de fabricação.",
        "Para acionar a garantia, precisamos do número de série.",
        "Entre em contato com nossa equipe técnica para trocas.",
        "Processo de devolução: [LINK_PROCESSO]"
      ]
    },
    {
      keywords: ['contato', 'humano', 'atendente', 'whatsapp'],
      respostas: [
        "Claro! Nosso WhatsApp: +55 66 99252-4707",
        "Fale diretamente conosco: +55 66 99252-4707",
        "Transferindo para WhatsApp..."
      ]
    }
  ];
  
  // Função de busca de respostas
  function encontrarResposta(mensagem) {
    const mensagemLower = mensagem.toLowerCase();
    const respostaEncontrada = respostas.find(item => 
      item.keywords.some(keyword => mensagemLower.includes(keyword))
    );
  
    if (!respostaEncontrada) return null;
    
    return respostaEncontrada.respostas[
      Math.floor(Math.random() * respostaEncontrada.respostas.length)
    ];
  }
  
  // Inicialização do Chat
  document.addEventListener("DOMContentLoaded", () => {
    // Botão do Chat
    const chatBtn = document.getElementById('chat-button');
    if (chatBtn) {
      chatBtn.addEventListener('click', () => {
        const chatWindow = window.open('', 'ChatWindow', 'width=400,height=600');
        if (!chatWindow) {
          alert('Por favor permita pop-ups para usar o chat');
          return;
        }
  
        chatWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
              <title>Chat AquaPulse</title>
              <style>
                  body { font-family: 'Poppins', sans-serif; background: #080808; color: white; margin: 0; padding: 0; display: flex; flex-direction: column; height: 100vh; }
                  .chat-header { background: #28a745; padding: 1rem; text-align: center; font-weight: bold; color: #000; }
                  .chat-body { flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; }
                  .chat-input { display: flex; padding: 1rem; background: #111; border-top: 1px solid #333; }
                  .chat-input input { flex: 1; padding: 0.75rem; border-radius: 5px; border: none; background: #222; color: white; outline: none; }
                  .message { background: #1c1c1c; padding: 0.75rem; border-radius: 8px; max-width: 80%; }
                  .user { align-self: flex-end; background: #28a745; color: #000; }
                  .bot { align-self: flex-start; background: #333; }
              </style>
          </head>
          <body>
              <div class="chat-header">Chat AquaPulse</div>
              <div class="chat-body" id="chatBody">
                  <div class="message bot">${['Olá! Como posso ajudar?', 'Bem-vindo! Conte comigo.'][Math.floor(Math.random() * 2)]}</div>
              </div>
              <div class="chat-input">
                  <input type="text" id="messageInput" placeholder="Digite sua mensagem..." autofocus>
              </div>
              <script>
                  const input = document.getElementById('messageInput');
                  const chatBody = document.getElementById('chatBody');
                  
                  function addMessage(msg, isUser) {
                      const msgDiv = document.createElement('div');
                      msgDiv.className = \`message \${isUser ? 'user' : 'bot'}\`;
                      msgDiv.textContent = msg;
                      chatBody.appendChild(msgDiv);
                      chatBody.scrollTop = chatBody.scrollHeight;
                  }
  
                  input.addEventListener('keypress', async (e) => {
                      if (e.key === 'Enter' && input.value.trim()) {
                          const msg = input.value.trim();
                          addMessage(msg, true);
                          
                          setTimeout(() => {
                              const resposta = window.opener.encontrarResposta(msg);
                              if (resposta) {
                                  addMessage(resposta, false);
                              } else {
                                  addMessage(\`Desculpe, não entendi. Por favor, entre em contato via WhatsApp: +55 66 99252-4707\`, false);
                              }
                          }, 800);
                          
                          input.value = '';
                      }
                  });
              <\/script>
          </body>
          </html>
        `);
        chatWindow.document.close();
      });
    }
  
    // Botão de Ticket
    const ticketButton = document.getElementById("ticket-button");
    if (ticketButton) {
      ticketButton.addEventListener("click", () => {
        alert("Ticket enviado com sucesso! Você receberá uma resposta em breve.");
      });
    }
  
    // Botão de Manual
    const manualButton = document.getElementById("manual-btn");
    if (manualButton) {
      manualButton.addEventListener("click", () => {
        window.location.href = '[LINK_MANUAL]';
      });
    }
  
    // Botão de Guia
    const guideButton = document.getElementById("guide-btn");
    if (guideButton) {
      guideButton.addEventListener("click", () => {
        window.location.href = '[LINK_GUIA]';
      });
    }
  
    // Botão de Contato
    const contactButton = document.getElementById("contact-button");
    if (contactButton) {
      contactButton.addEventListener("click", () => {
        window.open('https://api.whatsapp.com/send?phone=5566992524707', '_blank');
      });
    }
  });