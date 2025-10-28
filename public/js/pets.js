// Animações ao scroll
document.addEventListener('DOMContentLoaded', function() {
    // Função para animar elementos quando entrarem na viewport
    function animateOnScroll() {
        const elements = document.querySelectorAll('.pet-card, .feature-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate-fade-in');
            }
        });
    }

    // Executar a animação inicial
    animateOnScroll();

    // Adicionar listener para o scroll
    window.addEventListener('scroll', animateOnScroll);

    // Filtro de pets
    const filterButtons = document.querySelectorAll('.filter-btn');
    const petCards = document.querySelectorAll('.pet-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Atualizar classe ativa dos botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filtrar os cards
            petCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('show'), 10);
                } else {
                    card.classList.remove('show');
                    card.style.display = 'none';
                }
            });
        });
    });

    // Validação do formulário de adoção
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm) {
        adoptionForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validar campos obrigatórios
            const requiredFields = adoptionForm.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            // Validar email
            const emailField = document.getElementById('email');
            if (emailField && !isValidEmail(emailField.value)) {
                isValid = false;
                emailField.classList.add('is-invalid');
            }

            // Se tudo estiver válido, enviar o formulário
            if (isValid) {
                // Aqui você pode adicionar a lógica para enviar o formulário
                showSuccessMessage();
                adoptionForm.reset();
                // Fechar o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('adoptionModal'));
                modal.hide();
            }
        });
    }

    // Função para validar email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Função para mostrar mensagem de sucesso
    function showSuccessMessage() {
        const toast = document.createElement('div');
        toast.classList.add('toast', 'show', 'position-fixed', 'bottom-0', 'end-0', 'm-3');
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-header bg-success text-white">
                <strong class="me-auto">Sucesso!</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                Seu pedido de adoção foi enviado com sucesso! Entraremos em contato em breve.
            </div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // Máscaras para campos do formulário
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 11);
            
            if (value.length > 2) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            }
            if (value.length > 9) {
                value = `${value.substring(0, 10)}-${value.substring(10)}`;
            }
            
            e.target.value = value;
        });
    }

    // Lazy loading para imagens
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback para navegadores que não suportam lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
        document.body.appendChild(script);

        script.onload = function() {
            const observer = lozad();
            observer.observe();
        }
    }
});

// Smooth scroll para links âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});