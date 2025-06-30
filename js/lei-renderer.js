class LeiRenderer {
    constructor() {
        this.estrutura = null;
        this.artigos = null;
        this.contentContainer = document.getElementById('document-content');
        this.navigationPanel = document.getElementById('navigation-panel');
    }

    async init() {
        try {
            this.showLoading();
            await this.loadData();
            this.renderContent();
            this.generateNavigation();
            this.setupEventListeners();
            this.hideLoading();
        } catch (error) {
            console.error('Erro ao inicializar:', error);
            this.renderError();
        }
    }

    showLoading() {
        this.contentContainer.innerHTML = `
            <div class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                <span class="ml-3 text-slate-600">Carregando conteúdo da lei...</span>
            </div>
        `;
        this.navigationPanel.innerHTML = `
            <div class="flex items-center justify-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
            </div>
        `;
    }

    hideLoading() {
        // Loading será substituído pelo conteúdo real
    }

    async loadData() {
        try {
            const [estruturaResponse, artigosResponse, artigosParte2Response, artigosParte3Response, artigosParte4Response, artigosParte5Response, artigosParte6Response, artigosParte7Response, artigosParte8Response, artigosParte9Response] = await Promise.all([
                fetch('./data/lei-structure.json'),
                fetch('./data/artigos.json'),
                fetch('./data/artigos-parte2.json'),
                fetch('./data/artigos-parte3.json'),
                fetch('./data/artigos-parte4.json'),
                fetch('./data/artigos-parte5.json'),
                fetch('./data/artigos-parte6.json'),
                fetch('./data/artigos-parte7.json'),
                fetch('./data/artigos-parte8.json'),
                fetch('./data/artigos-parte9.json')
            ]);

            if (!estruturaResponse.ok) {
                throw new Error(`Erro ao carregar estrutura: ${estruturaResponse.status} ${estruturaResponse.statusText}`);
            }
            
            if (!artigosResponse.ok) {
                throw new Error(`Erro ao carregar artigos: ${artigosResponse.status} ${artigosResponse.statusText}`);
            }

            if (!artigosParte2Response.ok) {
                throw new Error(`Erro ao carregar artigos parte 2: ${artigosParte2Response.status} ${artigosParte2Response.statusText}`);
            }

            if (!artigosParte3Response.ok) {
                throw new Error(`Erro ao carregar artigos parte 3: ${artigosParte3Response.status} ${artigosParte3Response.statusText}`);
            }

            if (!artigosParte4Response.ok) {
                throw new Error(`Erro ao carregar artigos parte 4: ${artigosParte4Response.status} ${artigosParte4Response.statusText}`);
            }

            const responses = [artigosResponse, artigosParte2Response, artigosParte3Response, artigosParte4Response, artigosParte5Response, artigosParte6Response, artigosParte7Response, artigosParte8Response, artigosParte9Response];
            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) {
                    throw new Error(`Erro ao carregar artigos parte ${i + 1}: ${responses[i].status} ${responses[i].statusText}`);
                }
            }

            this.estrutura = await estruturaResponse.json();
            const artigosData = await Promise.all(responses.map(res => res.json()));

            // Combinar os artigos de todos os arquivos
            this.artigos = {
                artigos: artigosData.reduce((acc, data) => ({ ...acc, ...data.artigos }), {})
            };

            // Verificar se os dados foram carregados corretamente
            if (!this.estrutura || !this.estrutura.lei) {
                throw new Error('Estrutura da lei inválida');
            }
            
            if (!this.artigos || !this.artigos.artigos) {
                throw new Error('Dados dos artigos inválidos');
            }

            console.log('Dados carregados com sucesso:', {
                titulos: this.estrutura.lei.titulos?.length || 0,
                artigos: Object.keys(this.artigos.artigos).length
            });

        } catch (error) {
            console.error('Erro detalhado ao carregar dados:', error);
            throw error;
        }
    }

    renderContent() {
        this.contentContainer.innerHTML = '';
        
        if (!this.estrutura || !this.estrutura.lei || !this.estrutura.lei.titulos) {
            console.error('Estrutura da lei não foi carregada corretamente');
            this.renderError();
            return;
        }
        
        this.estrutura.lei.titulos.forEach(titulo => {
            const tituloElement = this.createTituloElement(titulo);
            this.contentContainer.appendChild(tituloElement);
        });
    }

    createTituloElement(titulo) {
        const section = document.createElement('section');
        section.id = titulo.id;
        section.className = 'content-section space-y-6';

        const titleH2 = document.createElement('h2');
        titleH2.className = 'text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2';
        titleH2.textContent = `TÍTULO ${titulo.numero} - ${titulo.nome}`;
        section.appendChild(titleH2);

        titulo.capitulos.forEach(capitulo => {
            const capituloElement = this.createCapituloElement(capitulo);
            section.appendChild(capituloElement);
        });

        return section;
    }

    createCapituloElement(capitulo) {
        const section = document.createElement('section');
        section.id = capitulo.id;
        section.className = 'content-section space-y-6 ml-4';

        const titleH3 = document.createElement('h3');
        titleH3.className = 'text-xl font-bold text-sky-700 border-b border-sky-200 pb-2';
        titleH3.textContent = `CAPÍTULO ${capitulo.numero} - ${capitulo.nome}`;
        section.appendChild(titleH3);

        // Processar artigos diretos do capítulo
        if (capitulo.artigos && Array.isArray(capitulo.artigos)) {
            capitulo.artigos.forEach(artigoId => {
                if (this.artigos && this.artigos.artigos && this.artigos.artigos[artigoId]) {
                    const artigoData = this.artigos.artigos[artigoId];
                    const artigoElement = this.createArtigoElement(artigoId, artigoData);
                    section.appendChild(artigoElement);
                } else {
                    console.warn(`Artigo ${artigoId} não encontrado nos dados`);
                }
            });
        }

        // Processar seções do capítulo
        if (capitulo.secoes && Array.isArray(capitulo.secoes)) {
            capitulo.secoes.forEach(secao => {
                const secaoElement = this.createSecaoElement(secao);
                section.appendChild(secaoElement);
            });
        }

        return section;
    }

    createSecaoElement(secao) {
        const section = document.createElement('section');
        section.id = secao.id;
        section.className = 'content-section space-y-4 ml-8';

        const titleH4 = document.createElement('h4');
        titleH4.className = 'text-lg font-semibold text-slate-700 border-b border-slate-100 pb-1';
        titleH4.textContent = `Seção ${secao.numero} - ${secao.nome}`;
        section.appendChild(titleH4);

        // Processar artigos da seção
        if (secao.artigos && Array.isArray(secao.artigos)) {
            secao.artigos.forEach(artigoId => {
                if (this.artigos && this.artigos.artigos && this.artigos.artigos[artigoId]) {
                    const artigoData = this.artigos.artigos[artigoId];
                    const artigoElement = this.createArtigoElement(artigoId, artigoData);
                    section.appendChild(artigoElement);
                } else {
                    console.warn(`Artigo ${artigoId} não encontrado nos dados`);
                }
            });
        }

        // Processar subseções se existirem
        if (secao.subsecoes && Array.isArray(secao.subsecoes)) {
            secao.subsecoes.forEach(subsecao => {
                const subsecaoElement = this.createSubsecaoElement(subsecao);
                section.appendChild(subsecaoElement);
            });
        }

        return section;
    }

    createSubsecaoElement(subsecao) {
        const section = document.createElement('section');
        section.id = subsecao.id;
        section.className = 'content-section space-y-4 ml-12';

        const titleH5 = document.createElement('h5');
        titleH5.className = 'text-base font-medium text-slate-600 border-b border-slate-50 pb-1';
        titleH5.textContent = `Subseção ${subsecao.numero} - ${subsecao.nome}`;
        section.appendChild(titleH5);

        // Processar artigos da subseção
        if (subsecao.artigos && Array.isArray(subsecao.artigos)) {
            subsecao.artigos.forEach(artigoId => {
                if (this.artigos && this.artigos.artigos && this.artigos.artigos[artigoId]) {
                    const artigoData = this.artigos.artigos[artigoId];
                    const artigoElement = this.createArtigoElement(artigoId, artigoData);
                    section.appendChild(artigoElement);
                } else {
                    console.warn(`Artigo ${artigoId} não encontrado nos dados`);
                }
            });
        }

        return section;
    }

    createArtigoElement(id, artigo) {
        const article = document.createElement('article');
        article.id = id;
        article.className = 'content-section bg-white p-6 rounded-lg shadow-sm border border-slate-200/80';

        // Header do artigo
        const header = document.createElement('div');
        header.className = 'flex justify-between items-start mb-3';

        const title = document.createElement('h4');
        title.className = 'font-bold text-slate-800';
        title.textContent = `Art. ${artigo.numero}`;

        const explainButton = document.createElement('button');
        explainButton.className = 'explain-article-btn text-xs bg-sky-100 text-sky-700 hover:bg-sky-200 font-semibold py-1 px-3 rounded-full transition-colors';
        explainButton.textContent = '✨ Explique este Artigo';

        header.appendChild(title);
        header.appendChild(explainButton);
        article.appendChild(header);

        // Conteúdo principal
        const mainContent = document.createElement('p');
        mainContent.className = 'mb-3';
        mainContent.textContent = artigo.conteudo;
        article.appendChild(mainContent);

        // Incisos
        if (artigo.incisos && artigo.incisos.length > 0) {
            const incisosElement = this.createIncisosElement(artigo.incisos);
            article.appendChild(incisosElement);
        }

        // Parágrafos
        if (artigo.paragrafos && artigo.paragrafos.length > 0) {
            const paragrafosDiv = this.createParagrafosElement(artigo.paragrafos);
            article.appendChild(paragrafosDiv);
        }

        return article;
    }

    createIncisosElement(incisos) {
        const incisosUl = document.createElement('ul');
        incisosUl.className = 'space-y-2 list-inside list-decimal ml-4';
        
        incisos.forEach(inciso => {
            const li = document.createElement('li');
            
            if (typeof inciso === 'string') {
                li.textContent = inciso;
            } else if (inciso.termo && inciso.definicao) {
                // Para o art. 6º (definições)
                li.className = 'border-l-2 border-slate-200 pl-4';
                li.innerHTML = `<span class="font-semibold">${inciso.termo}:</span> ${inciso.definicao}`;
            } else if (inciso.texto) {
                li.textContent = inciso.texto;
                
                // Se tem alíneas
                if (inciso.alineas && inciso.alineas.length > 0) {
                    const alineasUl = document.createElement('ul');
                    alineasUl.className = 'space-y-1 list-inside list-[lower-alpha] ml-6 mt-1';
                    
                    inciso.alineas.forEach(alinea => {
                        const alineaLi = document.createElement('li');
                        alineaLi.textContent = alinea;
                        alineasUl.appendChild(alineaLi);
                    });
                    
                    li.appendChild(alineasUl);
                }
            }
            
            incisosUl.appendChild(li);
        });
        
        return incisosUl;
    }

    createParagrafosElement(paragrafos) {
        const paragrafosDiv = document.createElement('div');
        paragrafosDiv.className = 'space-y-2 text-slate-600 border-l-2 border-slate-200 pl-4 mt-3';
        
        paragrafos.forEach(paragrafo => {
            const p = document.createElement('p');
            
            if (paragrafo.numero === 'único') {
                p.textContent = `Parágrafo único. ${paragrafo.texto}`;
            } else {
                p.textContent = `§ ${paragrafo.numero} ${paragrafo.texto}`;
            }
            
            paragrafosDiv.appendChild(p);
            
            // Se o parágrafo tem incisos
            if (paragrafo.incisos && paragrafo.incisos.length > 0) {
                const incisosUl = document.createElement('ul');
                incisosUl.className = 'space-y-2 list-inside list-decimal ml-6 mt-2';
                
                paragrafo.incisos.forEach(inciso => {
                    const li = document.createElement('li');
                    
                    if (typeof inciso === 'string') {
                        li.textContent = inciso;
                    } else if (inciso.texto) {
                        li.textContent = inciso.texto;
                        
                        // Se tem alíneas
                        if (inciso.alineas && inciso.alineas.length > 0) {
                            const alineasUl = document.createElement('ul');
                            alineasUl.className = 'space-y-1 list-inside list-[lower-alpha] ml-6 mt-1';
                            
                            inciso.alineas.forEach(alinea => {
                                const alineaLi = document.createElement('li');
                                alineaLi.textContent = alinea;
                                alineasUl.appendChild(alineaLi);
                            });
                            
                            li.appendChild(alineasUl);
                        }
                    }
                    
                    incisosUl.appendChild(li);
                });
                
                paragrafosDiv.appendChild(incisosUl);
            }
        });
        
        return paragrafosDiv;
    }

    createResumeButton() {
        const div = document.createElement('div');
        div.className = 'text-center mt-4';
        
        const button = document.createElement('button');
        button.className = 'summarize-chapter-btn text-sm bg-amber-100 text-amber-800 hover:bg-amber-200 font-semibold py-2 px-4 rounded-full transition-colors';
        button.textContent = '✨ Resumir Capítulo';
        
        div.appendChild(button);
        return div;
    }

    generateNavigation() {
        this.navigationPanel.innerHTML = '';
        const navLinks = [];

        if (!this.estrutura || !this.estrutura.lei || !this.estrutura.lei.titulos) {
            console.error('Estrutura não disponível para gerar navegação');
            return;
        }

        this.estrutura.lei.titulos.forEach(titulo => {
            const titleLink = this.createNavLink(titulo.id, `TÍTULO ${titulo.numero} - ${titulo.nome}`, 'title');
            this.navigationPanel.appendChild(titleLink);
            navLinks.push(titleLink);

            if (titulo.capitulos && Array.isArray(titulo.capitulos)) {
                titulo.capitulos.forEach(capitulo => {
                    // Cria container para capítulo
                    const chapterContainer = document.createElement('div');
                    chapterContainer.className = 'mb-1';

                    // Botão expandir/recolher
                    const expandBtn = document.createElement('button');
                    expandBtn.className = 'expand-btn text-xs text-sky-700 hover:underline mr-2';
                    expandBtn.textContent = '►';
                    expandBtn.setAttribute('aria-expanded', 'false');

                    // Título do capítulo
                    const chapterLink = this.createNavLink(capitulo.id, `CAPÍTULO ${capitulo.numero} - ${capitulo.nome.toLowerCase()}`, 'chapter');
                    chapterLink.style.display = 'inline';

                    // Container dos artigos do capítulo
                    const articlesContainer = document.createElement('div');
                    articlesContainer.className = 'ml-4';
                    articlesContainer.style.display = 'none';

                    // Artigos diretos do capítulo
                    if (capitulo.artigos && Array.isArray(capitulo.artigos)) {
                        capitulo.artigos.forEach(artigoId => {
                            if (this.artigos && this.artigos.artigos && this.artigos.artigos[artigoId]) {
                                const artigoData = this.artigos.artigos[artigoId];
                                const articleLink = this.createNavLink(artigoId, `Art. ${artigoData.numero}`, 'article');
                                articlesContainer.appendChild(articleLink);
                                navLinks.push(articleLink);
                            }
                        });
                    }

                    // Seções do capítulo
                    if (capitulo.secoes && Array.isArray(capitulo.secoes)) {
                        capitulo.secoes.forEach(secao => {
                            // Cria container para seção
                            const secaoContainer = document.createElement('div');
                            secaoContainer.className = 'mb-1';

                            // Botão expandir/recolher
                            const secaoExpandBtn = document.createElement('button');
                            secaoExpandBtn.className = 'expand-btn text-xs text-sky-700 hover:underline mr-2';
                            secaoExpandBtn.textContent = '►';
                            secaoExpandBtn.setAttribute('aria-expanded', 'false');

                            // Título da seção
                            const sectionLink = this.createNavLink(secao.id, `Seção ${secao.numero} - ${secao.nome.toLowerCase()}`, 'section');
                            sectionLink.style.display = 'inline';

                            // Container dos artigos da seção
                            const secaoArticlesContainer = document.createElement('div');
                            secaoArticlesContainer.className = 'ml-4';
                            secaoArticlesContainer.style.display = 'none';

                            // Artigos da seção
                            if (secao.artigos && Array.isArray(secao.artigos)) {
                                secao.artigos.forEach(artigoId => {
                                    if (this.artigos && this.artigos.artigos && this.artigos.artigos[artigoId]) {
                                        const artigoData = this.artigos.artigos[artigoId];
                                        const articleLink = this.createNavLink(artigoId, `Art. ${artigoData.numero}`, 'article');
                                        secaoArticlesContainer.appendChild(articleLink);
                                        navLinks.push(articleLink);
                                    }
                                });
                            }

                            // Subsecções da seção
                            if (secao.subsecoes && Array.isArray(secao.subsecoes)) {
                                secao.subsecoes.forEach(subsecao => {
                                    // Cria container para subseção
                                    const subsecaoContainer = document.createElement('div');
                                    subsecaoContainer.className = 'mb-1';

                                    // Botão expandir/recolher
                                    const subsecaoExpandBtn = document.createElement('button');
                                    subsecaoExpandBtn.className = 'expand-btn text-xs text-sky-700 hover:underline mr-2';
                                    subsecaoExpandBtn.textContent = '►';
                                    subsecaoExpandBtn.setAttribute('aria-expanded', 'false');

                                    // Título da subseção
                                    const subsectionLink = this.createNavLink(subsecao.id, `Subseção ${subsecao.numero} - ${subsecao.nome.toLowerCase()}`, 'subsection');
                                    subsectionLink.style.display = 'inline';

                                    // Container dos artigos da subseção
                                    const subsecaoArticlesContainer = document.createElement('div');
                                    subsecaoArticlesContainer.className = 'ml-4';
                                    subsecaoArticlesContainer.style.display = 'none';

                                    // Artigos da subseção
                                    if (subsecao.artigos && Array.isArray(subsecao.artigos)) {
                                        subsecao.artigos.forEach(artigoId => {
                                            if (this.artigos && this.artigos.artigos && this.artigos.artigos[artigoId]) {
                                                const artigoData = this.artigos.artigos[artigoId];
                                                const articleLink = this.createNavLink(artigoId, `Art. ${artigoData.numero}`, 'article');
                                                subsecaoArticlesContainer.appendChild(articleLink);
                                                navLinks.push(articleLink);
                                            }
                                        });
                                    }

                                    // Expand/collapse para subseção
                                    const toggleSubsecao = () => {
                                        const expanded = subsecaoExpandBtn.getAttribute('aria-expanded') === 'true';
                                        subsecaoExpandBtn.textContent = expanded ? '►' : '▼';
                                        subsecaoExpandBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                                        subsecaoArticlesContainer.style.display = expanded ? 'none' : '';
                                    };
                                    subsecaoExpandBtn.addEventListener('click', toggleSubsecao);
                                    subsectionLink.addEventListener('click', e => { e.preventDefault(); toggleSubsecao(); });

                                    subsecaoContainer.appendChild(subsecaoExpandBtn);
                                    subsecaoContainer.appendChild(subsectionLink);
                                    subsecaoContainer.appendChild(subsecaoArticlesContainer);
                                    secaoArticlesContainer.appendChild(subsecaoContainer);
                                });
                            }

                            // Expand/collapse para seção
                            const toggleSecao = () => {
                                const expanded = secaoExpandBtn.getAttribute('aria-expanded') === 'true';
                                secaoExpandBtn.textContent = expanded ? '►' : '▼';
                                secaoExpandBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                                secaoArticlesContainer.style.display = expanded ? 'none' : '';
                            };
                            secaoExpandBtn.addEventListener('click', toggleSecao);
                            sectionLink.addEventListener('click', e => { e.preventDefault(); toggleSecao(); });

                            secaoContainer.appendChild(secaoExpandBtn);
                            secaoContainer.appendChild(sectionLink);
                            secaoContainer.appendChild(secaoArticlesContainer);
                            articlesContainer.appendChild(secaoContainer);
                        });
                    }

                    // Expand/collapse para capítulo
                    const toggleCapitulo = () => {
                        const expanded = expandBtn.getAttribute('aria-expanded') === 'true';
                        expandBtn.textContent = expanded ? '►' : '▼';
                        expandBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                        articlesContainer.style.display = expanded ? 'none' : '';
                    };
                    expandBtn.addEventListener('click', toggleCapitulo);
                    chapterLink.addEventListener('click', e => { e.preventDefault(); toggleCapitulo(); });

                    chapterContainer.appendChild(expandBtn);
                    chapterContainer.appendChild(chapterLink);
                    chapterContainer.appendChild(articlesContainer);
                    this.navigationPanel.appendChild(chapterContainer);
                });
            }
        });

        this.setupScrollObserver(navLinks);
    }

    createNavLink(id, text, type) {
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = text;
        link.classList.add('nav-link', 'block', 'text-sm', 'rounded-md', 'transition-colors', 'duration-150');
        
        if (type === 'title') {
            link.classList.add('font-bold', 'text-slate-800', 'hover:bg-slate-200', 'p-2');
        } else if (type === 'chapter') {
            link.classList.add('font-semibold', 'text-slate-700', 'hover:bg-slate-100', 'p-2', 'ml-2');
        } else if (type === 'section') {
            link.classList.add('font-medium', 'text-slate-600', 'hover:bg-slate-50', 'py-1.5', 'px-2', 'ml-4');
        } else if (type === 'subsection') {
            link.classList.add('font-medium', 'text-slate-500', 'hover:bg-slate-50', 'py-1', 'px-2', 'ml-6');
        } else { 
            link.classList.add('text-slate-500', 'hover:bg-slate-100', 'hover:text-slate-800', 'py-1.5', 'px-2', 'ml-8');
        }
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetElement = document.getElementById(id);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        return link;
    }

    setupScrollObserver(navLinks) {
        const observer = new IntersectionObserver((entries) => {
            let intersectingSections = [];
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    intersectingSections.push(entry.target);
                }
            });

            if (intersectingSections.length > 0) {
                intersectingSections.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
                const id = intersectingSections[0].getAttribute('id');
                
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        }, { 
            rootMargin: '0px 0px -80% 0px',
            threshold: 0
        });

        document.querySelectorAll('.content-section').forEach(section => {
            observer.observe(section);
        });
    }

    setupEventListeners() {
        // Event delegation para botões de explicar artigo
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('explain-article-btn')) {
                const article = e.target.closest('article');
                const articleTitle = article.querySelector('h4').textContent;
                const articleText = article.innerText;
                // Chama função AI existente se disponível
                if (window.aiHelper) {
                    window.aiHelper.explainArticle(articleTitle, articleText);
                } else {
                    console.log('Explicar artigo:', articleTitle);
                    alert(`Funcionalidade de explicação do ${articleTitle} será implementada em breve!`);
                }
            }
            
            if (e.target.classList.contains('summarize-chapter-btn')) {
                const chapter = e.target.closest('section[id^="capitulo-"]');
                const chapterTitleEl = chapter.querySelector('h3');
                if(chapterTitleEl) {
                    const chapterTitle = chapterTitleEl.textContent;
                    const chapterText = chapter.innerText;
                    // Chama função AI existente se disponível
                    if (window.aiHelper) {
                        window.aiHelper.summarizeChapter(chapterTitle, chapterText);
                    } else {
                        console.log('Resumir capítulo:', chapterTitle);
                        alert(`Funcionalidade de resumo do capítulo será implementada em breve!`);
                    }
                }
            }
        });
    }

    renderError() {
        this.contentContainer.innerHTML = `
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p class="font-bold">Erro ao carregar conteúdo</p>
                <p>Não foi possível carregar os dados da lei. Verifique se os arquivos JSON estão disponíveis.</p>
                <button onclick="location.reload()" class="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                    Tentar novamente
                </button>
            </div>
        `;
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se já existe uma instância para evitar duplicação
    if (!window.leiRenderer) {
        window.leiRenderer = new LeiRenderer();
        window.leiRenderer.init();
    }
});
