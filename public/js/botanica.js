// Configurações
const PERENUAL_API_KEY = "sk-2OIW67eef038887e99590";
const UNSPLASH_API_KEY = "cyQiVStXEV5LEBQ4rLmZn29t0iBNSSMXqVgDTec--oo";
const ULTIMA_BUSCA_KEY = "ultimaBusca";

// Tradução dos termos
const tradutor = {
  watering: "Rega",
  sunlight: "Luz Solar",
  temperature: "Temperatura",
  soil: "Solo",
  care_level: "Nível de Cuidado",
};

// Elementos
const inputBusca = document.getElementById("inputBusca");
const resultadosDiv = document.getElementById("resultados");

// Carregar última busca
window.addEventListener("load", () => {
  const ultimaBusca = localStorage.getItem(ULTIMA_BUSCA_KEY);
  if (ultimaBusca) {
    inputBusca.value = ultimaBusca;
    buscarPlanta(ultimaBusca);
  }
});

// Busca rápida
document.querySelectorAll(".planta-rapida").forEach((botao) => {
  botao.addEventListener("click", () => {
    const planta = botao.dataset.planta;
    inputBusca.value = planta;
    buscarPlanta(planta);
  });
});

// Busca principal
async function buscarPlanta(nome) {
  if (!nome) return;

  resultadosDiv.innerHTML =
    '<div class="carregando"><i class="bi bi-arrow-repeat"></i> Carregando...</div>';

  try {
    // Salvar última busca
    localStorage.setItem(ULTIMA_BUSCA_KEY, nome);

    // Buscar dados
    const [dados, imagens] = await Promise.all([
      fetch(
        `https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&q=${nome}`
      ).then((r) => r.json()),
      fetch(
        `https://api.unsplash.com/search/photos?query=${nome}&client_id=${UNSPLASH_API_KEY}`
      ).then((r) => r.json()),
    ]);

    if (!dados.data || dados.data.length === 0) {
      throw new Error("Planta não encontrada");
    }

    // Processar dados
    const planta = dados.data[0];
    const imagem = imagens.results[0]?.urls?.regular || "";
    const recomendacoes = [];

    // Mapear recomendações
    for (const [key, value] of Object.entries(planta)) {
      if (tradutor[key] && value) {
        recomendacoes.push({
          termo: tradutor[key],
          valor: Array.isArray(value) ? value.join(", ") : value,
        });
      }
    }

    // Montar resultado
    resultadosDiv.innerHTML = `
        <div class="resultados">
            <div class="planta-card">
                ${
                  imagem
                    ? `<img src="${imagem}" class="planta-imagem" alt="${nome}">`
                    : ""
                }
                <div class="planta-detalhes">
                    <h2 class="planta-titulo">${planta.common_name || nome}</h2>
                    <p class="nome-cientifico">
                        <i class="bi bi-flower2"></i>
                        Nome científico: ${
                          planta.scientific_name || "Não disponível"
                        }
                    </p>
                    
                    <div class="recomendacoes">
                        ${recomendacoes
                          .map(
                            (rec) => `
                            <div class="recomendacao">
                                <i class="bi ${getIcon(rec.termo)}"></i>
                                <div>
                                    <strong>${rec.termo}:</strong><br>
                                    ${rec.valor}
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        </div>
    `;
  } catch (erro) {
    resultadosDiv.innerHTML = `
        <div class="erro">
            <i class="bi bi-x-circle"></i>
            ${erro.message}. Verifique se digitou em inglês!
        </div>
    `;
  }
}

// Obter ícone correto
function getIcon(termo) {
  const icons = {
    Rega: "bi-droplet",
    "Luz Solar": "bi-sun",
    Temperatura: "bi-thermometer-sun",
    Solo: "bi-globe2",
    "Nível de Cuidado": "bi-clipboard-heart",
  };
  return icons[termo] || "bi-info-circle";
}

// Eventos
document.getElementById("botaoBusca").addEventListener("click", () => {
  buscarPlanta(inputBusca.value.trim());
});

inputBusca.addEventListener("keypress", (e) => {
  if (e.key === "Enter") buscarPlanta(inputBusca.value.trim());
});
