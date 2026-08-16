# Credenciais de Teste

Usuários criados pelo script `database/seed.php` na tabela `usuarios`.

| Perfil | E-mail | Senha |
| ------ | ----------------------- | ------ |
| Administrador | `admin@barbearia.com` | `123456` |
| Operador | `operador@barbearia.com` | `123456` |

> As senhas são armazenadas com hash (`password_hash`) e validadas com `password_verify` no servidor.

## Dados de Teste Gerados pelo Seed

| Entidade | Quantidade | Observações |
| -------- | ---------- | ----------- |
| Clientes | 50 | Nomes, telefones e e-mails fictícios |
| Barbeiros | 6 | Com especialidades |
| Cabeleireiros | 5 | Com especialidades |
| Agendamentos | ~32 | Distribuídos entre os últimos 5 dias e os próximos 5 dias |
| Movimentações | ~31 | Dias do mês atual até hoje (entradas e saídas) |

## Credenciais do Banco (config.php)

| Configuração | Valor |
| ------------ | ----- |
| Host | `127.0.0.1` |
| Porta | `3306` |
| Banco | `barbearia` |
| Usuário | `root` |
| Senha | *(vazia)* |

> Ajuste em `config.php` se o seu XAMPP utilizar credenciais diferentes.
