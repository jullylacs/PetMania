// DOM Elements
    const dom = {
        header: document.querySelector('header'),
        menuToggle: document.querySelector('.menu-toggle'),
        navLinks: document.querySelector('.nav-links'),
        bookingForm: document.getElementById('bookingForm'),
        modal: document.getElementById('confirmationModal'),
        closeModal: document.querySelector('.close'),
        currentYear: document.getElementById('currentYear')
    };

    // Initialize
    function init() {
        setupEventListeners();
        setCopyrightYear();
    }


document.addEventListener('DOMContentLoaded', function() {
        // Adiciona o evento de clique a todos os botões de adoção/doação
        document.querySelectorAll('a[href="#booking"]').forEach(button => {
            button.addEventListener('click', function(e) {
                // Verifica se o botão tem o atributo data-pet
                if (this.hasAttribute('data-pet')) {
                    const petName = this.getAttribute('data-pet');
                    const petSelect = document.getElementById('pet_select');
                    
                    // Define o valor do select para o pet correspondente
                    if (petSelect) {
                        petSelect.value = petName;
                    }
                }
                
                // Rola suavemente até o formulário
                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Atualiza o ano no rodapé
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    });

    // Event Listeners
    function setupEventListeners() {
        // Scroll effects
        window.addEventListener('scroll', handleScroll);
        
        // Mobile menu
        dom.menuToggle.addEventListener('click', toggleMobileMenu);
        
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', smoothScroll);
        });
        
        // Animations on scroll
        window.addEventListener('scroll', animateOnScroll);
        window.addEventListener('load', animateOnScroll);
        
        // Form submission
        dom.bookingForm.addEventListener('submit', handleFormSubmit);
        
        // Modal controls
        dom.closeModal.addEventListener('click', closeModal);
        window.addEventListener('click', clickOutsideModal);
        document.addEventListener('keydown', escapeCloseModal);
    }

    // Handlers
    function handleScroll() {
        dom.header.classList.toggle('scrolled', window.scrollY > 50);
    }

    function toggleMobileMenu() {
        dom.navLinks.classList.toggle('show');
        this.setAttribute('aria-expanded', dom.navLinks.classList.contains('show'));
    }

    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }

        // Close mobile menu if open
        if (dom.navLinks.classList.contains('show')) {
            dom.navLinks.classList.remove('show');
            dom.menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    function animateOnScroll() {
        const elements = document.querySelectorAll('.room-card, .service-card, .booking-form');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (validateForm()) {
            dom.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        dom.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function clickOutsideModal(e) {
        if (e.target === dom.modal) {
            closeModal();
        }
    }

    function escapeCloseModal(e) {
        if (e.key === 'Escape' && dom.modal.style.display === 'block') {
            closeModal();
        }
    }

    // Form Validation
    function validateForm() {
        const fields = [
            { 
                element: document.getElementById('name'), 
                validate: val => val.trim() !== '', 
                error: 'Por favor, insira seu nome' 
            },
            { 
                element: document.getElementById('email'), 
                validate: val => isValidEmail(val), 
                error: 'Por favor, insira um email válido' 
            },
            { 
                element: document.getElementById('check-in'), 
                validate: val => val !== '', 
                error: 'Por favor, selecione uma data de chegada' 
            },
            { 
                element: document.getElementById('check-out'), 
                validate: val => {
                    if (val === '') return false;
                    const checkIn = document.getElementById('check-in').value;
                    return new Date(val) > new Date(checkIn);
                }, 
                error: 'A data de partida deve ser após a data de chegada' 
            },
            { 
                element: document.getElementById('room-type'), 
                validate: val => val !== '', 
                error: 'Por favor, selecione uma opção' 
            }
        ];

        let isValid = true;

        fields.forEach(({element, validate, error}) => {
            if (!validate(element.value)) {
                showError(element, error);
                isValid = false;
            } else {
                removeError(element);
            }
        });

        if (isValid) {
            resetForm();
        }

        return isValid;
    }

    function resetForm() {
        dom.bookingForm.reset();
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        let error = formGroup.querySelector('.error-message');
        
        if (!error) {
            error = document.createElement('div');
            error.className = 'error-message';
            formGroup.appendChild(error);
        }
        
        error.textContent = message;
        input.classList.add('error');
    }

    function removeError(input) {
        const formGroup = input.parentElement;
        const error = formGroup.querySelector('.error-message');
        
        if (error) {
            formGroup.removeChild(error);
        }
        
        input.classList.remove('error');
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Utility
    function setCopyrightYear() {
        dom.currentYear.textContent = new Date().getFullYear();
    }

    // Initialize the app
    init();

    // Modifique a função handleFormSubmit para limpar após sucesso
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        // Mostra o modal de confirmação
        dom.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Limpa o formulário (adiciona um pequeno delay para melhor UX)
        setTimeout(resetForm, 1000);
        
        // Opcional: Envie os dados do formulário para o servidor aqui
        // sendFormData();
    }
}

// Função resetForm melhorada
function resetForm() {
    // Reseta todos os campos do formulário
    dom.bookingForm.reset();
    
    // Remove todas as mensagens de erro visíveis
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
    
    // Remove as classes de erro dos inputs
    document.querySelectorAll('.error').forEach(input => {
        input.classList.remove('error');
    });
}

// Mantenha a função validateForm como está
function validateForm() {
    const fields = [
        { 
            element: document.getElementById('name'), 
            validate: val => val.trim() !== '', 
            error: 'Por favor, insira seu nome' 
        },
        // ... outros campos de validação ...
    ];

    let isValid = true;

    fields.forEach(({element, validate, error}) => {
        if (!validate(element.value)) {
            showError(element, error);
            isValid = false;
        } else {
            removeError(element);
        }
    });

    return isValid;
}