/* ==========================================================
   CARRINHO LD IPHONES
   Salvo no navegador com localStorage.
========================================================== */

const CHAVE_CARRINHO = "ldiphones_carrinho";

function lerCarrinho() {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
        return Array.isArray(salvo) ? salvo : [];
    } catch (erro) {
        return [];
    }
}

function salvarCarrinho(carrinho) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
    atualizarInterfaceCarrinho();
}

function quantidadeTotalCarrinho() {
    return lerCarrinho().reduce(
        (total, item) => total + Math.max(0, Number(item.quantidade) || 0),
        0
    );
}

function estoqueDisponivelCarrinho(produto) {
    if (!produto) return 0;

    if (Number.isFinite(Number(produto.estoqueDisponivel))) {
        return Math.max(0, Number(produto.estoqueDisponivel));
    }

    if (Number.isFinite(Number(produto.estoque_disponivel))) {
        return Math.max(0, Number(produto.estoque_disponivel));
    }

    if (Number.isFinite(Number(produto.estoque))) {
        const reservado = Math.max(0, Number(produto.estoqueReservado ?? produto.estoque_reservado ?? 0));
        return Math.max(0, Number(produto.estoque) - reservado);
    }

    // Compatibilidade enquanto algum produto ainda não tiver os campos de estoque carregados.
    return Infinity;
}

function adicionarProdutoAoCarrinho(produtoId) {
    const produto = produtos.find((item) => Number(item.id) === Number(produtoId));

    if (!produto || !produto.disponivel) {
        return false;
    }

    const carrinho = lerCarrinho();
    const existente = carrinho.find((item) => Number(item.id) === Number(produto.id));
    const quantidadeAtual = existente ? Math.max(0, Number(existente.quantidade) || 0) : 0;
    const disponivel = estoqueDisponivelCarrinho(produto);

    if (quantidadeAtual + 1 > disponivel) {
        alert("Não há mais unidades disponíveis deste produto.");
        return false;
    }

    if (existente) {
        existente.quantidade = quantidadeAtual + 1;
    } else {
        carrinho.push({
            id: Number(produto.id),
            quantidade: 1
        });
    }

    salvarCarrinho(carrinho);
    return true;
}

function alterarQuantidadeCarrinho(produtoId, alteracao) {
    const carrinho = lerCarrinho();
    const item = carrinho.find((produto) => Number(produto.id) === Number(produtoId));

    if (!item) return;

    if (alteracao > 0) {
        const produto = produtos.find((produto) => Number(produto.id) === Number(produtoId));
        const disponivel = estoqueDisponivelCarrinho(produto);
        const quantidadeAtual = Math.max(0, Number(item.quantidade) || 0);

        if (quantidadeAtual + alteracao > disponivel) {
            alert("Não há mais unidades disponíveis deste produto.");
            return;
        }
    }

    item.quantidade = Math.max(0, Number(item.quantidade) || 0) + Number(alteracao);

    const atualizado = carrinho.filter((produto) => produto.quantidade > 0);
    salvarCarrinho(atualizado);
}

function removerProdutoCarrinho(produtoId) {
    const atualizado = lerCarrinho().filter(
        (item) => Number(item.id) !== Number(produtoId)
    );

    salvarCarrinho(atualizado);
}

function formatarMoedaCarrinho(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function atualizarContadoresCarrinho() {
    const quantidade = quantidadeTotalCarrinho();

    document.querySelectorAll("#quantidadeCarrinho").forEach((contador) => {
        contador.textContent = quantidade;
    });
}

function criarItemCarrinho(item) {
    const produto = produtos.find((produto) => Number(produto.id) === Number(item.id));

    if (!produto) return "";

    const foto =
        Array.isArray(produto.fotos) && produto.fotos.length > 0
            ? produto.fotos[0]
            : "";

    const imagem = foto
        ? `<img src="${foto}" alt="${produto.nome}">`
        : `<div class="carrinho-item-sem-foto">📱</div>`;

    return `
        <article class="carrinho-item">
            <a href="produto.html?id=${produto.id}" class="carrinho-item-imagem">
                ${imagem}
            </a>

            <div class="carrinho-item-info">
                <div class="carrinho-item-topo">
                    <div>
                        <span>${produto.codigo}</span>
                        <h3>${produto.nome}</h3>
                        <p>${produto.armazenamento || ""} • ${produto.cor || ""}</p>
                    </div>

                    <button
                        type="button"
                        class="carrinho-remover"
                        data-remover-carrinho="${produto.id}"
                        aria-label="Remover ${produto.nome}"
                    >
                        ×
                    </button>
                </div>

                <div class="carrinho-item-rodape">
                    <div class="carrinho-quantidade">
                        <button type="button" data-diminuir-carrinho="${produto.id}">−</button>
                        <strong>${item.quantidade}</strong>
                        <button type="button" data-aumentar-carrinho="${produto.id}">+</button>
                    </div>

                    <strong class="carrinho-item-preco">
                        ${formatarMoedaCarrinho(produto.preco * item.quantidade)}
                    </strong>
                </div>
            </div>
        </article>
    `;
}

function renderizarCarrinho() {
    const lista = document.getElementById("carrinhoLista");
    const resumo = document.getElementById("carrinhoResumo");
    const subtotalElemento = document.getElementById("carrinhoSubtotal");

    if (!lista || !resumo || !subtotalElemento) {
        atualizarContadoresCarrinho();
        return;
    }

    const carrinho = lerCarrinho();

    const itensValidos = carrinho.filter((item) =>
        produtos.some((produto) => Number(produto.id) === Number(item.id))
    );

    if (itensValidos.length === 0) {
        lista.innerHTML = `
            <div class="carrinho-vazio">
                <span>🛒</span>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione um iPhone para continuar sua compra.</p>
                <a href="index.html#produtos">Ver produtos</a>
            </div>
        `;

        resumo.classList.add("vazio");
        subtotalElemento.textContent = "R$ 0,00";
        atualizarContadoresCarrinho();
        return;
    }

    resumo.classList.remove("vazio");

    lista.innerHTML = itensValidos
        .map(criarItemCarrinho)
        .join("");

    const subtotal = itensValidos.reduce((total, item) => {
        const produto = produtos.find((produto) => Number(produto.id) === Number(item.id));
        return total + (produto ? produto.preco * item.quantidade : 0);
    }, 0);

    subtotalElemento.textContent = formatarMoedaCarrinho(subtotal);

    configurarAcoesItensCarrinho();
    atualizarContadoresCarrinho();
}

function configurarAcoesItensCarrinho() {
    document.querySelectorAll("[data-aumentar-carrinho]").forEach((botao) => {
        botao.addEventListener("click", () => {
            alterarQuantidadeCarrinho(
                Number(botao.dataset.aumentarCarrinho),
                1
            );
        });
    });

    document.querySelectorAll("[data-diminuir-carrinho]").forEach((botao) => {
        botao.addEventListener("click", () => {
            alterarQuantidadeCarrinho(
                Number(botao.dataset.diminuirCarrinho),
                -1
            );
        });
    });

    document.querySelectorAll("[data-remover-carrinho]").forEach((botao) => {
        botao.addEventListener("click", () => {
            removerProdutoCarrinho(
                Number(botao.dataset.removerCarrinho)
            );
        });
    });
}

function abrirCarrinho() {
    const painel = document.getElementById("carrinhoPainel");
    const overlay = document.getElementById("carrinhoOverlay");

    if (!painel || !overlay) return;

    renderizarCarrinho();

    painel.classList.add("aberto");
    overlay.classList.add("aberto");
    painel.setAttribute("aria-hidden", "false");
    document.body.classList.add("carrinho-aberto");
}

function fecharCarrinho() {
    const painel = document.getElementById("carrinhoPainel");
    const overlay = document.getElementById("carrinhoOverlay");

    if (!painel || !overlay) return;

    painel.classList.remove("aberto");
    overlay.classList.remove("aberto");
    painel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("carrinho-aberto");
}

function atualizarInterfaceCarrinho() {
    atualizarContadoresCarrinho();
    renderizarCarrinho();
}

function configurarCarrinhoGlobal() {
    document.querySelectorAll("[data-abrir-carrinho]").forEach((botao) => {
        botao.addEventListener("click", abrirCarrinho);
    });

    const fechar = document.getElementById("fecharCarrinho");
    const overlay = document.getElementById("carrinhoOverlay");
    const continuar = document.getElementById("continuarComprando");
    const finalizar = document.getElementById("finalizarCarrinho");

    if (fechar) fechar.addEventListener("click", fecharCarrinho);
    if (overlay) overlay.addEventListener("click", fecharCarrinho);
    if (continuar) continuar.addEventListener("click", fecharCarrinho);

    if (finalizar) {
        finalizar.addEventListener("click", () => {
            if (lerCarrinho().length === 0) return;
            window.location.href = "checkout.html";
        });
    }

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            fecharCarrinho();
        }
    });

    atualizarInterfaceCarrinho();
}

document.addEventListener("DOMContentLoaded", configurarCarrinhoGlobal);
