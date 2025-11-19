// botanica.js
// Enciclopédia Botânica usando OpenPlantbook + Unsplash

// =======================
// CONFIGURAÇÕES
// =======================

// 👉 Troque pelo TOKEN gerado na OpenPlantbook.
// Ex.: "895be8f62d85de538f9cafb0c1607f2e5b8b1168"
// (ideal é usar variável de ambiente e NÃO deixar no front em produção)
const PLANTBOOK_API_KEY = "895be8f62d85de538f9cafb0c1607f2e5b8b1168";

// Unsplash (ok para ficar no front em projeto interno)
const UNSPLASH_API_KEY = "cyQiVStXEV5LEBQ4rLmZn29t0iBNSSMXqVgDTec--oo";

// Chave para salvar a última busca no localStorage
const ULTIMA_BUSCA_KEY = "ultimaBusca";


// =======================
// ELEMENTOS DA PÁGINA
// =======================

const inputBusca = document.getElementById("inputBusca");
const resultadosDiv = document.getElementById("resultados");
const botaoBusca = document.getElementById("botaoBusca");


// =======================
// HELPERS DE UI
// =======================

function setLoading(loading) {
  if (!botaoBusca) return;

  if (loading) {
    botaoBusca.classList.add("is-loading");
    botaoBusca.setAttribute("disabled", "disabled");
  } else {
    botaoBusca.classList.remove("is-loading");
    botaoBusca.removeAttribute("disabled");
  }
}


// =======================
// CARREGAR ÚLTIMA BUSCA
// =======================

window.addEventListener("load", () => {
  try {
    const ultimaBusca = localStorage.getItem(ULTIMA_BUSCA_KEY);
    if (ultimaBusca && inputBusca) {
      inputBusca.value = ultimaBusca;
      buscarPlanta(ultimaBusca);
    }
  } catch (e) {
    console.warn("Não foi possível ler a última busca:", e);
  }
});


// =======================
// BUSCA RÁPIDA (chips)
// =======================

document.querySelectorAll(".planta-rapida").forEach((botao) => {
  botao.addEventListener("click", () => {
    const planta = botao.dataset.planta;
    if (!planta || !inputBusca) return;

    inputBusca.value = planta;
    buscarPlanta(planta);
  });
});


// =======================
// FUNÇÃO PRINCIPAL
// =======================

async function buscarPlanta(nome) {
  nome = nome?.trim();
  if (!nome || !resultadosDiv) return;

  resultadosDiv.innerHTML =
    '<div class="carregando"><i class="bi bi-arrow-repeat"></i> Carregando dados da planta...</div>';

  setLoading(true);

  try {
    // Salvar última busca
    try {
      localStorage.setItem(ULTIMA_BUSCA_KEY, nome);
    } catch (e) {
      console.warn("Não foi possível salvar a última busca:", e);
    }

    // =======================
    // 1) BUSCAR NA OPENPLANTBOOK (SEARCH)
    // =======================
    const searchUrl = `https://open.plantbook.io/api/v1/plant/search?alias=${encodeURIComponent(
      nome
    )}&limit=5`;

    const searchResults = await fetch(searchUrl, {
      headers: {
        Authorization: `Token ${PLANTBOOK_API_KEY}`,
      },
    }).then((r) => {
      if (!r.ok) {
        console.error("Erro HTTP search:", r.status, r.statusText);
        throw new Error("Erro ao buscar planta na OpenPlantbook");
      }
      return r.json();
    });

    // 👉 AQUI É O PULO DO GATO: a resposta vem com .results
    const lista = Array.isArray(searchResults?.results)
      ? searchResults.results
      : [];

    console.log("Resultado search OpenPlantbook:", searchResults);

    if (!lista.length) {
      throw new Error("Planta não encontrada");
    }

    // Pega o primeiro resultado (depois dá pra montar lista se quiser)
    const plantaSearch = lista[0];
    const pid = plantaSearch.pid || plantaSearch.display_pid;

    if (!pid) {
      throw new Error("Não foi possível identificar a planta");
    }

    // =======================
    // 2) DETALHE DA PLANTA
    // =======================
    const detailUrl = `https://open.plantbook.io/api/v1/plant/detail/${encodeURIComponent(
      pid
    )}?lang=en`;

    const planta = await fetch(detailUrl, {
      headers: {
        Authorization: `Token ${PLANTBOOK_API_KEY}`,
      },
    }).then((r) => {
      if (!r.ok) {
        console.error("Erro HTTP detail:", r.status, r.statusText);
        throw new Error("Erro ao buscar detalhes da planta");
      }
      return r.json();
    });

    console.log("Detalhes da planta:", planta);

    // =======================
    // 3) BUSCAR IMAGEM NO UNSPLASH (OPCIONAL)
    // =======================
    let imagens = { results: [] };
    try {
      imagens = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          nome
        )}&orientation=portrait&client_id=${UNSPLASH_API_KEY}`
      ).then((r) => r.json());
    } catch (e) {
      console.warn("Erro ao buscar imagem no Unsplash:", e);
    }

    const imagemUrl =
      imagens?.results?.[0]?.urls?.regular || planta.image_url || "";

    // =======================
    // 4) MONTAR RECOMENDAÇÕES
    // =======================
    const recomendacoes = [];

    if (planta.min_temp != null && planta.max_temp != null) {
      recomendacoes.push({
        termo: "Temperatura",
        valor: `${planta.min_temp}°C a ${planta.max_temp}°C`,
      });
    }

    if (planta.min_light_lux != null && planta.max_light_lux != null) {
      recomendacoes.push({
        termo: "Luz Solar",
        valor: `${planta.min_light_lux} a ${planta.max_light_lux} lux`,
      });
    }

    if (planta.min_env_humid != null && planta.max_env_humid != null) {
      recomendacoes.push({
        termo: "Umidade do ambiente",
        valor: `${planta.min_env_humid}% a ${planta.max_env_humid}%`,
      });
    }

    if (planta.min_soil_moist != null && planta.max_soil_moist != null) {
      recomendacoes.push({
        termo: "Umidade do solo",
        valor: `${planta.min_soil_moist}% a ${planta.max_soil_moist}%`,
      });
    }

    if (planta.min_soil_ec != null && planta.max_soil_ec != null) {
      recomendacoes.push({
        termo: "Condutividade do solo",
        valor: `${planta.min_soil_ec} a ${planta.max_soil_ec} μS/cm`,
      });
    }

    const metaTags = [];
    if (planta.category) metaTags.push(`Categoria: ${planta.category}`);
    if (planta.display_pid) metaTags.push(`Espécie: ${planta.display_pid}`);
    if (planta.pid) metaTags.push(`PID: ${planta.pid}`);

    // =======================
    // 5) RENDERIZAR RESULTADO
    // =======================
    resultadosDiv.innerHTML = `
      <div class="planta-card">
        <div class="planta-imagem-wrapper">
          ${
            imagemUrl
              ? `<img src="${imagemUrl}" class="planta-imagem" alt="${nome}">`
              : `<div class="planta-imagem planta-imagem--placeholder"></div>`
          }
          <span class="planta-imagem-badge">Imagem ilustrativa</span>
        </div>

        <div class="planta-detalhes">
          <div>
            <h2 class="planta-titulo">${
              planta.alias || planta.display_pid || nome
            }</h2>
            <p class="nome-cientifico">
              <i class="bi bi-flower2"></i>
              Nome científico: ${planta.display_pid || "Não disponível"}
            </p>
          </div>

          ${
            metaTags.length
              ? `
            <div class="meta-tags">
              ${metaTags
                .map((t) => `<span class="meta-tag">${t}</span>`)
                .join("")}
            </div>
          `
              : ""
          }

          ${
            recomendacoes.length
              ? `
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
          `
              : "<p style='font-size:.85rem;color:#aaa;'>Sem recomendações detalhadas para esta espécie.</p>"
          }
        </div>
      </div>
    `;
  } catch (erro) {
    console.error("Erro geral na busca:", erro);
    resultadosDiv.innerHTML = `
      <div class="erro">
        <i class="bi bi-x-circle"></i>
        ${erro.message || "Erro ao buscar planta"}. Verifique se digitou o nome em inglês!
      </div>
    `;
  } finally {
    setLoading(false);
  }
}



// =======================
// ÍCONES POR TIPO DE INFO
// =======================

function getIcon(termo) {
  const icons = {
    Rega: "bi-droplet",
    "Luz Solar": "bi-sun",
    "Umidade do ambiente": "bi-cloud-drizzle",
    "Umidade do solo": "bi-moisture",
    Temperatura: "bi-thermometer-sun",
    "Condutividade do solo": "bi-lightning-charge",
  };
  return icons[termo] || "bi-info-circle";
}


// =======================
// EVENTOS DE BUSCA
// =======================

if (botaoBusca) {
  botaoBusca.addEventListener("click", () => {
    if (!inputBusca) return;
    buscarPlanta(inputBusca.value);
  });
}

if (inputBusca) {
  inputBusca.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      buscarPlanta(inputBusca.value);
    }
  });
}
