# Sistema de Gerenciamento de Barbearia

Sistema web responsivo para gestão de uma barbearia: cadastro de clientes, barbeiros e cabeleireiros, agenda de horários, caixa diário e controle financeiro mensal.

## Documentação

- [Análise de Requisitos](./analise-de-requisitos.md)
- [Tecnologias Utilizadas](./tecnologias-utilizadas.md)
- [Arquitetura do Sistema](./arquitetura-do-sistema.md)
- [Diagrama do Banco de Dados](./diagrama-do-banco-de-dados.md)
- [Credenciais de Teste](./credenciais-de-teste.md)
- [Identidade Visual](./identidade-visual.md)
- [Tutorial de Uso](./tutorial-de-uso.md)

## Stack utilizada

| Camada   | Tecnologia                              |
| -------- | --------------------------------------- |
| Frontend | HTML5, CSS3 e JavaScript (SPA)          |
| Backend  | PHP 8 (API REST em `api/index.php`)     |
| Banco    | MySQL / MariaDB (via XAMPP)             |

## Pré-requisitos

- [XAMPP](https://www.apachefriends.org/) instalado (Apache + MySQL)
- Navegador moderno

## Instalação

1. Copie a pasta do projeto para o diretório do XAMPP:

   ```
   C:\xampp\htdocs\barbearia
   ```

2. Abra o **XAMPP Control Panel** e inicie o Apache e o MySQL (botões `Start`).

3. Acesse o script de instalação/seed no navegador:

   ```
   http://localhost/barbearia/database/seed.php
   ```

   Ele cria o banco `barbearia`, as tabelas e insere os dados de teste (50 clientes, barbeiros, cabeleireiros, agendamentos e movimentações).

4. Abra o sistema:

   ```
   http://localhost/barbearia/
   ```

5. **Importante:** após o seed, apague o arquivo `database/seed.php` por segurança.

## Credenciais de teste

| Perfil        | E-mail                    | Senha   |
| ------------- | ------------------------- | ------- |
| Administrador | `admin@barbearia.com`     | `123456`|
| Operador      | `operador@barbearia.com`  | `123456`|

> A senha é validada no servidor usando `password_hash` / `password_verify` (tabela `usuarios`).

## Dados de teste gerados

- **50 clientes** fictícios (nome, telefone e e-mail)
- **6 barbeiros** e **5 cabeleireiros** com especialidades
- **~32 agendamentos** distribuídos entre os últimos 5 dias e os próximos 5 dias (status variados: Agendado, Confirmado, Concluído e Cancelado)
- **Movimentações de caixa** de todos os dias do mês atual até hoje (entradas de serviços e saídas de despesas)

## Estrutura do projeto

```
barbearia/
├── index.html          # Tela de login + painel (SPA)
├── style.css           # Estilos e responsividade
├── script.js           # Lógica do frontend (consome a API)
├── config.php          # Credenciais do banco de dados
├── api/
│   └── index.php       # API REST (login + CRUD)
├── database/
│   ├── schema.sql      # Estrutura do banco
│   └── seed.php        # Cria o banco e popula dados de teste
└── docs/
    ├── README.md                     # Esta documentação
    ├── analise-de-requisitos.md      # Requisitos funcionais e não funcionais
    ├── tecnologias-utilizadas.md     # Stack e padrões
    ├── arquitetura-do-sistema.md     # Visão geral da arquitetura
    ├── diagrama-do-banco-de-dados.md # DER e descrição das tabelas
    ├── credenciais-de-teste.md       # Usuários e dados de teste
    ├── identidade-visual.md          # Paleta, tipografia e componentes
    └── tutorial-de-uso.md            # Guia passo a passo do sistema
```

## Configuração do banco

Edite `config.php` caso seu MySQL do XAMPP use outra porta, usuário ou senha:

```php
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_NAME', 'barbearia');
define('DB_USER', 'root');
define('DB_PASS', '');
```

## Tabelas do banco (`barbearia`)

| Tabela           | Finalidade                                   |
| ---------------- | -------------------------------------------- |
| `usuarios`       | Login do sistema (e-mail + senha hash)       |
| `clientes`       | Cadastro de clientes                         |
| `barbeiros`      | Cadastro de barbeiros                        |
| `cabeleireiros`  | Cadastro de cabeleireiros                    |
| `agendamentos`   | Agenda de horários                           |
| `movimentacoes`  | Entradas e saídas do caixa                   |

## API REST

Endpoints disponíveis em `api/index.php`:

| Método | Rota                                            | Descrição                       |
| ------ | ----------------------------------------------- | ------------------------------- |
| POST   | `api/index.php?resource=login`                  | Autentica (e-mail e senha)      |
| GET    | `api/index.php?resource=clientes`               | Lista clientes                  |
| POST   | `api/index.php?resource=clientes`               | Cria cliente                    |
| PUT    | `api/index.php?resource=clientes&id=1`          | Atualiza cliente                |
| DELETE | `api/index.php?resource=clientes&id=1`          | Exclui cliente                  |
| GET    | `api/index.php?resource=barbeiros`              | Lista barbeiros                 |
| GET    | `api/index.php?resource=cabeleireiros`          | Lista cabeleireiros             |
| GET    | `api/index.php?resource=agendamentos`           | Lista agendamentos              |
| POST   | `api/index.php?resource=agendamentos`           | Cria agendamento                |
| PUT    | `api/index.php?resource=agendamentos&id=1`      | Atualiza (ex.: mudar status)    |
| DELETE | `api/index.php?resource=agendamentos&id=1`      | Exclui agendamento              |
| GET    | `api/index.php?resource=movimentacoes`          | Lista movimentações             |
| POST   | `api/index.php?resource=movimentacoes`          | Cria movimentação               |

Todas as rotas respondem em JSON no formato:

```json
{ "ok": true, "data": [...] }
```

Em caso de erro: `{ "ok": false, "error": "mensagem" }`.
