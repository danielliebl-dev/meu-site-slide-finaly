/* =========================================================
   FIREBASE
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

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


/* =========================================================
   ESTADO
========================================================= */

let currentUser = null;

let savedSongs = [];

let presentationSongs = [];

let selectedSongIndex = -1;

let currentSlideIndex = 0;

let showingBlackScreen = false;

let activeFilter = "Todos";

let unsubscribeSongs = null;


/* =========================================================
   ELEMENTOS
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

const savedSongsContainer =
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
   ABRIR / FECHAR PAINEL
========================================================= */

saveMenuBtn.addEventListener(
  "click",
  () => {

    savePanel.classList.toggle(
      "hidden"
    );

  }
);


closeSavePanelBtn.addEventListener(
  "click",
  () => {

    savePanel.classList.add(
      "hidden"
    );

  }
);


/* =========================================================
   MENSAGENS
========================================================= */

function showAuthMessage(message) {

  authMessage.textContent =
    message;

}


function clearAuthMessage() {

  authMessage.textContent =
    "";

}


/* =========================================================
   TRADUZIR ERROS FIREBASE
========================================================= */

function firebaseError(error) {

  const messages = {

    "auth/invalid-email":
      "Digite um e-mail válido.",

    "auth/invalid-credential":
      "E-mail ou senha incorretos.",

    "auth/wrong-password":
      "E-mail ou senha incorretos.",

    "auth/user-not-found":
      "E-mail ou senha incorretos.",

    "auth/email-already-in-use":
      "Este e-mail já está cadastrado.",

    "auth/weak-password":
      "A senha precisa ter pelo menos 6 caracteres.",

    "auth/network-request-failed":
      "Verifique sua conexão com a internet.",

    "auth/too-many-requests":
      "Muitas tentativas. Aguarde um pouco.",

    "auth/operation-not-allowed":
      "O login por e-mail não está ativado no Firebase.",

    "permission-denied":
      "Você não tem permissão para acessar os dados."

  };

  return messages[error.code] ||
    error.message ||
    "Ocorreu um erro.";

}


/* =========================================================
   CRIAR SLIDES
========================================================= */

function createSlides(lyrics, amount) {

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


  const slides = [];


  for (
    let i = 0;
    i < lines.length;
    i += amount
  ) {

    slides.push(
      lines
        .slice(
          i,
          i + amount
        )
        .join("\n")
    );

  }


  return slides;

}


/* =========================================================
   GERAR SLIDES
========================================================= */

generateBtn.addEventListener(
  "click",
  () => {

    const title =
      songTitle.value.trim();

    const category =
      songCategory.value;

    const lyrics =
      songLyrics.value.trim();

    const amount =
      parseInt(
        versesPerSlide.value,
        10
      );


    if (!title) {

      alert(
        "Digite o nome da música."
      );

      songTitle.focus();

      return;

    }


    if (!lyrics) {

      alert(
        "Digite ou cole a letra da música."
      );

      songLyrics.focus();

      return;

    }


    const slides =
      createSlides(
        lyrics,
        amount
      );


    if (
      slides.length === 0
    ) {

      alert(
        "Não foi possível criar os slides."
      );

      return;

    }


    const music = {

      id:
        createLocalId(),

      title:
        title,

      category:
        category,

      slides:
        slides,

      saved:
        false,

      createdAt:
        Date.now()

    };


    presentationSongs.push(
      music
    );


    selectedSongIndex =
      presentationSongs.length - 1;


    renderMusicList();

    selectPresentationSong(
      selectedSongIndex
    );


    /*
      Limpa somente a letra e título
      para facilitar o cadastro da
      próxima música.
    */

    songTitle.value =
      "";

    songLyrics.value =
      "";

  }
);


/* =========================================================
   ID LOCAL
========================================================= */

function createLocalId() {

  return (
    "local_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 8)
  );

}


/* =========================================================
   RENDERIZAR LISTA DE MÚSICAS
========================================================= */

function renderMusicList() {

  musicList.innerHTML =
    "";


  musicCount.textContent =
    `${presentationSongs.length} ${
      presentationSongs.length === 1
        ? "música"
        : "músicas"
    }`;


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
          Gere uma música para começar.
        </p>

      </div>

    `;

    startPresentationBtn.disabled =
      true;

    return;

  }


  presentationSongs.forEach(
    (song, index) => {

      /*
        Filtro
      */

      if (
        activeFilter !== "Todos" &&
        song.category !== activeFilter
      ) {

        return;

      }


      /*
        Item da música
      */

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "music-item";


      if (
        index === selectedSongIndex
      ) {

        item.classList.add(
          "active"
        );

      }


      const info =
        document.createElement(
          "div"
        );

      info.className =
        "music-item-info";


      const title =
        document.createElement(
          "div"
        );

      title.className =
        "music-item-title";

      title.textContent =
        ${index + 1}. ${song.title};


      const meta =
        document.createElement(
          "div"
        );

      meta.className =
        "music-item-meta";

      meta.textContent =
        `${song.category} • ${
          song.slides.length
        } slides`;


      info.appendChild(
        title
      );

      info.appendChild(
        meta
      );


      const actions =
        document.createElement(
          "div"
        );

      actions.className =
        "music-item-actions";


      const selectBtn =
        document.createElement(
          "button"
        );

      selectBtn.type =
        "button";

      selectBtn.textContent =
        "Abrir";


      selectBtn.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          selectPresentationSong(
            index
          );

        }
      );


      const deleteBtn =
        document.createElement(
          "button"
        );

      deleteBtn.type =
        "button";

      deleteBtn.className =
        "delete-music";

      deleteBtn.textContent =
        "🗑️";


      deleteBtn.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          removePresentationSong(
            index
          );

        }
      );


      actions.appendChild(
        selectBtn
      );

      actions.appendChild(
        deleteBtn
      );


      item.appendChild(
        info
      );

      item.appendChild(
        actions
      );


      item.addEventListener(
        "click",
        () => {

          selectPresentationSong(
            index
          );

        }
      );


      musicList.appendChild(
        item
      );


      /*
        Separador visual
        entre as músicas.
      */

      if (
        index <
        presentationSongs.length - 1
      ) {

        const separator =
          document.createElement(
            "div"
          );

        separator.className =
          "music-separator";

        separator.textContent =
          "Próxima música";

        musicList.appendChild(
          separator
        );

      }

    }
  );


  startPresentationBtn.disabled =
    presentationSongs.length === 0;

}


/* =========================================================
   SELECIONAR MÚSICA
========================================================= */

function selectPresentationSong(index) {

  const song =
    presentationSongs[index];


  if (!song) return;


  selectedSongIndex =
    index;


  selectedSongTitle.textContent =
    song.title;


  selectedSongInfo.textContent =
    `${song.category} • ${
      song.slides.length
    } slides`;


  renderSlides(
    song
  );

  renderMusicList();

}


/* =========================================================
   MOSTRAR SLIDES
========================================================= */

function renderSlides(song) {

  slidesContainer.innerHTML =
    "";


  song.slides.forEach(
    (slide, index) => {

      const box =
        document.createElement(
          "div"
        );

      box.className =
        "slide-box";


      const number =
        document.createElement(
          "div"
        );

      number.className =
        "slide-number";

      number.textContent =
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
        number
      );

      box.appendChild(
        content
      );


      slidesContainer.appendChild(
        box
      );

    }
  );

}


/* =========================================================
   REMOVER MÚSICA DA APRESENTAÇÃO
========================================================= */

function removePresentationSong(index) {

  const song =
    presentationSongs[index];


  if (!song) return;


  const confirmDelete =
    confirm(
      Remover "${song.title}" da apresentação?
    );


  if (!confirmDelete) {
    return;
  }


  presentationSongs.splice(
    index,
    1
  );


  if (
    presentationSongs.length === 0
  ) {

    selectedSongIndex =
      -1;

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

  }

  else {

    if (
      selectedSongIndex >=
      presentationSongs.length
    ) {

      selectedSongIndex =
        presentationSongs.length - 1;

    }


    selectPresentationSong(
      selectedSongIndex
    );

  }


  renderMusicList();

}


/* =========================================================
   FILTROS
========================================================= */

const filterButtons =
  document.querySelectorAll(
    ".filter-btn"
  );


filterButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        filterButtons.forEach(
          item => {

            item.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        activeFilter =
          button.dataset.filter;


        renderMusicList();

      }
    );

  }
);


/* =========================================================
   INICIAR APRESENTAÇÃO
========================================================= */

startPresentationBtn.addEventListener(
  "click",
  () => {

    if (
      presentationSongs.length === 0
    ) {

      return;

    }


    if (
      selectedSongIndex < 0
    ) {

      selectedSongIndex =
        0;

    }


    currentSlideIndex =
      0;

    showingBlackScreen =
      false;


    presentationModal.classList.remove(
      "hidden"
    );


    document.body.style.overflow =
      "hidden";


    updatePresentation();

  }
);


/* =========================================================
   ATUALIZAR APRESENTAÇÃO
========================================================= */

function updatePresentation() {

  /*
    Tela preta entre músicas
  */

  if (showingBlackScreen) {

    presentationModal.classList.add(
      "black-screen"
    );

    presentationSongName.textContent =
      "";

    presentationText.textContent =
      "";

    presentationCounter.textContent =
      "";

    return;

  }


  presentationModal.classList.remove(
    "black-screen"
  );


  const song =
    presentationSongs[
      selectedSongIndex
    ];


  if (!song) return;


  presentationSongName.textContent =
    song.title;


  presentationText.textContent =
    song.slides[
      currentSlideIndex
    ];


  presentationCounter.textContent =
    `Música ${
      selectedSongIndex + 1
    } de ${
      presentationSongs.length
    } • Slide ${
      currentSlideIndex + 1
    } de ${
      song.slides.length
    }`;

}


/* =========================================================
   PRÓXIMO
========================================================= */

nextSlideBtn.addEventListener(
  "click",
  () => {

    if (showingBlackScreen) {

      showingBlackScreen =
        false;

      currentSlideIndex =
        0;

      updatePresentation();

      return;

    }


    const song =
      presentationSongs[
        selectedSongIndex
      ];


    if (!song) return;


    /*
      Próximo slide da mesma música
    */

    if (
      currentSlideIndex <
      song.slides.length - 1
    ) {

      currentSlideIndex++;

      updatePresentation();

      return;

    }


    /*
      Terminou a música.
      Primeiro mostra a tela preta.
    */

    if (
      selectedSongIndex <
      presentationSongs.length - 1
    ) {

      showingBlackScreen =
        true;

      updatePresentation();

      return;

    }


    /*
      Terminou tudo.
    */

    alert(
      "Fim da apresentação."
    );

  }
);


/* =========================================================
   ANTERIOR
========================================================= */

previousSlideBtn.addEventListener(
  "click",
  () => {

    if (showingBlackScreen) {

      showingBlackScreen =
        false;

      const previousSongIndex =
        selectedSongIndex - 1;


      if (
        previousSongIndex >= 0
      ) {

        selectedSongIndex =
          previousSongIndex;

        currentSlideIndex =
          presentationSongs[
            selectedSongIndex
          ].slides.length - 1;

      }


      updatePresentation();

      return;

    }


    if (
      currentSlideIndex > 0
    ) {

      currentSlideIndex--;

      updatePresentation();

      return;

    }


    /*
      Voltar para a música anterior
    */

    if (
      selectedSongIndex > 0
    ) {

      selectedSongIndex--;

      currentSlideIndex =
        presentationSongs[
          selectedSongIndex
        ].slides.length - 1;

      updatePresentation();

    }

  }
);


/* =========================================================
   FECHAR APRESENTAÇÃO
========================================================= */

closePresentationBtn.addEventListener(
  "click",
  closePresentation
);


function closePresentation() {

  presentationModal.classList.add(
    "hidden"
  );

  presentationModal.classList.remove(
    "black-screen"
  );

  document.body.style.overflow =
    "";

  showingBlackScreen =
    false;

}


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      presentationModal.classList.contains(
        "hidden"
      )
    ) {

      return;

    }


    if (
      event.key ===
      "ArrowRight"
    ) {

      nextSlideBtn.click();

    }


    if (
      event.key ===
      "ArrowLeft"
    ) {

      previousSlideBtn.click();

    }


    if (
      event.key ===
      "Escape"
    ) {

      closePresentation();

    }

  }
);


/* =========================================================
   LOGIN
========================================================= */

loginBtn.addEventListener(
  "click",
  async () => {

    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value;


    clearAuthMessage();


    if (!email || !password) {

      showAuthMessage(
        "Preencha o e-mail e a senha."
      );

      return;

    }


    loginBtn.disabled =
      true;

    loginBtn.textContent =
      "Entrando...";


    try {

      await auth.signInWithEmailAndPassword(
        email,
        password
      );

      showAuthMessage(
        "Login realizado!"
      );

    }

    catch (error) {

      console.error(error);

      showAuthMessage(
        firebaseError(error)
      );

    }

    finally {

      loginBtn.disabled =
        false;

      loginBtn.textContent =
        "Entrar";

    }

  }
);


/* =========================================================
   RENDERIZAR REPERTÓRIO SALVO
========================================================= */

function renderSavedSongs() {

  savedSongsContainer.innerHTML = "";


  if (!currentUser) {

    savedSongsContainer.innerHTML = `
      <p class="empty-message">
        Entre na sua conta para ver suas músicas salvas.
      </p>
    `;

    return;
  }


  if (savedSongs.length === 0) {

    savedSongsContainer.innerHTML = `
      <p class="empty-message">
        Você ainda não possui músicas salvas.
      </p>
    `;

    return;
  }


  const filteredSongs =
    activeFilter === "Todos"
      ? savedSongs
      : savedSongs.filter(
          song =>
            song.category === activeFilter
        );


  if (filteredSongs.length === 0) {

    savedSongsContainer.innerHTML = `
      <p class="empty-message">
        Nenhuma música encontrada nessa categoria.
      </p>
    `;

    return;
  }


  filteredSongs.forEach(song => {

    const item =
      document.createElement("div");

    item.className =
      "saved-song";


    const info =
      document.createElement("div");

    info.className =
      "saved-song-info";


    const title =
      document.createElement("div");

    title.className =
      "saved-song-title";

    title.textContent =
      song.title;


    const category =
      document.createElement("div");

    category.className =
      "saved-song-category";

    category.textContent =
      `${song.category} • ${
        song.slides
          ? song.slides.length
          : 0
      } slides`;


    info.appendChild(title);
    info.appendChild(category);


    const buttons =
      document.createElement("div");


    const loadButton =
      document.createElement("button");

    loadButton.type =
      "button";

    loadButton.textContent =
      "Abrir";


    loadButton.addEventListener(
      "click",
      () => {

        loadSavedSong(
          song
        );

      }
    );


    const deleteButton =
      document.createElement("button");

    deleteButton.type =
      "button";

    deleteButton.textContent =
      "🗑️";


    deleteButton.addEventListener(
      "click",
      () => {

        deleteSavedSong(
          song.id
        );

      }
    );


    buttons.appendChild(
      loadButton
    );

    buttons.appendChild(
      deleteButton
    );


    item.appendChild(info);

    item.appendChild(buttons);


    savedSongsContainer.appendChild(
      item
    );

  });

}


/* =========================================================
   SALVAR MÚSICA NO FIREBASE
========================================================= */

async function saveCurrentSong() {

  if (!currentUser) {

    savePanel.classList.remove(
      "hidden"
    );

    showAuthMessage(
      "Entre ou crie uma conta para salvar a música."
    );

    return;

  }


  const title =
    songTitle.value.trim();

  const category =
    songCategory.value;

  const lyrics =
    songLyrics.value.trim();

  const amount =
    parseInt(
      versesPerSlide.value,
      10
    );


  if (!title) {

    alert(
      "Digite o nome da música antes de salvar."
    );

    return;

  }


  if (!lyrics) {

    alert(
      "Digite a letra da música antes de salvar."
    );

    return;

  }


  const slides =
    createSlides(
      lyrics,
      amount
    );


  try {

    await db
      .collection("songs")
      .add({

        userId:
          currentUser.uid,

        title:
          title,

        category:
          category,

        lyrics:
          lyrics,

        versesPerSlide:
          amount,

        slides:
          slides,

        createdAt:
          firebase.firestore.FieldValue.serverTimestamp()

      });


    alert(
      "🎵 Música salva com sucesso!"
    );


    /*
      Também coloca a música
      na apresentação atual.
    */

    const alreadyExists =
      presentationSongs.some(
        song =>
          song.title === title
      );


    if (!alreadyExists) {

      presentationSongs.push({

        id:
          createLocalId(),

        title:
          title,

        category:
          category,

        slides:
          slides,

        saved:
          true,

        createdAt:
          Date.now()

      });


      selectedSongIndex =
        presentationSongs.length - 1;


      renderMusicList();

      selectPresentationSong(
        selectedSongIndex
      );

    }

  }

  catch (error) {

    console.error(error);

    alert(
      "Não foi possível salvar a música:\n\n" +
      firebaseError(error)
    );

  }

}


/* =========================================================
   BOTÃO SALVAR MÚSICA
========================================================= */

const saveMusicAction =
  document.createElement("button");

saveMusicAction.type =
  "button";

saveMusicAction.textContent =
  "💾 Salvar música atual";

saveMusicAction.className =
  "btn primary";


saveMusicAction.style.marginTop =
  "12px";

saveMusicAction.style.width =
  "100%";


/*
  Coloca o botão dentro
  da área do usuário.
*/

userArea.appendChild(
  saveMusicAction
);


saveMusicAction.addEventListener(
  "click",
  saveCurrentSong
);


/* =========================================================
   CARREGAR MÚSICA SALVA
========================================================= */

function loadSavedSong(song) {

  if (!song) {
    return;
  }


  /*
    Preenche os campos
    do editor.
  */

  songTitle.value =
    song.title || "";

  songCategory.value =
    song.category || "Outros";

  songLyrics.value =
    song.lyrics || "";

  versesPerSlide.value =
    song.versesPerSlide || 2;


  /*
    Cria uma música para
    a apresentação atual.
  */

  const music = {

    id:
      createLocalId(),

    title:
      song.title,

    category:
      song.category,

    slides:
      song.slides || createSlides(
        song.lyrics || "",
        song.versesPerSlide || 2
      ),

    saved:
      true,

    createdAt:
      Date.now()

  };


  presentationSongs.push(
    music
  );


  selectedSongIndex =
    presentationSongs.length - 1;


  renderMusicList();

  selectPresentationSong(
    selectedSongIndex
  );


  /*
    Fecha o painel para
    voltar à tela principal.
  */

  savePanel.classList.add(
    "hidden"
  );

}


/* =========================================================
   EXCLUIR MÚSICA SALVA
========================================================= */

async function deleteSavedSong(id) {

  if (!currentUser) {
    return;
  }


  const song =
    savedSongs.find(
      item =>
        item.id === id
    );


  if (!song) {
    return;
  }


  const confirmed =
    confirm(
      Excluir permanentemente "${song.title}"?
    );


  if (!confirmed) {
    return;
  }


  try {

    await db
      .collection("songs")
      .doc(id)
      .delete();


  }

  catch (error) {

    console.error(error);

    alert(
      "Não foi possível excluir a música:\n\n" +
      firebaseError(error)
    );

  }

}


/* =========================================================
   FILTROS DO REPERTÓRIO
========================================================= */

filterButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        activeFilter =
          button.dataset.filter;


        renderSavedSongs();

      }
    );

  }
);


/* =========================================================
   SALVAR A MÚSICA PELO BOTÃO PRINCIPAL
========================================================= */

function createSaveButtonForEditor() {

  const button =
    document.createElement("button");

  button.type =
    "button";

  button.textContent =
    "💾 Salvar música";

  button.className =
    "btn secondary";


  button.style.minHeight =
    "43px";


  button.addEventListener(
    "click",
    () => {

      if (!currentUser) {

        savePanel.classList.remove(
          "hidden"
        );

        showAuthMessage(
          "Entre ou crie uma conta para salvar esta música."
        );

        return;

      }


      saveCurrentSong();

    }
  );


  const editorBottom =
    document.querySelector(
      ".editor-bottom"
    );


  editorBottom.appendChild(
    button
  );

}


/* =========================================================
   INICIALIZAÇÃO DO BOTÃO
========================================================= */

createSaveButtonForEditor();


/* =========================================================
   SALVAR AUTOMATICAMENTE A MÚSICA GERADA
   NA APRESENTAÇÃO
========================================================= */

function addGeneratedSongToPresentation(
  title,
  category,
  slides
) {

  const music = {

    id:
      createLocalId(),

    title:
      title,

    category:
      category,

    slides:
      slides,

    saved:
      false,

    createdAt:
      Date.now()

  };


  presentationSongs.push(
    music
  );


  selectedSongIndex =
    presentationSongs.length - 1;


  renderMusicList();

  selectPresentationSong(
    selectedSongIndex
  );

}


/* =========================================================
   LIMPAR FORMULÁRIO
========================================================= */

function clearMusicForm() {

  songTitle.value =
    "";

  songLyrics.value =
    "";

}


/* =========================================================
   ATALHO CTRL + ENTER
========================================================= */

songLyrics.addEventListener(
  "keydown",
  event => {

    if (
      event.ctrlKey &&
      event.key === "Enter"
    ) {

      generateBtn.click();

    }

  }
);


/* =========================================================
   FECHAR PAINEL AO CLICAR FORA
========================================================= */

document.addEventListener(
  "click",
  event => {

    if (
      savePanel.classList.contains(
        "hidden"
      )
    ) {

      return;

    }


    if (
      savePanel.contains(event.target)
    ) {

      return;

    }


    if (
      saveMenuBtn.contains(event.target)
    ) {

      return;

    }


    savePanel.classList.add(
      "hidden"
    );

  }
);


/* =========================================================
   LIMPAR MENSAGEM QUANDO DIGITAR
========================================================= */

emailInput.addEventListener(
  "input",
  clearAuthMessage
);

passwordInput.addEventListener(
  "input",
  clearAuthMessage
);


/* =========================================================
   ESTADO INICIAL
========================================================= */

renderMusicList();

renderSavedSongs();


console.log(
  "🎵 Sistema de repertório carregado com sucesso."
);
   CR
