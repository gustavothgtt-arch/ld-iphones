const SUPABASE_URL = "https://dhzeqztrgxtlhhrjkvcn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_FqxwVSf7JXSR--WiC39I8A_nQJrO9Ek";

const supabaseAdmin = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const formLogin = document.getElementById("formLogin");
const loginEmail = document.getElementById("loginEmail");
const loginSenha = document.getElementById("loginSenha");
const loginMensagem = document.getElementById("loginMensagem");
const btnLogin = document.getElementById("btnLogin");
const alternarSenha = document.getElementById("alternarSenha");

alternarSenha.addEventListener("click", () => {
    const mostrando = loginSenha.type === "text";
    loginSenha.type = mostrando ? "password" : "text";
    alternarSenha.textContent = mostrando ? "Mostrar" : "Ocultar";
});

formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    loginMensagem.textContent = "";
    loginMensagem.classList.remove("sucesso");
    btnLogin.disabled = true;
    btnLogin.textContent = "Entrando...";

    try {
        const { error } = await supabaseAdmin.auth.signInWithPassword({
            email: loginEmail.value.trim(),
            password: loginSenha.value
        });

        if (error) throw error;

        loginMensagem.textContent = "Acesso autorizado.";
        loginMensagem.classList.add("sucesso");
        window.location.href = "painel.html";
    } catch (erro) {
        console.error("Erro ao entrar:", erro);
        loginMensagem.textContent =
            "Não foi possível entrar. Confira o e-mail e a senha.";
    } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = "Entrar no painel";
    }
});

(async function verificarSessaoExistente() {
    try {
        const { data, error } = await supabaseAdmin.auth.getSession();
        if (error) throw error;

        if (data.session) {
            window.location.href = "painel.html";
        }
    } catch (erro) {
        console.error("Erro ao verificar sessão:", erro);
    }
})();
