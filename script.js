/* =========================================================
   CONFIGURAÇÃO DO FIREBASE
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyDIQ8JtxKJrsZQedoVUig5bUmxc6u3wvAQ",
  authDomain: "my-project-slide-6d2cd.firebaseapp.com",
  projectId: "my-project-slide-6d2cd",
  storageBucket: "my-project-slide-6d2cd.firebasestorage.app",
  messagingSenderId: "722407689614",
  appId: "1:722407689614:web:97f7a947dac7a1648fe8df",
  measurementId: "G-8L6RL89M41"
};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


/* =========================================================
   ESTADO
========================================================= */

let currentUser = null;

let allSongs = [];

let filteredSongs = [];

let localSongs = [];

let activeSongId = null;

let currentFilter = "Todos";

let unsubscribeSongs = null;

let currentSongIndex = 0;

let currentSlideIndex = 0;

let pendingSong = null;


/* =========================================================
   ELEMENTOS
========================================================= */

const appScreen =
  document.getElementById("appScreen");

const userEmailDisplay =
  document.getElementById("userEmailDisplay");

const logoutBtn =
  document.getElementById("logoutBtn");

const songTitleInput =
  document.getElementById("songTitleInput");

const songCategorySelect =
  document.getElementById("songCategorySelect");

const songLyricsInput =
  document.getElementById("songLyricsInput");

const versesSelect =
  document.getElementById("versesPerSlide");

const addSongBtn =
  document.getElementById("addSongBtn");

const playlist =
  document.getElementById("playlist");

const songCount =
  document.getElementById("songCount");

const slidesOutput =
  document.getElementById("slidesOutput");

const selectedSongTitle =
  document.getElementById("selectedSongTitle");

const selectedSongSubtitle =
  document.getElementById("selectedSongSubtitle");

const startPresentationBtn =
  document.getElementById("startPresentationBtn");


/* =========================================================
   ELEMENTOS DO LOGIN
========================================================= */

const authModal =
  document.getElementById("authModal");

const authForm =
  document.getElementById("authForm");

const emailInput =
  document.getElementById("emailInput");

const passwordInput =
  document.getElementById("passwordInput");

const togglePasswordBtn =
  document.getElementById("togglePasswordBtn");

const loginBtn =
  document.getElementById("loginBtn");

const registerBtn =
  document.getElementById("registerBtn");

const closeAuthBtn =
  document.getElementById("closeAuthBtn");

const authError =
  document.getElementById("authError");


/* =========================================================
   ELEMENTOS DA APRESENTAÇÃO
========================================================= */

const presentationModal =
  document.getElementById("presentationModal");

const presentationText =
  document.getElementById("presentationText");

const currentSongBadge =
  document.getElementById("currentSongBadge");

const currentSongTitle =
  document.getElementById("currentSongTitle");

const slideCounter =
  document.getElementById("slideCounter");

const closePresentBtn =
  document.getElementById("closePresentBtn");

const prevSlideBtn =
  document.getElementById("prevSlideBtn");

const nextSlideBtn =
  document.getElementById("nextSlideBtn");


/* =========================================================
   UTILIDADES
========================================================= */

function criarIdLocal() {

  return "local_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 9);

}


function salvarLocalmente() {

  localStorage.setItem(
    "missaSlidesLocalSongs",
    JSON.stringify(localSongs)
  );

}


function carregarMusicasLocais() {

  try {

    const saved =
      localStorage.getItem(
        "missaSlidesLocalSongs"
      );

    localSongs =
      saved
        ? JSON.parse(saved)
        : [];

  }

  catch (error) {

    console.error(error);

    localSongs = [];

  }

}


function mostrarErro(mensagem) {

  if (authError) {

    authError.textContent =
      mensagem;

  }

}


function limparErro() {

  if (authError) {

    authError.textContent =
      "";

  }

}


/* =========================================================
   MODAL DE LOGIN
========================================================= */

function abrirAuthModal() {

  limparErro();

  authModal.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";

}


function fecharAuthModal() {

  authModal.classList.add(
    "hidden"
  );

  document.body.style.overflow =
    "";

  limparErro();

}


/* =========================================================
   SENHA
========================================================= */

togglePasswordBtn.addEventListener(
  "click",
  () => {

    const mostrando =
      passwordInput.type === "text";

    passwordInput.type =
      mostrando
        ? "password"
        : "text";

    togglePasswordBtn.textContent =
      mostrando
        ? "👁️"
        : "🙈";

  }
);


/* =========================================================
   FECHAR LOGIN
========================================================= */

closeAuthBtn.addEventListener(
  "click",
  () => {

    pendingSong = null;

    fecharAuthModal();

  }
);


/* =========================================================
   CLIQUE FORA DO MODAL
========================================================= */

authModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target === authModal
    ) {

      pendingSong = null;

      fecharAuthModal();

    }

  }
);


/* =========================================================
   LOGIN
========================================================= */

authForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    await fazerLogin();

  }
);


loginBtn.addEventListener(
  "click",
  async (event) => {

    event.preventDefault();

    await fazerLogin();

  }
);


async function fazerLogin() {

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

  limparErro();


  if (!email || !password) {

    mostrarErro(
      "Preencha o e-mail e a senha."
    );

    return;

  }


  loginBtn.disabled =
    true;

  loginBtn.textContent =
    "Entrando...";


  try {

    await auth
      .signInWithEmailAndPassword(
        email,
        password
      );


    fecharAuthModal();

    await continuarSalvamentoPendente();

  }

  catch (error) {

    console.error(error);

    mostrarErro(
      traduzirErroFirebase(error)
    );

  }

  finally {

    loginBtn.disabled =
      false;

    loginBtn.textContent =
      "Entrar";

  }

}


/* =========================================================
   CRIAR CONTA
========================================================= */

registerBtn.addEventListener(
  "click",
  async () => {

    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value;

    limparErro();


    if (!email || !password) {

      mostrarErro(
        "Preencha o e-mail e a senha."
      );

      return;

    }


    if (password.length < 6) {

      mostrarErro(
        "A senha deve ter no mínimo 6 caracteres."
      );

      return;

    }


    registerBtn.disabled =
      true;

    registerBtn.textContent =
      "Criando...";


    try {

      await auth
        .createUserWithEmailAndPassword(
          email,
          password
        );


      fecharAuthModal();

      alert(
        "Conta criada com sucesso!"
      );


      await continuarSalvamentoPendente();

    }

    catch (error) {

      console.error(error);

      mostrarErro(
        traduzirErroFirebase(error)
      );

    }

    finally {

      registerBtn.disabled =
        false;

      registerBtn.textContent =
        "Criar Conta";

    }

  }
);


/* =========================================================
   TRADUZIR ERROS
========================================================= */

function traduzirErroFirebase(error) {

  const codigo =
    error.code || "";


  const mensagens = {

    "auth/invalid-email":
      "Digite um e-mail válido.",

    "auth/invalid-credential":
      "E-mail ou senha incorretos.",

    "auth/wrong-password":
      "E-mail ou senha incorretos.",

    "auth/user-not-found":
      "E-mail ou senha incorretos.",

    "auth/email-already-in-use":
      "Este e-mail já está cadastrado. Tente entrar.",

    "auth/weak-password":
      "A senha deve ter pelo menos 6 caracteres.",

    "auth/network-request-failed":
      "Problema de conexão com a internet.",

    "auth/too-many-requests":
      "Muitas tentativas. Aguarde um pouco.",

    "auth/operation-not-allowed":
      "O login por e-mail não está ativado no Firebase.",

    "permission-denied":
      "Você não tem permissão para acessar esses dados."

  };


  return mensagens[codigo] ||
    error.message ||
    "Ocorreu um erro.";

}


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn.addEventListener(
  "click",
  async () => {

    try {

      await auth.signOut();

    }

    catch (error) {

      console.error(error);

    }

  }
);


/* =========================================================
   AUTENTICAÇÃO
========================================================= */

auth.onAuthStateChanged(
  (user) => {

    currentUser =
      user || null;


    if (user) {

      userEmailDisplay.textContent =
        user.email || "Usuário";

      logoutBtn.classList.remove(
        "hidden"
      );

      carregarMusicasDaNuvem();

    }

    else {

      userEmailDisplay.textContent =
        "Visitante";

      logoutBtn.classList.add(
        "hidden"
      );


      if (unsubscribeSongs) {

        unsubscribeSongs();

        unsubscribeSongs =
          null;

      }


      allSongs = [];

      combinarMusicas();

    }

  }
);


/* =========================================================
   CARREGAR MÚSICAS LOCAIS
========================================================= */

carregarMusicasLocais();

combinarMusicas();


/* =========================================================
   CARREGAR MÚSICAS DA NUVEM
========================================================= */

function carregarMusicasDaNuvem() {

  if (!currentUser) return;


  if (unsubscribeSongs) {

    unsubscribeSongs();

  }


  unsubscribeSongs =
    db
      .collection("songs")
      .where(
        "userId",
        "==",
        currentUser.uid
      )
      .onSnapshot(

        (snapshot) => {

          allSongs =
            snapshot.docs.map(
              (doc) => ({

                id:
                  doc.id,

                ...doc.data(),

                cloud:
                  true

              })
            );


          allSongs.sort(
            ordenarMusicas
          );


          combinarMusicas();

        },

        (error) => {

          console.error(
            "Erro Firestore:",
            error
          );


          alert(
            "Não foi possível carregar as músicas da nuvem:\n\n" +
            traduzirErroFirebase(error)
          );

        }

      );

}


/* =========================================================
   COMBINAR LOCAL + NUVEM
========================================================= */

function combinarMusicas() {

  let musicas = [];


  if (currentUser) {

    musicas =
      [
        ...allSongs,
        ...localSongs
      ];

  }

  else {

    musicas =
      [
        ...localSongs
      ];

  }


  musicas.sort(
    ordenarMusicas
  );


  filteredSongs =
    musicas.filter(
      aplicarFiltroNaMusica
    );


  renderPlaylist();


  if (
    activeSongId &&
    musicas.some(
      song =>
        song.id ===
        activeSongId
    )
  ) {

    selecionarSemRender(
      activeSongId
    );

  }

}


/* =========================================================
   ORDENAÇÃO
========================================================= */

function ordenarMusicas(a, b) {

  const dataA =
    obterDataMusica(a);

  const dataB =
    obterDataMusica(b);

  return dataB - dataA;

}


function obterDataMusica(song) {

  if (
    song.createdAt &&
    typeof song.createdAt.toMillis ===
      "function"
  ) {

    return song.createdAt.toMillis();

  }


  if (
    typeof song.createdAt ===
    "number"
  ) {

    return song.createdAt;

  }


  return 0;

}


/* =========================================================
   FILTROS
========================================================= */

const filterChips =
  document.querySelectorAll(
    ".chip"
  );


filterChips.forEach(
  (chip) => {

    chip.addEventListener(
      "click",
      () => {

        filterChips.forEach(
          (item) => {

            item.classList.remove(
              "active"
            );

          }
        );


        chip.classList.add(
          "active"
        );


        currentFilter =
          chip.dataset.category;


        combinarMusicas();

      }
    );

  }
);


function aplicarFiltroNaMusica(song) {

  if (
    currentFilter ===
    "Todos"
  ) {

    return true;

  }


  return (
    song.category ===
    currentFilter
  );

}


/* =========================================================
   RENDERIZAR PLAYLIST
========================================================= */

function renderPlaylist() {

  playlist.innerHTML =
    "";

  songCount.textContent =
    filteredSongs.length;


  if (
    filteredSongs.length ===
    0
  ) {

    const item =
      document.createElement(
        "li"
      );

    item.className =
      "playlist-empty";

    item.textContent =
      currentFilter === "Todos"
        ? "Nenhuma música cadastrada."
        : "Nenhuma música neste momento.";

    playlist.appendChild(
      item
    );


    startPresentationBtn.disabled =
      true;

    return;

  }


  filteredSongs.forEach(
    (song) => {

      const li =
        document.createElement(
          "li"
        );

      li.className =
        "playlist-item";


      if (
        song.id ===
        activeSongId
      ) {

        li.classList.add(
          "active"
        );

      }


      const main =
        document.createElement(
          "div"
        );

      main.className =
        "playlist-main";


      const title =
        document.createElement(
          "span"
        );

      title.className =
        "playlist-item-title";

      title.textContent =
        song.title;


      const tag =
        document.createElement(
          "span"
        );

      tag.className =
        "playlist-item-tag";

      tag.textContent =
        song.category;


      main.appendChild(
        title
      );

      main.appendChild(
        tag
      );


      const deleteBtn =
        document.createElement(
          "button"
        );

      deleteBtn.className =
        "icon-btn";

      deleteBtn.type =
        "button";

      deleteBtn.textContent =
        "🗑️";

      deleteBtn.title =
        "Excluir música";


      deleteBtn.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          excluirMusica(
            song
          );

        }
      );


      li.appendChild(
        main
      );

      li.appendChild(
        deleteBtn
      );


      li.addEventListener(
        "click",
        () => {

          selecionarMusica(
            song.id
          );

        }
      );


      playlist.appendChild(
        li
      );

    }
  );


  startPresentationBtn.disabled =
    false;

}


/* =========================================================
   SELECIONAR MÚSICA
========================================================= */

function selecionarMusica(songId) {

  activeSongId =
    songId;


  selecionarSemRender(
    songId
  );


  renderPlaylist();

}


function selecionarSemRender(songId) {

  const song =
    encontrarMusica(
      songId
    );


  if (!song) return;


  activeSongId =
    songId;


  selectedSongTitle.textContent =
    song.title;


  selectedSongSubtitle.textContent =
    `${song.category} • ${
      song.slides?.length || 0
    } slides`;


  renderSlides(
    song
  );

}


/* =========================================================
   ENCONTRAR MÚSICA
========================================================= */

function encontrarMusica(songId) {

  const todas = [
    ...allSongs,
    ...localSongs
  ];


  return todas.find(
    song =>
      song.id ===
      songId
  );

}


/* =========================================================
   RENDERIZAR SLIDES
========================================================= */

function renderSlides(song) {

  slidesOutput.innerHTML =
    "";


  if (
    !song.slides ||
    song.slides.length ===
      0
  ) {

    slidesOutput.innerHTML = `

      <div class="empty-state">

        <span>⚠️</span>

        <h3>
          Esta música não possui slides
        </h3>

        <p>
          Cadastre a letra novamente.
        </p>

      </div>

    `;

    return;

  }


  song.slides.forEach(
    (slide, index) => {

      const box =
        document.createElement(
          "div"
        );

      box.className =
        "slide-box";


      const header =
        document.createElement(
          "div"
        );

      header.className =
        "slide-header";

      header.textContent =
        SLIDE ${index + 1};


      const content =
        document.createElement(
          "div"
        );

      content.className =
        "slide-content";

      content.textContent =
        slide;


      box.appendChild(
        header
      );

      box.appendChild(
        content
      );


      slidesOutput.appendChild(
        box
      );

    }
  );

}


/* =========================================================
   SALVAR MÚSICA
========================================================= */

addSongBtn.addEventListener(
  "click",
  async () => {

    const title =
      songTitleInput.value.trim();

    const category =
      songCategorySelect.value;

    const lyrics =
      songLyricsInput.value.trim();

    const versesPerSlide =
      parseInt(
        versesSelect.value,
        10
      );


    if (!title) {

      alert(
        "Digite o título da música."
      );

      songTitleInput.focus();

      return;

    }


    if (!lyrics) {

      alert(
        "Cole a letra da música."
      );

      songLyricsInput.focus();

      return;

    }


    const lines =
      lyrics
        .split(/\r?\n/)
        .map(
          line =>
            line.trim()
        )
        .filter(
          line =>
            line.length > 0
        );


    if (
      lines.length === 0
    ) {

      alert(
        "Digite a letra da música."
      );

      return;

    }


    const slides = [];


    for (
      let i = 0;
      i < lines.length;
      i += versesPerSlide
    ) {

      slides.push(
        lines
          .slice(
            i,
            i + versesPerSlide
          )
          .join("\n")
      );

    }


    const song = {

      title:
        title,

      category:
        category,

      slides:
        slides,

      createdAt:
        Date.now()

    };


    /*
      Se já estiver logado,
      salva diretamente na nuvem.
    */

    if (currentUser) {

      await salvarNaNuvem(
        song
      );

      return;

    }


    /*
      Se não estiver logado,
      guarda temporariamente e
      abre o login.
    */

    pendingSong =
      so
