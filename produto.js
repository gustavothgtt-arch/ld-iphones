const detalheProduto = document.getElementById("detalheProduto");
const breadcrumbProduto = document.getElementById("breadcrumbProduto");

const parametros = new URLSearchParams(window.location.search);
const produtoId = Number(parametros.get("id"));

let produtoSelecionado = null;
let fotoAtual = 0;

function formatarMoedaProduto(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function obterFotos(produto) {
    if (Array.isArray(produto.fotos) && produto.fotos.length > 0) {
        return produto.fotos;
    }

    return [];
}

function formatarEstadoSeminovo(valor) {
    const textos = {
        impecavel: "Impecável",
        excelente: "Excelente",
        bom: "Bom",
        marcas_de_uso: "Com marcas de uso",
        original: "Original",
        todas_originais: "Todas originais",
        substituida: "Substituída",
        funcionando: "Funcionando",
        nao_funcionando: "Não funcionando",
        nao_possui: "Não possui"
    };
    return textos[valor] || valor || "—";
}

function renderizarProduto() {
    if (!produtoSelecionado) {
        detalheProduto.innerHTML = `
            <div class="produto-nao-encontrado">
                <span>📱</span>
                <h1>Produto não encontrado</h1>
                <p>Este aparelho não está disponível ou o endereço é inválido.</p>
                <a href="index.html#produtos">Voltar para a loja</a>
            </div>
        `;
        return;
    }

    document.title = `${produtoSelecionado.nome} | LD iPhones`;

    if (breadcrumbProduto) {
        breadcrumbProduto.textContent = produtoSelecionado.nome;
    }

    const fotos = obterFotos(produtoSelecionado);
    const temFotos = fotos.length > 0;
const condicaoTexto =
        produtoSelecionado.condicao === "lacrado" ? "Lacrado" : "Seminovo";

    const imagemPrincipal = temFotos
        ? `
            <img
                id="imagemProdutoPrincipal"
                src="${fotos[fotoAtual]}"
                alt="${produtoSelecionado.nome}"
            >
        `
        : `
            <div class="produto-sem-foto-grande">
                <span>📱</span>
                <strong>Foto em breve</strong>
                <small>
                    ${
                        produtoSelecionado.condicao === "lacrado"
                            ? "A imagem ilustrativa será adicionada em breve."
                            : "As fotos reais deste aparelho serão adicionadas em breve."
                    }
                </small>
            </div>
        `;

    const controlesGaleria =
        temFotos && fotos.length > 1
            ? `
                <button
                    class="galeria-seta galeria-anterior"
                    id="fotoAnterior"
                    type="button"
                    aria-label="Foto anterior"
                >
                    ‹
                </button>

                <button
                    class="galeria-seta galeria-proxima"
                    id="fotoProxima"
                    type="button"
                    aria-label="Próxima foto"
                >
                    ›
                </button>

                <div class="galeria-pontos">
                    ${fotos.map((_, indice) => `
                        <button
                            type="button"
                            class="galeria-ponto ${indice === fotoAtual ? "ativo" : ""}"
                            data-foto="${indice}"
                            aria-label="Ver foto ${indice + 1}"
                        ></button>
                    `).join("")}
                </div>
            `
            : temFotos
                ? `
                    <div class="galeria-pontos">
                        <span class="galeria-ponto ativo"></span>
                    </div>
                `
                : "";

    const avisoImagem =
        produtoSelecionado.condicao === "lacrado"
            ? "Imagem ilustrativa. Pode haver variação de cor conforme o lote."
            : "As fotos exibidas correspondem ao aparelho seminovo anunciado.";

    detalheProduto.innerHTML = `

        <div class="produto-topo-layout">

            <div class="produto-galeria-area">

                <div class="produto-galeria">

                    <span class="selo-condicao produto-selo ${produtoSelecionado.condicao}">
                        ${condicaoTexto.toUpperCase()}
                    </span>

                    ${imagemPrincipal}
                    ${controlesGaleria}

                </div>

                <div class="aviso-imagem">
                    ${avisoImagem}
                </div>

            </div>

            <div class="produto-detalhe-info">

                <span class="produto-status">● DISPONÍVEL</span>

                <h1>${produtoSelecionado.nome}</h1>

                <span class="produto-detalhe-codigo">
                    ${produtoSelecionado.codigo}
                </span>

                <p class="produto-descricao">
                    ${produtoSelecionado.armazenamento} •
                    ${produtoSelecionado.cor} •
                    ${condicaoTexto}
                </p>

                <div class="produto-preco-detalhe">
                    <span>À vista</span>

                    <strong>
                        ${formatarMoedaProduto(produtoSelecionado.preco)}
                    </strong>
                    <p class="produto-consulta-parcelamento">Parcelamento? Consulte as condições pelo WhatsApp.</p>

                    <div class="produto-brindes-destaque">
                        <span class="produto-brindes-icone">🎁</span>

                        <div class="produto-brindes-texto">
                            <span>BRINDES INCLUSOS</span>
                            <strong>${
                                produtoSelecionado.condicao === "lacrado"
                                    ? "Capa + Película"
                                    : "Capa + Película + Carregador"
                            }</strong>
                            <small>Grátis na compra deste aparelho</small>
                        </div>
                    </div>
                </div>

                <button
                    class="btn-adicionar-carrinho"
                    type="button"
                    id="adicionarCarrinho"
                >
                    🛒 Adicionar ao carrinho
                </button>

                <div class="produto-beneficios-detalhe">

                    <div>
                        <span>✓</span>
                        <p>
                            <strong>Garantia</strong>
                            <small>Segurança na sua compra</small>
                        </p>
                    </div>

                    <div>
                        <span>🚚</span>
                        <p>
                            <strong>Entrega no RJ</strong>
                            <small>Consulte disponibilidade</small>
                        </p>
                    </div>

                    <div>
                        <span>💳</span>
                        <p>
                            <strong>Parcelamento</strong>
                            <small>Simulação pelo WhatsApp</small>
                        </p>
                    </div>

                    <div>
                        <span>🔒</span>
                        <p>
                            <strong>Compra segura</strong>
                            <small>Atendimento especializado</small>
                        </p>
                    </div>

                </div>

            </div>

        </div>

        ${produtoSelecionado.condicao === "seminovo" && produtoSelecionado.dadosSeminovo ? `
        <div class="produto-informacoes-inferiores">

            <section class="produto-especificacoes">
                <h2>Especificações técnicas</h2>

                ${produtoSelecionado.dadosSeminovo.saude_bateria ? `
                    <div class="especificacao">
                        <span>Saúde da bateria</span>
                        <strong>${produtoSelecionado.dadosSeminovo.saude_bateria}%</strong>
                    </div>
                ` : ""}

                ${produtoSelecionado.dadosSeminovo.estado_estetico ? `
                    <div class="especificacao">
                        <span>Estado estético</span>
                        <strong>${formatarEstadoSeminovo(produtoSelecionado.dadosSeminovo.estado_estetico)}</strong>
                    </div>
                ` : ""}

                ${produtoSelecionado.dadosSeminovo.tela ? `
                    <div class="especificacao">
                        <span>Tela</span>
                        <strong>${formatarEstadoSeminovo(produtoSelecionado.dadosSeminovo.tela)}</strong>
                    </div>
                ` : ""}

                ${produtoSelecionado.dadosSeminovo.pecas ? `
                    <div class="especificacao">
                        <span>Peças</span>
                        <strong>${formatarEstadoSeminovo(produtoSelecionado.dadosSeminovo.pecas)}</strong>
                    </div>
                ` : ""}

                ${produtoSelecionado.dadosSeminovo.face_id ? `
                    <div class="especificacao">
                        <span>Face ID</span>
                        <strong>${formatarEstadoSeminovo(produtoSelecionado.dadosSeminovo.face_id)}</strong>
                    </div>
                ` : ""}

                ${produtoSelecionado.dadosSeminovo.cameras ? `
                    <div class="especificacao">
                        <span>Câmeras</span>
                        <strong>${formatarEstadoSeminovo(produtoSelecionado.dadosSeminovo.cameras)}</strong>
                    </div>
                ` : ""}

                ${produtoSelecionado.dadosSeminovo.acompanha_caixa !== undefined && produtoSelecionado.dadosSeminovo.acompanha_caixa !== null ? `
                    <div class="especificacao">
                        <span>Acompanha caixa</span>
                        <strong>${produtoSelecionado.dadosSeminovo.acompanha_caixa === true || produtoSelecionado.dadosSeminovo.acompanha_caixa === "sim" ? "Sim" : "Não"}</strong>
                    </div>
                ` : ""}

                ${produtoSelecionado.dadosSeminovo.observacoes ? `
                    <div class="especificacao">
                        <span>Observações</span>
                        <strong>${produtoSelecionado.dadosSeminovo.observacoes}</strong>
                    </div>
                ` : ""}

            </section>

        </div>
        ` : ""}

        <div class="produto-acoes-finais">

            <a href="index.html#produtos" class="btn-voltar-loja">
                ← Voltar para a loja
            </a>

            <button
                type="button"
                class="btn-compartilhar"
                id="compartilharProduto"
            >
                ↗ Compartilhar
            </button>

        </div>
    `;

    configurarGaleria();
    configurarBotaoCarrinho();
    configurarCompartilhamento();
}

function configurarGaleria() {
    if (!produtoSelecionado) {
        return;
    }

    const fotos = obterFotos(produtoSelecionado);

    if (fotos.length <= 1) {
        return;
    }

    const botaoAnterior = document.getElementById("fotoAnterior");
    const botaoProxima = document.getElementById("fotoProxima");
    const pontos = document.querySelectorAll(".galeria-ponto[data-foto]");

    botaoAnterior.addEventListener("click", () => {
        fotoAtual = fotoAtual === 0 ? fotos.length - 1 : fotoAtual - 1;
        atualizarFoto();
    });

    botaoProxima.addEventListener("click", () => {
        fotoAtual = fotoAtual === fotos.length - 1 ? 0 : fotoAtual + 1;
        atualizarFoto();
    });

    pontos.forEach((ponto) => {
        ponto.addEventListener("click", () => {
            fotoAtual = Number(ponto.dataset.foto);
            atualizarFoto();
        });
    });
}

function atualizarFoto() {
    const fotos = obterFotos(produtoSelecionado);
    const imagem = document.getElementById("imagemProdutoPrincipal");
    const pontos = document.querySelectorAll(".galeria-ponto[data-foto]");

    if (!imagem || fotos.length === 0) {
        return;
    }

    imagem.src = fotos[fotoAtual];

    pontos.forEach((ponto, indice) => {
        ponto.classList.toggle("ativo", indice === fotoAtual);
    });
}

function configurarBotaoCarrinho() {
    const botao = document.getElementById("adicionarCarrinho");

    if (!botao || !produtoSelecionado) {
        return;
    }

    botao.addEventListener("click", () => {
        const adicionado = adicionarProdutoAoCarrinho(produtoSelecionado.id);

        if (!adicionado) {
            return;
        }

        botao.textContent = "✓ Adicionado ao carrinho";
        botao.classList.add("adicionado");

        abrirCarrinho();

        setTimeout(() => {
            botao.textContent = "🛒 Adicionar ao carrinho";
            botao.classList.remove("adicionado");
        }, 1800);
    });
}

function configurarCompartilhamento() {
    const botao = document.getElementById("compartilharProduto");

    if (!botao || !produtoSelecionado) {
        return;
    }

    botao.addEventListener("click", async () => {
        const dadosCompartilhamento = {
            title: produtoSelecionado.nome,
            text: `${produtoSelecionado.nome} - ${formatarMoedaProduto(produtoSelecionado.preco)} | LD iPhones`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(dadosCompartilhamento);
            } catch (erro) {
                // O usuário pode simplesmente cancelar o compartilhamento.
            }

            return;
        }

        try {
            await navigator.clipboard.writeText(window.location.href);

            const textoOriginal = botao.textContent;
            botao.textContent = "✓ Link copiado";

            setTimeout(() => {
                botao.textContent = textoOriginal;
            }, 1600);
        } catch (erro) {
            alert("Copie o endereço desta página para compartilhar o produto.");
        }
    });
}

async function iniciarPaginaProduto() {
    detalheProduto.innerHTML = `
        <div class="produto-nao-encontrado">
            <span>📱</span>
            <h1>Carregando produto...</h1>
            <p>Aguarde um instante.</p>
        </div>
    `;

    if (!Number.isFinite(produtoId) || produtoId <= 0) {
        renderizarProduto();
        return;
    }

    try {
        produtoSelecionado = await buscarProdutoSupabase(produtoId);

        if (produtoSelecionado && produtoSelecionado.disponivel === false) {
            produtoSelecionado = null;
        }

        renderizarProduto();
    } catch (erro) {
        console.error("Erro ao carregar produto:", erro);
        produtoSelecionado = null;
        renderizarProduto();
    }
}

iniciarPaginaProduto();
