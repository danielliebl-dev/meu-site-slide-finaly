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
 * A música não é salva automaticamente.
 * Ela só será salva permanentemente quando
 * o usuário clicar em "Salvar Música".
 */

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
   ========================================================= */

async function saveSongToFirestore(song) {

  if (!currentUser) {

    console.warn(
      "Usuário não está conectado."
    );

    return false;

  }

  if (!db) {

    console.error(
      "Firestore não está conectado."
    );

    showAuthMessage(
      "O banco de dados não está conectado.",
      "error"
    );

    return false;

  }

  try {

    const songData = {

      title:
        song.title,

      category:
        song.category || "Geral",

      lyrics:
        song.lyrics,

      versesPerSlide:
        song.versesPerSlide,

      slides:
        song.slides,

      userId:
        currentUser.uid,

      userEmail:
        currentUser.email || "",

      createdAt:
        firebase.firestore.FieldValue.serverTimestamp(),

      updatedAt:
        firebase.firestore.FieldValue.serverTimestamp()

    };


    /*
     * Cada usuário possui sua própria coleção.
     *
     * Caminho:
     *
     * users
     *   └── UID
     *       └── songs
     */

    const documentReference =
      await db
        .collection("users")
        .doc(currentUser.uid)
        .collection("songs")
        .doc(song.id)
        .set(songData);


    song.saved =
      true;


    console.log(
      "Música salva no Firestore:",
      song.id
    );


    return true;

  } catch (error) {

    console.error(
      "Erro ao salvar música no Firestore:",
      error
    );


    showAuthMessage(
      "Erro ao salvar a música.",
      "error"
    );


    return false;

  }

}


/* =========================================================
   26. CARREGAR MÚSICAS SALVAS
   ========================================================= */

async function loadSavedSongs() {

  if (!currentUser) {
    return;
  }

  if (!db) {

    console.error(
      "Firestore não está conectado."
    );

    return;

  }


  try {

    savedSongs.innerHTML = `

      <p class="empty-message">
        Carregando suas músicas...
      </p>

    `;


    const snapshot =
      await db
        .collection("users")
        .doc(currentUser.uid)
        .collection("songs")
        .orderBy(
          "createdAt",
          "desc"
        )
        .get();


    presentationSongs = [];


    snapshot.forEach(
      function (doc) {

        const data =
          doc.data();


        const song = {

          id:
            doc.id,

          title:
            data.title || "Sem título",

          category:
            data.category || "Geral",

          lyrics:
            Array.isArray(data.lyrics)
              ? data.lyrics
              : [],

          versesPerSlide:
            Number(
              data.versesPerSlide
            ) || 1,

          slides:
            Array.isArray(data.slides)
              ? data.slides
              : [],

          saved:
            true

        };


        presentationSongs.push(
          song
        );

      }
    );


    renderMusicList();

    renderSavedSongs();


    console.log(
      presentationSongs.length +
      " músicas carregadas."
    );


  } catch (error) {

    console.error(
      "Erro ao carregar músicas:",
      error
    );


    savedSongs.innerHTML = `

      <p class="empty-message">
        Não foi possível carregar suas músicas.
      </p>

    `;

  }

}


/* =========================================================
   27. MOSTRAR MÚSICAS SALVAS
   ========================================================= */

function renderSavedSongs() {

  if (!savedSongs) {
    return;
  }


  savedSongs.innerHTML = "";


  if (
    presentationSongs.length === 0
  ) {

    savedSongs.innerHTML = `

      <div class="empty-state">

        <span>🎵</span>

        <h3>
          Nenhuma música salva
        </h3>

        <p>
          Gere uma música e salve no seu repertório.
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
        "saved-song-card";


      card.innerHTML = `

        <div class="saved-song-info">

          <h3>
            ${escapeHTML(song.title)}
          </h3>

          <p>
            ${escapeHTML(song.category)}
          </p>

          <small>
            ${song.lyrics.length} versos
            •
            ${song.slides.length} slides
          </small>

        </div>


        <div class="saved-song-actions">

          <button
            type="button"
            class="btn"
            data-load-song>
            📺 Abrir
          </button>


          <button
            type="button"
            class="btn danger"
            data-delete-saved>
            🗑️ Excluir
          </button>

        </div>

      `;


      /*
       * Abrir música
       */

      card
        .querySelector(
          "[data-load-song]"
        )
        .addEventListener(
          "click",
          function () {

            selectedSong =
              song;


            renderSelectedSong();


            /*
             * Fecha o painel de salvar
             */

            if (savePanel) {

              savePanel.classList.add(
                "hidden"
              );

            }

          }
        );


      /*
       * Excluir música
       */

      card
        .querySelector(
          "[data-delete-saved]"
        )
        .addEventListener(
          "click",
          async function () {

            await deleteSongFromFirestore(
              song
            );

          }
        );


      savedSongs.appendChild(
        card
      );

    }
  );

}


/* =========================================================
   28. EXCLUIR MÚSICA DO FIRESTORE
   ========================================================= */

async function deleteSongFromFirestore(
  song
) {

  if (!currentUser) {

    showAuthMessage(
      "Faça login para excluir músicas.",
      "error"
    );

    return;

  }


  if (!db) {

    showAuthMessage(
      "O banco de dados não está conectado.",
      "error"
    );

    return;

  }


  const confirmed =
    confirm(
      Deseja excluir "${song.title}" do seu repertório?
    );


  if (!confirmed) {
    return;
  }


  try {

    await db
      .collection("users")
      .doc(currentUser.uid)
      .collection("songs")
      .doc(song.id)
      .delete();


    /*
     * Remove também da lista local
     */

    presentationSongs =
      presentationSongs.filter(
        function (item) {

          return item.id !== song.id;

        }
      );


    /*
     * Se a música excluída estava selecionada,
     * limpamos os slides.
     */

    if (
      selectedSong &&
      selectedSong.id === song.id
    ) {

      selectedSong =
        null;

      renderEmptySlides();

    }


    renderMusicList();

    renderSavedSongs();


    showAuthMessage(
      "Música excluída com sucesso.",
      "success"
    );


  } catch (error) {

    console.error(
      "Erro ao excluir música:",
      error
    );


    showAuthMessage(
      "Não foi possível excluir a música.",
      "error"
    );

  }

}


/* =========================================================
   29. SALVAR ALTERAÇÃO DE UMA MÚSICA
   ========================================================= */

async function updateSongInFirestore(
  song
) {

  if (!currentUser || !db) {
    return false;
  }


  try {

    await db
      .collection("users")
      .doc(currentUser.uid)
      .collection("songs")
      .doc(song.id)
      .update({

        title:
          song.title,

        category:
          song.category,

        lyrics:
          song.lyrics,

        versesPerSlide:
          song.versesPerSlide,

        slides:
          song.slides,

        updatedAt:
          firebase.firestore.FieldValue.serverTimestamp()

      });


    return true;


  } catch (error) {

    console.error(
      "Erro ao atualizar música:",
      error
    );


    return false;

  }

}


/* =========================================================
   30. FUNÇÃO ESCAPE HTML
   ========================================================= */

function escapeHTML(
  text
) {

  if (
    text === null ||
    text === undefined
  ) {

    return "";

  }


  return String(text)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   31. FILTRO DE CATEGORIAS
   ========================================================= */

function filterSongs(
  category
) {

  currentFilter =
    category;


  const cards =
    musicList.querySelectorAll(
      ".music-card"
    );


  cards.forEach(
    function (card) {

      const song =
        presentationSongs.find(
          function (item) {

            return (
              escapeHTML(item.title) ===
              card.querySelector("h3").textContent
            );

          }
        );


      if (!song) {
        return;
      }


      if (
        category === "Todos" ||
        song.category === category
      ) {

        card.style.display =
          "";

      } else {

        card.style.display =
          "none";

      }

    }
  );

}


/* =========================================================
   32. ATUALIZAR QUANTIDADE DE VERSOS
   ========================================================= */

function updateVerseCounter() {

  if (!songLyrics) {
    return;
  }


  const lyrics =
    songLyrics.value
      .split(/\r?\n/)
      .map(
        line => line.trim()
      )
      .filter(
        line => line.length > 0
      );


  const counter =
    document.getElementById(
      "verseCount"
    );


  if (counter) {

    counter.textContent =
      lyrics.length +
      (
        lyrics.length === 1
          ? " verso"
          : " versos"
      );

  }

}


/* =========================================================
   33. ATUALIZAR CONTADOR ENQUANTO DIGITA
   ========================================================= */

if (songLyrics) {

  songLyrics.addEventListener(
    "input",
    updateVerseCounter
  );

}


/* =========================================================
   34. SALVAR MANUALMENTE A MÚSICA ATUAL
   ========================================================= */

async function saveCurrentSong() {

  if (!selectedSong) {

    alert(
      "Primeiro gere ou selecione uma música."
    );

    return;

  }


  if (!currentUser) {

    alert(
      "Faça login para salvar músicas."
    );

    return;

  }


  const success =
    await saveSongToFirestore(
      selectedSong
    );


  if (success) {

    renderSavedSongs();

    showAuthMessage(
      "Música salva no seu repertório!",
      "success"
    );

  }

}


/* =========================================================
   35. BOTÃO SALVAR MÚSICA
   ========================================================= */

const saveCurrentSongBtn =
  document.getElementById(
    "saveCurrentSongBtn"
  );


if (saveCurrentSongBtn) {

  saveCurrentSongBtn.addEventListener(
    "click",
    saveCurrentSong
  );

}


/* =========================================================
   36. INICIALIZAÇÃO FINAL
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    initializeInterface();

    updateVerseCounter();

    console.log(
      "Repertório de Slides iniciado."
    );

  }
);


/* =========================================================
   37. EVITAR ERROS COM ELEMENTOS AUSENTES
   ========================================================= */

function safeAddEventListener(
  element,
  event,
  callback
) {

  if (!element) {
    return;
  }


  element.addEventListener(
    event,
    callback
  );

}


/* =========================================================
   38. DUPLO CLIQUE PARA ABRIR APRESENTAÇÃO
   ========================================================= */

safeAddEventListener(
  slidesContainer,
  "dblclick",
  function () {

    if (
      selectedSong &&
      !startPresentationBtn.disabled
    ) {

      startPresentationBtn.click();

    }

  }
);


/* =========================================================
   39. ATALHOS DE TECLADO
   ========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    /*
     * Espaço inicia a apresentação
     */

    if (
      event.code === "Space" &&
      selectedSong &&
      presentationModal.classList.contains(
        "hidden"
      )
    ) {

      const activeElement =
        document.activeElement;


      /*
       * Não executar enquanto o usuário
       * estiver digitando em um campo.
       */

      const isTyping =
        activeElement &&
        (
          activeElement.tagName ===
          "INPUT" ||
          activeElement.tagName ===
          "TEXTAREA"
        );


      if (!isTyping) {

        event.preventDefault();

        startPresentationBtn.click();

      }

    }

  }
);


/* =========================================================
   40. FINAL
   ========================================================= */

console.log(
  "======================================="
);

console.log(
  " REPERTÓRIO DE SLIDES"
);

console.log(
  " Sistema carregado."
);

console.log(
  " Firebase:",
  auth ? "OK" : "ERRO"
);

console.log(
  " Firestore:",
  db ? "OK" : "ERRO"
);

console.log(
  "======================================="
);
