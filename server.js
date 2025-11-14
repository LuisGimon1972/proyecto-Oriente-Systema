const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;
const DB_PATH = 'bancosystem.db';
const db = new sqlite3.Database(DB_PATH);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      senha TEXT NOT NULL,
      email TEXT 
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      controle INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT NOT NULL,
      cidade TEXT,
      cep TEXT,
      endereco TEXT,
      bairro TEXT,
      numero TEXT,
      pais TEXT,
      uf TEXT,
      ativo TEXT,
      telefone TEXT,
      celular TEXT,
      datanascimento DATE,
      datahoracadastro DATE,
      naturalidade TEXT,
      nacionalidade TEXT,
      rg TEXT,
      sexo TEXT,
      estadocivil TEXT,
      cpf TEXT,
      cnpj TEXT,
      tipocliente TEXT,
      e_mail TEXT,
      ie TEXT,
      im TEXT,
      fantasia TEXT,  
      limite REAL
    )
  `);  

  db.run(`
    CREATE TABLE IF NOT EXISTS emitente (
      controle INTEGER PRIMARY KEY AUTOINCREMENT,
      emitente TEXT NOT NULL,
      cidade TEXT,
      cep TEXT,
      endereco TEXT,
      bairro TEXT,
      numero TEXT,
      pais TEXT,
      uf TEXT,
      ativo TEXT,
      telefone TEXT,
      celular TEXT,
      datanascimento DATE,
      datahoracadastro DATE,
      naturalidade TEXT,
      nacionalidade TEXT,
      rg TEXT,
      sexo TEXT,
      estadocivil TEXT,      
      cpf TEXT,
      cnpj TEXT,
      tipocliente TEXT,
      e_mail TEXT,
      ie TEXT,
      im TEXT,
      suframa TEXT,
      crt TEXT,
      segmento TEXT, 
      faixa TEXT, 
      fantasia TEXT,
      tipodebusca TEXT  
    )
  `);  

  db.run(`
  CREATE TABLE IF NOT EXISTS produtos (
    controle INTEGER PRIMARY KEY AUTOINCREMENT,
    produto TEXT NOT NULL,
    codbarras INTEGER,
    fornecedor TEXT,
    grupoestoque TEXT,
    subgrupoestoque TEXT,
    marca TEXT,
    precocusto REAL,
    perclucro INTEGER,
    precovenda REAL NOT NULL, 
    precorevenda REAL, 
    precoatacado REAL, 
    quantidade REAL,
    quantidademin REAL,
    quantidademax REAL,
    datahoracadastro DATE,
    ativop TEXT NOT NULL,
    fracionado TEXT,
    aplicacao TEXT NOT NULL,
    duracao REAL
  )
`);


  db.run(`
    CREATE TABLE IF NOT EXISTS funcionarios (
      controle INTEGER PRIMARY KEY AUTOINCREMENT,
      funcionariof TEXT NOT NULL,      
      cpff TEXT,      
      rgf TEXT,
      cepf TEXT,
      enderecof TEXT,
      bairrof TEXT,
      numerof TEXT,      
      uff TEXT,
      cidadef TEXT,
      ativof TEXT,
      telefonef TEXT,
      celularf TEXT,
      datanascimentof DATE,
      datahoracadastrof DATE,     
      dataadmissaof DATE,           
      sexof TEXT,
      estadocivilf TEXT,      
      funcaof TEXT,
      e_mailf TEXT      
    )
  `);

db.run(`
  CREATE TABLE IF NOT EXISTS fornecedores (
    controle INTEGER PRIMARY KEY AUTOINCREMENT,
    fornecedor TEXT NOT NULL,
    cnpj TEXT,
    ie TEXT,
    endereco TEXT,
    bairro TEXT,
    cidade TEXT,
    uf TEXT,
    cep TEXT,
    numero TEXT,
    telefone TEXT,
    celular TEXT,
    email TEXT,
    datahoracadastrofo DATE,     
    observacoes TEXT,
    ativo TEXT NOT NULL
  )
`);
});

db.run(`
  CREATE TABLE IF NOT EXISTS receber (
    controle INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    funcionario TEXT, 
    descricao TEXT,
    datavencimento TEXT,
    datapagamento TEXT,
    datacadastro TEXT,
    valororiginal REAL,
    valor REAL,
    valorpago REAL,
    numeroparcela INTEGER,
    totalparcelas INTEGER,    
    juros REAL,
    multa REAL,
    status TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(controle)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS pagar (
    controle INTEGER PRIMARY KEY AUTOINCREMENT,
    fornecedor_id INTEGER NOT NULL,
    funcionario TEXT, 
    descricao TEXT,
    datavencimento TEXT,
    datapagamento TEXT,
    datacadastro TEXT,
    valororiginal REAL,
    valor REAL,
    valorpago REAL,
    numeroparcela INTEGER,
    totalparcelas INTEGER,    
    juros REAL,
    multa REAL,
    status TEXT,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(controle)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS caixa (
    controle INTEGER PRIMARY KEY AUTOINCREMENT,
    cod_cliente INTEGER,
    cliente TEXT,
    cod_funcionario INTEGER NOT NULL,
    funcionario TEXT, 
    cod_fornecedor INTEGER,
    fornecedor TEXT,
    descricao TEXT,    
    datacadastro TEXT,
    especies TEXT,    
    valorentrada REAL,
    valorsaida REAL
  )
`);

// ================================
// TABELA: ordemServico
// ================================
db.run(`
  CREATE TABLE IF NOT EXISTS ordemServico (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numeroOS TEXT UNIQUE,                         -- número visível para controle (ex: OS0001)
    clienteId INTEGER NOT NULL,
    objetoVeiculoId INTEGER,
    funcionarioId INTEGER,
    laudo TEXT,                                    -- Ex: Manutenção, Instalação, Revisão
    dataAbertura TEXT NOT NULL,
    dataFinalizacao TEXT,
    status TEXT NOT NULL DEFAULT 'ABERTA',        -- ABERTA, EM ANDAMENTO, FINALIZADA, CANCELADA
    descricao TEXT,
    observacoes TEXT,
    garantia TEXT,
    desconto REAL DEFAULT 0,
    acrescimo REAL DEFAULT 0,
    valorTotalItem REAL DEFAULT 0,   
    valorTotalServ REAL DEFAULT 0,
    valorTotal REAL DEFAULT 0,
    formaPagamento TEXT,
    dataCadastro TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clienteId) REFERENCES clientes(controle),
    FOREIGN KEY (objetoVeiculoId) REFERENCES objetosVeiculos(id),
    FOREIGN KEY (funcionarioId) REFERENCES funcionarios(controle)
  )
`);


// ================================
// TABELA: itensOrdemServico
// ================================
db.run(`
  CREATE TABLE IF NOT EXISTS itensOrdemServico (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ordemServicoId INTEGER NOT NULL,
    produtoId INTEGER,
    descricao TEXT,
    tipoItem TEXT DEFAULT 'PRODUTO',              -- PRODUTO ou SERVIÇO
    quantidade REAL NOT NULL,
    valorUnitario REAL NOT NULL,
    total REAL NOT NULL,
    tecnico TEXT,
    FOREIGN KEY (ordemServicoId) REFERENCES ordemServico(id),
    FOREIGN KEY (produtoId) REFERENCES produtos(controle)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS objetosVeiculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clienteId INTEGER NOT NULL,
    tipo TEXT NOT NULL,                           -- Ex: Veículo, Impressora, Ar-condicionado, etc.
    marca TEXT,
    modelo TEXT,
    ano TEXT,
    cor TEXT,
    placaSerie TEXT,
    numeroSerie TEXT,
    status TEXT DEFAULT 'ATIVO',                  -- ATIVO, INATIVO, EM REPARO, etc.
    observacoes TEXT,
    ativo TEXT DEFAULT 'SIM',
    dataCadastro TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clienteId) REFERENCES clientes(controle)
  )
`);



// Utilitário de erro
const handleDbError = (res, err) => {
  console.error('Erro no banco de dados:', err.message);
  res.status(500).json({ erro: 'Erro no banco de dados', detalhe: err.message });
};

// ================================
// ROTA: Listar ordens de serviço completas
// ================================
app.get('/api/ordens-servico', (req, res) => {
  const sql = `
    SELECT 
      os.id AS idOS,
      c.controle AS idCliente,
      c.cliente AS nomeCliente,
      f.controle AS idFuncionario,
      f.funcionariof AS nomeFuncionario,
      os.status,
      os.valorTotalItem AS valorProdutos,
      os.valorTotalServ AS valorServicos,
      os.desconto AS Desconto,
      os.acrescimo AS Acrescimo,
      os.valorTotal AS totalOS,
      ov.tipo || ' - ' || IFNULL(ov.modelo, '') AS objetoConsertado
    FROM ordemServico AS os
    LEFT JOIN clientes AS c ON os.clienteId = c.controle
    LEFT JOIN funcionarios AS f ON os.funcionarioId = f.controle
    LEFT JOIN objetosVeiculos AS ov ON os.objetoVeiculoId = ov.id
    ORDER BY os.id desc
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro ao listar ordens de serviço:', err);
      res.status(500).json({ error: 'Erro ao listar ordens de serviço.' });
    } else {
      res.json(rows);
    }
  });
});

// ==========================
// POST /ordemServico
// ==========================
app.post("/ordemServico", (req, res) => {
  const {
    numeroOS, clienteId, objetoVeiculoId, funcionarioId, laudo,
    dataAbertura, status, descricao, observacoes,
    formaPagamento, desconto, acrescimo, valorTotalItem, valorTotalServ, valorTotal
  } = req.body;

  const sql = `
    INSERT INTO ordemServico (
      numeroOS, clienteId, objetoVeiculoId, funcionarioId, laudo,
      dataAbertura, status, descricao, observacoes,
      formaPagamento, desconto, acrescimo, valorTotalItem, valorTotalServ, valorTotal
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    numeroOS, clienteId, objetoVeiculoId, funcionarioId, laudo,
    dataAbertura, status, descricao, observacoes,
    formaPagamento, desconto, acrescimo, valorTotalItem, valorTotalServ, valorTotal
  ], function (err) {
    if (err) {
      console.error("Erro ao inserir ordem de serviço:", err);
      return res.status(500).json({ error: "Erro ao salvar OS" });
    }
    res.json({ id: this.lastID });
  });
});

// Atualiza apenas o campo dataFinalizacao (e opcionalmente o status)
app.patch("/ordemServico/:id/finalizar", (req, res) => {
  const { id } = req.params;
  const dataFinalizacao = new Date().toISOString();

  const sql = `
    UPDATE ordemServico
    SET dataFinalizacao = ?, status = 'FATURADA'
    WHERE id = ?
  `;

  db.run(sql, [dataFinalizacao, id], function (err) {
    if (err) {
      console.error("❌ Erro ao atualizar data de finalização da OS:", err);
      return res.status(500).json({ error: "Erro ao atualizar data de finalização" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Ordem de serviço não encontrada" });
    }

    res.status(200).json({
      success: true,
      message: "✅ Data de finalização registrada com sucesso",
      dataFinalizacao
    });
  });
});



// ==========================
// POST /itensOrdemServico
// ==========================
app.post("/itensOrdemServico", (req, res) => {
  const { ordemServicoId, produtoId, descricao, tipoItem, quantidade, valorUnitario, total, tecnico } = req.body;

  const sql = `
    INSERT INTO itensOrdemServico (
      ordemServicoId, produtoId, descricao, tipoItem, quantidade, valorUnitario, total, tecnico
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [ordemServicoId, produtoId, descricao, tipoItem, quantidade, valorUnitario, total, tecnico], function (err) {
    if (err) {
      console.error("Erro ao inserir item da OS:", err);
      return res.status(500).json({ error: "Erro ao salvar item da OS" });
    }
    res.json({ id: this.lastID });
  });
});

// GET /itensOrdemServico/:ordemServicoId
app.get("/itensOrdemServico/:ordemServicoId", (req, res) => {
  const { ordemServicoId } = req.params;

  const sql = `
    SELECT *
    FROM itensOrdemServico
    WHERE ordemServicoId = ?
  `;

  db.all(sql, [ordemServicoId], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar itens da OS:", err);
      return res.status(500).json({ error: "Erro ao buscar itens da OS" });
    }

    res.json(rows);
  });
});

app.get('/api/ordens-servico', (req, res) => {
  const sql = `
    SELECT 
      os.id AS idOS,
      c.controle AS idCliente,
      c.cliente AS nomeCliente,
      f.controle AS idFuncionario,
      f.funcionariof AS nomeFuncionario,
      os.status,
      os.valorTotalItem AS valorProdutos,
      os.valorTotalServ AS valorServicos,
      os.desconto AS Desconto,
      os.acrescimo AS Acrescimo,
      os.valorTotal AS totalOS,
      ov.tipo || ' - ' || IFNULL(ov.modelo, '') AS objetoConsertado
    FROM ordemServico AS os
    LEFT JOIN clientes AS c ON os.clienteId = c.controle
    LEFT JOIN funcionarios AS f ON os.funcionarioId = f.controle
    LEFT JOIN objetosVeiculos AS ov ON os.objetoVeiculoId = ov.id
    ORDER BY os.id asc
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro ao listar ordens de serviço:', err);
      res.status(500).json({ error: 'Erro ao listar ordens de serviço.' });
    } else {
      res.json(rows);
    }
  });
});

// ==========================
// POST /ordemServico
// ==========================

app.get("/ordemServico/os/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM ordemServico WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar OS" });
    if (!row) return res.status(404).json({ error: "Ordem de serviço não encontrada" });
    res.json(row);
  });
});

app.get("/ordemServico/:id/com-itens", (req, res) => {
  const { id } = req.params;

  const sqlOS = "SELECT * FROM ordemServico WHERE id = ?";
  const sqlItens = "SELECT * FROM itensOrdemServico WHERE ordemServicoId = ?";

  db.get(sqlOS, [id], (err, os) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar OS" });
    if (!os) return res.status(404).json({ error: "OS não encontrada" });

    db.all(sqlItens, [id], (err, itens) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar itens" });
      res.json({ ...os, itens });
    });
  });
});

app.put("/ordemServico/:id", (req, res) => {
  const { id } = req.params;
  const {
    numeroOS, clienteId, objetoVeiculoId, funcionarioId, laudo,
    dataAbertura, status, descricao, observacoes,
    formaPagamento, desconto, acrescimo, valorTotalItem, valorTotalServ, valorTotal
  } = req.body;

  const sql = `
    UPDATE ordemServico
    SET
      numeroOS = ?,
      clienteId = ?,
      objetoVeiculoId = ?,
      funcionarioId = ?,
      laudo = ?,
      dataAbertura = ?,
      status = ?,
      descricao = ?,
      observacoes = ?,
      formaPagamento = ?,
      desconto = ?,
      acrescimo = ?,
      valorTotalItem = ?,
      valorTotalServ = ?,
      valorTotal = ?
    WHERE id = ?
  `;

  db.run(sql, [
    numeroOS, clienteId, objetoVeiculoId, funcionarioId, laudo,
    dataAbertura, status, descricao, observacoes,
    formaPagamento, desconto, acrescimo, valorTotalItem, valorTotalServ, valorTotal, id
  ], function (err) {
    if (err) {
      console.error("Erro ao atualizar ordem de serviço:", err);
      return res.status(500).json({ error: "Erro ao atualizar OS" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Ordem de serviço não encontrada" });
    }

    res.json({ success: true, message: "Ordem de serviço atualizada com sucesso" });
  });
});

app.put("/itensOrdemServico/:id", (req, res) => {
  const { id } = req.params;
  const { ordemServicoId, produtoId, descricao, tipoItem, quantidade, valorUnitario, total, tecnico } = req.body;

  const sql = `
    UPDATE itensOrdemServico
    SET
      ordemServicoId = ?,
      produtoId = ?,
      descricao = ?,
      tipoItem = ?,
      quantidade = ?,
      valorUnitario = ?,
      total = ?,
      tecnico = ?
    WHERE id = ?
  `;

  db.run(sql, [ordemServicoId, produtoId, descricao, tipoItem, quantidade, valorUnitario, total, tecnico, id], function (err) {
    if (err) {
      console.error("Erro ao atualizar item da OS:", err);
      return res.status(500).json({ error: "Erro ao atualizar item da OS" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Item da OS não encontrado" });
    }

    res.json({ success: true, message: "Item da OS atualizado com sucesso" });
  });
});

app.delete('/itensOrdemServico/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM itensOrdemServico WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ deleted: this.changes });
  });
});


app.get("/objetosVeiculos/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM objetosVeiculos
    WHERE id = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Erro ao buscar objeto do veículo:", err);
      return res.status(500).json({ error: "Erro ao buscar objeto do veículo" });
    }

    if (!row) {
      return res.status(404).json({ error: "Objeto de veículo não encontrado" });
    }

    res.json(row);
  });
});

// ===============================
// DELETAR OS + ITENS VINCULADOS
// ===============================
// ===============================
// DELETAR OS + ITENS VINCULADOS
// ===============================
app.delete('/ordemServico/:id', (req, res) => {
  const { id } = req.params;

  console.log(`🟡 Tentando remover OS ID = ${id}`);

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Apagar os itens vinculados
    db.run('DELETE FROM itensOrdemServico WHERE ordemServicoId = ?', [id], function (err) {
      if (err) {
        console.error('❌ Erro ao deletar itens vinculados:', err.message);
        db.run('ROLLBACK');
        return res.status(500).json({ erro: 'Erro ao remover itens vinculados: ' + err.message });
      }

      console.log(`✅ Itens removidos: ${this.changes}`);

      // Agora apaga a OS
      db.run('DELETE FROM ordemServico WHERE id = ?', [id], function (err2) {
        if (err2) {
          console.error('❌ Erro ao deletar OS:', err2.message);
          db.run('ROLLBACK');
          return res.status(500).json({ erro: 'Erro ao remover Ordem de Serviço: ' + err2.message });
        }

        console.log(`✅ Ordem de Serviço removida. Changes = ${this.changes}`);

        db.run('COMMIT');
        res.json({
          mensagem: 'Ordem de Serviço e itens vinculados removidos com sucesso.',
          itensRemovidos: this.changes
        });
      });
    });
  });
});







// ROTAS USUÁRIOS

function inserirClientePadrao(db) {
  db.get(`SELECT controle FROM clientes WHERE cliente = ?`, ['CONSUMIDOR PADRÃO'], (err, row) => {
    if (err) {
      console.error("Erro ao verificar cliente padrão:", err.message);
      return;
    }

    if (!row) {
      db.run(`
        INSERT INTO clientes (
          cliente, cidade, cep, endereco, bairro, numero, pais, uf,
          ativo, telefone, celular, datanascimento, datahoracadastro,
          naturalidade, nacionalidade, rg, sexo, estadocivil, cpf, cnpj,
          tipocliente, e_mail, ie, im, fantasia, limite
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `, [
        'CONSUMIDOR PADRÃO', '', '', '', '', '', '', '', 'SIM', '', '', null,
        new Date().toISOString(), '', '', '', '', '', '', '', 'F',
        '', '', '', '', null
      ], (err) => {
        if (err) {
          console.error("Erro ao inserir cliente CONSUMIDOR:", err.message);
        } else {
          console.log("Cliente CONSUMIDOR padrão inserido com sucesso.");
        }
      });
    } else {
     // console.log("Cliente CONSUMIDOR já existe.");
    }
  });
}

// --- Chamando as funções ---
inserirClientePadrao(db);

function inserirUsuarioPadrao(db) {
  db.get(`SELECT id FROM usuarios WHERE nome = ?`, ['ADMIN'], (err, row) => {
    if (err) {
      console.error("Erro ao verificar usuário padrão:", err.message);
      return;
    }

    if (!row) {
      db.run(`
        INSERT INTO usuarios (nome, senha, email)
        VALUES (?, ?, ?)
      `, ['ADMIN', '123', ''], (err) => {
        if (err) {
          console.error("Erro ao inserir usuário ADMIN:", err.message);
        } else {
          console.log("Usuário ADMIN inserido com sucesso.");
        }
      });
    } else {
      // console.log("Usuário ADMIN já existe.");
    }
  });
}

inserirUsuarioPadrao(db);

// ROTAS DE USUARIO

app.post('/usuarios', (req, res) => {
  const { nome, senha, email } = req.body;
  if (!nome || !senha) {
    return res.status(400).json({ erro: 'Login e senha são obrigatórios.' });
  }

  const sql = `INSERT INTO usuarios (nome, senha, email) VALUES (?, ?, ?)`;
  db.run(sql, [nome, senha, email], function(err) {
    if (err) return handleDbError(res, err);
    res.status(201).json({ id: this.lastID, nome, senha, email });
  });
});

app.get('/usuarios', (req, res) => {
  db.all(`SELECT * FROM usuarios`, [], (err, rows) => {
    if (err) return handleDbError(res, err);
    res.json(rows);
  });
});

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).send('Usuário e senha são obrigatórios.');
  }

  const sql = `SELECT * FROM usuarios WHERE nome = ? AND senha = ?`;
  db.get(sql, [usuario, senha], (err, row) => {
    if (err) return res.status(500).send('Erro ao acessar o banco de dados.');
    if (!row) return res.status(401).send('Usuário ou senha inválidos.');

    // Se encontrou o usuário, login válido
    res.status(200).json({ sucesso: true, nome: row.nome, email: row.email });
  });
});


app.put('/usuarios/:id', (req, res) => {
  const { nome, senha, email } = req.body;
  const { id } = req.params;
  if (!nome || !senha) {
    return res.status(400).json({ erro: 'Nome e senha são obrigatórios.' });
  }

  const sql = `UPDATE usuarios SET nome = ?, senha = ?, email = ? WHERE id = ?`;
  db.run(sql, [nome, senha, email, id], function(err) {
    if (err) return handleDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    res.json({ atualizado: true, id });
  });
});

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM usuarios WHERE id = ?`, [id], function(err) {
    if (err) return handleDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    res.json({ deletado: true, id });
  });
});


// ROTAS EMITENTE
app.post('/emitente', (req, res) => {
  const dados = req.body;
  const sql = `
    INSERT INTO emitente (
      emitente, cidade, cep, endereco, bairro, numero, pais, uf, ativo,
      telefone, celular, datanascimento, datahoracadastro, naturalidade,
      nacionalidade, rg, sexo, estadocivil, cpf, cnpj, tipocliente,
      e_mail, ie, im, suframa, crt, segmento, faixa, fantasia, tipodebusca
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;
  const params = [
    dados.emitente, dados.cidade, dados.cep, dados.endereco, dados.bairro, dados.numero,
    dados.pais, dados.uf, dados.ativo, dados.telefone, dados.celular,
    dados.datanascimento, dados.datahoracadastro, dados.naturalidade, dados.nacionalidade,
    dados.rg, dados.sexo, dados.estadocivil, dados.cpf, dados.cnpj,
    dados.tipocliente, dados.e_mail, dados.ie, dados.im, dados.suframa,
    dados.crt, dados.segmento, dados.faixa, dados.fantasia, dados.tipodebusca
  ];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ controle: this.lastID, ...dados });
  });
});

// Listar todos emitentes
app.get('/emitente', (req, res) => {
  db.all(`SELECT * FROM emitente`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Buscar emitente por controle
app.get('/emitente/:controle', (req, res) => {
  const { controle } = req.params;
  db.get(`SELECT * FROM emitente WHERE controle = ?`, [controle], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Emitente não encontrado' });
    res.json(row);
  });
});

// Atualizar emitente
app.put('/emitente/:controle', (req, res) => {
  const { controle } = req.params;
  const dados = req.body;
  const sql = `
    UPDATE emitente SET
      emitente=?, cidade=?, cep=?, endereco=?, bairro=?, numero=?, pais=?, uf=?, ativo=?,
      telefone=?, celular=?, datanascimento=?, datahoracadastro=?, naturalidade=?,
      nacionalidade=?, rg=?, sexo=?, estadocivil=?, cpf=?, cnpj=?, tipocliente=?,
      e_mail=?, ie=?, im=?, suframa=?, crt=?, segmento=?, faixa=?, fantasia=?, tipodebusca =?
    WHERE controle=?
  `;
  const params = [
    dados.emitente, dados.cidade, dados.cep, dados.endereco, dados.bairro, dados.numero,
    dados.pais, dados.uf, dados.ativo, dados.telefone, dados.celular,
    dados.datanascimento, dados.datahoracadastro, dados.naturalidade, dados.nacionalidade,
    dados.rg, dados.sexo, dados.estadocivil, dados.cpf, dados.cnpj,
    dados.tipocliente, dados.e_mail, dados.ie, dados.im, dados.suframa,
    dados.crt, dados.segmento, dados.faixa, dados.fantasia, dados.tipodebusca,
    controle
  ];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Emitente não encontrado' });
    res.json({ controle, ...dados });
  });
});

// Excluir emitente
app.delete('/emitente/:controle', (req, res) => {
  const { controle } = req.params;
  db.run(`DELETE FROM emitente WHERE controle = ?`, [controle], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Emitente não encontrado' });
    res.json({ message: 'Emitente excluído com sucesso' });
  });
});

// Atualizar tipodebusca do emitente
app.put('/emitente/tipobusca/:controle', (req, res) => {
  const { controle } = req.params;
  const { tipodebusca } = req.body;

  if (!tipodebusca) {
    return res.status(400).json({ erro: "tipodebusca é obrigatório." });
  }

  const sql = `UPDATE emitente SET tipodebusca = ? WHERE controle = ?`;

  db.run(sql, [tipodebusca, controle], function (err) {
    if (err) {
      console.error("Erro ao atualizar tipodebusca:", err.message);
      return res.status(500).json({ erro: "Erro no servidor." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ erro: "Emitente não encontrado." });
    }

    res.json({ sucesso: true, tipodebusca });
  });
});


// ROTAS CLIENTES
app.post('/clientes', (req, res) => {
  const {
    cliente, cidade, cep, endereco, bairro, numero, pais, uf, ativo,
    telefone, celular, datanascimento, datahoracadastro,
    naturalidade, nacionalidade, rg, sexo, estadocivil,
    cpf, cnpj, tipocliente, e_mail, ie, im, fantasia, limite, objetos
  } = req.body;

  const sql = `
    INSERT INTO clientes (
      cliente, cidade, cep, endereco, bairro, numero, pais, uf, ativo,
      telefone, celular, datanascimento, datahoracadastro,
      naturalidade, nacionalidade, rg, sexo, estadocivil,
      cpf, cnpj, tipocliente, e_mail, ie, im, fantasia, limite
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    cliente, cidade, cep, endereco, bairro, numero, pais, uf, ativo,
    telefone, celular, datanascimento, datahoracadastro,
    naturalidade, nacionalidade, rg, sexo, estadocivil,
    cpf, cnpj, tipocliente, e_mail, ie, im, fantasia, limite
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Erro ao inserir cliente:', err.message);
      return res.status(500).json({ erro: err.message });
    }

    const clienteId = this.lastID;

    // 🔹 Se existirem objetos associados, salvar cada um
    if (objetos && objetos.length > 0) {
      const stmt = db.prepare(`
        INSERT INTO objetosVeiculos (
          clienteId, tipo, marca, modelo, ano, cor, placaSerie, observacoes, ativo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const obj of objetos) {
        stmt.run(
          clienteId,
          obj.tipo || 'OUTRO',
          obj.marca || '',
          obj.modelo || '',
          obj.ano || '',
          obj.cor || '',
          obj.placaSerie || '',
          obj.observacoes || '',
          'SIM'
        );
      }

      stmt.finalize();
    }

    res.status(201).json({ sucesso: true, id: clienteId });
  });
});



app.get('/clientes', (req, res) => {
  db.all(`SELECT * FROM clientes`, [], (err, rows) => {
    if (err) return handleDbError(res, err);
    res.json(rows);
  });
});

app.get('/clientes/:controle', (req, res) => {
  const { controle } = req.params;
  db.get(`SELECT * FROM clientes WHERE controle = ?`, [controle], (err, row) => {
    if (err) return handleDbError(res, err);
    if (!row) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json(row);
  });
});

app.get('/clientes/nome/:controle', (req, res) => {
  const { controle } = req.params;

  db.get(`SELECT cliente FROM clientes WHERE controle = ?`, [controle], (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!row) return res.status(404).json({ erro: 'Cliente não encontrado.' });

    res.json({ cliente: row.cliente });
  });
});


app.put('/clientes/:controle', (req, res) => {
  const {
    cliente, cidade, cep, endereco, bairro, numero, pais, uf,
    ativo, telefone, celular, datanascimento,
    naturalidade, nacionalidade, rg, sexo, estadocivil, cpf, cnpj,
    tipocliente, e_mail, ie, im, fantasia, limite
  } = req.body;

  const { controle } = req.params;

  if (!cliente || !cep || !numero) {
    return res.status(400).json({ erro: 'Campos obrigatórios: cliente, cep e número.' });
  }

  const sql = `
    UPDATE clientes SET
      cliente = ?, cidade = ?, cep = ?, endereco = ?, bairro = ?, numero = ?, pais = ?, uf = ?, ativo = ?,
      telefone = ?, celular = ?, datanascimento = ?, naturalidade = ?, nacionalidade = ?,
      rg = ?, sexo = ?, estadocivil = ?, cpf = ?, cnpj = ?, tipocliente = ?, e_mail = ?, ie = ?, im = ?, fantasia = ?, limite = ?
    WHERE controle = ?
  `;

  const params = [
    cliente, cidade, cep, endereco, bairro, numero, pais, uf, ativo,
    telefone, celular, datanascimento, naturalidade, nacionalidade,
    rg, sexo, estadocivil, cpf, cnpj, tipocliente, e_mail, ie, im, fantasia, limite,
    controle // agora está na posição certa
  ];

  db.run(sql, params, function (err) {
    if (err) return handleDbError(res, err);
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }
    res.json({ atualizado: true, controle });
  });
});


app.delete('/clientes/:controle', (req, res) => {
  const { controle } = req.params;
  db.run(`DELETE FROM clientes WHERE controle = ?`, [controle], function(err) {
    if (err) return handleDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json({ deletado: true, controle });
  });
});

app.get('/clientes/:id/total-aberto', (req, res) => {
  const clienteId = req.params.id;

  const sql = `
    SELECT 
      COUNT(*) AS qtd_abertas,
      COALESCE(SUM(valor + juros + multa), 0) AS total_aberto
    FROM receber
    WHERE cliente_id = ?
      AND (status IS NULL OR UPPER(status) <> 'PAGO')
  `;

  db.get(sql, [clienteId], (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });

    // Retorna pronto para exibir
    res.json({
      mensagem: `${row.qtd_abertas} parcela(s) aberta(s) — Total: R$ ${row.total_aberto.toFixed(2)}`,
      qtd_abertas: row.qtd_abertas,
      total_aberto: row.total_aberto
    });
  });
});

app.get('/clientes/:controle/limite', (req, res) => {
  const controle = req.params.controle;

  const sql = `SELECT limite FROM clientes WHERE controle = ?`;

  db.get(sql, [controle], (err, row) => {
    if (err) {
      console.error('Erro ao buscar limite:', err.message);
      return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }

    if (!row) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    res.json({
      controle: controle,
      limite: row.limite
    });
  });
});




// ROTAS PRODUTOS

app.post('/produtos', (req, res) => {
  const {
    produto, codbarras, fornecedor, grupoestoque, subgrupoestoque, marca,
    precocusto, perclucro, precovenda, precorevenda, precoatacado,
    quantidade, quantidademin, quantidademax, datahoracadastro, ativop, fracionado, aplicacao, duracao
  } = req.body;

   const sql = `
    INSERT INTO produtos (
      produto, codbarras, fornecedor, grupoestoque, subgrupoestoque, marca,
      precocusto, perclucro, precovenda, precorevenda, precoatacado,
      quantidade, quantidademin, quantidademax, datahoracadastro, ativop, fracionado, aplicacao, duracao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    produto, codbarras, fornecedor, grupoestoque, subgrupoestoque, marca,
    precocusto, perclucro, precovenda, precorevenda, precoatacado,
    quantidade, quantidademin, quantidademax, datahoracadastro, ativop, fracionado, aplicacao, duracao
  ];

  db.run(sql, params, function(err) {
    if (err) return handleDbError(res, err);
    res.status(201).json({ controle: this.lastID, produto });
  });
});

app.get('/produtos', (req, res) => {
  db.all(`SELECT * FROM produtos WHERE aplicacao = 'PRODUTOS'`, [], (err, rows) => {
    if (err) return handleDbError(res, err);
    res.json(rows);
  });
});

app.get('/produtos/servicos', (req, res) => {
  db.all(`SELECT * FROM produtos WHERE aplicacao = 'SERVIÇOS' `, [], (err, rows) => {
    if (err) return handleDbError(res, err);
    res.json(rows);
  });
});

app.get('/produtos/max', (req, res) => {
  db.get(`SELECT MAX(controle) as maxControle FROM produtos`, [], (err, row) => {
    if (err) return handleDbError(res, err);
    res.json(row);
  });
});

app.get('/produtos/servico/max', (req, res) => {
  db.get(`SELECT MAX(controle) as maxControle FROM produtos`, [], (err, row) => {
    if (err) return handleDbError(res, err);
    res.json(row);
  });
});

app.get('/ordemServico/max', (req, res) => {
  db.get(`SELECT MAX(id) as maxId FROM ordemServico`, [], (err, row) => {
    if (err) return handleDbError(res, err);
    res.json(row);
  });
});

app.get('/produtos/codbarras/:codbarras', (req, res) => {
  const { codbarras } = req.params;
  db.get(`SELECT * FROM produtos WHERE codbarras = ? and ativop = 'SIM'`, [codbarras], (err, row) => {
    if (err) return handleDbError(res, err);
    if (!row) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(row);
  });
});

app.get('/produtos/controleos/:controle', (req, res) => {
  const { controle } = req.params;
  db.get(`SELECT * FROM produtos WHERE controle = ? and ativop = 'SIM'`, [controle], (err, row) => {
    if (err) return handleDbError(res, err);
    if (!row) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(row);
  });
});

app.get('/produtos/controle/:controle', (req, res) => {
  const { controle } = req.params;
  db.get(`SELECT * FROM produtos WHERE controle = ? and ativop = 'SIM' and aplicacao = 'PRODUTOS'`, [controle], (err, row) => {
    if (err) return handleDbError(res, err);
    if (!row) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(row);
  });
});

app.get('/produtos/:controle', (req, res) => {
  const { controle } = req.params;
  db.get(`SELECT * FROM produtos WHERE controle = ?`, [controle], (err, row) => {
    if (err) return handleDbError(res, err);
    if (!row) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(row);
  });
});

app.put('/produtos/:controle', (req, res) => {
  const {
    produto, codbarras, fornecedor, grupoestoque, subgrupoestoque, marca,
    precocusto, perclucro, precovenda, precorevenda, precoatacado,
    quantidade, quantidademin, quantidademax, ativop, fracionado, aplicacao, duracao
  } = req.body;

  const { controle } = req.params;

  const sql = `
    UPDATE produtos SET
      produto = ?, codbarras = ?, fornecedor = ?, grupoestoque = ?, subgrupoestoque = ?, marca = ?,
      precocusto = ?, perclucro = ?, precovenda = ?, precorevenda = ?, precoatacado = ?,
      quantidade = ?, quantidademin = ?, quantidademax = ?, ativop = ?, fracionado = ?, aplicacao = ?, duracao = ?
    WHERE controle = ?
  `;

  const params = [
    produto, codbarras, fornecedor, grupoestoque, subgrupoestoque, marca,
    precocusto, perclucro, precovenda, precorevenda, precoatacado,
    quantidade, quantidademin, quantidademax, ativop, fracionado, aplicacao, duracao, controle
  ];

  db.run(sql, params, function (err) {
    if (err) return handleDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json({ atualizado: true, controle });
  });
});


app.delete('/produtos/:controle', (req, res) => {
  const { controle } = req.params;
  db.run(`DELETE FROM produtos WHERE controle = ?`, [controle], function(err) {
    if (err) return handleDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json({ deletado: true, controle });
  });
});


// Diminuir estoque

app.post('/produtos/:controle/diminuir', express.json(), (req, res) => {
  const controle = parseInt(req.params.controle);
  const quantidadeDiminuir = parseFloat(req.body.quantidade); 


  if (isNaN(quantidadeDiminuir) || quantidadeDiminuir <= 0) {
    return res.status(400).send('Quantidade inválida');
  }

  db.get('SELECT quantidade FROM produtos WHERE controle = ?', [controle], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro no banco de dados');
    }
    if (!row) {
      return res.status(404).send('Produto não encontrado');
    }

    const estoqueAtual = row.quantidade;
    if (estoqueAtual < quantidadeDiminuir) {
      return res.status(400).send('Estoque insuficiente');
    }

    const novaQuantidade = estoqueAtual - quantidadeDiminuir;

    db.run('UPDATE produtos SET quantidade = ? WHERE controle = ?', [novaQuantidade, controle], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).send('Erro ao atualizar estoque');
      }
      console.log(`-Estoque do produto ${controle} atualizado de ${row.quantidade.toFixed(2)} para ${novaQuantidade.toFixed(2)}`
);

      res.json({ mensagem: 'Estoque atualizado', novaQuantidade });
    });
  });
});

// Aumentar estoque

const productLocks = new Set();
app.post('/produtos/:controle/aumentar', (req, res) => {
  const controle = parseInt(req.params.controle, 10);
  const quantidadeAumentar = parseFloat(req.body.quantidade);  
  
  // validações iniciais
  if (isNaN(controle)) {
    return res.status(400).json({ erro: 'Controle inválido' });
  }
  if (isNaN(quantidadeAumentar) || quantidadeAumentar <= 0) {
    return res.status(400).json({ erro: 'Quantidade deve ser um número positivo' });
  }
  
  // bloqueio para evitar atualizações concorrentes
  if (productLocks.has(controle)) {
    return res.status(429).json({ 
      erro: 'Atualização de estoque já em andamento para este produto. Tente novamente em instantes.' 
    });
  }

  productLocks.add(controle);  

  db.serialize(() => {
    db.get('SELECT quantidade FROM produtos WHERE controle = ?', [controle], (err, row) => {
      if (err) {
        console.error('Erro ao consultar o banco:', err);
        productLocks.delete(controle);
        return res.status(500).json({ erro: 'Erro interno ao consultar o banco de dados' });
      }

      if (!row) {
        productLocks.delete(controle);
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      const novaQuantidade = parseFloat(row.quantidade) + quantidadeAumentar;

      db.run(
        'UPDATE produtos SET quantidade = ? WHERE controle = ?',
        [novaQuantidade, controle],
        function(err2) {
          // libera o lock sempre, mesmo em caso de erro
          productLocks.delete(controle);

          if (err2) {
            console.error('Erro ao atualizar o estoque:', err2);
            return res.status(500).json({ erro: 'Erro ao atualizar o estoque do produto' });
          }

          console.log(
            `+Estoque do produto ${controle} atualizado de ${row.quantidade.toFixed(2)} para ${novaQuantidade.toFixed(2)}`
          );

          return res.json({
            mensagem: 'Estoque atualizado com sucesso',
            produto: {
              controle,
              quantidadeAnterior: parseFloat(row.quantidade),
              novaQuantidade
            }
          });
        }
      );
    });
  });
});


// 1. **Rota para criar um novo funcionário (POST)**

function inserirFuncionarioPadrao(db) {
  db.get(`SELECT controle FROM funcionarios WHERE funcionariof = ?`, ['FUNCIONÁRIO PADRÃO'], (err, row) => {
    if (err) {
      console.error("Erro ao verificar funcionário padrão:", err.message);
      return;
    }

    if (!row) {
      db.run(`
        INSERT INTO funcionarios (
          funcionariof, cpff, rgf, cepf, enderecof, bairrof, numerof,
          uff, cidadef, ativof, telefonef, celularf, datanascimentof,
          datahoracadastrof, dataadmissaof, sexof, estadocivilf,
          funcaof, e_mailf
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `, [
        'FUNCIONÁRIO PADRÃO', '', '', '', '', '', '', '', '', 'SIM', '', '',
        null, new Date().toISOString(), new Date().toISOString(), '', '', '', ''
      ], (err) => {
        if (err) {
          console.error("Erro ao inserir funcionário padrão:", err.message);
        } else {
          console.log("Funcionário padrão inserido com sucesso.");
        }
      });
    } else {
    //  console.log("Funcionário padrão já existe.");
    }
  });
}
inserirFuncionarioPadrao(db);

app.post('/funcionarios', (req, res) => {
  const {
    funcionariof, cpff, rgf, cepf, enderecof, bairrof, numerof,
    uff, cidadef, ativof, telefonef, celularf, datanascimentof,
    datahoracadastrof, datanaadmissaof, sexof, estadocivilf,
    funcaof, e_mailf
  } = req.body;

  const sql = `
    INSERT INTO funcionarios (
      funcionariof, cpff, rgf, cepf, enderecof, bairrof, numerof,
      uff, cidadef, ativof, telefonef, celularf, datanascimentof,
      datahoracadastrof, dataadmissaof, sexof, estadocivilf,
      funcaof, e_mailf
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    funcionariof, cpff, rgf, cepf, enderecof, bairrof, numerof,
    uff, cidadef, ativof, telefonef, celularf, datanascimentof,
    datahoracadastrof, datanaadmissaof, sexof, estadocivilf,
    funcaof, e_mailf
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao inserir funcionário');
    } else {
      res.status(201).json({ controle: this.lastID });
    }
  });
});


// 2. **Rota para listar todos os funcionários (GET)**
app.get('/funcionarios', (req, res) => {
  const query = 'SELECT * FROM funcionarios';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar funcionários:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar funcionários' });
    }
    res.status(200).json(rows);
  });
});

// 3. **Rota para buscar um funcionário por ID (GET)**
app.get('/funcionarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM funcionarios WHERE controle = ?';

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar funcionário:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar funcionário' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    res.status(200).json(row);
  });
});

app.get('/funcionarios/nome/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT funcionariof FROM funcionarios WHERE controle = ?';

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar funcionário:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar funcionário' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.status(200).json({ funcionariof: row.funcionariof });
  });
});


// 4. **Rota para atualizar um funcionário (PUT)**
app.put('/funcionarios/:id', (req, res) => {
  const { id } = req.params;
  const {
    funcionariof,
    cpff,
    rgf,
    cepf,
    enderecof,
    bairrof,
    numerof,
    uff,
    cidadef,
    ativof,
    telefonef,
    celularf,
    datanascimentof,
    datahoracadastrof,
    dataadmissaof,
    sexof,
    estadocivilf,
    funcaof,
    e_mailf
  } = req.body;

  const query = `
    UPDATE funcionarios SET
      funcionariof = ?, cpff = ?, rgf = ?, cepf = ?, enderecof = ?, bairrof = ?, numerof = ?, uff = ?, cidadef = ?,
      ativof = ?, telefonef = ?, celularf = ?, datanascimentof = ?, datahoracadastrof = ?, dataadmissaof = ?,
      sexof = ?, estadocivilf = ?, funcaof = ?, e_mailf = ?
    WHERE controle = ?
  `;
  
  const values = [
    funcionariof, cpff, rgf, cepf, enderecof, bairrof, numerof, uff, cidadef,
    ativof, telefonef, celularf, datanascimentof, datahoracadastrof, dataadmissaof,
    sexof, estadocivilf, funcaof, e_mailf, id
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error('Erro ao atualizar funcionário:', err.message);
      return res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    res.status(200).json({ message: 'Funcionário atualizado com sucesso' });
  });
});

// 5. **Rota para excluir um funcionário (DELETE)**
app.delete('/funcionarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM funcionarios WHERE controle = ?';

  db.run(query, [id], function (err) {
    if (err) {
      console.error('Erro ao excluir funcionário:', err.message);
      return res.status(500).json({ error: 'Erro ao excluir funcionário' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    res.status(200).json({ message: 'Funcionário excluído com sucesso' });
  });
});

// Rota para fornecedores**

app.post('/fornecedores', (req, res) => {
  const {
    fornecedor, cnpj, ie, endereco, bairro, cidade, uf, cep, numero,
    telefone, celular, email, datahoracadastrofo, observacoes, ativo
  } = req.body;

  if (!fornecedor || !ativo) {
    return res.status(400).json({ erro: 'Campos obrigatórios: fornecedor e ativo.' });
  }

  const sql = `
    INSERT INTO fornecedores (
      fornecedor, cnpj, ie, endereco, bairro, cidade, uf, cep, numero,
      telefone, celular, email, datahoracadastrofo, observacoes, ativo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    fornecedor, cnpj, ie, endereco, bairro, cidade, uf, cep, numero,
    telefone, celular, email, datahoracadastrofo, observacoes, ativo
  ];

  db.run(sql, params, function(err) {
    if (err) return handleDbError(res, err);
    res.status(201).json({ controle: this.lastID, fornecedor });
  });
});

app.get('/fornecedores', (req, res) => {
  db.all(`SELECT * FROM fornecedores ORDER BY controle`, [], (err, rows) => {
    if (err) return handleDbError(res, err);
    res.json(rows);
  });
});

app.get('/fornecedores/:controle', (req, res) => {
  const { controle } = req.params;

  db.get(`SELECT * FROM fornecedores WHERE controle = ?`, [controle], (err, row) => {
    if (err) return handleDbError(res, err);
    if (!row) return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
    res.json(row);
  });
});

app.put('/fornecedores/:controle', (req, res) => {
  const { controle } = req.params;
  const {
    fornecedor, cnpj, ie, endereco, bairro, cidade, uf, cep, numero,
    telefone, celular, email, datahoracadastrofo, observacoes, ativo
  } = req.body;

  if (!fornecedor || !ativo) {
    return res.status(400).json({ erro: 'Campos obrigatórios: fornecedor e ativo.' });
  }

  const sql = `
    UPDATE fornecedores SET
      fornecedor = ?, cnpj = ?, ie = ?, endereco = ?, bairro = ?, cidade = ?, uf = ?, cep = ?, numero = ?,
      telefone = ?, celular = ?, email = ?, datahoracadastrofo =?, observacoes = ?, ativo = ?
    WHERE controle = ?
  `;

  const params = [
    fornecedor, cnpj, ie, endereco, bairro, cidade, uf, cep, numero,
    telefone, celular, email, datahoracadastrofo, observacoes, ativo, controle
  ];

  db.run(sql, params, function (err) {
    if (err) return handleDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
    res.json({ atualizado: true, controle });
  });
});

app.delete('/fornecedores/:controle', (req, res) => {
  const { controle } = req.params;

  db.run(`DELETE FROM fornecedores WHERE controle = ?`, [controle], function(err) {
    if (err) return handleDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
    res.json({ deletado: true, controle });
  });
});


function inserirFornecedorPadrao(db) {
  db.get(
    `SELECT controle FROM fornecedores WHERE fornecedor = ?`,
    ['FORNECEDOR PADRÃO'],
    (err, row) => {
      if (err) {
        console.error("Erro ao verificar fornecedor padrão:", err.message);
        return;
      }

      if (!row) {
        db.run(
          `
          INSERT INTO fornecedores (
            fornecedor, cnpj, ie, endereco, bairro, cidade, uf, cep,
            numero, telefone, celular, email, datahoracadastrofo,
            observacoes, ativo
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
          `,
          [
            'FORNECEDOR PADRÃO', 
            '',  // cnpj
            '',  // ie
            '',  // endereco
            '',  // bairro
            '',  // cidade
            '',  // uf
            '',  // cep
            '',  // numero
            '',  // telefone
            '',  // celular
            '',  // email
            new Date().toISOString(), // datahoracadastrofo
            '',  // observacoes
            'SIM' // ativo
          ],
          (err) => {
            if (err) {
              console.error("Erro ao inserir fornecedor padrão:", err.message);
            } else {
              console.log("Fornecedor padrão inserido com sucesso.");
            }
          }
        );
      } else {
        // console.log("Fornecedor padrão já existe.");
      }
    }
  );
}

// chamar após abrir o banco
inserirFornecedorPadrao(db);


app.post('/produtos/repor-em-lote', express.json(), async (req, res) => {
  const itens = req.body;   
  const aumentarEstoque = (controle, quantidade) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT quantidade FROM produtos WHERE controle = ?', [controle], (err, row) => {
        if (err) return reject(err);
        if (!row) return reject(new Error('Produto não encontrado'));

        const quantidadeAumentar = parseFloat(quantidade);
        const novaQuantidade = row.quantidade + quantidadeAumentar;

        db.run('UPDATE produtos SET quantidade = ? WHERE controle = ?', [novaQuantidade, controle], (err2) => {
          if (err2) return reject(err2);
          console.log(`+Estoque do produto ${controle} atualizado de ${row.quantidade.toFixed(2)} para ${novaQuantidade.toFixed(2)}`);
          resolve();
        });
      });
    });
  };
  try {
    for (const item of itens) {
      await aumentarEstoque(item.controle, item.quantidade);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Erro ao repor em lote:', err.message);
    res.status(500).json({ erro: 'Erro ao repor produtos', detalhe: err.message });
  }
});

app.post('/produtos/diminuir-em-lote', express.json(), async (req, res) => {
  const itens = req.body; 
  const diminuirEstoque = (controle, quantidade) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT quantidade FROM produtos WHERE controle = ?', [controle], (err, row) => {
        if (err) return reject(err);
        if (!row) return reject(new Error(`Produto ${controle} não encontrado`));

        if (row.quantidade < quantidade) {
          return reject(new Error(`Estoque insuficiente para o produto ${controle}`));
        }
        const quantidadeDiminuir = parseFloat(quantidade);
        const novaQuantidade = row.quantidade - quantidadeDiminuir;
        db.run('UPDATE produtos SET quantidade = ? WHERE controle = ?', [novaQuantidade, controle], (err2) => {
          if (err2) return reject(err2);
          console.log(`-Estoque do produto ${controle} atualizado de ${row.quantidade.toFixed(2)} para ${novaQuantidade.toFixed(2)}`
);

          resolve();
        });
      });
    });
  };
  try {
    for (const item of itens) {
      await diminuirEstoque(item.controle, item.quantidade);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Erro ao diminuir em lote:', err.message);
    res.status(500).json({ erro: 'Erro ao diminuir produtos', detalhe: err.message });
  }
});
//ROTAS RECEBER

app.post('/receber', (req, res) => {
  const {
    cliente_id,
    funcionario,
    descricao,
    datavencimento,
    datapagamento,
    datacadastro,
    valororiginal,
    valor,
    valorpago,
    numeroparcela,
    totalparcelas,
    juros,
    multa,
    status
  } = req.body;

  const sql = `
    INSERT INTO receber (
      cliente_id,
      funcionario,
      descricao,
      datavencimento,
      datapagamento,
      datacadastro,
      valororiginal,
      valor,
      valorpago,
      numeroparcela,
      totalparcelas,
      juros,
      multa,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    cliente_id,
    funcionario,
    descricao,
    datavencimento,
    datapagamento,
    datacadastro,
    valororiginal,
    valor,
    valorpago,
    numeroparcela,
    totalparcelas,
    juros,
    multa,
    status
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Erro ao inserir movimentação:', err.message);
      return res.status(500).json({ error: 'Erro ao salvar movimentação' });
    }
    res.status(201).json({ message: 'Movimentação salva com sucesso', id: this.lastID });
  });
});

app.get('/receber', (req, res) => {
  const sql = `
    SELECT 
      receber.*, 
      clientes.cliente AS nomecliente
    FROM 
      receber
    LEFT JOIN 
      clientes ON receber.cliente_id = clientes.controle
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar dados de receber:', err);
      return res.status(500).json({ erro: 'Erro ao buscar dados' });
    }
    res.json(rows);
  });
});



app.delete('/receber/:controle', (req, res) => {
  const { controle } = req.params;

  const sql = 'DELETE FROM receber WHERE controle = ?';

  db.run(sql, [controle], function (err) {
    if (err) {
      console.error('Erro ao deletar movimentação:', err.message);
      return res.status(500).json({ error: 'Erro ao deletar movimentação' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Movimentação não encontrada' });
    }

    res.status(200).json({ message: 'Movimentação deletada com sucesso' });
  });
});

app.put('/:cliente_id/pagar-parcelas', (req, res) => {
  const clienteId = req.params.cliente_id;
  const { parcelasIds, valorAbono } = req.body;

  if (!Array.isArray(parcelasIds) || parcelasIds.length === 0) {
    return res.status(400).json({ error: 'Nenhuma parcela selecionada.' });
  }

  if (!valorAbono || valorAbono <= 0) {
    return res.status(400).json({ error: 'Valor de abono inválido.' });
  }

  const placeholders = parcelasIds.map(() => '?').join(',');
  const selectSql = `
    SELECT controle, valororiginal, juros, multa, COALESCE(valorpago, 0) AS valorpago
    FROM receber
    WHERE cliente_id = ?
      AND controle IN (${placeholders})
      AND status = 'ABERTO'
  `;

  db.all(selectSql, [clienteId, ...parcelasIds], (err, rows) => {
    if (err) {
      console.error('Erro ao consultar parcelas:', err.message);
      return res.status(500).json({ error: 'Erro ao consultar parcelas.' });
    }

    if (rows.length !== parcelasIds.length) {
      return res.status(400).json({
        error: 'Algumas parcelas não existem ou já estão pagas.',
      });
    }

    const totalSelecionado = rows.reduce((total, row) => {
      return total + (row.valororiginal + row.juros + row.multa - row.valorpago);
    }, 0);

    if (Math.abs(totalSelecionado - valorAbono) > 0.01) {
      return res.status(400).json({
        error: `O valor total selecionado é R$${totalSelecionado.toFixed(2)} e não bate com o valor informado.`,
      });
    }

    const dataHoje = new Date().toISOString().split('T')[0];

    const updates = rows.map(row => {
      const totalPago = row.valororiginal + row.juros + row.multa;
      return new Promise((resolve, reject) => {
        db.run(
          `UPDATE receber
           SET valorpago = ?, status = ?, datapagamento = ?
           WHERE controle = ?`,
          [totalPago, 'PAGO', dataHoje, row.controle],
          (err) => (err ? reject(err) : resolve())
        );
      });
    });

    Promise.all(updates)
      .then(() => {
        res.json({
          //message: `Parcelas pagas com sucesso. Total: R$${totalSelecionado.toFixed(2)}.`,
          //quantidade: rows.length
        });
      })
      .catch((error) => {
        console.error('Erro ao atualizar parcelas:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar parcelas.' });
      });
  });
});



//ROTAS PAGAR

app.post('/pagar', (req, res) => {
  const {
    fornecedor_id,
    funcionario,
    descricao,
    datavencimento,
    datapagamento,
    datacadastro,
    valororiginal,
    valor,
    valorpago,
    numeroparcela,
    totalparcelas,
    juros,
    multa,
    status
  } = req.body;

  
  if (!fornecedor_id || !datavencimento || !datacadastro || !valororiginal || !numeroparcela || !totalparcelas || !status) {
    return res.status(400).json({ erro: 'Dados obrigatórios faltando.' });
  }

  const sql = `
    INSERT INTO pagar (
      fornecedor_id, funcionario, descricao, datavencimento, datapagamento,
      datacadastro, valororiginal, valor, valorpago, numeroparcela,
      totalparcelas, juros, multa, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    fornecedor_id,
    funcionario || '',
    descricao || '',
    datavencimento,
    datapagamento || '',
    datacadastro,
    valororiginal,
    valor || valororiginal,
    valorpago || 0,
    numeroparcela,
    totalparcelas,
    juros || 0,
    multa || 0,
    status
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Erro ao inserir parcela em pagar:', err);
      return res.status(500).json({ erro: 'Erro ao inserir parcela' });
    }
    res.json({ sucesso: true, id: this.lastID });
  });
});


app.get('/pagar', (req, res) => {
  const sql = `
    SELECT 
      pagar.*, 
      fornecedores.fornecedor AS nomefornecedor
    FROM 
      pagar
    LEFT JOIN 
      fornecedores ON pagar.fornecedor_id = fornecedores.controle
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar dados de pagar:', err);
      return res.status(500).json({ erro: 'Erro ao buscar dados' });
    }
    res.json(rows);
  });
});

app.delete('/pagar/:controle', (req, res) => {
  const { controle } = req.params;

  const sql = 'DELETE FROM pagar WHERE controle = ?';

  db.run(sql, [controle], function (err) {
    if (err) {
      console.error('Erro ao deletar movimentação:', err.message);
      return res.status(500).json({ error: 'Erro ao deletar movimentação' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Movimentação não encontrada' });
    }

    res.status(200).json({ message: 'Movimentação deletada com sucesso' });
  });
});

app.put('/:fornecedor_id/pagarparcelas', (req, res) => {
  const fornecedorId = req.params.fornecedor_id;
  const { parcelasIds, valorAbono } = req.body;

  if (!Array.isArray(parcelasIds) || parcelasIds.length === 0) {
    return res.status(400).json({ error: 'Nenhuma parcela selecionada.' });
  }

  if (!valorAbono || valorAbono <= 0) {
    return res.status(400).json({ error: 'Valor de abono inválido.' });
  }

  const placeholders = parcelasIds.map(() => '?').join(',');
  const selectSql = `
    SELECT controle, valororiginal, juros, multa, COALESCE(valorpago, 0) AS valorpago
    FROM pagar
    WHERE fornecedor_id = ?
      AND controle IN (${placeholders})
      AND status = 'ABERTO'
  `;

  db.all(selectSql, [fornecedorId, ...parcelasIds], (err, rows) => {
    if (err) {
      console.error('Erro ao consultar parcelas:', err.message);
      return res.status(500).json({ error: 'Erro ao consultar parcelas.' });
    }

    if (rows.length !== parcelasIds.length) {
      return res.status(400).json({
        error: 'Algumas parcelas não existem ou já estão pagas.',
      });
    }

    const totalSelecionado = rows.reduce((total, row) => {
      return total + (row.valororiginal + row.juros + row.multa - row.valorpago);
    }, 0);

    if (Math.abs(totalSelecionado - valorAbono) > 0.01) {
      return res.status(400).json({
        error: `O valor total selecionado é R$${totalSelecionado.toFixed(2)} e não bate com o valor informado.`,
      });
    }

    const dataHoje = new Date().toISOString().split('T')[0];

    const updates = rows.map(row => {
      const totalPago = row.valororiginal + row.juros + row.multa;
      return new Promise((resolve, reject) => {
        db.run(
          `UPDATE pagar
           SET valorpago = ?, status = ?, datapagamento = ?
           WHERE controle = ?`,
          [totalPago, 'PAGO', dataHoje, row.controle],
          (err) => (err ? reject(err) : resolve())
        );
      });
    });

    Promise.all(updates)
      .then(() => {
        res.json({
          
        });
      })
      .catch((error) => {
        console.error('Erro ao atualizar parcelas:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar parcelas.' });
      });
  });
});

//ROTAS DE CAIXA

app.post('/caixa', (req, res) => {
  const {
    cod_cliente, cliente,
    cod_funcionario, funcionario,
    cod_fornecedor, fornecedor,
    descricao, datacadastro,
    especies, valorentrada, valorsaida
  } = req.body;

  const sql = `
    INSERT INTO caixa (
      cod_cliente, cliente,
      cod_funcionario, funcionario,
      cod_fornecedor, fornecedor,
      descricao, datacadastro,
      especies, valorentrada, valorsaida
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    cod_cliente, cliente,
    cod_funcionario, funcionario,
    cod_fornecedor, fornecedor,
    descricao, datacadastro,
    especies, valorentrada, valorsaida
  ];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Registro inserido com sucesso', controle: this.lastID });
  });
});

app.get('/caixa', (req, res) => {
  db.all('SELECT * FROM caixa ORDER BY datacadastro ASC', (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.delete('/caixa/:controle', (req, res) => {
  const { controle } = req.params;
  db.run('DELETE FROM caixa WHERE controle = ?', [controle], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    if (this.changes === 0) return res.status(404).json({ erro: 'Registro não encontrado' });
    res.json({ mensagem: 'Registro excluído com sucesso' });
  });
});


// ==========================
// ROTAS DE OBJETOS/VEÍCULOS VINCULADOS AO CLIENTE
// ==========================

// 📋 Listar todos os objetos de um cliente
app.get('/clientes/:clienteId/objetos-veiculos', (req, res) => {
  const { clienteId } = req.params;
  db.all(`SELECT * FROM objetosVeiculos WHERE clienteId = ? AND ativo = 'SIM' ORDER BY id DESC`, [clienteId], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

// ➕ Cadastrar novo objeto/veículo
app.post('/clientes/:clienteId/objetos-veiculos', (req, res) => {
  const { clienteId } = req.params;
  const { tipo, marca, modelo, ano, cor, placaSerie, numeroSerie, observacoes } = req.body;

  db.run(
    `INSERT INTO objetosVeiculos (clienteId, tipo, marca, modelo, ano, cor, placaSerie, numeroSerie, observacoes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [clienteId, tipo, marca, modelo, ano, cor, placaSerie, numeroSerie, observacoes],
    function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ id: this.lastID, mensagem: 'Objeto/veículo cadastrado com sucesso!' });
    }
  );
});

// Atualizar cliente
app.put('/clientes/:clienteId/objetos-veiculos/:id', (req, res) => {
  const { clienteId, id } = req.params;
  const { tipo, marca, modelo, ano, cor, placaSerie, numeroSerie, observacoes } = req.body;

  const sql = `
    UPDATE objetosVeiculos SET
      tipo = ?,
      marca = ?,
      modelo = ?,
      ano = ?,
      cor = ?,
      placaSerie = ?,
      numeroSerie = ?,
      observacoes = ?
    WHERE id = ? AND clienteId = ?
  `;

  const params = [tipo, marca, modelo, ano, cor, placaSerie, numeroSerie, observacoes, id, clienteId];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Erro ao atualizar objeto/veículo:', err.message);
      return res.status(500).json({ erro: 'Erro ao atualizar objeto/veículo.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Objeto/veículo não encontrado.' });
    }

    res.json({ sucesso: true, mensagem: 'Objeto/veículo atualizado com sucesso!' });
  });
});


// Deletar objetos do cliente
app.delete('/clientes/:clienteId/objetos-veiculos', (req, res) => {
  const { clienteId } = req.params;
  db.run(`DELETE FROM objetosVeiculos WHERE clienteId = ?`, [clienteId], function (err) {
    if (err) return res.status(500).send('Erro ao remover objetos.');
    res.json({ sucesso: true });
  });
});



// 🗑️ Desativar (em vez de apagar)
app.put('/objetos-veiculos/:id/desativar', (req, res) => {
  const { id } = req.params;
  db.run(`UPDATE objetosVeiculos SET ativo = 'NÃO' WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Objeto/veículo desativado com sucesso!' });
  });
});

function calcularDiasAtraso(dataVencimento) {
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  const diffTime = hoje - vencimento;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function calcularJurosEMulta(valorOriginal, valorPago, diasAtraso, taxaMulta, taxaJurosDiaria) {
  const saldoDevedor = Math.max(0, valorOriginal - (valorPago || 0));
  const multa = parseFloat((valorOriginal * taxaMulta).toFixed(2));
  const juros = parseFloat((saldoDevedor * taxaJurosDiaria * diasAtraso).toFixed(2));
  return { multa, juros };
}

function atualizarJurosEMultas() {
  const hoje = new Date();
  const taxaMulta = 0.02;
  const taxaJurosDiaria = 0.02 / 30;

  const sql = `
    SELECT controle, valororiginal, datavencimento, valorpago
    FROM receber
    WHERE status IN ('ABERTO')
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error('Erro ao buscar contas:', err.message);
    }

    rows.forEach(({ controle, valororiginal, datavencimento, valorpago }) => {
      if (new Date(datavencimento) < hoje) {
        const diasAtraso = calcularDiasAtraso(datavencimento);
        const { multa, juros } = calcularJurosEMulta(
          valororiginal,
          valorpago,
          diasAtraso,
          taxaMulta,
          taxaJurosDiaria
        );

        db.run(
          `UPDATE receber SET juros = ?, multa = ? WHERE controle = ?`,
          [juros, multa, controle],
          (err) => {
            if (err) {
              console.error(`Erro ao atualizar conta ${controle}:`, err.message);
            } else {
              console.log(`Conta Receber ${controle} atualizada: Juros R$${juros.toFixed(2)}, Multa R$${multa.toFixed(2)}`);
            }
          }
        );
      }
    });
  });
}

function atualizarJurosEMultasPagar() {
  const hoje = new Date();
  const taxaMulta = 0.02;
  const taxaJurosDiaria = 0.02 / 30;

  const sql = `
    SELECT controle, valororiginal, datavencimento, valorpago
    FROM pagar
    WHERE status IN ('ABERTO')
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error('Erro ao buscar contas:', err.message);
    }

    rows.forEach(({ controle, valororiginal, datavencimento, valorpago }) => {
      if (new Date(datavencimento) < hoje) {
        const diasAtraso = calcularDiasAtraso(datavencimento);
        const { multa, juros } = calcularJurosEMulta(
          valororiginal,
          valorpago,
          diasAtraso,
          taxaMulta,
          taxaJurosDiaria
        );

        db.run(
          `UPDATE pagar SET juros = ?, multa = ? WHERE controle = ?`,
          [juros, multa, controle],
          (err) => {
            if (err) {
              console.error(`Erro ao atualizar conta ${controle}:`, err.message);
            } else {
              console.log(`Conta Pagar ${controle} atualizada: Juros R$${juros.toFixed(2)}, Multa R$${multa.toFixed(2)}`);
            }
          }
        );
      }
    });
  });
}
atualizarJurosEMultas()
atualizarJurosEMultasPagar()

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  //atualizarJurosEMultas()

});