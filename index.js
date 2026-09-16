const listaProdutos = document.getElementById("listaProdutos");
const campoBusca = document.getElementById("campoBusca");
const ordenacao = document.getElementById("ordenacao");
const botoesFiltro = document.querySelectorAll(".filtro");
const resultadoBusca = document.getElementById("resultadoBusca");
const heroDestaque = document.getElementById("heroDestaque");

let filtroAtual = "todos";

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

const tiposDestaque = {
    lancamento: "LANÇAMENTO",
    destaque: "DESTAQUE",
    promocao: "PROMOÇÃO"
};

function obterTipoDestaque(produto) {
    const tipo = String(produto.tipoDestaque || "destaque").toLowerCase();

    if (tiposDestaque[tipo]) {
        return { classe: tipo, texto: tiposDestaque[tipo] };
    }

    return { classe: "destaque", texto: "DESTAQUE" };
}

function atualizarDestaque() {
    if (!heroDestaque) return;

    const produtoDestaque = produtos.find(
        (produto) => produto.disponivel && produto.destaque === true
    );

    if (!produtoDestaque) {
        heroDestaque.innerHTML = `
            <div class="destaque-sem-produto">
                <span class="destaque-etiqueta destaque">LD IPHONES</span>
                <img src="imagens/logo-ld.png" alt="LD iPhones" class="destaque-logo-padrao">
                <strong>Novidades em breve</strong>
                <small>Acompanhe os próximos lançamentos da LD iPhones.</small>
            </div>
        `;
        return;
    }

    const tipo = obterTipoDestaque(produtoDestaque);
    const primeiraFoto = Array.isArray(produtoDestaque.fotos) ? produtoDestaque.fotos[0] : "";

    const imagem = primeiraFoto
        ? `<img src="${primeiraFoto}" alt="${produtoDestaque.nome}" class="destaque-produto-imagem">`
        : `<div class="destaque-sem-foto"><span>📱</span><small>Foto do produto em breve</small></div>`;

    heroDestaque.innerHTML = `
        <article class="destaque-card">
            <div class="destaque-visual">${imagem}</div>
            <div class="destaque-conteudo">
                <span class="destaque-etiqueta ${tipo.classe}">${tipo.texto}</span>
                <h2>${produtoDestaque.nome}</h2>
                <p class="destaque-detalhes">
                    ${produtoDestaque.armazenamento || ""}${produtoDestaque.cor ? " • " + produtoDestaque.cor : ""}
                </p>
                <div class="destaque-preco">
                    <span>À vista</span>
                    <strong>${formatarMoeda(produtoDestaque.preco)}</strong>
                </div>
                <a href="produto.html?id=${produtoDestaque.id}" class="btn-destaque">Ver produto</a>
            </div>
        </article>
    `;
}

function criarCardProduto(produto) {
    const primeiraFoto = Array.isArray(produto.fotos) ? produto.fotos[0] : "";

    const imagemProduto = primeiraFoto
        ? `<img src="${primeiraFoto}" alt="${produto.nome}">`
        : `<div class="sem-foto"><span>📱</span><small>Foto em breve</small></div>`;

    return `
        <article class="card-produto">
            <div class="produto-imagem">
                <span class="selo-condicao ${produto.condicao}">
                    ${produto.condicao === "lacrado" ? "LACRADO" : "SEMINOVO"}
                </span>
                ${imagemProduto}
            </div>
            <div class="produto-info">
                <span class="produto-codigo">${produto.codigo}</span>
                <h3>${produto.nome}</h3>
                <p class="produto-detalhes">
                    ${produto.armazenamento || ""}${produto.cor ? " • " + produto.cor : ""}
                </p>
                <div class="produto-preco">
                    <span>À vista</span>
                    <strong>${formatarMoeda(produto.preco)}</strong>
                    <p class="produto-consulta-parcelamento">Parcelamento? Consulte pelo WhatsApp</p>
                </div>
                <a class="btn-detalhes" href="produto.html?id=${produto.id}">Ver detalhes</a>
            </div>
        </article>
    `;
}

function atualizarProdutos() {
    const termo = campoBusca.value.trim().toLowerCase();

    let produtosFiltrados = produtos.filter((produto) => {
        if (!produto.disponivel) return false;

        const correspondeFiltro =
            filtroAtual === "todos" ||
            produto.condicao === filtroAtual ||
            (filtroAtual === "acessorios" && produto.categoria === "acessorio");

        const textoProduto = `
            ${produto.nome || ""}
            ${produto.codigo || ""}
            ${produto.armazenamento || ""}
            ${produto.cor || ""}
            ${produto.condicao || ""}
        `.toLowerCase();

        return correspondeFiltro && textoProduto.includes(termo);
    });

    if (ordenacao.value === "menor") produtosFiltrados.sort((a, b) => a.preco - b.preco);
    if (ordenacao.value === "maior") produtosFiltrados.sort((a, b) => b.preco - a.preco);

    resultadoBusca.textContent = `${produtosFiltrados.length} ${
        produtosFiltrados.length === 1 ? "produto encontrado" : "produtos encontrados"
    }`;

    if (!produtosFiltrados.length) {
        listaProdutos.innerHTML = `
            <div class="nenhum-produto">
                <span>📱</span>
                <h3>Nenhum produto encontrado</h3>
                <p>Novos aparelhos serão adicionados em breve.</p>
            </div>
        `;
        return;
    }

    listaProdutos.innerHTML = produtosFiltrados.map(criarCardProduto).join("");
}

botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
        botoesFiltro.forEach((item) => item.classList.remove("ativo"));
        botao.classList.add("ativo");
        filtroAtual = botao.dataset.filtro;
        atualizarProdutos();
    });
});

campoBusca.addEventListener("input", atualizarProdutos);
ordenacao.addEventListener("change", atualizarProdutos);

async function iniciarLoja() {
    resultadoBusca.textContent = "Carregando produtos...";
    listaProdutos.innerHTML = "";

    try {
        await carregarProdutosSupabase();
        atualizarDestaque();
        atualizarProdutos();
    } catch (erro) {
        console.error("Erro ao carregar a loja:", erro);
        resultadoBusca.textContent = "Não foi possível carregar os produtos.";
        listaProdutos.innerHTML = `
            <div class="nenhum-produto">
                <span>⚠️</span>
                <h3>Não foi possível carregar a loja</h3>
                <p>Atualize a página e tente novamente.</p>
            </div>
        `;
    }
}

iniciarLoja();
