# Lei nº 14.133 - Sistema de Consulta

Este é um sistema web para consulta e estudo da Lei nº 14.133/2021 (Nova Lei de Licitações), desenvolvido com uma arquitetura modular e eficiente.

## 📁 Estrutura do Projeto

```
├── index.html                 # Página principal
├── data/                      # Dados estruturados da lei
│   ├── lei-structure.json     # Estrutura hierárquica (títulos, capítulos)
│   └── artigos.json          # Conteúdo dos artigos
├── js/                       # Scripts JavaScript modulares
│   ├── ai-helper.js          # Funcionalidades de IA
│   ├── lei-renderer.js       # Renderização do conteúdo
│   └── main.js               # Inicialização e utilitários
└── README.md                 # Esta documentação
```

## 🚀 Funcionalidades

### ✨ Principais
- **Navegação intuitiva** com sidebar responsivo
- **Renderização dinâmica** do conteúdo a partir de arquivos JSON
- **Assistente de IA** para explicações e resumos
- **Interface moderna** com Tailwind CSS
- **Design responsivo** para desktop e mobile

### 🤖 IA Integrada
- Explicação de artigos em linguagem simples
- Resumos de capítulos
- Integração com Google Gemini API

### 📱 Interface
- Design limpo e profissional
- Scroll suave entre seções
- Indicador visual de seção ativa
- Modals para conteúdo adicional

## 🔧 Arquitetura

### Separação de Responsabilidades

1. **Dados (JSON)**
   - `lei-structure.json`: Hierarquia da lei
   - `artigos.json`: Conteúdo detalhado dos artigos

2. **Renderização (lei-renderer.js)**
   - Carregamento assíncrono dos dados
   - Criação dinâmica dos elementos DOM
   - Geração automática da navegação

3. **IA (ai-helper.js)**
   - Interface com APIs de IA
   - Processamento de respostas
   - Gerenciamento de modals

4. **Utilitários (main.js)**
   - Funções auxiliares
   - Inicialização da aplicação
   - Gerenciamento de eventos

## 💡 Vantagens da Nova Arquitetura

### ✅ Manutenibilidade
- Código modular e organizado
- Fácil adição de novos artigos
- Separação clara entre dados e lógica

### ✅ Performance
- Carregamento assíncrono
- Estrutura otimizada
- Menor tamanho de arquivos

### ✅ Escalabilidade
- Facilmente extensível
- Suporte a outras leis
- Arquitetura reutilizável

### ✅ Experiência do Usuário
- Interface responsiva
- Carregamento progressivo
- Feedback visual

## 🛠️ Como Usar

### Desenvolvimento Local
1. Abra o `index.html` em um servidor web local
2. Os dados serão carregados automaticamente dos arquivos JSON
3. A IA está configurada e pronta para uso

### Adicionar Novos Artigos
1. Edite `data/artigos.json` com o novo conteúdo
2. Atualize `data/lei-structure.json` com a nova estrutura
3. O sistema renderizará automaticamente o novo conteúdo

### Personalizar IA
- Configure sua própria API key em `js/ai-helper.js`
- Modifique os prompts conforme necessário
- Adicione novos tipos de análise

## 📋 Exemplo de Estrutura JSON

### Artigo (artigos.json)
```json
{
  "art-1": {
    "numero": "1º",
    "conteudo": "Texto principal do artigo...",
    "incisos": ["Primeiro inciso", "Segundo inciso"],
    "paragrafos": [
      {
        "numero": "1º",
        "texto": "Texto do parágrafo..."
      }
    ]
  }
}
```

### Estrutura (lei-structure.json)
```json
{
  "lei": {
    "titulos": [
      {
        "id": "titulo-1",
        "numero": "I",
        "nome": "DISPOSIÇÕES PRELIMINARES",
        "capitulos": [
          {
            "id": "capitulo-1-1",
            "numero": "I",
            "nome": "DO ÂMBITO DE APLICAÇÃO",
            "artigos": ["art-1", "art-2"]
          }
        ]
      }
    ]
  }
}
```

## 🔄 Fluxo de Inicialização

1. **DOM Ready**: `main.js` inicializa a aplicação
2. **Carregamento**: `lei-renderer.js` busca dados JSON
3. **Renderização**: Criação dinâmica do conteúdo e navegação
4. **Interatividade**: Event listeners para IA e navegação
5. **Pronto**: Sistema totalmente funcional

## 🎯 Benefícios Técnicos

- **Código limpo**: Estrutura organizada e bem documentada
- **Reusabilidade**: Componentes modulares
- **Testabilidade**: Funções isoladas e bem definidas
- **Manutenibilidade**: Fácil localização e correção de bugs
- **Extensibilidade**: Simples adição de novas funcionalidades

Este sistema representa uma evolução significativa em relação ao código HTML estático anterior, oferecendo uma base sólida para futuras expansões e melhorias.
