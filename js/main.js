// Arquivo principal que inicializa toda a aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lei 14.133 - Sistema inicializado');
    
    // Inicializar todas as funcionalidades
    initializeModals();
    initializeSearch();
});

function initializeModals() {
    // Modal para publicação original
    const openModalButton = document.getElementById('open-modal-button');
    const closeModalButton = document.getElementById('close-modal-button');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContainer = document.getElementById('modal-container');

    if (openModalButton && modalOverlay && modalContainer) {
        openModalButton.addEventListener('click', () => {
            modalOverlay.classList.remove('hidden');
            modalContainer.classList.remove('hidden');
        });

        const closeModal = () => {
            modalOverlay.classList.add('hidden');
            modalContainer.classList.add('hidden');
        };

        if (closeModalButton) {
            closeModalButton.addEventListener('click', closeModal);
        }

        modalOverlay.addEventListener('click', closeModal);
    }
}

function showPublicationModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-4xl mx-4 max-h-96">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-slate-800">Publicação Original</h3>
                <button class="close-modal text-slate-500 hover:text-slate-700 text-xl font-bold">&times;</button>
            </div>
            <div class="text-slate-600 leading-relaxed">
                <p class="text-center">
                    <strong>LEI Nº 14.133, DE 1º DE ABRIL DE 2021</strong><br>
                    Presidência da República<br>
                    Secretaria-Geral<br>
                    Subchefia para Assuntos Jurídicos
                </p>
                <p class="mt-4">
                    Estabelece normas gerais de licitação e contratação para as Administrações Públicas diretas, 
                    autárquicas e fundacionais da União, dos Estados, do Distrito Federal e dos Municípios, 
                    e revoga a Lei nº 8.666, de 21 de junho de 1993, e a Lei nº 10.520, de 17 de julho de 2002.
                </p>
                <p class="mt-4 text-sm">
                    <strong>O PRESIDENTE DA REPÚBLICA</strong> Faço saber que o Congresso Nacional decreta 
                    e eu sanciono a seguinte Lei:
                </p>
            </div>
            <div class="mt-6 text-right">
                <button class="close-modal bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">Fechar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners para fechar
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });

    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function initializeSearch() {
    // Funcionalidade de busca pode ser implementada aqui
    console.log('Funcionalidade de busca inicializada');
    
    // Placeholder para funcionalidade de busca futura
    // Pode incluir:
    // - Busca por texto nos artigos
    // - Filtros por capítulo/título
    // - Busca por palavras-chave
}

// Função utilitária para scroll suave
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função para destacar texto
function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

// Função para copiar texto para área de transferência
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Texto copiado para a área de transferência!', 'success');
        }).catch(err => {
            console.error('Erro ao copiar texto:', err);
            showNotification('Erro ao copiar texto', 'error');
        });
    } else {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Texto copiado para a área de transferência!', 'success');
        } catch (err) {
            console.error('Erro ao copiar texto:', err);
            showNotification('Erro ao copiar texto', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-blue-500 text-white'
    };
    
    notification.classList.add(...colors[type].split(' '));
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Exportar funções para uso global
window.AppUtils = {
    smoothScrollTo,
    highlightText,
    copyToClipboard,
    showNotification
};
