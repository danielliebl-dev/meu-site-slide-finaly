/* =========================================================
   REPERTÓRIO DE SLIDES
   SCRIPT PRINCIPAL
   ========================================================= */


/* =========================================================
   1. CONFIGURAÇÃO DO FIREBASE
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
   2. INICIALIZAR FIREBASE
   ========================================================= */

let auth = null;
let db = null;

try {

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  auth = firebase.auth();
  db = firebase.firestore();

  console.log("Firebase conectado com sucesso.");

} catch (error) {

  console.error(
    "Erro ao iniciar o Firebase:",
    error
  );

}


/* =========================================================
   3. VARIÁVEIS DO SISTEMA
   ========================================================= */

let currentUser = null;

let presentationSongs = [];

let selectedSong = null;

let currentFilter = "Todos";

let presentationSlides = [];

let currentPresentationSlide = 0;


/* =========================================================
   4. ELEMENTOS DO HTML
   ========================================================= */

const saveMenuBtn =
  document.getElementById("saveMenuBtn");

const savePanel =
  document.getElementById("savePanel");

const closeSavePanelBtn =
  document.getElementById("closeSavePanelBtn");

const emailInput =
  document.getElementById("emailInput");

const passwordInput =
  document.getElementById("passwordInput");

const loginBtn =
  document.getElementById("loginBtn");

const registerBtn =
  document.getElementById("registerBtn");

const logoutBtn =
  document.getElementById("logoutBtn");

const loginArea =
  document.getElementById("loginArea");

const userArea =
  document.getElementById("userArea");

const userEmail =
  document.getElementById("userEmail");

const authMessage =
  document.getElementById("authMessage");

const savedSongs =
  document.getElementById("savedSongs");

const currentUserStatus =
  document.getElementById("currentUserStatus");

const songTitle =
  document.getElementById("songTitle");

const songCategory =
  document.getElementById("songCategory");

const songLyrics =
  document.getElementById("songLyrics");

const versesPerSlide =
  document.getElementById("versesPerSlide");

const generateBtn =
  document.getElementById("generateBtn");

const musicList =
  document.getElementById("musicList");

const musicCount =
  document.getElementById("musicCount");

const selectedSongTitle =
  document.getElementById("selectedSongTitle");

const selectedSongInfo =
  document.getElementById("selectedSongInfo");

const slidesContainer =
  document.getElementById("slidesContainer");

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
   5. INICIAR INTERFACE
   ========================================================= */

function initializeInterface() {

  renderMusicList();

  renderEmptySlides();

}


/* =========================================================
   6. MENU SALVAR
   ========================================================= */

saveMenuBtn.addEventListener(
  "click",
  function () {

    savePanel.classList.remove("hidden");

  }
);


closeSavePanelBtn.addEventListener(
  "click",
  function () {

    savePanel.classList.add("hidden");

  }
);


/* =========================================================
   7. MENSAGEM DE AUTENTICAÇÃO
   ========================================================= */

function showAuthMessage(
  message,
  type = "info"
) {

  authMessage.textContent =
    message;

  authMessage.className =
    "auth-message " + type;

}


/* =========================================================
   8. CRIAR CONTA
   ========================================================= */

async function createAccount() {

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

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
      "O Firebase não foi conectado.",
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

    currentUser =
      result.user;

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

    if (
      error.code ===
      "auth/email-already-in-use"
    ) {

      message =
        "Este e-mail já está cadastrado.";

    } else if (
      error.code ===
      "auth/invalid-email"
    ) {

      message =
        "Digite um e-mail válido.";

    } else if (
      error.code ===
      "auth/weak-password"
    ) {

      message =
        "A senha precisa ter pelo menos 6 caracteres.";

    } else if (
      error.code ===
      "auth/operation-not-allowed"
    ) {

      message =
        "O login por e-mail ainda não está ativado no Firebase.";

    } else if (
      error.code ===
      "auth/network-request-failed"
    ) {

      message =
        "Verifique sua conexão com a internet.";

    } else {

      message =
        error.message ||
        message;
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
  createAccount
);


/* =========================================================
   9. LOGIN
   ========================================================= */

async function loginUser() {

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

  if (!email) {

    showAuthMessage(
      "Digite seu e-mail.",
      "error"
    );

    return;
  }

  if (!password) {

    showAuthMessage(
      "Digite sua senha.",
      "error"
    );

    return;
  }

  if (!auth) {

    showAuthMessage(
      "O Firebase não foi conectado.",
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

    emailInput.value = "";
    passwordInput.value = "";

    showAuthMessage(
      "Login realizado com sucesso!",
      "success"
    );

  } catch (error) {

    console.error(
      "Erro no login:",
      error
    );

    let message =
      "Não foi possível entrar.";

    if (
      error.code ===
      "auth/invalid-credential"
    ) {

      message =
        "E-mail ou senha incorretos.";

    } else if (
      error.code ===
      "auth/user-not-found"
    ) {

      message =
        "Conta não encontrada.";

    } else if (
      error.code ===
      "auth/wrong-password"
    ) {

      message =
        "Senha incorreta.";

    } else if (
      error.code ===
      "auth/invalid-email"
    ) {

      message =
        "Digite um e-mail válido.";

    } else {

      message =
        error.message ||
        message;
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
   10. SAIR DA CONTA
   ========================================================= */

logoutBtn.addEventListener(
  "click",
  async function () {

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
        error
      );

      showAuthMessage(
        "Erro ao sair da conta.",
        "error"
      );

    }

  }
);


/* =========================================================
   11. OBSERVAR LOGIN
   ========================================================= */

if (auth) {

  auth.onAuthStateChanged(
    async function (user) {

      currentUser =
        user;

      if (user) {

        loginArea.classList.add(
          "hidden"
        );

        userArea.classList.remove(
          "hidden"
        );

        userEmail.textContent =
          user.email || "Usuário";

        currentUserStatus.textContent =
          "Conectado";

        await loadSavedSongs();

      } else {

        loginArea.classList.remove(
          "hidden"
        );

        userArea.classList.add(
          "hidden"
        );

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
  );

}


/* =========================================================
   12. PEGAR VERSOS
   ========================================================= */

function getLyrics() {

  return songLyrics.value
    .split(/\r?\n/)
    .map(
      line => line.trim()
    )
    .filter(
      line => line.length > 0
    );

}


/* =========================================================
   13. CRIAR SLIDES
   ========================================================= */

function createSlides(
  lyrics,
  verses
) {

  const slides = [];

  for (
    let i = 0;
    i < lyrics.length;
    i += verses
  ) {

    slides.push(
      lyrics.slice(
        i,
        i + verses
      )
    );

  }

  return slides;

}


/* =========================================================
   14. GERAR SLIDES
   ========================================================= */

generateBtn.addEventListener(
  "click",
  function () {

    const title =
      songTitle.value.trim();

    const category =
      songCategory.value;

    const lyrics =
      getLyrics();

    const verses =
      Number(
        versesPerSlide.value
      );

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

    const slides =
      createSlides(
        lyrics,
        verses
      );

    const song = {

      id:
        createId(),

      title:
        title,

      category:
        category,

      lyrics:
        lyrics,

      versesPerSlide:
        verses,

      slides:
        slides,

      saved:
        false

    };

    presentationSongs.push(
      song
    );

    selectedSong =
      song;

    renderMusicList();

    renderSelectedSong();

    /*
     * Se o usuário estiver conectado,
     * oferecemos salvar automaticamente.
     */

    if (currentUser) {

      saveSongToFirestore(
        song
      );

    }

    songTitle.value = "";
    songLyrics.value = "";

  }
);


/* =========================================================
   15. GERAR ID
   ========================================================= */

function createId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2)
  );

}


/* =========================================================
   16. LISTA DE MÚSICAS DA APRESENTAÇÃO
   ========================================================= */

function renderMusicList() {

  musicList.innerHTML = "";

  musicCount.textContent =
    presentationSongs.length === 1
      ? "1 música"
      : presentationSongs.length +
        " músicas";

  if (
    presentationSongs.length === 0
  ) {

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
    function (song) {

      const card =
        document.createElement(
          "div"
        );

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
            data-view>
            👁️ Ver
          </button>

          <button
            type="button"
            class="btn danger"
            data-delete>
            🗑️
          </button>

        </div>
      `;

      card
        .querySelector("[data-view]")
        .addEventListener(
          "click",
          function () {

            selectedSong =
              song;

            renderSelectedSong();

          }
        );

      card
        .querySelector("[data-delete]")
        .addEventListener(
          "click",
          function () {

            const confirmed =
              confirm(
                "Deseja remover esta música?"
              );

            if (!confirmed) {
              return;
            }

            presentationSongs =
              presentationSongs.filter(
                item =>
                  item.id !== song.id
              );

            if (
              selectedSong &&
              selectedSong.id === song.id
            ) {

              selectedSong =
                null;

              renderEmptySlides();

            }

            renderMusicList();

          }
        );

      musicList.appendChild(
        card
      );

    }
  );

}


/* =========================================================
   17. MOSTRAR SLIDES
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
    selectedSong.category +
    " • " +
    selectedSong.lyrics.length +
    " versos • " +
    selectedSong.slides.length +
    " slides";

  slidesContainer.innerHTML =
    "";

  selectedSong.slides.forEach(
    function (slide, index) {

      const element =
        document.createElement(
          "div"
        );

      element.className =
        "slide-preview";

      element.innerHTML = `

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
        element
      );

    }
  );

  startPresentationBtn.disabled =
    false;

}


/* =========================================================
   18. SLIDES VAZIOS
   ========================================================= */

function renderEmptySlides() {

  selectedSongTitle.textContent =
    "Slides";

  selectedSongInfo.textContent =
    "Os slides aparecerão aqui.";

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

  startPresentationBtn.disabled =
    true;

}


/* =========================================================
   19. INICIAR APRESENTAÇÃO
   ========================================================= */

startPresentationBtn.addEventListener(
  "click",
  function () {

    if (!selectedSong) {
      return;
    }

    presentationSlides =
      selectedSong.slides;

    currentPresentationSlide =
      0;

    presentationSongName.textContent =
      selectedSong.title;

    presentationModal.classList.remove(
      "hidden"
    );

    updatePresentation();

  }
);


/* =========================================================
   20. ATUALIZAR APRESENTAÇÃO
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
    "Slide " +
    (currentPresentationSlide + 1) +
    " de " +
    presentationSlides.length;

  previousSlideBtn.disabled =
    currentPresentationSlide === 0;

  nextSlideBtn.disabled =
    currentPresentationSlide ===
    presentationSlides.length - 1;

}


/* =========================================================
   21. PRÓXIMO SLIDE
   ========================================================= */

nextSlideBtn.addEventListener(
  "click",
  function () {

    if (
      currentPresentationSlide <
      presentationSlides.length - 1
    ) {

      currentPresentationSlide++;

      updatePresentation();

    }

  }
);


/* =========================================================
   22. SLIDE ANTERIOR
   ========================================================= */

previousSlideBtn.addEventListener(
  "click",
  function () {

    if (
      currentPresentationSlide > 0
    ) {

      currentPresentationSlide--;

      updatePresentation();

    }

  }
);


/* =========================================================
   23. FECHAR APRESENTAÇÃO
   ========================================================= */

closePresentationBtn.addEventListener(
  "click",
  function () {

    presentationModal.classList.add(
      "hidden"
    );

  }
);


/* =========================================================
   24. TECLADO
   ========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      presentationModal.classList.contains(
        "hidden"
      )
    ) {

      return;

    }

    if (
      event.key === "ArrowRight"
    ) {

      nextSlideBtn.click();

    }

    if (
      event.key === "ArrowLeft"
    ) {

      previousSlideBtn.click();

    }

    if (
      event.key === "Escape"
    ) {

      closePresentationBtn.click();

    }

  }
);


/* =========================================================
   25. SALVAR NO FIRESTORE
