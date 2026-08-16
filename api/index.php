<?php

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function responder($ok, $data = null, $error = null, $code = 200) {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'data' => $data, 'error' => $error], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    responder(false, null, 'Erro de conexão com o banco. Verifique o MySQL no XAMPP.', 500);
}

$method = $_SERVER['REQUEST_METHOD'];
$resource = $_GET['resource'] ?? '';
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;
$body = json_decode(file_get_contents('php://input'), true) ?? [];
$ok = false;

if ($method === 'POST' && $resource === 'login') {
    $email = trim($body['email'] ?? '');
    $senha = $body['senha'] ?? '';
    if ($email === '' || $senha === '') {
        responder(false, null, 'Informe e-mail e senha.', 400);
    }
    $stmt = $pdo->prepare('SELECT id, nome, email, senha FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user && password_verify($senha, $user['senha'])) {
        responder(true, ['id' => (int) $user['id'], 'nome' => $user['nome'], 'email' => $user['email']]);
    }
    responder(false, null, 'E-mail ou senha inválidos.', 401);
}

$recursos = ['clientes', 'barbeiros', 'cabeleireiros', 'agendamentos', 'movimentacoes'];

if (!in_array($resource, $recursos, true)) {
    responder(false, null, 'Recurso não encontrado.', 404);
}

$campos = [
    'clientes' => ['nome', 'telefone', 'email'],
    'barbeiros' => ['nome', 'especialidade', 'telefone'],
    'cabeleireiros' => ['nome', 'especialidade', 'telefone'],
    'agendamentos' => ['servico', 'valor', 'data', 'hora', 'status'],
    'movimentacoes' => ['tipo', 'descricao', 'valor', 'forma', 'data', 'hora']
][$resource];

if ($method === 'GET') {
    $sql = 'SELECT * FROM ' . $resource;
    if ($resource === 'agendamentos') {
        $sql = 'SELECT a.id, a.cliente_id AS clienteId, a.tipo_profissional AS tipoProfissional, a.profissional_id AS profissionalId, a.servico, a.valor, a.data, a.hora, a.status,
                       c.nome AS cliente_nome, b.nome AS profissional_nome
                FROM agendamentos a
                LEFT JOIN clientes c ON c.id = a.cliente_id
                LEFT JOIN barbeiros b ON b.id = a.profissional_id
                ORDER BY a.data, a.hora';
    } else {
        $sql .= ' ORDER BY id';
    }
    $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as &$row) {
        if (isset($row['valor'])) {
            $row['valor'] = (float) $row['valor'];
        }
        if (isset($row['hora'])) {
            $row['hora'] = substr($row['hora'], 0, 5);
        }
    }
    unset($row);
    responder(true, $rows);
}

if ($method === 'POST') {
    $novo = [];
    foreach ($campos as $campo) {
        if (isset($body[$campo])) {
            $novo[$campo] = $body[$campo];
        }
    }

    if ($resource === 'agendamentos') {
        $novo['cliente_id'] = (int) ($body['clienteId'] ?? 0);
        $novo['tipo_profissional'] = $body['tipoProfissional'] ?? 'barbeiro';
        $novo['profissional_id'] = (int) ($body['profissionalId'] ?? 0);
    }

    if (isset($novo['valor'])) {
        $novo['valor'] = (float) str_replace(',', '.', $novo['valor']);
    }

    $colunas = array_keys($novo);
    if ($colunas === []) {
        responder(false, null, 'Nenhum dado enviado.', 400);
    }

    $sql = 'INSERT INTO ' . $resource . ' (' . implode(', ', $colunas) . ') VALUES (' . implode(', ', array_fill(0, count($colunas), '?')) . ')';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_values($novo));
    responder(true, ['id' => (int) $pdo->lastInsertId()]);
}

if ($method === 'PUT') {
    if (!$id) {
        responder(false, null, 'ID obrigatório.', 400);
    }
    $atualizar = [];
    foreach ($campos as $campo) {
        if (array_key_exists($campo, $body)) {
            $atualizar[$campo] = $body[$campo];
        }
    }
    if (isset($atualizar['valor'])) {
        $atualizar['valor'] = (float) str_replace(',', '.', $atualizar['valor']);
    }
    if ($atualizar === []) {
        responder(false, null, 'Nenhum dado para atualizar.', 400);
    }
    $sql = 'UPDATE ' . $resource . ' SET ' . implode(', ', array_map(fn($c) => $c . ' = ?', array_keys($atualizar))) . ' WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([...array_values($atualizar), $id]);
    responder(true, ['id' => $id]);
}

if ($method === 'DELETE') {
    if (!$id) {
        responder(false, null, 'ID obrigatório.', 400);
    }
    $pdo->prepare('DELETE FROM ' . $resource . ' WHERE id = ?')->execute([$id]);
    responder(true, ['id' => $id]);
}

responder(false, null, 'Método não permitido.', 405);
