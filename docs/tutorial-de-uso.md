# Tutorial de Uso

## 1. Acessar o sistema

1. Ligue o **Apache** e o **MySQL** no XAMPP Control Panel.
2. Abra no navegador: `http://localhost/barbearia/`
3. Entre com as credenciais de teste (veja [credenciais-de-teste.md](./credenciais-de-teste.md)):
   - E-mail: `admin@barbearia.com`
   - Senha: `123456`

## 2. Tela Inicial (Dashboard)

Após o login, a tela de **Início** mostra:
- Total de clientes, barbeiros e cabeleireiros cadastrados
- Agendamentos de hoje e saldo do caixa do dia
- Próximos agendamentos (futuros)

Use a **sidebar** (menu lateral) para navegar entre os módulos. No celular, toque no ícone `☰` para abrir o menu.

## 3. Cadastro de Clientes

1. Clique em **Clientes** na sidebar.
2. Preencha nome, telefone e e-mail.
3. Clique em **Salvar** — o cliente aparece na tabela abaixo.
4. Para **editar**, clique em **Editar** na linha; ajuste os campos e clique em **Salvar** (ou **Cancelar** para desistir).
5. Para **excluir**, clique em **Excluir** e confirme.

## 4. Cadastro de Barbeiros e Cabeleireiros

Mesmo fluxo do cadastro de clientes, com campo adicional de **especialidade** (ex.: Degradê, Coloração).

## 5. Agenda

1. Clique em **Agenda**.
2. No painel **Novo agendamento**, escolha o cliente, o tipo de profissional (Barbeiro/Cabeleireiro) e o profissional.
3. Informe o serviço, o valor, a data, a hora e o status inicial.
4. Clique em **Agendar**.
5. A lista abaixo mostra os agendamentos do dia selecionado no filtro de data. É possível filtrar também por status.
6. Ações por agendamento:
   - **Concluir** — marca o serviço como Concluído
   - **Cancelar** — marca como Cancelado
   - **Excluir** — remove o agendamento

> Dica: use o filtro de data para ver outros dias.

## 6. Caixa

1. Clique em **Caixa**.
2. Em **Registrar movimentação**, escolha o tipo (Entrada/Saída), descreva o lançamento, informe o valor e a forma de pagamento.
3. Clique em **Registrar**.
4. Os cards no topo mostram entradas, saídas e **total do dia**. A lista abaixo exibe as movimentações de hoje.

> O caixa sempre registra a data/hora atuais; cada dia é tratado separadamente.

## 7. Financeiro

1. Clique em **Financeiro**.
2. Os cards mostram **Receitas**, **Despesas** e **Saldo do mês atual**.
3. A tabela lista todas as movimentações do mês (entradas em verde, saídas em vermelho).

## 8. Encerrar a sessão

Clique em **Sair** na parte inferior da sidebar para voltar à tela de login.

## 9. Recarga de dados de teste

Para restaurar os dados de demonstração, acesse `http://localhost/barbearia/database/seed.php` (recria o banco e re-popula). **Remova esse arquivo em produção.**
