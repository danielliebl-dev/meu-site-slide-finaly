/* =========================================================
   REPERTÓRIO DE SLIDES
   JavaScript principal
   ========================================================= */


/* =========================================================
   1. CONFIGURAÇÃO DO FIREBASE
   =========================================================

   COLOQUE AQUI A CONFIGURAÇÃO DO SEU PROJETO FIREBASE.

   Exemplo:

   const firebaseConfig = {
     apiKey: "SUA_API_KEY",
     authDomain: "SEU_PROJETO.firebaseapp.com",
     projectId: "SEU_PROJETO",
     storageBucket: "SEU_PROJETO.firebasestorage.app",
     messagingSenderId: "SEU_ID",
     appId: "SEU_APP_ID"
   };

   ========================================================= */

const firebaseConfig = {
  apiKey: "COLOQUE_SUA_API_KEY",
  authDomain: "COLOQUE_SEU_AUTH_DOMAIN",
  projectId: "COLOQUE_SEU_PROJECT_ID",
  storageBucket: "COLOQUE_SEU_STORAGE_BUCKET",
  messagingSenderId: "COLOQUE_SEU_MESSAGING_SENDER_ID",
  appId: "COLOQUE_SEU_APP_ID"
};


/* =========================================================
   2. INICIALIZAÇÃO
   ========================================================= */

let auth = null;
let db = null;

let currentUser = null;

let presentationSongs = [];
let selectedSong = null;

let currentFilter = "Todos";

let presentationSlides = [];
let currentPresentationSlide = 0;


/* =========================================================
   3. ELEMENTOS DO HTML
   ========================================================= */

const saveMenuBtn = document.getElementById("saveMenuBtn");
const savePanel = document.getElementById("savePanel");
const closeSavePanelBtn = document.getElementById("closeSavePanelBtn");

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginArea = document.getElementById("loginArea");
const userArea = document.getElementById("userArea");

const userEmail = document.getElementById("userEmail");
const authMessage = document.getElementById("authMessage");

const currentUserStatus = document.getElementById("currentUserStatus");

const savedSongs = document.getElementById("savedSongs");

const songTitle = document.getElementById("songTitle");
const songCategory = document.getElementById("songCategory");
const songLyrics = document.getElementById("songLyrics");

const versesPerSlide = document.getElementById("versesPerSlide");

const generateBtn = document.getElementById("generateBtn");

const musicList = document.getElementById("musicList");
const musicCount = document.getElementById("musicCount");

const selectedSongTitle = document.getElementById("selectedSongTitle");
const selectedSongInfo = document.getElementById("selectedSongInfo");

const slidesContainer = document.getElementById("slidesContainer");

const startPresentationBtn =
  document.getElementById("startPresentationBtn");

const presentationModal =
  document.getElementById("presentationModal");

const presentationSongName =
  document.getElementById("presentationSongName");

const presentationText =
  document.getElementById("presentationText");

const presentationCounter =
  document.getElementById("presentationCounter");

const previousSlideBtn =
  document.getElementById("previousSlideBtn");

const nextSlideBtn =
  document.getElementById("nextSlideBtn");

const closePresentationBtn =
  document.getElementById("closePresentationBtn");


/* =========================================================
   4. VERIFICAÇÃO DOS ELEMENTOS
   ========================================================= */

function checkElements() {

  const requiredElements = [
    saveMenuBtn,
    savePanel,
    closeSavePanelBtn,
    emailInput,
    passwordInput,
    loginBtn,
    registerBtn,
    logoutBtn,
    loginArea,
    userArea,
    userEmail,
    authMessage,
    currentUserStatus,
    savedSongs,
    songTitle,
    songCategory,
    songLyrics,
    versesPerSlide,
    generateBtn,
    musicList,
    musicCount,
    selectedSongTitle,
    selectedSongInfo,
    slidesContainer,
    startPresentationBtn,
    presentationModal,
    presentationSongName,
    presentationText,
    presentationCounter,
    previousSlideBtn,
    nextSlideBtn,
    closePresentationBtn
  ];

  const missing = requiredElements.some(
    element => !element
  );

  if (missing) {

    console.error(
      "Um ou mais elementos do HTML não foram encontrados."
    );

    return false;
  }

  return true;
}


/* =========================================================
   5. FIREBASE
   ========================================================= */

function initializeFirebase() {

  try {

    if (
      firebaseConfig.apiKey === "COLOQUE_SUA_API_KEY" ||
      firebaseConfig.projectId === "COLOQUE_SEU_PROJECT_ID"
    ) {

      console.warn(
        "A configuração do Firebase ainda não foi preenchida."
      );

      showAuthMessage(
        "Configure o Firebase no script.js para usar contas e salvar músicas.",
        "error"
      );

      return false;
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    auth = firebase.auth();
    db = firebase.firestore();

    auth.onAuthStateChanged(handleAuthStateChanged);

    return true;

  } catch (error) {

    console.error(
      "Erro ao inicializar o Firebase:",
      error
    );

    showAuthMessage(
      "Não foi possível conectar ao Firebase.",
      "error"
    );

    return false;
  }
}


/* =========================================================
   6. MENSAGENS
   ========================================================= */

function showAuthMessage(message, type = "info") {

  if (!authMessage) {
    return;
  }

  authMessage.textContent = message;

  authMessage.classList.remove(
    "success",
    "error",
    "info"
  );

  authMessage.classList.add(type);
}


/* =========================================================
   7. ABRIR / FECHAR MENU DE SALVAR
   ========================================================= */

function openSavePanel() {

  savePanel.classList.remove("hidden");

}


function closeSavePanel() {

  savePanel.classList.add("hidden");

}


saveMenuBtn.addEventListener(
  "click",
  openSavePanel
);


closeSavePanelBtn.addEventListener(
  "click",
  closeSavePanel
);


/* =========================================================
   8. CRIAR CONTA
   ========================================================= */

async function registerUser() {

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email) {

    showAuthMessage(
      "Digite seu e-mail.",
      "error"
    );

    emailInput.focus();

    return;
  }

  if (!password) {

    showAuthMessage(
      "Digite uma senha.",
      "error"
    );

    passwordInput.focus();

    return;
  }

  if (password.length < 6) {

    showAuthMessage(
      "A senha precisa ter pelo menos 6 caracteres.",
      "error"
    );

    return;
  }

  if (!auth) {

    showAuthMessage(
      "Firebase não está configurado.",
      "error"
    );

    return;
  }

  registerBtn.disabled = true;

  showAuthMessage(
    "Criando sua conta...",
    "info"
  );

  try {

    const result =
      await auth.createUserWithEmailAndPassword(
        email,
        password
      );

    currentUser = result.user;

    showAuthMessage(
      "Conta criada com sucesso!",
      "success"
    );

    emailInput.value = "";
    passwordInput.value = "";

  } catch (error) {

    console.error(
      "Erro ao criar conta:",
      error
    );

    let message =
      "Não foi possível criar a conta.";

    switch (error.code) {

      case "auth/email-already-in-use":
        message =
          "Este e-mail já possui uma conta.";
        break;

      case "auth/invalid-email":
        message =
          "Digite um e-mail válido.";
        break;

      case "auth/weak-password":
        message =
          "A senha é muito fraca.";
        break;

      case "auth/network-request-failed":
        message =
          "Verifique sua conexão com a internet.";
        break;

      case "auth/operation-not-allowed":
        message =
          "O login por e-mail ainda não está ativado no Firebase.";
        break;

      default:
        message =
          error.message || message;
    }

    showAuthMessage(
      message,
      "error"
    );

  } finally {

    registerBtn.disabled = false;
  }
}


registerBtn.addEventListener(
  "click",
  registerUser
);


/* =========================================================
   9. LOGIN
   ========================================================= */

async function loginUser() {

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email) {

    showAuthMessage(
      "Digite seu e-mail.",
      "error"
    );

    emailInput.focus();

    return;
  }

  if (!password) {

    showAuthMessage(
      "Digite sua senha.",
      "error"
    );

    passwordInput.focus();

    return;
  }

  if (!auth) {

    showAuthMessage(
      "Firebase não está configurado.",
      "error"
    );

    return;
  }

  loginBtn.disabled = true;

  showAuthMessage(
    "Entrando...",
    "info"
  );

  try {

    await auth.signInWithEmailAndPassword(
      email,
      password
    );

    showAuthMessage(
      "Login realizado com sucesso!",
      "success"
    );

    emailInput.value = "";
    passwordInput.value = "";

  } catch (error) {

    console.error(
      "Erro ao entrar:",
      error
    );

    let message =
      "Não foi possível entrar.";

    switch (error.code) {

      case "auth/user-not-found":
        message =
          "Não existe uma conta com este e-mail.";
        break;

      case "auth/wrong-password":
        message =
          "Senha incorreta.";
        break;

      case "auth/invalid-credential":
        message =
          "E-mail ou senha incorretos.";
        break;

      case "auth/invalid-email":
        message =
          "Digite um e-mail válido.";
        break;

      case "auth/network-request-failed":
        message =
          "Verifique sua conexão com a internet.";
        break;

      default:
        message =
          error.message || message;
    }

    showAuthMessage(
      message,
      "error"
    );

  } finally {

    loginBtn.disabled = false;
  }
}


loginBtn.addEventListener(
  "click",
  loginUser
);


/* =========================================================
   10. LOGOUT
   ========================================================= */

async function logoutUser() {

  if (!auth) {
    return;
  }

  try {

    await auth.signOut();

    showAuthMessage(
      "Você saiu da conta.",
      "info"
    );

  } catch (error) {

    console.error(
      "Erro ao sair:",
      error
    );

    showAuthMessage(
      "Não foi possível sair da conta.",
      "error"
    );
  }
}


logoutBtn.addEventListener(
  "click",
  logoutUser
);


/* =========================================================
   11. ESTADO DO USUÁRIO
   ========================================================= */

async function handleAuthStateChanged(user) {

  currentUser = user;

  if (user) {

    loginArea.classList.add("hidden");

    userArea.classList.remove("hidden");

    userEmail.textContent =
      user.email || "Usuário";

    currentUserStatus.textContent =
      "Conectado";

    await loadSavedSongs();

  } else {

    loginArea.classList.remove("hidden");

    userArea.classList.add("hidden");

    userEmail.textContent =
      "—";

    currentUserStatus.textContent =
      "Visitante";

    savedSongs.innerHTML = `
      <p class="empty-message">
        Entre na sua conta para ver suas músicas salvas.
      </p>
    `;
  }
}


/* =========================================================
   12. PREPARAR LETRA
   ========================================================= */

function getLyricsLines() {

  return songLyrics.value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
}


/* =========================================================
   13. CRIAR SLIDES
   ========================================================= */

function createSlidesFromLyrics(
  lyrics,
  amount
) {

  const slides = [];

  for (
    let i = 0;
    i < lyrics.length;
    i += amount
  ) {

    slides.push(
      lyrics.slice(
        i,
        i + amount
      )
    );
  }

  return slides;
}


/* =========================================================
   14. GERAR SLIDES
   ========================================================= */

function generateSlides() {

  const title =
    songTitle.value.trim();

  const category =
    songCategory.value;

  const lyrics =
    getLyricsLines();

  const amount =
    Number(versesPerSlide.value);

  if (!title) {

    alert(
      "Digite o nome da música."
    );

    songTitle.focus();

    return;
  }

  if (lyrics.length === 0) {

    alert(
      "Digite a letra da música."
    );

    songLyrics.focus();

    return;
  }

  if (!amount || amount < 1) {

    alert(
      "Escolha a quantidade de versos por slide."
    );

    return;
  }

  const slides =
    createSlidesFromLyrics(
      lyrics,
      amount
    );

  const song = {

    id:
      createLocalId(),

    title,

    category,

    lyrics,

    versesPerSlide:
      amount,

    slides,

    createdAt:
      Date.now()
  };

  presentationSongs.push(song);

  selectedSong = song;

  renderMusicList();

  renderSelectedSong();

  clearEditor();

}


/* =========================================================
   15. ID LOCAL
   ========================================================= */

function createLocalId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 9)
  );
}


generateBtn.addEventListener(
  "click",
  generateSlides
);


/* =========================================================
   16. LIMPAR EDITOR
   ========================================================= */

function clearEditor() {

  songTitle.value = "";
  songLyrics.value = "";

}


/* =========================================================
   17. RENDERIZAR LISTA DE MÚSICAS
   ========================================================= */

function renderMusicList() {

  musicList.innerHTML = "";

  musicCount.textContent =
    presentationSongs.length === 1
      ? "1 música"
      : ${presentationSongs.length} músicas;

  if (presentationSongs.length === 0) {

    musicList.innerHTML = `
      <div class="empty-state">

        <span>🎵</span>

        <h3>
          Nenhuma música adicionada
        </h3>

        <p>
          Preencha os campos acima e clique
          em "Gerar Slides".
        </p>

      </div>
    `;

    return;
  }

  presentationSongs.forEach(
    song => {

      const card =
        document.createElement("div");

      card.className =
        "music-card";

      card.innerHTML = `

        <div class="music-card-info">

          <h3>
            ${escapeHTML(song.title)}
          </h3>

          <p>
            ${escapeHTML(song.category)}
            •
            ${song.lyrics.length} versos
            •
            ${song.slides.length} slides
          </p>

        </div>

        <div class="music-card-actions">

          <button
            type="button"
            class="btn"
            data-action="select">
            👁️ Ver
          </button>

          <button
            type="button"
            class="btn danger"
            data-action="delete">
            🗑️
          </button>

        </div>
      `;

      const selectButton =
        card.querySelector(
          '[data-action="select"]'
        );

      const deleteButton =
        card.querySelector(
          '[data-action="delete"]'
        );

      selectButton.addEventListener(
        "click",
        () => {

          selectedSong = song;

          renderSelectedSong();

        }
      );

      deleteButton.addEventListener(
        "click",
        () => {

          deletePresentationSong(
            song.id
          );

        }
      );

      musicList.appendChild(card);
    }
  );

}


/* =========================================================
   18. EXCLUIR MÚSICA DA APRESENTAÇÃO
   ========================================================= */

function deletePresentationSong(id) {

  const confirmed =
    confirm(
      "Deseja remover esta música da apresentação?"
    );

  if (!confirmed) {
    return;
  }

  presentationSongs =
    presentationSongs.filter(
      song => song.id !== id
    );

  if (
    selectedSong &&
    selectedSong.id === id
  ) {

    selectedSong = null;

    selectedSongTitle.textContent =
      "Slides";

    selectedSongInfo.textContent =
      "Os slides aparecerão aqui.";

    renderEmptySlides();

    startPresentationBtn.disabled =
      true;
  }

  renderMusicList();

}


/* =========================================================
   19. MOSTRAR MÚSICA SELECIONADA
   ========================================================= */

function renderSelectedSong() {

  if (!selectedSong) {

    renderEmptySlides();

    startPresentationBtn.disabled =
      true;

    return;
  }

  selectedSongTitle.textContent =
    selectedSong.title;

  selectedSongInfo.textContent =
    `${selectedSong.category} • ` +
    `${selectedSong.lyrics.length} versos • ` +
    ${selectedSong.slides.length} slides;

  slidesContainer.innerHTML = "";

  selectedSong.slides.forEach(
    (slide, index) => {

      const slideElement =
        document.createElement("div");

      slideElement.className =
        "slide-preview";

      slideElement.innerHTML = `

        <div class="slide-number">
          Slide ${index + 1}
        </div>

        <div class="slide-text">

          ${slide
            .map(
              line =>
                <div>${escapeHTML(line)}</div>
            )
            .join("")
          }

        </div>
      `;

      slidesContainer.appendChild(
        slideElement
      );
    }
  );

  startPresentationBtn.disabled =
    false;

}


/* =========================================================
   20. SLIDES VAZIOS
   ========================================================= */

function renderEmptySlides() {

  slidesContainer.innerHTML = `

    <div class="empty-state">

      <span>📺</span>

      <h3>
        Aguardando slides
      </h3>

      <p>
        Gere uma música para começar.
      </p>

    </div>
  `;

}


/* =========================================================
   21. APRESENTAÇÃO
   ========================================================= */

function startPresentation() {

  if (!selectedSong) {
    return;
  }

  presentationSlides =
    selectedSong.slides;

  if (
    presentationSlides.length === 0
  ) {
    return;
  }

  currentPresentationSlide = 0;

  presentationSongName.textContent =
    selectedSong.title;

  presentationModal.classList.remove(
    "hidden"
  );

  updatePresentation();

}


startPresentationBtn.addEventListener(
  "click",
  startPresentation
);


/* =========================================================
   22. ATUALIZAR APRESENTAÇÃO
   ========================================================= */

function updatePresentation() {

  if (
    presentationSlides.length === 0
  ) {
    return;
  }

  const slide =
    presentationSlides[
      currentPresentationSlide
    ];

  presentationText.innerHTML =
    slide
      .map(
        line =>
          <div>${escapeHTML(line)}</div>
      )
      .join("");

  presentationCounter.textContent =
    `Slide ${
      currentPresentationSlide + 1
    } de ${
      presentationSlides.length
    }`;

  previousSlideBtn.disabled =
    currentPresentationSlide === 0;

  nextSlideBtn.disabled =
    currentPresentationSl
