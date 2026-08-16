# Identidade Visual

## Conceito

Identidade premium, sóbria e masculina, típica de barbearias: **fundo escuro** combinado com **dourado**, transmitindo elegância e tradição.

## Paleta de Cores

| Variável CSS | Cor | Uso |
| ------------ | --- | --- |
| `--primary` | `#c9a227` | Dourado — destaques, botões, itens ativos |
| `--primary-dark` | `#a8841a` | Dourado escuro — hover de botões |
| `--bg-dark` | `#111111` | Fundo principal / inputs |
| `--bg-card` | `#1c1c1c` | Cards, painéis, sidebar e topbar |
| `--text-light` | `#f5f5f5` | Textos principais |
| `--text-muted` | `#9e9e9e` | Textos secundários |
| `--border` | `#2c2c2c` | Bordas e separadores |
| `--error` | `#e74c3c` | Erros e saídas |
| `--success` | `#2ecc71` | Entradas / concluído |
| `--info` | `#3498db` | Status "Confirmado" |

## Tipografia

- **Família:** `Segoe UI`, `Tahoma`, `Geneva`, `Verdana` (fallback `sans-serif`)
- **Títulos:** negrito (700), cor `--text-light`
- **Textos de apoio:** 0.85–0.9rem, cor `--text-muted`
- **Destaques (totais):** 1.4–1.5rem, negrito, cor `--primary`

## Componentes Visuais

| Componente | Estilo |
| ---------- | ------ |
| Login | Card centralizado com logo circular dourado e sombra |
| Sidebar | 240px, fundo `--bg-card`, item ativo com fundo dourado |
| Cards de estatística | Grid responsivo, fundo `--bg-card`, borda 1px |
| Painéis | Fundo `--bg-card`, cantos 12–16px, borda `--border` |
| Tabelas | Cabeçalho uppercase cinza, linhas com hover |
| Badges | Pílulas coloridas por status (Agendado, Confirmado, Concluído, Cancelado, Entrada, Saída) |
| Botões | Primário dourado com texto escuro; secundário com borda |
| Inputs | Fundo `--bg-dark`, foco com borda dourada e brilho suave |

## Logotipo

- Símbolo: letra **"B"** em um círculo de fundo dourado (`--primary`) com texto escuro (`--bg-dark`).
- Usado na tela de login (64px) e na sidebar (40px).

## Ícones

Não há dependência de bibliotecas de ícones. A navegação usa apenas texto e o botão de menu móvel usa o caractere `☰`.

## Comportamento Responsivo

| Faixa | Comportamento |
| ----- | ------------- |
| Desktop (>768px) | Sidebar fixa à esquerda |
| Tablet/Celular (≤768px) | Sidebar vira off-canvas com hambúrguer e overlay; tabelas rolam horizontalmente |
| Telas pequenas (≤480px) | Cards e painéis com padding reduzido |
