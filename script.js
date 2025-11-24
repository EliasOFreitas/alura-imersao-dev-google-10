let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("header input");
let dados = [];

// Adiciona o evento para detectar a tecla "Enter" no input
campoBusca.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        iniciarBusca();
    }
});

function recarregarPagina() {
    // Recarrega a página a partir do servidor, limpando qualquer alteração
    location.reload(true);
}

async function iniciarBusca() {
    // Tratamento de espaços em branco (trim remove espaços do começo e fim)
    const termoBusca = campoBusca.value.toLowerCase().trim();

    // Validação: Se estiver vazio, limpa a tela e exibe uma mensagem
    if (termoBusca === "") {
        cardContainer.innerHTML = `
            <div class="mensagem-aviso">
                <p>Campo vazio, por favor tente novamente.</p>
            </div>
        `;
        return; // Interrompe a função AQUI. Não faz fetch, não filtra.
    }

    // Carregamento dos dados (só acontece se passou da validação acima)
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            return; //Interrompe a execução se houver erro
        }
    }

    const dadosFiltrados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) || 
        dado.descricao.toLowerCase().includes(termoBusca)
    );

    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    // LIMPA O CONTEÚDO ANTERIOR
    cardContainer.innerHTML = "";

    // Verifica se a lista está vazia
    if (dados.length === 0) {
        // Adiciona uma classe para estilizar essa mensagem no CSS
        cardContainer.innerHTML = `
            <div class="mensagem-aviso">
                <p>Nenhum resultado encontrado para a sua busca.</p>
            </div>
        `;
        return;
    }

    // Se houver dados, gera os cards normalmente
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = 
        `
        <h2>${dado.nome}</h2>
        <p>${dado.tipo}</p>
        <p>${dado.sistemas_compativeis}</p>
        <p>${dado.descricao}</p>
        <a href="${dado.link}" target="_blank">Saiba Mais</a>
        `
        cardContainer.appendChild(article);
    }
}