# Tecnologias Utilizadas

## Frontend

| Tecnologia | Versão | Finalidade |
| ---------- | ------ | ---------- |
| HTML5 | - | Estrutura das páginas (SPA com login e painel) |
| CSS3 | - | Estilização, tema escuro, responsividade |
| JavaScript (ES6+) | - | Interatividade, navegação, consumo da API via `fetch` |

## Backend

| Tecnologia | Versão | Finalidade |
| ---------- | ------ | ---------- |
| PHP | 8.x | API REST e regras de negócio no servidor |
| PDO | - | Camada de acesso ao banco com statements preparados |

## Banco de Dados

| Tecnologia | Versão | Finalidade |
| ---------- | ------ | ---------- |
| MySQL / MariaDB | 8.x / 10.x | Persistência dos dados (via XAMPP) |

## Servidor Local

| Tecnologia | Finalidade |
| ---------- | ---------- |
| XAMPP (Apache + MySQL) | Ambiente de desenvolvimento e execução |

## Padrões e Boas Práticas

- **API REST** — comunicação frontend/backend via endpoints JSON
- **Prepared Statements (PDO)** — proteção contra SQL Injection
- **Password Hashing** — `password_hash()` / `password_verify()`
- **SPA (Single Page Application)** — navegação sem recarregar a página
- **Sem dependências externas** — nenhum framework ou biblioteca de terceiros
