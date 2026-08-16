# Arquitetura do Sistema

## Visão Geral

O sistema segue uma arquitetura **cliente-servidor** simples, sem framework:

```
┌────────────────────────┐        ┌─────────────────────────┐
│       Frontend         │  HTTP  │        Backend          │
│  index.html (SPA)      │ ─────► │  api/index.php (REST)   │
│  style.css             │  JSON  │  config.php             │
│  script.js (fetch)     │ ◄───── │                         │
└────────────────────────┘        └───────────┬─────────────┘
                                              │ PDO (MySQL)
                                              ▼
                                   ┌─────────────────────────┐
                                   │   MySQL - barbearia     │
                                   └─────────────────────────┘
```

## Fluxo de Dados

1. O usuário interage com a interface (HTML/CSS/JS).
2. `script.js` envia requisições `fetch` para a API REST em `api/index.php`.
3. A API valida os dados e executa operações no MySQL usando PDO (prepared statements).
4. A resposta é retornada em JSON e o frontend renderiza os dados.

## Estrutura de Pastas

```
barbearia/
├── index.html          # Página única: login + painel (views por módulo)
├── style.css           # Estilos, tema e responsividade
├── script.js           # Lógica do frontend, chamadas à API, renderização
├── config.php          # Constantes de conexão com o banco
├── api/
│   └── index.php       # Roteador REST: login + CRUD dos recursos
├── database/
│   ├── schema.sql      # DDL: criação do banco e tabelas
│   └── seed.php        # Popula dados de teste (50 clientes etc.)
└── docs/               # Documentação do projeto
```

## Componentes

### Frontend (SPA)
- **`index.html`** — define a tela de login e o painel com 7 views (Início, Clientes, Barbeiros, Cabeleireiros, Agenda, Caixa, Financeiro), alternadas pela classe `.active`.
- **`script.js`** — controla navegação, autenticação, CRUD e renderização. Centraliza as chamadas HTTP nas funções `apiRequest`, `apiList`, `apiCreate`, `apiUpdate`, `apiDelete` e `apiLogin`.

### Backend (API REST)
- **`api/index.php`** — recebe o recurso via parâmetro `?resource=` e o método HTTP (GET/POST/PUT/DELETE):

| Recurso | Métodos |
| ------- | ------- |
| `login` | POST |
| `clientes` | GET, POST, PUT, DELETE |
| `barbeiros` | GET, POST, PUT, DELETE |
| `cabeleireiros` | GET, POST, PUT, DELETE |
| `agendamentos` | GET, POST, PUT, DELETE |
| `movimentacoes` | GET, POST |

### Banco de Dados
- MySQL com as tabelas `usuarios`, `clientes`, `barbeiros`, `cabeleireiros`, `agendamentos` e `movimentacoes`.
- A tabela `agendamentos` possui chave estrangeira para `clientes` (ON DELETE CASCADE).

## Comunicação

- **Formato:** JSON (`Content-Type: application/json`)
- **Contrato de resposta:** `{ "ok": true, "data": [...] }` ou `{ "ok": false, "error": "mensagem" }`
- **CORS:** habilitado para desenvolvimento local (`Access-Control-Allow-Origin: *`)

## Decisões de Arquitetura

- **API própria em PHP** em vez de framework: projeto leve, sem dependências externas.
- **SPA em JS puro**: evita recarregamento de página e mantém o escopo simples.
- **Separar dados (banco) da apresentação (frontend)**: permite evoluir o backend de forma independente.
