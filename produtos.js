const SUPABASE_URL_LOJA = "https://dhzeqztrgxtlhhrjkvcn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY_LOJA = "sb_publishable_FqxwVSf7JXSR--WiC39I8A_nQJrO9Ek";

let produtos = [];

function normalizarProdutoSupabase(produto) {
    const registrosFotos = Array.isArray(produto.produto_fotos)
        ? [...produto.produto_fotos]
        : [];

    registrosFotos.sort((a, b) => {
        if (a.principal === true && b.principal !== true) return -1;
        if (a.principal !== true && b.principal === true) return 1;
        return Number(a.ordem || 0) - Number(b.ordem || 0);
    });

    const estoque = Math.max(0, Number(produto.estoque || 0));
    const estoqueReservado = Math.max(0, Number(produto.estoque_reservado || 0));
    const estoqueDisponivel = Math.max(0, estoque - estoqueReservado);

    return {
        id: Number(produto.id),
        codigo: produto.codigo,
        nome: produto.nome,
        categoria: produto.categoria,
        condicao: produto.condicao,
        armazenamento: produto.armazenamento || "",
        cor: produto.cor || "",
        preco: Number(produto.preco || 0),
        parcelas: Number(produto.parcelas || 1),
        fotos: registrosFotos.map((foto) => foto.url).filter(Boolean),

        // Controle de estoque
        estoque: estoque,
        estoqueReservado: estoqueReservado,
        estoque_reservado: estoqueReservado,
        estoqueDisponivel: estoqueDisponivel,
        estoque_disponivel: estoqueDisponivel,

        // O produto precisa estar marcado como disponível e possuir estoque livre.
        disponivel: produto.disponivel !== false && estoqueDisponivel > 0,

        destaque: produto.destaque === true,
        tipoDestaque: produto.tipo_destaque || "nenhum",
        dadosSeminovo: produto.dados_seminovo || null
    };
}

async function carregarProdutosSupabase() {
    const select = encodeURIComponent(
        "*,produto_fotos(id,url,caminho_storage,principal,ordem)"
    );

    const resposta = await fetch(
        `${SUPABASE_URL_LOJA}/rest/v1/produtos?select=${select}&order=id.asc`,
        {
            headers: {
                apikey: SUPABASE_PUBLISHABLE_KEY_LOJA,
                Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY_LOJA}`
            }
        }
    );

    if (!resposta.ok) {
        const detalhe = await resposta.text();
        throw new Error(`Erro ao carregar produtos: ${resposta.status} ${detalhe}`);
    }

    const dados = await resposta.json();
    produtos = (dados || []).map(normalizarProdutoSupabase);
    return produtos;
}

async function buscarProdutoSupabase(id) {
    const select = encodeURIComponent(
        "*,produto_fotos(id,url,caminho_storage,principal,ordem)"
    );

    const resposta = await fetch(
        `${SUPABASE_URL_LOJA}/rest/v1/produtos?select=${select}&id=eq.${encodeURIComponent(id)}&limit=1`,
        {
            headers: {
                apikey: SUPABASE_PUBLISHABLE_KEY_LOJA,
                Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY_LOJA}`
            }
        }
    );

    if (!resposta.ok) {
        const detalhe = await resposta.text();
        throw new Error(`Erro ao carregar produto: ${resposta.status} ${detalhe}`);
    }

    const dados = await resposta.json();
    if (!dados.length) return null;

    const produto = normalizarProdutoSupabase(dados[0]);

    const indice = produtos.findIndex(
        (item) => Number(item.id) === Number(produto.id)
    );

    if (indice >= 0) {
        produtos[indice] = produto;
    } else {
        produtos.push(produto);
    }

    return produto;
}
