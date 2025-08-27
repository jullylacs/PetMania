const swiper = new Swiper(".swiper-container", {
  direction: "vertical",
  effect: "fade",
  speed: 1000,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  mousewheel: {
    invert: false,
    forceToAxis: false,
    thresholdDelta: 50,
    sensitivity: 1,
  },
  on: {
    init: function () {
      let activeSlide = this.slides[this.activeIndex];
      let background = activeSlide.querySelector(".background");
      background.classList.add("animation");
    },
    slideChange: function () {
      this.slides.forEach((slide) => {
        let background = slide.querySelector(".background");
        if (background) {
          background.classList.remove("animation");
        }
      });
      let activeSlide = this.slides[this.activeIndex];
      let background = activeSlide.querySelector(".background");
      if (background) {
        background.classList.add("animation");
      }
    },
  },
});

if (validateForm()) {
  resetForm(); // Limpa primeiro
  dom.modal.style.display = "block"; // Depois mostra o modal
}

// CONSTANTES E SELEÇÃO DE ELEMENTOS
const DOM = {
  header: document.querySelector("header"),
  menuToggle: document.querySelector(".menu-toggle"),
  navLinks: document.querySelector(".nav-links"),
  bookingForm: document.getElementById("bookingForm"),
  modal: document.getElementById("confirmationModal"),
  closeModal: document.querySelector(".close"),
  currentYear: document.getElementById("currentYear"),
};

// FUNÇÕES DE INICIALIZAÇÃO
function init() {
  setupEventListeners();
  setCopyrightYear();
}

// CONFIGURAÇÃO DE EVENT LISTENERS
function setupEventListeners() {
  // Navegação
  window.addEventListener("scroll", handleScroll);
  DOM.menuToggle.addEventListener("click", toggleMobileMenu);

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", smoothScroll);
  });

  // Animações
  window.addEventListener("scroll", animateOnScroll);
  window.addEventListener("load", animateOnScroll);

  // Formulário
  DOM.bookingForm.addEventListener("submit", handleFormSubmit);

  // Modal
  DOM.closeModal.addEventListener("click", closeModal);
  window.addEventListener("click", clickOutsideModal);
  document.addEventListener("keydown", escapeCloseModal);
}

// FUNÇÕES DE NAVEGAÇÃO
function handleScroll() {
  DOM.header.classList.toggle("scrolled", window.scrollY > 50);
}

function toggleMobileMenu() {
  DOM.navLinks.classList.toggle("show");
  this.setAttribute("aria-expanded", DOM.navLinks.classList.contains("show"));
}

function smoothScroll(e) {
  e.preventDefault();
  const targetId = this.getAttribute("href").substring(1);
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop - 100,
      behavior: "smooth",
    });
  }

  if (DOM.navLinks.classList.contains("show")) {
    DOM.navLinks.classList.remove("show");
    DOM.menuToggle.setAttribute("aria-expanded", "false");
  }
}

// FUNÇÕES DE ANIMAÇÃO
function animateOnScroll() {
  const elements = document.querySelectorAll(".room-card, .service-card, .booking-form");
  const windowHeight = window.innerHeight;

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      element.classList.add("animate");
    }
  });
}

// FUNÇÕES DO FORMULÁRIO
function handleFormSubmit(e) {
  e.preventDefault();

  if (validateForm()) {
    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      check_in: document.getElementById("check-in").value,
      horario: document.getElementById("horario").value, // corrigido: 'horario' minúsculo
      room_type: document.getElementById("animal-type").value,
    };

    // Enviar dados para o backend
    fetch("/agendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Usando o formato de formulário
      },
      body: new URLSearchParams(data).toString(), // Converte objeto em formato de query string
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao agendar");
        return response.text(); // ou .json() se você preferir no backend
      })
      .then((result) => {
        // Sucesso: mostra o modal e limpa o formulário
        console.log(result); // ou mostrar no modal
        DOM.modal.style.display = "block";
        document.body.style.overflow = "hidden";
        setTimeout(resetForm, 1000);
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Falha ao enviar agendamento. Tente novamente.");
      });
  }
}

function validateForm() {
  const fields = [
    { element: document.getElementById("name"), validate: (val) => val.trim() !== "", error: "Por favor, insira seu nome" },
    { element: document.getElementById("email"), validate: (val) => isValidEmail(val), error: "Por favor, insira um email válido" },
    { element: document.getElementById("check-in"), validate: (val) => val !== "", error: "Por favor, selecione uma data" },
    { element: document.getElementById("horario"), validate: (val) => val !== "", error: "Por favor, selecione um horário" }, // corrigido para 'horario' minúsculo
    { element: document.getElementById("animal-type"), validate: (val) => val !== "", error: "Por favor, selecione um animal" },
  ];

  let isValid = true;

  fields.forEach(({ element, validate, error }) => {
    if (!validate(element.value)) {
      showError(element, error);
      isValid = false;
    } else {
      removeError(element);
    }
  });

  return isValid;
}

function showError(input, message) {
  const formGroup = input.parentElement;
  let error = formGroup.querySelector(".error-message") || document.createElement("div");
  error.className = "error-message";
  error.textContent = message;
  formGroup.appendChild(error);
  input.classList.add("error");
}

function removeError(input) {
  const formGroup = input.parentElement;
  const error = formGroup.querySelector(".error-message");
  if (error) formGroup.removeChild(error);
  input.classList.remove("error");
}

function resetForm() {
  DOM.bookingForm.reset();
  document.querySelectorAll(".error-message, .error").forEach((el) => {
    el.classList?.remove("error");
    el.remove?.();
  });
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// FUNÇÕES DO MODAL
function closeModal() {
  DOM.modal.style.display = "none";
  document.body.style.overflow = "auto";
}

function clickOutsideModal(e) {
  if (e.target === DOM.modal) closeModal();
}

function escapeCloseModal(e) {
  if (e.key === "Escape" && DOM.modal.style.display === "block") closeModal();
}

// FUNÇÕES UTILITÁRIAS
function setCopyrightYear() {
  DOM.currentYear.textContent = new Date().getFullYear();
}

// INICIALIZAÇÃO
init();
