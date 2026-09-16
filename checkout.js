const checkoutResumoItens = document.getElementById("checkoutResumoItens");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
const formCheckout = document.getElementById("formCheckout");
const checkoutEndereco = document.getElementById("checkoutEndereco");
const avisoCartao = document.getElementById("avisoCartao");
const checkoutConfirmacao = document.getElementById("checkoutConfirmacao");
const numeroPedido = document.getElementById("numeroPedido");

const SUPABASE_URL = "https://dhzeqztrgxtlhhrjkvcn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_FqxwVSf7JXSR--WiC39I8A_nQJrO9Ek";

function moedaCheckout(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function obterProdutoCheckout(id) {
    return produtos.find((produto) => produto.id === Number(id));
}

function obterCarrinhoValido() {
    return lerCarrinho()
        .map((item) => {
            const produto = obterProdutoCheckout(item.id);

            if (!produto || !produto.disponivel) {
                return null;
            }

            return {
                produto,
                quantidade: Math.max(1, Number(item.quantidade) || 1)
            };
        })
        .filter(Boolean);
}

function calcularTotalCheckout() {
    return obterCarrinhoValido().reduce((total, item) => {
        return total + (item.produto.preco * item.quantidade);
    }, 0);
}

function renderizarResumoCheckout() {
    const carrinho = obterCarrinhoValido();

    if (carrinho.length === 0) {
        checkoutResumoItens.innerHTML = `
            <div class="checkout-vazio">
                <span>🛒</span>
                <h3>Seu carrinho está vazio</h3>
                <p>Escolha um produto antes de finalizar o pedido.</p>
                <a href="index.html#produtos">Ver produtos</a>
            </div>
        `;

        checkoutSubtotal.textContent = "R$ 0,00";
        checkoutTotal.textContent = "R$ 0,00";

        document.querySelectorAll(".checkout-btn-enviar").forEach((botao) => {
            botao.disabled = true;
        });

        return;
    }

    let total = 0;

    checkoutResumoItens.innerHTML = carrinho.map((item) => {
        const produto = item.produto;
        total += produto.preco * item.quantidade;

        const foto =
            Array.isArray(produto.fotos) && produto.fotos.length > 0
                ? produto.fotos[0]
                : "";

        const imagem = foto
            ? `<img src="${foto}" alt="${produto.nome}">`
            : `<div class="checkout-item-sem-foto">📱</div>`;

        return `
            <article class="checkout-item">
                <div class="checkout-item-imagem">
                    ${imagem}
                </div>

                <div class="checkout-item-info">
                    <span>${produto.codigo}</span>
                    <h3>${produto.nome}</h3>
                    <p>${produto.armazenamento} • ${produto.cor}</p>
                    <small>Quantidade: ${item.quantidade}</small>
                </div>

                <strong>
                    ${moedaCheckout(produto.preco * item.quantidade)}
                </strong>
            </article>
        `;
    }).join("");

    checkoutSubtotal.textContent = moedaCheckout(total);
    checkoutTotal.textContent = moedaCheckout(total);

    document.querySelectorAll(".checkout-btn-enviar").forEach((botao) => {
        botao.disabled = false;
    });
}

function configurarRecebimento() {
    const radios = document.querySelectorAll('input[name="recebimento"]');
    const camposEndereco = checkoutEndereco.querySelectorAll("input");

    function atualizar() {
        const selecionado = document.querySelector(
            'input[name="recebimento"]:checked'
        );

        const entrega = selecionado && selecionado.value === "entrega";

        checkoutEndereco.classList.toggle("oculto", !entrega);

        camposEndereco.forEach((campo) => {
            campo.required = entrega;
        });
    }

    radios.forEach((radio) => {
        radio.addEventListener("change", atualizar);
    });

    atualizar();
}

function configurarPagamento() {
    const radios = document.querySelectorAll('input[name="pagamento"]');

    function atualizar() {
        const selecionado = document.querySelector(
            'input[name="pagamento"]:checked'
        );

        const cartao = selecionado && selecionado.value === "cartao";
        avisoCartao.classList.toggle("visivel", cartao);
    }

    radios.forEach((radio) => {
        radio.addEventListener("change", atualizar);
    });

    atualizar();
}

function configurarTelefone() {
    const telefone = document.getElementById("checkoutTelefone");

    telefone.addEventListener("input", () => {
        let valor = telefone.value.replace(/\D/g, "").slice(0, 11);

        if (valor.length > 10) {
            valor = valor.replace(
                /^(\d{2})(\d{5})(\d{0,4}).*/,
                "($1) $2-$3"
            );
        } else if (valor.length > 6) {
            valor = valor.replace(
                /^(\d{2})(\d{4})(\d{0,4}).*/,
                "($1) $2-$3"
            );
        } else if (valor.length > 2) {
            valor = valor.replace(/^(\d{2})(\d+)/, "($1) $2");
        } else if (valor.length > 0) {
            valor = valor.replace(/^(\d{0,2})/, "($1");
        }

        telefone.value = valor;
    });
}

function definirEstadoEnvio(enviando) {
    document.querySelectorAll(".checkout-btn-enviar").forEach((botao) => {
        botao.disabled = enviando;
        botao.dataset.textoOriginal = botao.dataset.textoOriginal || botao.textContent;
        botao.textContent = enviando
            ? "Enviando pedido..."
            : botao.dataset.textoOriginal;
    });
}

function montarPedidoParaBanco() {
    const recebimentoSelecionado = document.querySelector(
        'input[name="recebimento"]:checked'
    );

    const pagamentoSelecionado = document.querySelector(
        'input[name="pagamento"]:checked'
    );

    const carrinho = obterCarrinhoValido();
    const total = calcularTotalCheckout();
    const entrega = recebimentoSelecionado.value === "entrega";

    return {
        nome_cliente: document.getElementById("checkoutNome").value.trim(),
        telefone: document.getElementById("checkoutTelefone").value.trim(),
        email: document.getElementById("checkoutEmail").value.trim() || null,
        tipo_recebimento: recebimentoSelecionado.value,
        endereco: entrega
            ? document.getElementById("checkoutEnderecoTexto").value.trim()
            : null,
        bairro: entrega
            ? document.getElementById("checkoutBairro").value.trim()
            : null,
        cidade: entrega
            ? document.getElementById("checkoutCidade").value.trim()
            : null,
        forma_pagamento: pagamentoSelecionado.value,
        observacoes:
            document.getElementById("checkoutObservacoes").value.trim() || null,
        valor_total: Number(total.toFixed(2)),
        itens: carrinho.map((item) => ({
            produto_id: Number(item.produto.id),
            codigo_produto: item.produto.codigo,
            nome_produto: item.produto.nome,
            armazenamento: item.produto.armazenamento || null,
            cor: item.produto.cor || null,
            condicao: item.produto.condicao || null,
            quantidade: item.quantidade,
            preco_unitario: Number(item.produto.preco.toFixed(2)),
            subtotal: Number(
                (item.produto.preco * item.quantidade).toFixed(2)
            )
        }))
    };
}

async function registrarPedidoNoSupabase(pedido) {
    const resposta = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/criar_pedido`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_PUBLISHABLE_KEY,
                "Authorization": `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
            },
            body: JSON.stringify({
                p_pedido: pedido
            })
        }
    );

    const textoResposta = await resposta.text();

    let dados = null;

    if (textoResposta) {
        try {
            dados = JSON.parse(textoResposta);
        } catch (erro) {
            dados = textoResposta;
        }
    }

    if (!resposta.ok) {
        console.error("Erro do Supabase:", dados);
        throw new Error("Não foi possível registrar o pedido.");
    }

    return dados;
}

function limparCarrinhoAposPedido() {
    localStorage.removeItem("ldiphones_carrinho");

    if (typeof atualizarQuantidadeCarrinho === "function") {
        atualizarQuantidadeCarrinho();
    }

    document.querySelectorAll("#quantidadeCarrinho").forEach((contador) => {
        contador.textContent = "0";
    });
}

function configurarEnvioPedido() {
    formCheckout.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        if (obterCarrinhoValido().length === 0) {
            return;
        }

        if (!formCheckout.reportValidity()) {
            return;
        }

        definirEstadoEnvio(true);

        try {
            const pedido = montarPedidoParaBanco();
            const respostaBanco = await registrarPedidoNoSupabase(pedido);

            const referenciaBanco =
                respostaBanco && respostaBanco.referencia
                    ? respostaBanco.referencia
                    : null;

            if (!referenciaBanco) {
                throw new Error("O banco não retornou a referência do pedido.");
            }

            localStorage.setItem(
                "ldiphones_ultimo_pedido",
                JSON.stringify({
                    ...pedido,
                    referencia: referenciaBanco,
                    banco: respostaBanco
                })
            );

            limparCarrinhoAposPedido();

            numeroPedido.textContent = referenciaBanco;

            checkoutConfirmacao.classList.add("visivel");
            checkoutConfirmacao.setAttribute("aria-hidden", "false");
            document.body.classList.add("checkout-modal-aberto");
        } catch (erro) {
            console.error(erro);

            alert(
                "Não foi possível enviar o pedido agora. " +
                "Seu carrinho foi mantido. Tente novamente em alguns instantes."
            );
        } finally {
            definirEstadoEnvio(false);
        }
    });
}

function configurarConfirmacao() {
    const fechar = document.getElementById("fecharConfirmacao");

    fechar.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

async function iniciarCheckout() {
    checkoutResumoItens.innerHTML = `
        <div class="checkout-vazio">
            <span>📱</span>
            <h3>Carregando seu carrinho...</h3>
            <p>Aguarde um instante.</p>
        </div>
    `;

    document.querySelectorAll(".checkout-btn-enviar").forEach((botao) => {
        botao.disabled = true;
    });

    try {
        if (typeof carregarProdutosSupabase === "function") {
            await carregarProdutosSupabase();
        }

        renderizarResumoCheckout();
    } catch (erro) {
        console.error("Erro ao carregar produtos no checkout:", erro);

        checkoutResumoItens.innerHTML = `
            <div class="checkout-vazio">
                <span>⚠️</span>
                <h3>Não foi possível carregar seu carrinho</h3>
                <p>Atualize a página e tente novamente.</p>
            </div>
        `;

        checkoutSubtotal.textContent = "R$ 0,00";
        checkoutTotal.textContent = "R$ 0,00";
    }
}

configurarRecebimento();
configurarPagamento();
configurarTelefone();
configurarEnvioPedido();
configurarConfirmacao();
iniciarCheckout();
