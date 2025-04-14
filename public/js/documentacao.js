
        document.addEventListener('DOMContentLoaded', () => {
            const sidebar = document.getElementById('apdoc-sidebar');
            const toggleButton = document.getElementById('sidebar-toggle');
            const overlay = document.getElementById('mobile-overlay');
            const sidebarLinks = document.querySelectorAll('#apdoc-sidebar .apdoc-sidebar-link');

            // --- Funções para Sidebar Mobile ---
            const closeMobileSidebar = () => {
                if (sidebar.classList.contains('apdoc-sidebar-mobile-open')) {
                    sidebar.classList.remove('apdoc-sidebar-mobile-open');
                    overlay.classList.remove('active');
                    toggleButton.setAttribute('aria-expanded', 'false');
                    toggleButton.innerHTML = '☰';
                }
            };
             const openMobileSidebar = () => {
                 if (!sidebar.classList.contains('apdoc-sidebar-mobile-open')) {
                     sidebar.classList.add('apdoc-sidebar-mobile-open');
                     overlay.classList.add('active');
                     toggleButton.setAttribute('aria-expanded', 'true');
                     toggleButton.innerHTML = '×';
                 }
             };

            // --- Event Listeners Sidebar Mobile ---
            if (toggleButton && sidebar && overlay) {
                toggleButton.addEventListener('click', (e) => {
                     e.stopPropagation();
                    if (sidebar.classList.contains('apdoc-sidebar-mobile-open')) {
                        closeMobileSidebar();
                    } else {
                        openMobileSidebar();
                    }
                });
            }
            if (overlay) {
                overlay.addEventListener('click', closeMobileSidebar);
            }
            sidebarLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (sidebar.classList.contains('apdoc-sidebar-mobile-open')) {
                        closeMobileSidebar();
                    }
                });
            });

            // --- Active Link Highlighting ---
            const sectionsAndHeadings = document.querySelectorAll('.apdoc-content-section[id], .apdoc-main-content-area h3[id]');
            const navLinks = document.querySelectorAll('.apdoc-sidebar-link[data-target-id]');
            const linkMap = new Map();
            navLinks.forEach(link => linkMap.set(link.dataset.targetId, link));
            let lastActiveLink = null;

            const observerOptions = { root: null, rootMargin: '0px 0px -50% 0px', threshold: 0 };

            const observerCallback = (entries) => {
                 let currentActiveFound = false;
                 entries.forEach(entry => {
                     if (entry.isIntersecting) {
                         const targetId = entry.target.id;
                         const correspondingLink = linkMap.get(targetId);
                         if (correspondingLink) {
                             navLinks.forEach(link => link.classList.remove('active'));
                             correspondingLink.classList.add('active');
                             lastActiveLink = correspondingLink;
                             currentActiveFound = true;
                         }
                     }
                 });
                 if (!currentActiveFound && lastActiveLink && window.scrollY > 0) {
                      navLinks.forEach(link => link.classList.remove('active'));
                      lastActiveLink.classList.add('active');
                 } else if (window.scrollY === 0) {
                     navLinks.forEach(link => link.classList.remove('active'));
                     lastActiveLink = null;
                 }
             };

            const observer = new IntersectionObserver(observerCallback, observerOptions);
            sectionsAndHeadings.forEach(section => observer.observe(section));

            // --- Botão de Copiar Código ---
             // (O código continua aqui, mas não encontrará <pre><code> no novo conteúdo)
            document.querySelectorAll('.apdoc-main-content-area pre').forEach(pre => {
                const code = pre.querySelector('code');
                if (code) { // Só adiciona se houver <code>
                    const button = document.createElement('button');
                    button.innerText = 'Copiar';
                    button.classList.add('apdoc-copy-code-button');
                    button.setAttribute('aria-label', 'Copiar código para a área de transferência');
                    button.addEventListener('click', () => {
                        navigator.clipboard.writeText(code.innerText).then(() => {
                            button.innerText = 'Copiado!'; button.classList.add('copied');
                            setTimeout(() => { button.innerText = 'Copiar'; button.classList.remove('copied'); }, 2000);
                        }).catch(err => {
                            console.error('Erro ao copiar código: ', err); button.innerText = 'Erro';
                             setTimeout(() => { button.innerText = 'Copiar'; }, 2000);
                        });
                    });
                    pre.appendChild(button);
                }
            });
        });
