// Animações de Entrada
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.progress-card, .feature-card');
    const triggerBottom = window.innerHeight * 0.85;

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();

        if (rect.top < triggerBottom) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

// Inicializa animações
document.addEventListener('DOMContentLoaded', () => {
    // Anima barras de progresso
    document.querySelectorAll('.progress-fill').forEach(bar => {
        const targetWidth = bar.getAttribute('style')?.match(/width:\s*([^;]+)/)?.[1] || '0%';

        // começa em 0
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 400);
    });

    // Configura observador de scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executa inicialmente
});
