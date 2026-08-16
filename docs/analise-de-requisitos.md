# Análise de Requisitos

## 1. Introdução

Sistema web de gerenciamento para barbearias, responsável por controlar cadastros, agenda de horários, caixa diário e movimentações financeiras. O acesso é protegido por login com usuário e senha.

## 2. Requisitos Funcionais

| Código | Requisito | Descrição |
| ------ | --------- | --------- |
| RF001 | Autenticação | O sistema deve permitir login com e-mail e senha validados no banco de dados. |
| RF002 | Logout | O usuário deve poder encerrar a sessão e voltar à tela de login. |
| RF003 | Cadastro de clientes | CRUD de clientes com nome, telefone e e-mail. |
| RF004 | Cadastro de barbeiros | CRUD de barbeiros com nome, especialidade e telefone. |
| RF005 | Cadastro de cabeleireiros | CRUD de cabeleireiros com nome, especialidade e telefone. |
| RF006 | Agenda | Cadastro de agendamentos com cliente, tipo de profissional, profissional, serviço, valor, data, hora e status. |
| RF007 | Agenda - status | Permitir marcar um agendamento como Concluído ou Cancelado. |
| RF008 | Agenda - filtros | Filtrar agendamentos por data e por status. |
| RF009 | Caixa | Registrar entradas e saídas com descrição, valor, forma de pagamento, data e hora. |
| RF010 | Caixa - resumo | Exibir totais de entradas, saídas e saldo do dia. |
| RF011 | Financeiro | Exibir receitas, despesas e saldo do mês atual, com listagem das movimentações. |
| RF012 | Dashboard | Página inicial com resumo: totais de clientes, barbeiros, cabeleireiros, agendamentos do dia e caixa do dia. |
| RF013 | Persistência | Todos os dados devem ser persistidos em banco MySQL. |
| RF014 | Responsividade | O sistema deve ser utilizável em desktop, tablet e celular. |

## 3. Requisitos Não Funcionais

| Código | Requisito | Descrição |
| ------ | --------- | --------- |
| RNF001 | Segurança | Senhas armazenadas com hash (password_hash / password_verify). |
| RNF002 | Segurança | Validação no servidor para todos os envios de dados. |
| RNF003 | Desempenho | Respostas da API em JSON com baixa latência (API local). |
| RNF004 | Compatibilidade | Navegadores modernos (Chrome, Edge, Firefox). |
| RNF005 | Usabilidade | Interface simples, tema escuro, navegação lateral. |
| RNF006 | Portabilidade | Execução via XAMPP (Apache + PHP + MySQL), sem dependências externas. |

## 4. Regras de Negócio

| Código | Regra |
| ------ | ----- |
| RN001 | Só usuários cadastrados na tabela `usuarios` acessam o painel. |
| RN002 | Um agendamento concluído ou cancelado não pode ser alterado pelo botão de status. |
| RN003 | O caixa registra movimentações do dia atual automaticamente (data/hora do servidor). |
| RN004 | O saldo do caixa é a diferença entre entradas e saídas. |
| RN005 | O financeiro agrega as movimentações do mês corrente. |
| RN006 | Para criar um agendamento é obrigatório informar cliente e profissional válidos. |

## 5. Casos de Uso (resumo)

- **UC01** — Realizar login
- **UC02** — Gerenciar clientes (incluir, editar, excluir, listar)
- **UC03** — Gerenciar barbeiros
- **UC04** — Gerenciar cabeleireiros
- **UC05** — Agendar serviço
- **UC06** — Concluir/cancelar agendamento
- **UC07** — Registrar movimentação de caixa
- **UC08** — Visualizar resumo do dia (dashboard)
- **UC09** — Visualizar relatório financeiro mensal

## 6. Perfis de Acesso

| Perfil | Permissões |
| ------ | ---------- |
| Administrador | Acesso completo a todos os módulos. |
| Operador | Acesso completo a todos os módulos (simplificação do escopo). |
