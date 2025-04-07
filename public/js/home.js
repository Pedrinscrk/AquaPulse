document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Mais informações sobre: ' + this.parentElement.querySelector('h2').innerText);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const elementos = document.querySelectorAll('.chamada-imagem, .Textos-animados-container');

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

  elementos.forEach(el => observer.observe(el));
});


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
        el.classList.remove('animate'); // Permite repetir animação ao voltar
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-50px 0px'
  });

  elementosAnimados.forEach(el => observer.observe(el));
});





