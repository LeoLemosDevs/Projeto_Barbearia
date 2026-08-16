<?php

header('Content-Type: text/html; charset=utf-8');

require_once __DIR__ . '/../config.php';

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $schema = file_get_contents(__DIR__ . '/schema.sql');
    if ($schema === false) {
        throw new RuntimeException('Não foi possível ler schema.sql');
    }
    $pdo->exec($schema);

    $pdo->exec('SET FOREIGN_KEY_CHECKS = 0');
    foreach (['usuarios', 'clientes', 'barbeiros', 'cabeleireiros', 'agendamentos', 'movimentacoes'] as $tabela) {
        $pdo->exec('TRUNCATE TABLE ' . $tabela);
    }
    $pdo->exec('SET FOREIGN_KEY_CHECKS = 1');

    $stmtUsuario = $pdo->prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
    $stmtUsuario->execute(['Administrador', 'admin@barbearia.com', password_hash('123456', PASSWORD_DEFAULT)]);
    $stmtUsuario->execute(['Operador', 'operador@barbearia.com', password_hash('123456', PASSWORD_DEFAULT)]);

    $primeiros = ['João', 'Pedro', 'Carlos', 'Lucas', 'Rafael', 'Gabriel', 'Felipe', 'Bruno', 'Diego', 'Thiago', 'André', 'Marcos', 'Eduardo', 'Gustavo', 'Vinícius', 'Matheus', 'Renan', 'Daniel', 'Rodrigo', 'Fábio', 'Léo', 'Caio', 'Igor', 'Marcelo', 'Anderson', 'Ricardo', 'Paulo', 'Sérgio', 'Antônio', 'José', 'Francisco', 'Alexandre', 'Fernando', 'Henrique', 'Leandro', 'Maurício', 'Otávio', 'Samuel', 'Vitor', 'Wallace', 'Natan', 'Breno', 'Davi', 'Heitor', 'Enzo', 'Miguel', 'Arthur', 'Bernardo', 'Caue', 'Ruan'];
    $sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Rodrigues', 'Almeida', 'Nascimento', 'Lima', 'Araújo', 'Fernandes', 'Carvalho', 'Gomes', 'Martins', 'Rocha', 'Ribeiro', 'Alves', 'Monteiro', 'Barbosa', 'Correia', 'Mendes', 'Moreira', 'Cardoso', 'Teixeira', 'Cavalcanti', 'Dias', 'Castro', 'Campos', 'Melo', 'Farias', 'Pinto', 'Azevedo', 'Barros', 'Freitas', 'Vieira', 'Moura', 'Peixoto', 'Batista', 'Assis', 'Duarte', 'Cunha', 'Ramos', 'Moraes', 'Sales', 'Tavares', 'Fontes', 'Antunes', 'Prado', 'Nogueira'];

    $clientes = [];
    for ($i = 0; $i < 50; $i++) {
        $nome = $primeiros[$i] . ' ' . $sobrenomes[$i] . ' ' . $sobrenomes[array_rand($sobrenomes)];
        $telefone = '(11) 9' . rand(5000, 9999) . '-' . rand(1000, 9999);
        $email = strtolower(str_replace(['ç', 'á', 'â', 'ã', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú', ' '], ['c', 'a', 'a', 'a', 'e', 'e', 'i', 'o', 'o', 'o', 'u', '.'], $nome)) . rand(10, 99) . '@email.com';
        $clientes[] = ['nome' => $nome, 'telefone' => $telefone, 'email' => $email];
    }

    $stmt = $pdo->prepare('INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)');
    foreach ($clientes as $c) {
        $stmt->execute([$c['nome'], $c['telefone'], $c['email']]);
    }

    $barbeiros = [
        ['Marcos Barba', 'Corte e Barba'],
        ['Rafael Navalha', 'Degradê'],
        ['Anderson Tesoura', 'Corte Clássico'],
        ['Bruno Máquina', 'Skin Fade'],
        ['Diego Lâmina', 'Barba Completa'],
        ['Fernando Penteado', 'Corte Infantil']
    ];
    $stmt = $pdo->prepare('INSERT INTO barbeiros (nome, especialidade, telefone) VALUES (?, ?, ?)');
    foreach ($barbeiros as $b) {
        $stmt->execute([$b[0], $b[1], '(11) 9' . rand(5000, 9999) . '-' . rand(1000, 9999)]);
    }

    $cabeleireiros = [
        ['Fernanda Hair', 'Coloração'],
        ['Júlia Tranças', 'Penteados'],
        ['Camila Luzes', 'Mechas'],
        ['Patrícia Cachos', 'Escova'],
        ['Renata Corte', 'Corte Feminino']
    ];
    $stmt = $pdo->prepare('INSERT INTO cabeleireiros (nome, especialidade, telefone) VALUES (?, ?, ?)');
    foreach ($cabeleireiros as $c) {
        $stmt->execute([$c[0], $c[1], '(11) 9' . rand(5000, 9999) . '-' . rand(1000, 9999)]);
    }

    $servicos = ['Corte', 'Barba', 'Corte + Barba', 'Degradê', 'Sobrancelha', 'Coloração', 'Mechas', 'Escova', 'Penteados', 'Luzes'];
    $stmt = $pdo->prepare('INSERT INTO agendamentos (cliente_id, tipo_profissional, profissional_id, servico, valor, data, hora, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

    for ($i = 0; $i < 32; $i++) {
        $clienteId = rand(1, 50);
        $tipo = (rand(0, 1) === 0) ? 'barbeiro' : 'cabeleireiro';
        $profissionalId = $tipo === 'barbeiro' ? rand(1, 6) : rand(1, 5);
        $servico = $servicos[array_rand($servicos)];
        $valor = rand(25, 150) + (rand(0, 1) ? 0.5 : 0);
        $offset = rand(-5, 5);
        $data = date('Y-m-d', strtotime($offset . ' days'));
        $hora = sprintf('%02d:%02d:00', rand(8, 18), rand(0, 55));

        if ($data < date('Y-m-d')) {
            $status = (rand(1, 10) === 1) ? 'Cancelado' : 'Concluído';
        } else {
            $status = (rand(0, 1) === 0) ? 'Agendado' : 'Confirmado';
        }

        $stmt->execute([$clienteId, $tipo, $profissionalId, $servico, $valor, $data, $hora, $status]);
    }

    $formas = ['Dinheiro', 'Pix', 'Cartão', 'Débito'];
    $stmt = $pdo->prepare('INSERT INTO movimentacoes (tipo, descricao, valor, forma, data, hora) VALUES (?, ?, ?, ?, ?, ?)');

    $hoje = date('Y-m-d');
    $diaAtual = (int) date('j');
    $mesAtual = (int) date('n');
    $anoAtual = (int) date('Y');

    for ($dia = 1; $dia <= $diaAtual; $dia++) {
        $data = sprintf('%04d-%02d-%02d', $anoAtual, $mesAtual, $dia);
        $hora = sprintf('%02d:%02d:00', rand(9, 18), rand(0, 55));

        $qtd = rand(1, 2);
        for ($k = 0; $k < $qtd; $k++) {
            $cliente = $clientes[array_rand($clientes)];
            $servico = $servicos[array_rand($servicos)];
            $valor = rand(25, 150) + (rand(0, 1) ? 0.5 : 0);
            $stmt->execute(['entrada', 'Serviço - ' . $cliente['nome'] . ' - ' . $servico, $valor, $formas[array_rand($formas)], $data, $hora]);
        }

        if (rand(1, 4) === 1) {
            $despesas = [
                'Compra de lâminas' => 25,
                'Produtos para barba' => 40,
                'Aluguel do espaço' => 300,
                'Conta de energia' => 90,
                'Compra de máquina de corte' => 180,
                'Gel e pomadas' => 35
            ];
            $desc = array_rand($despesas);
            $stmt->execute(['saida', $desc, $despesas[$desc], $formas[array_rand($formas)], $data, $hora]);
        }
    }

    $total = $pdo->query('SELECT COUNT(*) FROM clientes')->fetchColumn();
    $agend = $pdo->query('SELECT COUNT(*) FROM agendamentos')->fetchColumn();
    $mov = $pdo->query('SELECT COUNT(*) FROM movimentacoes')->fetchColumn();

    echo '<h1>Banco populado com sucesso!</h1>';
    echo "<ul>";
    echo "<li>Usuários: 2 (admin@barbearia.com / 123456)</li>";
    echo "<li>Clientes: {$total}</li>";
    echo "<li>Barbeiros: 6</li>";
    echo "<li>Cabeleireiros: 5</li>";
    echo "<li>Agendamentos: {$agend}</li>";
    echo "<li>Movimentações: {$mov}</li>";
    echo "</ul>";
    echo '<p><strong>Atenção:</strong> apague o arquivo <code>database/seed.php</code> após executar.</p>';
    echo '<p><a href="../index.html">Ir para o sistema</a></p>';
} catch (PDOException $e) {
    echo '<h1>Erro no banco de dados</h1><pre>' . htmlspecialchars($e->getMessage()) . '</pre>';
    echo '<p>Verifique se o MySQL está ativo no XAMPP (botão <strong>Start</strong> no MySQL).</p>';
} catch (Exception $e) {
    echo '<h1>Erro</h1><pre>' . htmlspecialchars($e->getMessage()) . '</pre>';
}
