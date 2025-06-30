// AI Helper - Funcionalidades de IA integradas
class AIHelper {
    constructor() {
        this.isEnabled = true;
        this.apiKey = "AIzaSyAav51WPs2n8k22ccQ9n7yEtujWTH_il38"; // API Key
        this.apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
        this.initializeModal();
    }

    initializeModal() {
        // Configurar modal de IA
        this.aiModal = document.getElementById('ai-modal');
        this.aiModalBackdrop = document.getElementById('ai-modal-backdrop');
        this.aiModalContent = document.getElementById('ai-modal-content');
        this.aiModalBody = document.getElementById('ai-modal-body');
        this.aiModalTitle = document.getElementById('ai-modal-title');
        this.aiCloseModalBtn = document.getElementById('ai-modal-close-btn');

        if (this.aiCloseModalBtn) {
            this.aiCloseModalBtn.addEventListener('click', () => this.hideAIModal());
        }
        
        if (this.aiModalBackdrop) {
            this.aiModalBackdrop.addEventListener('click', () => this.hideAIModal());
        }
    }

    explainArticle(articleTitle, articleText) {
        console.log(`Solicitação de explicação para: ${articleTitle}`);
        
        if (this.aiModalTitle) {
            this.aiModalTitle.textContent = `✨ A Explicar: ${articleTitle}`;
        }
        
        const prompt = `Você é um assistente jurídico. Explique o seguinte artigo da Lei 14.133 em linguagem simples e clara, como se estivesse a falar para uma pessoa leiga que não entende de jargão jurídico. O foco é na clareza e facilidade de compreensão.\n\nArtigo:\n"${articleText}"`;
        
        this.callGemini(prompt);
    }

    summarizeChapter(chapterTitle, chapterText) {
        console.log(`Solicitação de resumo para: ${chapterTitle}`);
        
        if (this.aiModalTitle) {
            this.aiModalTitle.textContent = `✨ Resumo do ${chapterTitle}`;
        }
        
        const prompt = `Você é um assistente jurídico. Resuma os pontos-chave e as principais regras do seguinte capítulo da Lei 14.133. O resumo deve ser conciso e focado nos aspetos mais importantes para um gestor público entender rapidamente o conteúdo.\n\nCapítulo:\n"${chapterText}"`;
        
        this.callGemini(prompt);
    }

    showAIModal() {
        if (this.aiModal) {
            this.aiModal.classList.remove('hidden');
            setTimeout(() => {
                if (this.aiModalBackdrop) {
                    this.aiModalBackdrop.classList.remove('opacity-0');
                }
                if (this.aiModalContent) {
                    this.aiModalContent.classList.remove('opacity-0', 'scale-95');
                }
            }, 10);
        }
    }

    hideAIModal() {
        if (this.aiModalBackdrop) {
            this.aiModalBackdrop.classList.add('opacity-0');
        }
        if (this.aiModalContent) {
            this.aiModalContent.classList.add('opacity-0', 'scale-95');
        }
        setTimeout(() => {
            if (this.aiModal) {
                this.aiModal.classList.add('hidden');
            }
        }, 300);
    }

    async callGemini(prompt) {
        if (!this.aiModalBody) {
            console.error('Modal body não encontrado');
            return;
        }

        // Mostrar loading
        this.aiModalBody.innerHTML = '<div class="flex items-center justify-center p-8"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div><p class="ml-4 text-slate-600">A processar com a IA...</p></div>';
        this.showAIModal();

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const requestUrl = `${this.apiUrl}?key=${this.apiKey}`;

        try {
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                
                let text = result.candidates[0].content.parts[0].text;
                
                // Formatação básica do texto
                text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
                text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
                text = text.replace(/\n\n/g, '</p><p class="text-slate-600 leading-relaxed mt-4">');
                text = text.replace(/\n/g, '<br>');
                
                this.aiModalBody.innerHTML = `<div class="text-slate-600 leading-relaxed">${text}</div>`;
            } else {
                throw new Error("Resposta da IA inválida ou vazia.");
            }
        } catch (error) {
            console.error("Gemini API call failed:", error);
            this.aiModalBody.innerHTML = `
                <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p class="font-bold">Erro ao conectar com a IA</p>
                    <p>Não foi possível obter a resposta da IA. Por favor, tente novamente mais tarde.</p>
                    <p class="text-sm mt-2">Detalhes: ${error.message}</p>
                </div>
            `;
        }
    }

    // Métodos de fallback para mostrar mock content se a API falhar
    generateMockExplanation(articleTitle) {
        const explanations = {
            'Art. 1º': 'Este artigo estabelece o âmbito de aplicação da Lei 14.133/2021, definindo quais órgãos e entidades devem seguir suas normas de licitação e contratação. Basicamente, se aplica a toda a administração pública direta e indireta.',
            'Art. 2º': 'Define os tipos de contratações abrangidas pela lei, incluindo compras, locações, obras, serviços e outros. É uma lista abrangente que cobre praticamente todas as necessidades da administração pública.',
            'Art. 5º': 'Lista todos os princípios fundamentais que devem ser observados nos processos licitatórios, como legalidade, transparência, economicidade e competitividade.',
        };
        
        return explanations[articleTitle] || 'Explicação detalhada não disponível no momento. A funcionalidade de IA será ativada em breve.';
    }

    generateMockSummary(chapterTitle) {
        const summaries = {
            'CAPÍTULO I - DO ÂMBITO DE APLICAÇÃO DESTA LEI': 'Este capítulo define quais órgãos e entidades devem seguir a Lei 14.133, estabelece as situações de aplicação e exceções. É fundamental para entender o escopo da lei.',
            'CAPÍTULO II - DOS PRINCÍPIOS': 'Estabelece os princípios fundamentais que regem as licitações públicas, criando a base ética e legal para todos os processos.',
        };
        
        const key = Object.keys(summaries).find(k => chapterTitle.includes(k.split(' - ')[1]));
        return summaries[key] || 'Resumo não disponível no momento. A funcionalidade de IA será ativada em breve.';
    }
}

// Criar instância global
window.aiHelper = new AIHelper();
