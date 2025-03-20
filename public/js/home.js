document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Mais informações sobre: ' + this.parentElement.querySelector('h2').innerText);
  });
});