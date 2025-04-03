
// Interatividade do FAQ
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

// Validação de Formulário
const form = document.querySelector('.contact-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso!');
    form.reset();
});
