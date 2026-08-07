/* =========================================================
   CONFIGURAÇÃO DO FIREBASE
=========================================================

   COLOQUE AQUI OS DADOS DO SEU PROJETO FIREBASE.

   No Firebase:
   Configurações do projeto
   → Seus aplicativos
   → Aplicativo da Web
   → Configuração do SDK

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
   INICIALIZAÇÃO DO FIREBASE
========================================================= */

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


/* =========================================================
   ESTADO DA APLICAÇÃO
========================================================= */

let currentUser = null;
let allSongs = [];
let filteredSongs = [];
let activeSongId = null;
let currentFilter = "Todos";
let unsubscribeSongs = null;


/* =========================================================
   ESTADO DA APRESENTAÇÃO
========================================================= */

let currentSongIndex = 0;
let currentSlideIndex = 0;


/* =========================================================
   ELEMENTOS DO HTML
========================================================= */

const authScreen =
  document.getElementById("authScreen");

const appScreen =
  document.getElementById("appScreen");

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

const authError =
  document.getElementById("authError");

const userEmailDisplay =
  document.getElementById("userEmailDisplay");

const logoutBtn =
  document.getElementById("logoutBtn");


/* =========================================================
   ELEMENTOS DAS MÚSICAS
========================================================= */

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
   MOSTRAR / OCULTAR SENHA
========================================================= */

togglePasswordBtn.addEventListener("click", () => {

  const isPassword =
    passwordInput.type === "password";

  passwordInput.type =
    isPassword ? "text" : "password";

  togglePasswordBtn.textContent =
    isPassword ? "🙈" : "👁️";

});


/* =========================================================
   LOGIN COM ENTER
========================================================= */

authForm.addEventListener("submit", (event) => {

  event.preventDefault();

  fazerLogin();

});


/* =========================================================
   LOGIN
========================================================= */

loginBtn.addEventListener("click", (event) => {

  event.preventDefault();

  fazerLogin();

});


function fazerLogin() {

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

  authError.textContent = "";


  if (!email || !password) {

    authError.textContent =
      "Preencha o e-mail e a senha.";

    return;

  }


  loginBtn.disabled = true;

  loginBtn.textContent =
    "Entrando...";


  auth.signInWithEmailAndPassword(
    email,
    password
  )

  .catch((error) => {

    console.error(error);

    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-credential"
    ) {

      authError.textContent =
        "E-mail ou senha incorretos.";

    }

    else if (
      error.code === "auth/invalid-email"
    ) {

      authError.textContent =
        "Digite um e-mail válido.";

    }

    else {

      authError.textContent =
        "Erro ao entrar: " +
        traduzirErroFirebase(error);

    }

  })

  .finally(() => {

    loginBtn.disabled = false;

    loginBtn.textContent =
      "Entrar";

  });

}


/* =========================================================
   CRIAR CONTA
========================================================= */

registerBtn.addEventListener("click", () => {

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

  authError.textContent = "";


  if (!email || !password) {

    authError.textContent =
      "Preencha o e-mail e a senha.";

    return;

  }


  if (password.length < 6) {

    authError.textContent =
      "A senha deve ter no mínimo 6 caracteres.";

    return;

  }


  registerBtn.disabled = true;

  registerBtn.textContent =
    "Criando...";


  auth.createUserWithEmailAndPassword(
    email,
    password
  )

  .then(() => {

    alert(
      "Conta criada com sucesso!"
    );

  })

  .catch((error) => {

    console.error(error);

    if (
      error.code ===
      "auth/email-already-in-use"
    ) {

      authError.textContent =
        "Este e-mail já está cadastrado.";

    }

    else if (
      error.code ===
      "auth/invalid-email"
    ) {

      authError.textContent =
        "Digite um e-mail válido.";

    }

    else {

      authError.textContent =
        "Erro ao cadastrar: " +
        traduzirErroFirebase(error);

    }

  })

  .finally(() => {

    registerBtn.disabled = false;

    registerBtn.textContent =
      "Criar Conta";

  });

});


/* =========================================================
   TRADUZIR ERROS DO FIREBASE
========================================================= */

function traduzirErroFirebase(error) {

  const codigo =
    error.code || "";

  const mensagens = {

    "auth/network-request-failed":
      "Verifique sua conexão com a internet.",

    "auth/too-many-requests":
      "Muitas tentativas. Aguarde um pouco.",

    "auth/weak-password":
      "A senha é muito fraca.",

    "auth/operation-not-allowed":
      "O login por e-mail/senha não está habilitado no Firebase.",

    "permission-denied":
      "Você não tem permissão para acessar esses dados."

  };


  return mensagens[codigo] ||
    error.message ||
    "Erro desconhecido.";

}


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn.addEventListener(
  "click",
  () => {

    auth.signOut();

  }
);


/* =========================================================
   MONITOR DE AUTENTICAÇÃO
========================================================= */

auth.onAuthStateChanged((user) => {

  if (user) {

    currentUser = user;

    userEmailDisplay.textContent =
      user.email || "Usuário";

    authScreen.classList.add(
      "hidden"
    );

    appScreen.classList.remove(
      "hidden"
    );

    loadUserSongs();

  }

  else {

    currentUser = null;

    allSongs = [];

    filteredSongs = [];

    activeSongId = null;

    authScreen.classList.remove(
      "hidden"
    );

    appScreen.classList.add(
      "hidden"
    );


    if (unsubscribeSongs) {

      unsubscribeSongs();

      unsubscribeSongs = null;

    }

  }

});


/* =========================================================
   SALVAR MÚSICA
========================================================= */

addSongBtn.addEventListener(
  "click",
  async () => {

    if (!currentUser) {

      alert(
        "Você precisa estar logado."
      );

      return;

    }


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


    /* TRANSFORMA A LETRA EM VERSOS */

    const lines =
      lyrics
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(
          line => line.length > 0
        );


    if (lines.length === 0) {

      alert(
        "A letra não possui versos válidos."
      );

      return;

    }


    /* CRIA OS SLIDES */

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


    const newSong = {

      userId:
        currentUser.uid,

      title:
        title,

      category:
        category,

      slides:
        slides,

      createdAt:
        firebase.firestore.FieldValue
          .serverTimestamp()

    };


    try {

      addSongBtn.disabled = true;

      addSongBtn.textContent =
        "☁️ Salvando...";


      const docRef =
        await db
          .collection("songs")
          .add(newSong);


      songTitleInput.value = "";

      songLyricsInput.value = "";

      activeSongId =
        docRef.id;


      alert(
        "Música salva com sucesso!"
      );


    }

    catch (error) {

      console.error(error);

      alert(
        "Erro ao salvar música:\n\n" +
        traduzirErroFirebase(error)
      );

    }

    finally {

      addSongBtn.disabled = false;

      addSongBtn.textContent =
        "☁️ Salvar Música";

    }

  }
);


/* =========================================================
   CARREGAR MÚSICAS DO USUÁRIO
========================================================= */

function loadUserSongs() {

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
              doc => ({

                id: doc.id,

                ...doc.data()

              })
            );


          /* ORDENA POR DATA */

          allSongs.sort(
            (a, b) => {

              const dateA =
                a.createdAt?.toMillis?.() ||
                0;

              const dateB =
                b.createdAt?.toMillis?.() ||
                0;

              return dateB - dateA;

            }
          );


          applyFilter();

        },

        (error) => {

          console.error(error);

          alert(
            "Erro ao carregar suas músicas:\n\n" +
            traduzirErroFirebase(error)
          );

        }

      );

}


/* =========================================================
   FILTROS
========================================================= */

const filterChips =
  document.querySelectorAll(
    ".chip"
  );


filterChips.forEach(
  chip => {

    chip.addEventListener(
      "click",
      () => {

        filterChips.forEach(
          item => {

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


        applyFilter();

      }
    );

  }
);


/* =========================================================
   APLICAR FILTRO
========================================================= */

function applyFilter() {

  if (
    currentFilter === "Todos"
  ) {

    filteredSongs =
      [...allSongs];

  }

  else {

    filteredSongs =
      allSongs.filter(
        song =>
          song.category ===
          currentFilter
      );

  }


  renderPlaylist();

}


/* =========================================================
   MOSTRAR PLAYLIST
========================================================= */

function renderPlaylist() {

  playlist.innerHTML = "";

  songCount.textContent =
    filteredSongs.length;


  if (
    filteredSongs.length === 0
  ) {

    const empty =
      document.createElement(
        "li"
      );

    empty.className =
      "playlist-empty";

    empty.textContent =
      currentFilter === "Todos"
        ? "Nenhuma música cadastrada."
        : "Nenhuma música neste momento.";

    playlist.appendChild(
      empty
    );


    startPresentationBtn.disabled =
      true;

    return;

  }


  filteredSongs.forEach(
    song => {

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


      /* BOTÃO EXCLUIR */

      const deleteBtn =
        document.createElement(
          "button"
        );

      deleteBtn.className =
        "icon-btn";

      deleteBtn.type =
        "button";

      deleteBtn.title =
        "Excluir música";

      deleteBtn.textContent =
        "🗑️";


      deleteBtn.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          deleteSong(song);

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

          selectSong(
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
    filteredSongs.length === 0;

}


/* =========================================================
   SELECIONAR MÚSICA
========================================================= */

function selectSong(songId) {

  const song =
    allSongs.find(
      item =>
        item.id === songId
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


  renderSlides(song);

  renderPlaylist();

}


/* =========================================================
   MOSTRAR SLIDES
========================================================= */

function renderSlides(song) {

  slidesOutput.innerHTML =
    "";


  if (
    !song.slides ||
    song.slides.length === 0
  ) {

    slidesOutput.innerHTML = `

      <div class="empty-state">

        <span class="empty-icon">
          ⚠️
        </span>

        <h3>
          Esta música não possui slides
        </h3>

        <p>
          Cadastre a música novamente
          com a letra preenchida.
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
   EXCLUIR MÚSICA
========================================================= */

async function deleteSong(song) {

  if (!currentUser) return;


  const confirmed =
    confirm(
      Deseja realmente excluir a música "${song.title}"?
    );


  if (!confirmed) return;


  try {

    await db
      .collection("songs")
      .doc(song.id)
      .delete();


    if (
      activeSongId ===
      song.id
    ) {

      activeSongId = null;


      selectedSongTitle.textContent =
        "Selecione ou adicione uma música";


      selectedSongSubtitle.textContent =
        "Os slides da música escolhida aparecerão aqui.";


      slidesOutput.innerHTML = `

        <div class="empty-state">

          <span class="empty-icon">
            🎵
          </span>

          <h3>
            Nenhuma música selecionada
          </h3>

          <p>
            Selecione uma música do seu repertório.
          </p>

        </div>

      `;

    }


  }

  catch (error) {

    console.error(error);

    alert(
      "Erro ao excluir música:\n\n" +
      traduzirErroFirebase(error)
    );

  }

}


/* =========================================================
   INICIAR APRESENTAÇÃO
========================================================= */

startPresentationBtn.addEventListener(
  "click",
  () => {

    if (
      filteredSongs.length === 0
    ) {

      alert(
        "Não há músicas para apresentar."
      );

      return;

    }


    const selectedIndex =
      filteredSongs.findIndex(
        song =>
          song.id ===
          activeSongId
      );


    currentSongIndex =
      selectedIndex >= 0
        ? selectedIndex
        : 0;


    currentSlideIndex =
      0;


    presentationModal.classList.remove(
      "hidden"
    );


    document.body.style.overflow =
      "hidden";


    updatePresentation();


    entrarTelaCheia();

  }
);


/* =========================================================
   ATUALIZAR APRESENTAÇÃO
========================================================= */

function updatePresentation() {

  if (
    filteredSongs.length === 0
  ) {

    return;

  }


  const song =
    filteredSongs[
      currentSongIndex
    ];


  if (!song) return;


  const slides =
    song.slides || [];


  if (slides.length === 0) {
