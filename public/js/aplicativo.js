
// Animações de Entrada
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.progress-card, .feature-card');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

// Inicializa animações
document.addEventListener('DOMContentLoaded', () => {
    // Anima barras de progresso
    document.querySelectorAll('.progress-fill').forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500);
    });

    // Configura observador de scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executa inicialmente
});
