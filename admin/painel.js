const SUPABASE_URL = "https://dhzeqztrgxtlhhrjkvcn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_FqxwVSf7JXSR--WiC39I8A_nQJrO9Ek";

const supabasePainel = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const titulo = document.getElementById("titulo");
const listaPedidos = document.getElementById("listaPedidos");
const pedidosMensagem = document.getElementById("pedidosMensagem");
const buscaPedidos = document.getElementById("buscaPedidos");
const filtroStatusPedidos = document.getElementById("filtroStatusPedidos");
const btnAtualizarPedidos = document.getElementById("btnAtualizarPedidos");
const modalPedido = document.getElementById("modalPedido");
const modalPedidoConteudo = document.getElementById("modalPedidoConteudo");
const fecharModalPedido = document.getElementById("fecharModalPedido");

const listaProdutos = document.getElementById("listaProdutos");
const produtosMensagem = document.getElementById("produtosMensagem");
const buscaProdutos = document.getElementById("buscaProdutos");
const filtroProdutos = document.getElementById("filtroProdutos");
const btnAtualizarProdutos = document.getElementById("btnAtualizarProdutos");

const divulgacaoProduto = document.getElementById("divulgacaoProduto");
const divulgacaoFormato = document.getElementById("divulgacaoFormato");
const divulgacaoChamada = document.getElementById("divulgacaoChamada");
const divulgacaoMostrarParcelamento = document.getElementById("divulgacaoMostrarParcelamento");
const btnGerarDivulgacao = document.getElementById("btnGerarDivulgacao");
const btnBaixarDivulgacao = document.getElementById("btnBaixarDivulgacao");
const btnAtualizarDivulgacao = document.getElementById("btnAtualizarDivulgacao");
const divulgacaoMensagem = document.getElementById("divulgacaoMensagem");
const arteDivulgacao = document.getElementById("arteDivulgacao");
const arteFotoProduto = document.getElementById("arteFotoProduto");
const arteSemFoto = document.getElementById("arteSemFoto");
const arteChamada = document.getElementById("arteChamada");
const arteCondicaoTopo = document.getElementById("arteCondicaoTopo");
const arteCondicao = document.getElementById("arteCondicao");
const arteCodigo = document.getElementById("arteCodigo");
const arteNome = document.getElementById("arteNome");
const arteDetalhes = document.getElementById("arteDetalhes");
const artePreco = document.getElementById("artePreco");
const arteParcelamento = document.getElementById("arteParcelamento");
const arteParcelasQtd = document.getElementById("arteParcelasQtd");
const arteValorParcela = document.getElementById("arteValorParcela");
const btnNovoProduto = document.getElementById("btnNovoProduto");
const modalProduto = document.getElementById("modalProduto");
const fecharModalProduto = document.getElementById("fecharModalProduto");
const formProduto = document.getElementById("formProduto");
const produtoCondicao = document.getElementById("produtoCondicao");
const camposSeminovo = document.getElementById("camposSeminovo");
const produtoFormMensagem = document.getElementById("produtoFormMensagem");
const produtoFotosInput = document.getElementById("produtoFotosInput");
const produtoFotosPreview = document.getElementById("produtoFotosPreview");
const produtoFotosVazio = document.getElementById("produtoFotosVazio");
const produtoFotosContador = document.getElementById("produtoFotosContador");
const produtoFotosAjuda = document.getElementById("produtoFotosAjuda");
const produtoEstoque = document.getElementById("produtoEstoque");
const campoEstoqueProduto = document.getElementById("campoEstoqueProduto");
const formNovoAcesso = document.getElementById("formNovoAcesso");
const acessoNome = document.getElementById("acessoNome");
const acessoEmail = document.getElementById("acessoEmail");
const acessoSenha = document.getElementById("acessoSenha");
const acessoConfirmarSenha = document.getElementById("acessoConfirmarSenha");
const acessosMensagem = document.getElementById("acessosMensagem");
const listaAcessos = document.getElementById("listaAcessos");
const acessosListaMensagem = document.getElementById("acessosListaMensagem");
const btnCriarAcesso = document.getElementById("btnCriarAcesso");
const btnAtualizarAcessos = document.getElementById("btnAtualizarAcessos");


let pedidosCarregados = [];
let produtosCarregados = [];
let fotosProdutoAtuais = [];
let novasFotosProduto = [];
let fotosProdutoRemovidas = [];
let fotoPrincipalChave = null;

const nomes = {
    dashboard: "Dashboard",
    produtos: "Produtos",
    pedidos: "Pedidos",
    divulgacao: "Divulgação",
    acessos: "Acessos"
};

const statusPedidos = {
    novo: "Novo",
    em_contato: "Em contato",
    confirmado: "Confirmado",
    em_entrega: "Em entrega",
    concluido: "Concluído",
    cancelado: "Cancelado"
};

function escaparHTML(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function moeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(data) {
    if (!data) return "—";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(new Date(data));
}

function textoRecebimento(valor) {
    return valor === "entrega" ? "Entrega no RJ" : "Retirada combinada";
}

function textoPagamento(valor) {
    const nomesPagamento = {
        pix: "PIX",
        dinheiro: "Dinheiro",
        cartao: "Cartão"
    };

    return nomesPagamento[valor] || valor || "—";
}

function fecharMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
}

function abrirPagina(id) {
    document.querySelectorAll(".page").forEach((pagina) => {
        pagina.classList.remove("ativa");
    });

    document.querySelectorAll(".nav").forEach((item) => {
        item.classList.remove("ativo");
    });

    const pagina = document.getElementById(id);
    const itemMenu = document.querySelector(`[data-page="${id}"]`);

    if (!pagina || !itemMenu) return;

    pagina.classList.add("ativa");
    itemMenu.classList.add("ativo");
    titulo.textContent = nomes[id] || "Painel";

    fecharMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-page]").forEach((item) => {
    item.addEventListener("click", () => abrirPagina(item.dataset.page));
});

document.querySelectorAll("[data-go]").forEach((item) => {
    item.addEventListener("click", () => abrirPagina(item.dataset.go));
});

document.getElementById("abrirMenu").addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("show");
});

document.getElementById("fecharMenu").addEventListener("click", fecharMenu);
overlay.addEventListener("click", fecharMenu);

document.getElementById("btnSair").addEventListener("click", async () => {
    await supabasePainel.auth.signOut();
    window.location.href = "login.html";
});

function atualizarDashboard() {
    const ativosStatus = ["novo", "em_contato", "confirmado", "em_entrega"];

    const novos = pedidosCarregados.filter((pedido) => pedido.status === "novo").length;

    const emAndamento = pedidosCarregados.filter((pedido) =>
        ["em_contato", "confirmado", "em_entrega"].includes(pedido.status)
    ).length;

    const concluidos = pedidosCarregados.filter(
        (pedido) => pedido.status === "concluido"
    );

    const cancelados = pedidosCarregados.filter(
        (pedido) => pedido.status === "cancelado"
    );

    const pedidosAtivos = pedidosCarregados.filter(
        (pedido) => ativosStatus.includes(pedido.status)
    );

    const valorAtivos = pedidosAtivos.reduce(
        (total, pedido) => total + Number(pedido.valor_total || 0),
        0
    );

    const valorConcluido = concluidos.reduce(
        (total, pedido) => total + Number(pedido.valor_total || 0),
        0
    );

    document.getElementById("statPedidosNovos").textContent = novos;
    document.getElementById("statPedidosNovosTexto").textContent =
        novos === 1 ? "1 solicitação nova" : `${novos} solicitações novas`;

    document.getElementById("statEmAndamento").textContent = emAndamento;
    document.getElementById("statEmAndamentoTexto").textContent =
        "Em contato, confirmados e em entrega";

    document.getElementById("statConcluidos").textContent = concluidos.length;
    document.getElementById("statConcluidosTexto").textContent =
        concluidos.length === 1 ? "1 venda concluída" : `${concluidos.length} vendas concluídas`;

    document.getElementById("statCancelados").textContent = cancelados.length;
    document.getElementById("statCanceladosTexto").textContent =
        cancelados.length === 1 ? "1 pedido cancelado" : `${cancelados.length} pedidos cancelados`;

    document.getElementById("statValorAtivos").textContent = moeda(valorAtivos);
    document.getElementById("statValorAtivosTexto").textContent =
        "Novos e pedidos em andamento";

    document.getElementById("statValorConcluido").textContent = moeda(valorConcluido);
    document.getElementById("statValorConcluidoTexto").textContent =
        "Somente vendas concluídas";
}

function abrirPedidosPeloDashboard(filtro) {
    buscaPedidos.value = "";
    filtroStatusPedidos.value = filtro;
    abrirPagina("pedidos");
    renderizarPedidos();
}

document.querySelectorAll("[data-dashboard-filtro]").forEach((card) => {
    card.addEventListener("click", () => {
        abrirPedidosPeloDashboard(card.dataset.dashboardFiltro);
    });
});

function obterTextoItens(pedido) {
    const itens = Array.isArray(pedido.pedido_itens) ? pedido.pedido_itens : [];

    if (!itens.length) return "Sem itens";

    return itens.map((item) => {
        const qtd = Number(item.quantidade || 1);
        return `${qtd}x ${item.nome_produto}`;
    }).join(", ");
}

function normalizarTextoBusca(valor) {
    return String(valor ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function somenteNumeros(valor) {
    return String(valor ?? "").replace(/\D/g, "");
}

function renderizarPedidos() {
    const termoOriginal = buscaPedidos.value.trim();
    const termo = normalizarTextoBusca(termoOriginal);
    const termoNumerico = somenteNumeros(termoOriginal);
    const statusSelecionado = filtroStatusPedidos.value;

    const filtrados = pedidosCarregados.filter((pedido) => {
        const referencia = normalizarTextoBusca(pedido.referencia);
        const nomeCliente = normalizarTextoBusca(pedido.nome_cliente);
        const telefone = normalizarTextoBusca(pedido.telefone);
        const telefoneNumerico = somenteNumeros(pedido.telefone);

        const combinaBusca =
            !termo ||
            referencia.includes(termo) ||
            nomeCliente.includes(termo) ||
            telefone.includes(termo) ||
            (
                termoNumerico.length > 0 &&
                telefoneNumerico.includes(termoNumerico)
            );

        const combinaStatus =
            statusSelecionado === "todos" ||
            (statusSelecionado === "andamento" &&
                ["em_contato", "confirmado", "em_entrega"].includes(pedido.status)) ||
            pedido.status === statusSelecionado;

        return combinaBusca && combinaStatus;
    });

    if (!filtrados.length) {
        listaPedidos.innerHTML = "";
        pedidosMensagem.textContent = pedidosCarregados.length
            ? "Nenhum pedido encontrado com esses filtros."
            : "Nenhum pedido recebido até o momento.";
        pedidosMensagem.classList.add("visivel");
        return;
    }

    pedidosMensagem.classList.remove("visivel");

    listaPedidos.innerHTML = filtrados.map((pedido) => {
        const itens = Array.isArray(pedido.pedido_itens) ? pedido.pedido_itens : [];
        const quantidadeItens = itens.reduce(
            (total, item) => total + Number(item.quantidade || 0),
            0
        );

        return `
            <article class="pedido-card">
                <div class="pedido-card-topo">
                    <div>
                        <span class="pedido-referencia">${escaparHTML(pedido.referencia)}</span>
                        <small>${formatarData(pedido.criado_em)}</small>
                    </div>
                    <span class="status-badge status-${escaparHTML(pedido.status)}">
                        ${escaparHTML(statusPedidos[pedido.status] || pedido.status)}
                    </span>
                </div>

                <div class="pedido-card-grid">
                    <div>
                        <small>Cliente</small>
                        <strong>${escaparHTML(pedido.nome_cliente)}</strong>
                        <span>${escaparHTML(pedido.telefone)}</span>
                    </div>

                    <div>
                        <small>Produto</small>
                        <strong>${escaparHTML(obterTextoItens(pedido))}</strong>
                        <span>${quantidadeItens} ${quantidadeItens === 1 ? "item" : "itens"}</span>
                    </div>

                    <div>
                        <small>Recebimento</small>
                        <strong>${escaparHTML(textoRecebimento(pedido.tipo_recebimento))}</strong>
                        <span>${escaparHTML(textoPagamento(pedido.forma_pagamento))}</span>
                    </div>

                    <div class="pedido-valor">
                        <small>Valor</small>
                        <strong>${moeda(pedido.valor_total)}</strong>
                    </div>
                </div>

                <div class="pedido-card-acoes">
                    <button class="btn-ver-pedido" type="button" data-pedido-id="${pedido.id}">
                        Ver detalhes
                    </button>

                    <button class="btn-excluir-pedido" type="button" data-pedido-id="${pedido.id}">
                        Excluir pedido
                    </button>

                    <select class="select-status-pedido" data-pedido-id="${pedido.id}" aria-label="Alterar status do pedido ${escaparHTML(pedido.referencia)}">
                        ${Object.entries(statusPedidos).map(([valor, rotulo]) => `
                            <option value="${valor}" ${pedido.status === valor ? "selected" : ""}>
                                ${rotulo}
                            </option>
                        `).join("")}
                    </select>
                </div>
            </article>
        `;
    }).join("");

    document.querySelectorAll(".btn-ver-pedido").forEach((botao) => {
        botao.addEventListener("click", () => {
            abrirDetalhesPedido(Number(botao.dataset.pedidoId));
        });
    });

    document.querySelectorAll(".btn-excluir-pedido").forEach((botao) => {
        botao.addEventListener("click", async () => {
            await excluirPedido(Number(botao.dataset.pedidoId));
        });
    });

    document.querySelectorAll(".select-status-pedido").forEach((select) => {
        select.addEventListener("change", async () => {
            await alterarStatusPedido(Number(select.dataset.pedidoId), select.value, select);
        });
    });
}

async function carregarPedidos() {
    pedidosMensagem.textContent = "Carregando pedidos...";
    pedidosMensagem.classList.add("visivel");
    btnAtualizarPedidos.disabled = true;
    btnAtualizarPedidos.textContent = "Atualizando...";

    try {
        const { data, error } = await supabasePainel
            .from("pedidos")
            .select(`
                *,
                pedido_itens (
                    id,
                    produto_id,
                    codigo_produto,
                    nome_produto,
                    armazenamento,
                    cor,
                    condicao,
                    quantidade,
                    preco_unitario,
                    subtotal
                )
            `)
            .order("criado_em", { ascending: false });

        if (error) throw error;

        pedidosCarregados = data || [];
        atualizarDashboard();
        renderizarPedidos();
    } catch (erro) {
        console.error("Erro ao carregar pedidos:", erro);
        pedidosMensagem.textContent =
            "Não foi possível carregar os pedidos. Atualize a página e tente novamente.";
        pedidosMensagem.classList.add("visivel");

        document.getElementById("statPedidosNovos").textContent = "!";
        document.getElementById("statEmAndamento").textContent = "!";
        document.getElementById("statConcluidos").textContent = "!";
        document.getElementById("statCancelados").textContent = "!";
        document.getElementById("statValorAtivos").textContent = "!";
        document.getElementById("statValorConcluido").textContent = "!";
    } finally {
        btnAtualizarPedidos.disabled = false;
        btnAtualizarPedidos.textContent = "↻ Atualizar";
    }
}

async function alterarStatusPedido(id, novoStatus, select) {
    const pedido = pedidosCarregados.find((item) => Number(item.id) === Number(id));
    if (!pedido || pedido.status === novoStatus) return;

    const statusAnterior = pedido.status;
    select.disabled = true;

    try {
        const { data, error } = await supabasePainel.rpc("alterar_status_pedido", {
            p_pedido_id: Number(id),
            p_novo_status: novoStatus
        });

        if (error) throw error;

        if (!data || data.ok !== true) {
            throw new Error("O Supabase não confirmou a alteração do pedido.");
        }

        pedido.status = novoStatus;

        await Promise.all([
            carregarPedidos(),
            carregarProdutos()
        ]);

        if (modalPedido.classList.contains("visivel")) {
            abrirDetalhesPedido(id);
        }
    } catch (erro) {
        console.error("Erro ao alterar status:", erro);
        pedido.status = statusAnterior;
        select.value = statusAnterior;

        const mensagem = erro?.message || "Não foi possível alterar o status do pedido.";
        alert(`Não foi possível alterar o status do pedido.

${mensagem}`);
    } finally {
        select.disabled = false;
    }
}

async function excluirPedido(id) {
    const pedido = pedidosCarregados.find((item) => Number(item.id) === Number(id));
    if (!pedido) return;

    const referencia = pedido.referencia || `#${id}`;
    const confirmarExclusao = confirm(
        `Excluir o pedido ${referencia}?

` +
        `Essa ação é definitiva. O estoque será ajustado automaticamente de acordo com o status atual do pedido.`
    );

    if (!confirmarExclusao) return;

    try {
        const { data, error } = await supabasePainel.rpc("excluir_pedido", {
            p_pedido_id: Number(id)
        });

        if (error) throw error;

        if (!data || data.ok !== true) {
            throw new Error("O Supabase não confirmou a exclusão do pedido.");
        }

        if (modalPedido.classList.contains("visivel")) {
            fecharDetalhesPedido();
        }

        await Promise.all([
            carregarPedidos(),
            carregarProdutos()
        ]);

        alert(`Pedido ${referencia} excluído com sucesso.`);
    } catch (erro) {
        console.error("Erro ao excluir pedido:", erro);
        const mensagem = erro?.message || "Não foi possível excluir o pedido.";
        alert(`Não foi possível excluir o pedido.

${mensagem}`);
    }
}

function abrirDetalhesPedido(id) {
    const pedido = pedidosCarregados.find((item) => Number(item.id) === Number(id));
    if (!pedido) return;

    const itens = Array.isArray(pedido.pedido_itens) ? pedido.pedido_itens : [];

    const endereco = pedido.tipo_recebimento === "entrega"
        ? [pedido.endereco, pedido.bairro, pedido.cidade].filter(Boolean).join(" • ")
        : "Retirada combinada com a LD iPhones";

    modalPedidoConteudo.innerHTML = `
        <div class="modal-pedido-cabecalho">
            <span>PEDIDO</span>
            <h2 id="modalPedidoTitulo">${escaparHTML(pedido.referencia)}</h2>
            <p>Recebido em ${formatarData(pedido.criado_em)}</p>
        </div>

        <div class="modal-pedido-status">
            <div>
                <small>Status atual</small>
                <span class="status-badge status-${escaparHTML(pedido.status)}">
                    ${escaparHTML(statusPedidos[pedido.status] || pedido.status)}
                </span>
            </div>

            <select id="modalStatusPedido">
                ${Object.entries(statusPedidos).map(([valor, rotulo]) => `
                    <option value="${valor}" ${pedido.status === valor ? "selected" : ""}>
                        ${rotulo}
                    </option>
                `).join("")}
            </select>
        </div>

        <div class="modal-pedido-secao">
            <h3>Cliente</h3>
            <div class="modal-info-grid">
                <div><small>Nome</small><strong>${escaparHTML(pedido.nome_cliente)}</strong></div>
                <div><small>Telefone</small><strong>${escaparHTML(pedido.telefone)}</strong></div>
                <div><small>E-mail</small><strong>${escaparHTML(pedido.email || "Não informado")}</strong></div>
                <div><small>Pagamento</small><strong>${escaparHTML(textoPagamento(pedido.forma_pagamento))}</strong></div>
            </div>
        </div>

        <div class="modal-pedido-secao">
            <h3>Recebimento</h3>
            <p><strong>${escaparHTML(textoRecebimento(pedido.tipo_recebimento))}</strong></p>
            <p>${escaparHTML(endereco)}</p>
        </div>

        <div class="modal-pedido-secao">
            <h3>Itens</h3>
            <div class="modal-itens">
                ${itens.map((item) => `
                    <article>
                        <div>
                            <small>${escaparHTML(item.codigo_produto)}</small>
                            <strong>${escaparHTML(item.nome_produto)}</strong>
                            <span>
                                ${escaparHTML(item.armazenamento || "")}
                                ${item.cor ? " • " + escaparHTML(item.cor) : ""}
                                ${item.condicao ? " • " + escaparHTML(item.condicao) : ""}
                            </span>
                        </div>
                        <div>
                            <small>${Number(item.quantidade || 1)}x ${moeda(item.preco_unitario)}</small>
                            <strong>${moeda(item.subtotal)}</strong>
                        </div>
                    </article>
                `).join("")}
            </div>
        </div>

        <div class="modal-pedido-secao">
            <h3>Observações</h3>
            <p>${escaparHTML(pedido.observacoes || "Nenhuma observação informada.")}</p>
        </div>

        <div class="modal-pedido-total">
            <span>Valor do pedido</span>
            <strong>${moeda(pedido.valor_total)}</strong>
        </div>

        <div class="modal-pedido-exclusao">
            <button id="btnExcluirPedidoModal" class="btn-excluir-pedido" type="button">
                Excluir pedido
            </button>
        </div>
    `;

    const btnExcluirPedidoModal = document.getElementById("btnExcluirPedidoModal");
    btnExcluirPedidoModal.addEventListener("click", async () => {
        await excluirPedido(pedido.id);
    });

    const modalStatusPedido = document.getElementById("modalStatusPedido");
    modalStatusPedido.addEventListener("change", async () => {
        await alterarStatusPedido(pedido.id, modalStatusPedido.value, modalStatusPedido);
    });

    modalPedido.classList.add("visivel");
    modalPedido.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-aberto");
}

function fecharDetalhesPedido() {
    modalPedido.classList.remove("visivel");
    modalPedido.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-aberto");
}

fecharModalPedido.addEventListener("click", fecharDetalhesPedido);

document.querySelectorAll("[data-fechar-modal]").forEach((elemento) => {
    elemento.addEventListener("click", fecharDetalhesPedido);
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && modalPedido.classList.contains("visivel")) {
        fecharDetalhesPedido();
    }
    if (evento.key === "Escape" && modalProduto.classList.contains("visivel")) {
        fecharModalProdutoFunc();
    }
});

buscaPedidos.addEventListener("input", renderizarPedidos);
filtroStatusPedidos.addEventListener("change", renderizarPedidos);
btnAtualizarPedidos.addEventListener("click", carregarPedidos);


function textoCondicaoProduto(valor) {
    return valor === "seminovo" ? "Seminovo" : "Lacrado";
}

function textoDestaqueProduto(valor) {
    const tipos = { destaque: "Destaque", lancamento: "Lançamento", promocao: "Promoção" };
    return tipos[valor] || "Nenhum";
}

function atualizarStatProdutos() {
    const disponiveis = produtosCarregados.filter(
        (p) => p.disponivel !== false && estoqueDisponivelProduto(p) > 0
    ).length;
    document.getElementById("statProdutos").textContent = disponiveis;
    document.getElementById("statProdutosTexto").textContent =
        disponiveis === 1 ? "1 produto disponível" : `${disponiveis} produtos disponíveis`;
}

function renderizarProdutos() {
    const termo = buscaProdutos.value.trim().toLowerCase();
    const filtro = filtroProdutos.value;

    const filtrados = produtosCarregados.filter((produto) => {
        const texto = [produto.codigo, produto.nome, produto.categoria, produto.condicao, produto.armazenamento, produto.cor]
            .join(" ").toLowerCase();
        const buscaOk = !termo || texto.includes(termo);
        let filtroOk = true;
        if (filtro === "disponiveis") filtroOk = produto.disponivel !== false;
        if (filtro === "indisponiveis") filtroOk = produto.disponivel === false;
        if (filtro === "destaques") filtroOk = produto.destaque === true;
        return buscaOk && filtroOk;
    });

    if (!filtrados.length) {
        listaProdutos.innerHTML = "";
        produtosMensagem.textContent = produtosCarregados.length
            ? "Nenhum produto encontrado com esses filtros."
            : "Nenhum produto cadastrado. Clique em + Novo produto para começar.";
        produtosMensagem.classList.add("visivel");
        return;
    }

    produtosMensagem.classList.remove("visivel");
    listaProdutos.innerHTML = filtrados.map((produto) => `
        <article class="produto-admin-card">
            <div class="produto-admin-icone">
                ${(() => {
                    const fotos = Array.isArray(produto.produto_fotos) ? [...produto.produto_fotos] : [];
                    fotos.sort((a, b) => Number(b.principal) - Number(a.principal) || Number(a.ordem || 0) - Number(b.ordem || 0));
                    return fotos[0]?.url
                        ? `<img src="${escaparHTML(fotos[0].url)}" alt="${escaparHTML(produto.nome)}">`
                        : "📱";
                })()}
            </div>
            <div class="produto-admin-info">
                <div class="produto-admin-topo">
                    <div>
                        <small>${escaparHTML(produto.codigo)}</small>
                        <h3>${escaparHTML(produto.nome)}</h3>
                    </div>
                    <div class="produto-badges">
                        ${produto.destaque ? `<span class="produto-badge destaque">${escaparHTML(textoDestaqueProduto(produto.tipo_destaque))}</span>` : ""}
                        <span class="produto-badge ${
                            produto.disponivel === false || estoqueDisponivelProduto(produto) <= 0
                                ? "indisponivel"
                                : "disponivel"
                        }">
                            ${
                                produto.disponivel === false
                                    ? "Indisponível"
                                    : estoqueDisponivelProduto(produto) <= 0
                                        ? "Esgotado"
                                        : "Disponível"
                            }
                        </span>
                    </div>
                </div>
                <div class="produto-admin-detalhes">
                    <span>${escaparHTML(textoCondicaoProduto(produto.condicao))}</span>
                    <span>${escaparHTML(produto.armazenamento || "Sem armazenamento")}</span>
                    <span>${escaparHTML(produto.cor || "Sem cor")}</span>
                    <span>Estoque: ${estoqueFisicoProduto(produto)}</span>
                    <span>Reservado: ${estoqueReservadoProduto(produto)}</span>
                    <span>Disponível: ${estoqueDisponivelProduto(produto)}</span>
                </div>
                <div class="produto-admin-rodape">
                    <div><small>Preço à vista</small><strong>${moeda(produto.preco)}</strong></div>
                    <div class="produto-admin-acoes">
                        <button class="btn-produto-disponibilidade" data-produto-id="${produto.id}" type="button">
                            ${produto.disponivel !== false ? "Marcar indisponível" : "Marcar disponível"}
                        </button>
                        <button class="btn-editar-produto" data-produto-id="${produto.id}" type="button">Editar</button>
                        <button class="btn-excluir-produto" data-produto-id="${produto.id}" type="button">Excluir</button>
                    </div>
                </div>
            </div>
        </article>
    `).join("");

    document.querySelectorAll(".btn-editar-produto").forEach((btn) =>
        btn.addEventListener("click", () => abrirModalProduto(Number(btn.dataset.produtoId)))
    );
    document.querySelectorAll(".btn-produto-disponibilidade").forEach((btn) =>
        btn.addEventListener("click", () => alternarDisponibilidadeProduto(Number(btn.dataset.produtoId)))
    );
    document.querySelectorAll(".btn-excluir-produto").forEach((btn) =>
        btn.addEventListener("click", () => excluirProduto(Number(btn.dataset.produtoId)))
    );
}


function obterProdutoDivulgacaoSelecionado() {
    const id = String(divulgacaoProduto?.value || "");
    return produtosCarregados.find((produto) => String(produto.id) === id) || null;
}

function atualizarProdutosDivulgacao() {
    if (!divulgacaoProduto) return;

    const selecionado = String(divulgacaoProduto.value || "");

    const disponiveis = produtosCarregados.filter((produto) => {
        // O painel já carrega somente os dados reais do Supabase.
        // Aqui consideramos disponível o produto que não foi marcado como indisponível
        // e que possui estoque disponível quando essa informação existir.
        const marcadoDisponivel = produto.disponivel !== false;

        const estoque = Number(produto.estoque);
        const reservado = Number(produto.estoque_reservado);

        const temControleEstoque =
            Number.isFinite(estoque) &&
            Number.isFinite(reservado);

        const temEstoque = !temControleEstoque || (estoque - reservado) > 0;

        return marcadoDisponivel && temEstoque;
    });

    divulgacaoProduto.innerHTML = `
        <option value="">Selecione um produto</option>
        ${disponiveis.map((produto) => `
            <option value="${produto.id}">
                ${escaparHTML(produto.codigo || "")} — ${escaparHTML(produto.nome || "Produto")}
            </option>
        `).join("")}
    `;

    if (disponiveis.some((produto) => String(produto.id) === selecionado)) {
        divulgacaoProduto.value = selecionado;
    }

    if (!disponiveis.length) {
        divulgacaoProduto.innerHTML = `
            <option value="">Nenhum produto disponível encontrado</option>
        `;
    }

    atualizarResumoDivulgacao();
}

function obterFotoDivulgacao(produto) {
    const fotos = Array.isArray(produto?.produto_fotos) ? [...produto.produto_fotos] : [];
    fotos.sort((a, b) =>
        Number(b.principal) - Number(a.principal) ||
        Number(a.ordem || 0) - Number(b.ordem || 0)
    );
    return fotos[0]?.url || "";
}

function atualizarResumoDivulgacao() {
    const produto = obterProdutoDivulgacaoSelecionado();

    if (!produto) {
        arteCodigo.textContent = "LD-000";
        arteNome.textContent = "Selecione um iPhone";
        arteDetalhes.textContent = "Armazenamento • Cor • Condição";
        artePreco.textContent = "R$ 0,00";
        arteValorParcela.textContent = "R$ 0,00";
        arteCondicao.textContent = "DISPONÍVEL";
        if (arteCondicaoTopo) arteCondicaoTopo.textContent = "DISPONÍVEL";
        arteFotoProduto.removeAttribute("src");
        arteFotoProduto.classList.remove("visivel");
        arteSemFoto.style.display = "grid";
        btnBaixarDivulgacao.disabled = true;
        return;
    }

    montarArteDivulgacao(produto);
}

function montarArteDivulgacao(produto) {
    const condicao = produto?.condicao === "seminovo" ? "SEMINOVO" : "LACRADO";
    const detalhes = [
        produto?.armazenamento,
        produto?.cor,
        produto?.condicao === "seminovo" ? "Seminovo" : "Lacrado"
    ].filter(Boolean).join(" • ");

    const preco = Number(produto?.preco || 0);
    const parcelas = Math.max(1, Number(produto?.parcelas || 12));
    const foto = obterFotoDivulgacao(produto);
    const chamada = String(divulgacaoChamada?.value || "").trim() || "OFERTA ESPECIAL";

    arteChamada.textContent = chamada.toUpperCase();
    if (arteCondicaoTopo) arteCondicaoTopo.textContent = condicao;
    arteCondicao.textContent = condicao;
    arteCodigo.textContent = produto?.codigo || "LD";
    arteNome.textContent = produto?.nome || "iPhone";
    arteDetalhes.textContent = detalhes || "Produto disponível";
    artePreco.textContent = moeda(preco);

    arteParcelasQtd.textContent = `${parcelas}X`;
    arteValorParcela.textContent = moeda(preco / parcelas);
    arteParcelamento.style.display =
        divulgacaoMostrarParcelamento?.checked && parcelas > 1 ? "grid" : "none";

    if (foto) {
        arteFotoProduto.src = foto;
        arteFotoProduto.classList.add("visivel");
        arteSemFoto.style.display = "none";
    } else {
        arteFotoProduto.removeAttribute("src");
        arteFotoProduto.classList.remove("visivel");
        arteSemFoto.style.display = "grid";
    }

    const formato = divulgacaoFormato?.value || "feed";
    arteDivulgacao.classList.toggle("formato-feed", formato === "feed");
    arteDivulgacao.classList.toggle("formato-story", formato === "story");
}

function gerarDivulgacao(evento) {
    if (evento) evento.preventDefault();

    const produto = obterProdutoDivulgacaoSelecionado();

    if (!produto) {
        divulgacaoMensagem.textContent = "Selecione um produto para gerar a arte.";
        divulgacaoMensagem.className = "divulgacao-mensagem erro";
        btnBaixarDivulgacao.disabled = true;
        return;
    }

    montarArteDivulgacao(produto);
    divulgacaoMensagem.textContent = "Arte gerada. Confira a prévia e faça o download em PNG.";
    divulgacaoMensagem.className = "divulgacao-mensagem sucesso";
    btnBaixarDivulgacao.disabled = false;
}

async function baixarArteDivulgacao() {
    const produto = obterProdutoDivulgacaoSelecionado();

    if (!produto) {
        divulgacaoMensagem.textContent = "Selecione um produto antes de baixar a arte.";
        divulgacaoMensagem.className = "divulgacao-mensagem erro";
        return;
    }

    if (typeof html2canvas !== "function") {
        divulgacaoMensagem.textContent = "O recurso de exportação não foi carregado. Faça Ctrl + F5 e tente novamente.";
        divulgacaoMensagem.className = "divulgacao-mensagem erro";
        return;
    }

    btnBaixarDivulgacao.disabled = true;
    btnBaixarDivulgacao.textContent = "Gerando PNG...";
    divulgacaoMensagem.textContent = "Preparando a arte em alta resolução...";
    divulgacaoMensagem.className = "divulgacao-mensagem";

    const estiloAnterior = {
        transform: arteDivulgacao.style.transform,
        marginBottom: arteDivulgacao.style.marginBottom,
        transformOrigin: arteDivulgacao.style.transformOrigin
    };

    try {
        if (arteFotoProduto?.src && !arteFotoProduto.complete) {
            await new Promise((resolve) => {
                const finalizar = () => resolve();
                arteFotoProduto.addEventListener("load", finalizar, { once: true });
                arteFotoProduto.addEventListener("error", finalizar, { once: true });
                setTimeout(finalizar, 4000);
            });
        }

        const formato = divulgacaoFormato?.value || "feed";
        const largura = 1080;
        const altura = formato === "story" ? 1920 : 1350;

        // A prévia fica reduzida no painel, mas a captura precisa acontecer em 100%.
        arteDivulgacao.style.transform = "none";
        arteDivulgacao.style.marginBottom = "0";
        arteDivulgacao.style.transformOrigin = "top left";

        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const canvas = await html2canvas(arteDivulgacao, {
            backgroundColor: "#050309",
            useCORS: true,
            allowTaint: false,
            scale: 1,
            width: largura,
            height: altura,
            windowWidth: largura,
            windowHeight: altura,
            scrollX: 0,
            scrollY: 0,
            logging: false,
            imageTimeout: 8000
        });

        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob((arquivo) => {
                if (arquivo) resolve(arquivo);
                else reject(new Error("Não foi possível criar o arquivo PNG."));
            }, "image/png", 1);
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const codigo = String(produto.codigo || "produto")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-");

        link.href = url;
        link.download = `ld-iphones-${codigo}-${formato}.png`;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 3000);

        divulgacaoMensagem.textContent = "Arte gerada e enviada para download.";
        divulgacaoMensagem.className = "divulgacao-mensagem sucesso";
    } catch (erro) {
        console.error("Erro ao exportar arte:", erro);
        divulgacaoMensagem.textContent =
            "Não foi possível baixar a arte. Se a foto estiver vindo do Supabase, atualize a página e tente novamente.";
        divulgacaoMensagem.className = "divulgacao-mensagem erro";
    } finally {
        arteDivulgacao.style.transform = estiloAnterior.transform;
        arteDivulgacao.style.marginBottom = estiloAnterior.marginBottom;
        arteDivulgacao.style.transformOrigin = estiloAnterior.transformOrigin;

        btnBaixarDivulgacao.disabled = false;
        btnBaixarDivulgacao.textContent = "↓ Baixar arte em PNG";
    }
}

async function carregarProdutos() {
    produtosMensagem.textContent = "Carregando produtos...";
    produtosMensagem.classList.add("visivel");
    btnAtualizarProdutos.disabled = true;

    try {
        const { data, error } = await supabasePainel
            .from("produtos")
            .select(`
                *,
                produto_fotos (
                    id,
                    url,
                    caminho_storage,
                    principal,
                    ordem,
                    criado_em
                )
            `)
            .order("id", { ascending: true });
        if (error) throw error;
        produtosCarregados = data || [];
        atualizarStatProdutos();
        renderizarProdutos();
        atualizarProdutosDivulgacao();
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        produtosMensagem.textContent = "Não foi possível carregar os produtos do Supabase.";
        produtosMensagem.classList.add("visivel");
        document.getElementById("statProdutos").textContent = "!";
        document.getElementById("statProdutosTexto").textContent = "Erro ao carregar catálogo";
    } finally {
        btnAtualizarProdutos.disabled = false;
    }
}


function chaveFotoNova(item) {
    return `nova:${item.uid}`;
}

function chaveFotoAtual(item) {
    return `atual:${item.id}`;
}

function limparEstadoFotosProduto() {
    novasFotosProduto.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });

    fotosProdutoAtuais = [];
    novasFotosProduto = [];
    fotosProdutoRemovidas = [];
    fotoPrincipalChave = null;
    produtoFotosInput.value = "";
    renderizarFotosProduto();
}

function atualizarModoFotosProduto() {
    const seminovo = produtoCondicao.value === "seminovo";

    produtoFotosInput.multiple = seminovo;
    produtoFotosAjuda.textContent = seminovo
        ? "Para seminovo, selecione várias fotos reais do aparelho e escolha a principal."
        : "Para aparelho lacrado, selecione uma foto principal.";

    const label = document.querySelector(".btn-selecionar-fotos");
    if (label) label.textContent = seminovo ? "+ Selecionar fotos" : "+ Selecionar foto";

    if (!seminovo && novasFotosProduto.length > 1) {
        const manter = novasFotosProduto[0];
        novasFotosProduto.slice(1).forEach((item) => {
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        novasFotosProduto = [manter];
    }

    renderizarFotosProduto();
}

function obterTodasFotosVisiveis() {
    const atuais = fotosProdutoAtuais
        .filter((foto) => !fotosProdutoRemovidas.includes(Number(foto.id)))
        .map((foto) => ({
            tipo: "atual",
            chave: chaveFotoAtual(foto),
            id: Number(foto.id),
            url: foto.url,
            caminho_storage: foto.caminho_storage,
            principal: foto.principal === true,
            ordem: Number(foto.ordem || 0)
        }));

    const novas = novasFotosProduto.map((foto, indice) => ({
        tipo: "nova",
        chave: chaveFotoNova(foto),
        uid: foto.uid,
        url: foto.previewUrl,
        principal: false,
        ordem: atuais.length + indice
    }));

    return [...atuais, ...novas];
}

function garantirFotoPrincipal() {
    const fotos = obterTodasFotosVisiveis();

    if (!fotos.length) {
        fotoPrincipalChave = null;
        return;
    }

    if (!fotoPrincipalChave || !fotos.some((foto) => foto.chave === fotoPrincipalChave)) {
        const principalAtual = fotos.find((foto) => foto.principal);
        fotoPrincipalChave = principalAtual?.chave || fotos[0].chave;
    }
}

function renderizarFotosProduto() {
    garantirFotoPrincipal();
    const fotos = obterTodasFotosVisiveis();

    produtoFotosVazio.style.display = fotos.length ? "none" : "flex";
    produtoFotosPreview.innerHTML = "";
    produtoFotosContador.textContent = `${fotos.length} ${fotos.length === 1 ? "foto" : "fotos"}`;

    fotos.forEach((foto, indice) => {
        const card = document.createElement("article");
        card.className = `produto-foto-card ${fotoPrincipalChave === foto.chave ? "principal" : ""}`;

        card.innerHTML = `
            <div class="produto-foto-imagem">
                <img src="${escaparHTML(foto.url)}" alt="Foto ${indice + 1}">
                ${fotoPrincipalChave === foto.chave ? '<span class="foto-principal-badge">Principal</span>' : ""}
            </div>
            <div class="produto-foto-acoes">
                <button class="btn-foto-principal" type="button" data-foto-chave="${escaparHTML(foto.chave)}">
                    ${fotoPrincipalChave === foto.chave ? "✓ Principal" : "Definir principal"}
                </button>
                <button class="btn-remover-foto" type="button" data-foto-chave="${escaparHTML(foto.chave)}">
                    Remover
                </button>
            </div>
        `;

        produtoFotosPreview.appendChild(card);
    });

    produtoFotosPreview.querySelectorAll(".btn-foto-principal").forEach((botao) => {
        botao.addEventListener("click", () => {
            fotoPrincipalChave = botao.dataset.fotoChave;
            renderizarFotosProduto();
        });
    });

    produtoFotosPreview.querySelectorAll(".btn-remover-foto").forEach((botao) => {
        botao.addEventListener("click", () => removerFotoProduto(botao.dataset.fotoChave));
    });
}

function removerFotoProduto(chave) {
    if (chave.startsWith("nova:")) {
        const uid = chave.replace("nova:", "");
        const foto = novasFotosProduto.find((item) => item.uid === uid);

        if (foto?.previewUrl) URL.revokeObjectURL(foto.previewUrl);
        novasFotosProduto = novasFotosProduto.filter((item) => item.uid !== uid);
    } else if (chave.startsWith("atual:")) {
        const id = Number(chave.replace("atual:", ""));
        if (!fotosProdutoRemovidas.includes(id)) fotosProdutoRemovidas.push(id);
    }

    if (fotoPrincipalChave === chave) fotoPrincipalChave = null;
    renderizarFotosProduto();
}

function selecionarFotosProduto(evento) {
    const arquivos = Array.from(evento.target.files || []);
    if (!arquivos.length) return;

    const permitidos = ["image/jpeg", "image/png", "image/webp"];
    const invalidos = arquivos.filter((arquivo) => !permitidos.includes(arquivo.type));

    if (invalidos.length) {
        produtoFormMensagem.textContent = "Use somente imagens JPG, PNG ou WEBP.";
        produtoFormMensagem.classList.add("erro");
        produtoFotosInput.value = "";
        return;
    }

    const seminovo = produtoCondicao.value === "seminovo";
    const selecionados = seminovo ? arquivos : [arquivos[0]];

    if (!seminovo) {
        novasFotosProduto.forEach((item) => {
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        novasFotosProduto = [];

        fotosProdutoAtuais.forEach((foto) => {
            if (!fotosProdutoRemovidas.includes(Number(foto.id))) {
                fotosProdutoRemovidas.push(Number(foto.id));
            }
        });
        fotoPrincipalChave = null;
    }

    selecionados.forEach((arquivo) => {
        const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        novasFotosProduto.push({
            uid,
            arquivo,
            previewUrl: URL.createObjectURL(arquivo)
        });
    });

    produtoFotosInput.value = "";
    produtoFormMensagem.textContent = "";
    produtoFormMensagem.className = "produto-form-mensagem";
    renderizarFotosProduto();
}

function sanitizarNomeArquivo(nome) {
    const partes = nome.split(".");
    const extensao = (partes.pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const base = partes.join(".")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50) || "foto";

    return { base, extensao };
}

async function excluirFotosMarcadas() {
    if (!fotosProdutoRemovidas.length) return;

    const fotos = fotosProdutoAtuais.filter((foto) =>
        fotosProdutoRemovidas.includes(Number(foto.id))
    );

    const caminhos = fotos.map((foto) => foto.caminho_storage).filter(Boolean);

    if (caminhos.length) {
        const { error: storageError } = await supabasePainel.storage
            .from("produtos")
            .remove(caminhos);

        if (storageError) throw storageError;
    }

    const { error } = await supabasePainel
        .from("produto_fotos")
        .delete()
        .in("id", fotosProdutoRemovidas);

    if (error) throw error;
}

async function enviarNovasFotos(produtoId, codigoProduto) {
    const novasInseridas = [];

    for (let indice = 0; indice < novasFotosProduto.length; indice++) {
        const item = novasFotosProduto[indice];
        const { base, extensao } = sanitizarNomeArquivo(item.arquivo.name);
        const codigoSeguro = String(codigoProduto || produtoId)
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-");

        const caminho = `${codigoSeguro}/${Date.now()}-${indice}-${base}.${extensao}`;

        const { error: uploadError } = await supabasePainel.storage
            .from("produtos")
            .upload(caminho, item.arquivo, {
                cacheControl: "3600",
                upsert: false,
                contentType: item.arquivo.type
            });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabasePainel.storage
            .from("produtos")
            .getPublicUrl(caminho);

        const principal = fotoPrincipalChave === chaveFotoNova(item);

        const { data: fotoSalva, error: fotoError } = await supabasePainel
            .from("produto_fotos")
            .insert({
                produto_id: Number(produtoId),
                url: publicData.publicUrl,
                caminho_storage: caminho,
                principal,
                ordem: fotosProdutoAtuais.filter((foto) => !fotosProdutoRemovidas.includes(Number(foto.id))).length + indice
            })
            .select("id,url,caminho_storage,principal,ordem,criado_em")
            .single();

        if (fotoError) {
            await supabasePainel.storage.from("produtos").remove([caminho]);
            throw fotoError;
        }

        novasInseridas.push(fotoSalva);
    }

    return novasInseridas;
}

async function sincronizarFotoPrincipal(produtoId) {
    const fotosRestantes = fotosProdutoAtuais.filter(
        (foto) => !fotosProdutoRemovidas.includes(Number(foto.id))
    );

    const principalAtual = fotoPrincipalChave?.startsWith("atual:")
        ? Number(fotoPrincipalChave.replace("atual:", ""))
        : null;

    if (principalAtual) {
        const { error: limparError } = await supabasePainel
            .from("produto_fotos")
            .update({ principal: false })
            .eq("produto_id", Number(produtoId));

        if (limparError) throw limparError;

        const { error: principalError } = await supabasePainel
            .from("produto_fotos")
            .update({ principal: true })
            .eq("id", principalAtual)
            .eq("produto_id", Number(produtoId));

        if (principalError) throw principalError;
    } else if (!novasFotosProduto.length && fotosRestantes.length) {
        const primeira = fotosRestantes[0];

        const { error: limparError } = await supabasePainel
            .from("produto_fotos")
            .update({ principal: false })
            .eq("produto_id", Number(produtoId));

        if (limparError) throw limparError;

        const { error: principalError } = await supabasePainel
            .from("produto_fotos")
            .update({ principal: true })
            .eq("id", Number(primeira.id));

        if (principalError) throw principalError;
    }
}

async function salvarFotosProduto(produtoId, codigoProduto) {
    await excluirFotosMarcadas();
    await sincronizarFotoPrincipal(produtoId);
    await enviarNovasFotos(produtoId, codigoProduto);

    // Garante uma única foto principal quando a escolhida for uma foto nova.
    if (fotoPrincipalChave?.startsWith("nova:")) {
        const { data: fotos, error } = await supabasePainel
            .from("produto_fotos")
            .select("id,principal,ordem")
            .eq("produto_id", Number(produtoId))
            .order("ordem", { ascending: true });

        if (error) throw error;

        const principais = (fotos || []).filter((foto) => foto.principal);
        if (principais.length > 1) {
            const manter = principais[principais.length - 1];
            const { error: limparError } = await supabasePainel
                .from("produto_fotos")
                .update({ principal: false })
                .eq("produto_id", Number(produtoId))
                .neq("id", Number(manter.id));

            if (limparError) throw limparError;
        }
    }
}

function estoqueFisicoProduto(produto) {
    return Math.max(0, Number(produto?.estoque || 0));
}

function estoqueReservadoProduto(produto) {
    return Math.max(0, Number(produto?.estoque_reservado || 0));
}

function estoqueDisponivelProduto(produto) {
    return Math.max(0, estoqueFisicoProduto(produto) - estoqueReservadoProduto(produto));
}

function atualizarCampoEstoqueProduto() {
    const seminovo = produtoCondicao.value === "seminovo";

    if (seminovo) {
        produtoEstoque.value = "1";
        produtoEstoque.readOnly = true;
        produtoEstoque.required = false;
        campoEstoqueProduto.querySelector("span").textContent = "Estoque";
        campoEstoqueProduto.querySelector(".campo-ajuda").textContent =
            "Seminovo representa um aparelho único: estoque automático de 1 unidade.";
    } else {
        produtoEstoque.readOnly = false;
        produtoEstoque.required = true;
        campoEstoqueProduto.querySelector("span").textContent = "Quantidade em estoque *";
        campoEstoqueProduto.querySelector(".campo-ajuda").textContent =
            "Informe quantas unidades físicas deste aparelho lacrado existem.";
    }
}

function atualizarCamposSeminovo() {
    const seminovo = produtoCondicao.value === "seminovo";
    camposSeminovo.hidden = !seminovo;
    atualizarCampoEstoqueProduto();
    atualizarModoFotosProduto();

    const obrigatorios = [
        "produtoSaudeBateria",
        "produtoEstadoEstetico",
        "produtoTela",
        "produtoPecas",
        "produtoFaceId",
        "produtoCameras"
    ];

    obrigatorios.forEach((id) => {
        const campo = document.getElementById(id);
        if (campo) campo.required = seminovo;
    });

    if (!seminovo) {
        document.getElementById("produtoSaudeBateria").value = "";
        document.getElementById("produtoEstadoEstetico").value = "";
        document.getElementById("produtoTela").value = "";
        document.getElementById("produtoPecas").value = "";
        document.getElementById("produtoFaceId").value = "";
        document.getElementById("produtoCameras").value = "";
        document.getElementById("produtoCaixa").value = "nao";
        document.getElementById("produtoImei").value = "";
        document.getElementById("produtoObservacoesSeminovo").value = "";
    }
}

function obterDadosSeminovo() {
    if (produtoCondicao.value !== "seminovo") return null;

    return {
        saude_bateria: Number(document.getElementById("produtoSaudeBateria").value),
        estado_estetico: document.getElementById("produtoEstadoEstetico").value,
        tela: document.getElementById("produtoTela").value,
        pecas: document.getElementById("produtoPecas").value,
        face_id: document.getElementById("produtoFaceId").value,
        cameras: document.getElementById("produtoCameras").value,
        acompanha_caixa: document.getElementById("produtoCaixa").value === "sim",
        imei: document.getElementById("produtoImei").value.trim() || null,
        observacoes: document.getElementById("produtoObservacoesSeminovo").value.trim() || null
    };
}

function preencherDadosSeminovo(dados) {
    const d = dados || {};
    document.getElementById("produtoSaudeBateria").value = d.saude_bateria ?? "";
    document.getElementById("produtoEstadoEstetico").value = d.estado_estetico || "";
    document.getElementById("produtoTela").value = d.tela || "";
    document.getElementById("produtoPecas").value = d.pecas || "";
    document.getElementById("produtoFaceId").value = d.face_id || "";
    document.getElementById("produtoCameras").value = d.cameras || "";
    document.getElementById("produtoCaixa").value = d.acompanha_caixa ? "sim" : "nao";
    document.getElementById("produtoImei").value = d.imei || "";
    document.getElementById("produtoObservacoesSeminovo").value = d.observacoes || "";
}

function validarSeminovo(dados) {
    if (!dados) return true;

    if (
        !Number.isFinite(dados.saude_bateria) ||
        dados.saude_bateria < 1 ||
        dados.saude_bateria > 100 ||
        !dados.estado_estetico ||
        !dados.tela ||
        !dados.pecas ||
        !dados.face_id ||
        !dados.cameras
    ) {
        produtoFormMensagem.textContent = "Preencha corretamente os campos obrigatórios da condição do seminovo.";
        produtoFormMensagem.classList.add("erro");
        return false;
    }

    if (dados.imei && !/^\d{15}$/.test(dados.imei)) {
        produtoFormMensagem.textContent = "O IMEI deve conter exatamente 15 números ou ficar em branco.";
        produtoFormMensagem.classList.add("erro");
        return false;
    }

    return true;
}

function preencherParcelas() {
    // Parcelamento removido do cadastro. A simulação é feita pelo WhatsApp.
}


function proximoCodigoProduto() {
    const numeros = produtosCarregados
        .map((produto) => {
            const match = String(produto.codigo || "").match(/^LD-(\d+)$/i);
            return match ? Number(match[1]) : 0;
        })
        .filter((numero) => Number.isFinite(numero));

    const maior = numeros.length ? Math.max(...numeros) : 0;
    return `LD-${String(maior + 1).padStart(3, "0")}`;
}

function abrirModalProduto(id = null) {
    formProduto.reset();
    produtoFormMensagem.textContent = "";
    produtoFormMensagem.className = "produto-form-mensagem";
    document.getElementById("produtoId").value = "";
    document.getElementById("produtoDisponivel").checked = true;
    document.getElementById("produtoDestaque").checked = false;
    document.getElementById("produtoTipoDestaque").value = "nenhum";
    document.getElementById("produtoCondicao").value = "lacrado";
    produtoEstoque.value = "0";
    document.getElementById("produtoCodigo").value = id ? "" : proximoCodigoProduto();
    document.getElementById("produtoCodigo").readOnly = true;
    limparEstadoFotosProduto();
    preencherDadosSeminovo(null);
    atualizarCamposSeminovo();
    document.getElementById("tituloModalProduto").textContent = id ? "Editar produto" : "Novo produto";

    if (id) {
        const produto = produtosCarregados.find((p) => Number(p.id) === Number(id));
        if (!produto) return;
        document.getElementById("produtoId").value = produto.id;
        document.getElementById("produtoCodigo").value = produto.codigo || "";
        document.getElementById("produtoNome").value = produto.nome || "";
        document.getElementById("produtoCategoria").value = produto.categoria || "iphone";
        document.getElementById("produtoCondicao").value = produto.condicao || "lacrado";
        produtoEstoque.value = produto.condicao === "seminovo" ? "1" : String(estoqueFisicoProduto(produto));
        document.getElementById("produtoArmazenamento").value = produto.armazenamento || "";
        document.getElementById("produtoCor").value = produto.cor || "";
        document.getElementById("produtoPreco").value = produto.preco ?? "";
        document.getElementById("produtoTipoDestaque").value = produto.tipo_destaque || "nenhum";
        document.getElementById("produtoDisponivel").checked = produto.disponivel !== false;
        document.getElementById("produtoDestaque").checked = produto.destaque === true;
        fotosProdutoAtuais = Array.isArray(produto.produto_fotos)
            ? [...produto.produto_fotos].sort((a, b) =>
                Number(b.principal) - Number(a.principal) ||
                Number(a.ordem || 0) - Number(b.ordem || 0)
            )
            : [];
        fotosProdutoRemovidas = [];
        novasFotosProduto = [];
        const principalExistente = fotosProdutoAtuais.find((foto) => foto.principal) || fotosProdutoAtuais[0];
        fotoPrincipalChave = principalExistente ? chaveFotoAtual(principalExistente) : null;
        preencherDadosSeminovo(produto.dados_seminovo);
        atualizarCamposSeminovo();
        if (produto.condicao === "seminovo") preencherDadosSeminovo(produto.dados_seminovo);
    }

    modalProduto.classList.add("visivel");
    modalProduto.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-aberto");
}

function fecharModalProdutoFunc() {
    modalProduto.classList.remove("visivel");
    modalProduto.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-aberto");
}

async function salvarProduto(evento) {
    evento.preventDefault();
    const id = document.getElementById("produtoId").value;
    const destaque = document.getElementById("produtoDestaque").checked;

    const dados = {
        codigo: document.getElementById("produtoCodigo").value.trim(),
        nome: document.getElementById("produtoNome").value.trim(),
        categoria: document.getElementById("produtoCategoria").value,
        condicao: document.getElementById("produtoCondicao").value,
        armazenamento: document.getElementById("produtoArmazenamento").value.trim() || null,
        cor: document.getElementById("produtoCor").value.trim() || null,
        preco: Number(document.getElementById("produtoPreco").value),
        disponivel: document.getElementById("produtoDisponivel").checked,
        destaque,
        tipo_destaque: document.getElementById("produtoTipoDestaque").value === "nenhum"
            ? null
            : document.getElementById("produtoTipoDestaque").value,
        dados_seminovo: obterDadosSeminovo(),
        estoque: document.getElementById("produtoCondicao").value === "seminovo"
            ? 1
            : Number(produtoEstoque.value)
    };

    if (!dados.codigo || !dados.nome || !Number.isFinite(dados.preco) || dados.preco < 0) {
        produtoFormMensagem.textContent = "Preencha corretamente os campos obrigatórios.";
        produtoFormMensagem.classList.add("erro");
        return;
    }

    if (!Number.isInteger(dados.estoque) || dados.estoque < 0) {
        produtoFormMensagem.textContent = "Informe uma quantidade de estoque válida.";
        produtoFormMensagem.classList.add("erro");
        return;
    }

    if (id) {
        const produtoAtual = produtosCarregados.find((p) => Number(p.id) === Number(id));
        const reservadoAtual = estoqueReservadoProduto(produtoAtual);

        if (dados.estoque < reservadoAtual) {
            produtoFormMensagem.textContent =
                `O estoque físico não pode ser menor que o estoque reservado (${reservadoAtual}).`;
            produtoFormMensagem.classList.add("erro");
            return;
        }
    }

    if (!validarSeminovo(dados.dados_seminovo)) return;

    const btn = document.getElementById("btnSalvarProduto");
    btn.disabled = true;
    btn.textContent = "Salvando...";

    try {
        if (destaque) {
            let query = supabasePainel.from("produtos").update({ destaque: false }).eq("destaque", true);
            if (id) query = query.neq("id", Number(id));
            const { error: erroDestaque } = await query;
            if (erroDestaque) throw erroDestaque;
        }

        let resultado;
        let produtoSalvoId = id ? Number(id) : null;

        if (id) {
            resultado = await supabasePainel
                .from("produtos")
                .update(dados)
                .eq("id", Number(id))
                .select("id")
                .single();
        } else {
            resultado = await supabasePainel
                .from("produtos")
                .insert(dados)
                .select("id")
                .single();
        }

        if (resultado.error) throw resultado.error;
        produtoSalvoId = Number(resultado.data.id);

        btn.textContent = novasFotosProduto.length || fotosProdutoRemovidas.length
            ? "Salvando fotos..."
            : "Finalizando...";

        await salvarFotosProduto(produtoSalvoId, dados.codigo);

        await carregarProdutos();
        fecharModalProdutoFunc();
    } catch (erro) {
        console.error("Erro ao salvar produto:", erro);
        produtoFormMensagem.textContent = erro.message || "Não foi possível salvar o produto.";
        produtoFormMensagem.classList.add("erro");
    } finally {
        btn.disabled = false;
        btn.textContent = "Salvar produto";
    }
}

async function alternarDisponibilidadeProduto(id) {
    const produto = produtosCarregados.find((p) => Number(p.id) === Number(id));
    if (!produto) return;
    try {
        const { error } = await supabasePainel
            .from("produtos")
            .update({ disponivel: produto.disponivel === false })
            .eq("id", id);
        if (error) throw error;
        await carregarProdutos();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível alterar a disponibilidade do produto.");
    }
}

async function excluirProduto(id) {
    const produto = produtosCarregados.find((p) => Number(p.id) === Number(id));
    if (!produto) return;
    if (!confirm(`Excluir ${produto.nome} (${produto.codigo})?`)) return;

    try {
        const fotos = Array.isArray(produto.produto_fotos) ? produto.produto_fotos : [];
        const caminhos = fotos.map((foto) => foto.caminho_storage).filter(Boolean);

        if (caminhos.length) {
            const { error: storageError } = await supabasePainel.storage
                .from("produtos")
                .remove(caminhos);

            if (storageError) throw storageError;
        }

        const { error } = await supabasePainel.from("produtos").delete().eq("id", id);
        if (error) throw error;
        await carregarProdutos();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir o produto.");
    }
}

preencherParcelas();
btnNovoProduto.addEventListener("click", () => abrirModalProduto());
document.getElementById("btnNovoProdutoDashboard").addEventListener("click", () => {
    abrirPagina("produtos");
    abrirModalProduto();
});
document.getElementById("atalhoNovoProduto").addEventListener("click", () => {
    abrirPagina("produtos");
    abrirModalProduto();
});
btnAtualizarProdutos.addEventListener("click", carregarProdutos);

divulgacaoProduto?.addEventListener("change", () => {
    atualizarResumoDivulgacao();
    divulgacaoMensagem.textContent = "";
    divulgacaoMensagem.className = "divulgacao-mensagem";
});

divulgacaoFormato?.addEventListener("change", () => {
    const produto = obterProdutoDivulgacaoSelecionado();
    if (produto) montarArteDivulgacao(produto);
});

divulgacaoChamada?.addEventListener("input", () => {
    const produto = obterProdutoDivulgacaoSelecionado();
    if (produto) montarArteDivulgacao(produto);
});

divulgacaoMostrarParcelamento?.addEventListener("change", () => {
    const produto = obterProdutoDivulgacaoSelecionado();
    if (produto) montarArteDivulgacao(produto);
});

btnGerarDivulgacao?.addEventListener("click", (evento) => gerarDivulgacao(evento));
btnBaixarDivulgacao?.addEventListener("click", baixarArteDivulgacao);
btnAtualizarDivulgacao?.addEventListener("click", carregarProdutos);
buscaProdutos.addEventListener("input", renderizarProdutos);
filtroProdutos.addEventListener("change", renderizarProdutos);
produtoCondicao.addEventListener("change", atualizarCamposSeminovo);
produtoFotosInput.addEventListener("change", selecionarFotosProduto);
document.getElementById("produtoDestaque").addEventListener("change", (evento) => {
    const tipo = document.getElementById("produtoTipoDestaque");
    if (evento.target.checked && tipo.value === "nenhum") {
        tipo.value = "destaque";
    }
});
formProduto.addEventListener("submit", salvarProduto);
fecharModalProduto.addEventListener("click", fecharModalProdutoFunc);
document.getElementById("btnCancelarProduto").addEventListener("click", fecharModalProdutoFunc);
document.querySelectorAll("[data-fechar-produto]").forEach((el) => el.addEventListener("click", fecharModalProdutoFunc));


function formatarDataAcesso(data) {
    if (!data) return "—";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(new Date(data));
}

async function chamarFuncaoAcessos(acao, dados = {}) {
    const { data: sessaoData, error: sessaoError } = await supabasePainel.auth.getSession();

    if (sessaoError || !sessaoData.session) {
        throw new Error("Sua sessão expirou. Entre novamente no painel.");
    }

    const resposta = await fetch(
        `${SUPABASE_URL}/functions/v1/gerenciar-acessos-admin`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessaoData.session.access_token}`,
                "apikey": SUPABASE_PUBLISHABLE_KEY
            },
            body: JSON.stringify({
                acao,
                ...dados
            })
        }
    );

    let resultado = null;

    try {
        resultado = await resposta.json();
    } catch (erro) {
        resultado = null;
    }

    if (!resposta.ok || !resultado?.ok) {
        throw new Error(
            resultado?.erro ||
            resultado?.message ||
            "Não foi possível concluir a operação."
        );
    }

    return resultado;
}

function renderizarAcessos(usuarios) {
    if (!listaAcessos || !acessosListaMensagem) return;

    if (!Array.isArray(usuarios) || !usuarios.length) {
        listaAcessos.innerHTML = "";
        acessosListaMensagem.textContent = "Nenhum usuário cadastrado.";
        acessosListaMensagem.classList.add("visivel");
        return;
    }

    acessosListaMensagem.classList.remove("visivel");

    listaAcessos.innerHTML = usuarios.map((usuario) => `
        <article class="pedido-card">
            <div class="pedido-card-topo">
                <div>
                    <span class="pedido-referencia">
                        ${escaparHTML(usuario.nome || "Usuário")}
                    </span>
                    <small>${escaparHTML(usuario.email || "Sem e-mail")}</small>
                </div>
                <span class="status-badge status-concluido">ATIVO</span>
            </div>

            <div class="pedido-card-grid">
                <div>
                    <small>Cadastrado em</small>
                    <strong>${escaparHTML(formatarDataAcesso(usuario.criado_em))}</strong>
                </div>

                <div>
                    <small>Último acesso</small>
                    <strong>${escaparHTML(formatarDataAcesso(usuario.ultimo_acesso))}</strong>
                </div>
            </div>
        </article>
    `).join("");
}

async function carregarAcessos() {
    if (!listaAcessos || !acessosListaMensagem) return;

    acessosListaMensagem.textContent = "Carregando usuários...";
    acessosListaMensagem.classList.add("visivel");

    if (btnAtualizarAcessos) {
        btnAtualizarAcessos.disabled = true;
        btnAtualizarAcessos.textContent = "Atualizando...";
    }

    try {
        const resultado = await chamarFuncaoAcessos("listar");
        renderizarAcessos(resultado.usuarios || []);
    } catch (erro) {
        console.error("Erro ao carregar acessos:", erro);
        listaAcessos.innerHTML = "";
        acessosListaMensagem.textContent =
            erro?.message || "Não foi possível carregar os usuários.";
        acessosListaMensagem.classList.add("visivel");
    } finally {
        if (btnAtualizarAcessos) {
            btnAtualizarAcessos.disabled = false;
            btnAtualizarAcessos.textContent = "↻ Atualizar";
        }
    }
}

async function criarNovoAcesso(evento) {
    evento.preventDefault();

    const nome = acessoNome.value.trim();
    const email = acessoEmail.value.trim().toLowerCase();
    const senha = acessoSenha.value;
    const confirmarSenha = acessoConfirmarSenha.value;

    acessosMensagem.textContent = "";
    acessosMensagem.className = "produto-form-mensagem";

    if (!nome || !email || !senha || !confirmarSenha) {
        acessosMensagem.textContent = "Preencha todos os campos.";
        acessosMensagem.classList.add("erro");
        return;
    }

    if (senha.length < 6) {
        acessosMensagem.textContent = "A senha deve ter pelo menos 6 caracteres.";
        acessosMensagem.classList.add("erro");
        return;
    }

    if (senha !== confirmarSenha) {
        acessosMensagem.textContent = "As senhas não coincidem.";
        acessosMensagem.classList.add("erro");
        return;
    }

    const confirmar = window.confirm(
        `Criar acesso administrativo para ${nome} (${email})?`
    );

    if (!confirmar) return;

    btnCriarAcesso.disabled = true;
    btnCriarAcesso.textContent = "Criando acesso...";

    try {
        await chamarFuncaoAcessos("criar", {
            nome,
            email,
            senha
        });

        formNovoAcesso.reset();
        acessosMensagem.textContent = "Acesso criado com sucesso.";
        acessosMensagem.classList.add("sucesso");

        await carregarAcessos();
    } catch (erro) {
        console.error("Erro ao criar acesso:", erro);
        acessosMensagem.textContent =
            erro?.message || "Não foi possível criar o acesso.";
        acessosMensagem.classList.add("erro");
    } finally {
        btnCriarAcesso.disabled = false;
        btnCriarAcesso.textContent = "Criar acesso";
    }
}

formNovoAcesso?.addEventListener("submit", criarNovoAcesso);
btnAtualizarAcessos?.addEventListener("click", carregarAcessos);



function atualizarSaudacaoPainel() {
    const saudacao = document.getElementById("saudacao");
    if (!saudacao) return;

    const hora = new Date().getHours();

    let cumprimento = "Bom dia";

    if (hora >= 12 && hora < 18) {
        cumprimento = "Boa tarde";
    } else if (hora >= 18) {
        cumprimento = "Boa noite";
    }

    saudacao.textContent = `${cumprimento}! 👋`;
}

atualizarSaudacaoPainel();

async function protegerPainel() {
    try {
        const { data, error } = await supabasePainel.auth.getSession();

        if (error || !data.session) {
            window.location.href = "login.html";
            return;
        }

        await Promise.all([carregarPedidos(), carregarProdutos(), carregarAcessos()]);
    } catch (erro) {
        console.error("Erro ao validar sessão:", erro);
        window.location.href = "login.html";
    }
}

protegerPainel();
