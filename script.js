document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'api/index.php';

  const buildUrl = (resource, params = {}) => {
    const qs = new URLSearchParams({ resource, ...params }).toString();
    return `${API_URL}?${qs}`;
  };

  const apiRequest = async (url, options) => {
    const res = await fetch(url, options);
    let json;
    try {
      json = await res.json();
    } catch {
      json = { ok: false, error: 'Resposta inválida do servidor.' };
    }
    if (!json.ok) throw new Error(json.error || 'Erro na requisição.');
    return json.data;
  };

  const apiList = (resource) => apiRequest(buildUrl(resource));

  const apiCreate = (resource, data) =>
    apiRequest(buildUrl(resource), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

  const apiUpdate = (resource, id, data) =>
    apiRequest(buildUrl(resource, { id }), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

  const apiDelete = (resource, id) =>
    apiRequest(buildUrl(resource, { id }), { method: 'DELETE' });

  const apiLogin = (email, senha) =>
    apiRequest(buildUrl('login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const fmtDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '');

  const fmtMoney = (v) => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',');

  const loginForm = document.getElementById('loginForm');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const loginView = document.getElementById('loginView');
  const appView = document.getElementById('appView');

  const emailError = email.closest('.form-group').querySelector('.error-message');
  const passwordError = password.closest('.form-group').querySelector('.error-message');

  const setError = (input, errorEl, message) => {
    input.classList.add('invalid');
    errorEl.textContent = message;
  };

  const clearError = (input, errorEl) => {
    input.classList.remove('invalid');
    errorEl.textContent = '';
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  togglePassword.addEventListener('click', () => {
    const type = password.type === 'password' ? 'text' : 'password';
    password.type = type;
    togglePassword.setAttribute('aria-label', type === 'password' ? 'Mostrar senha' : 'Ocultar senha');
  });

  email.addEventListener('input', () => clearError(email, emailError));
  password.addEventListener('input', () => clearError(password, passwordError));

  function enterApp(userEmail) {
    loginView.classList.add('hidden');
    appView.classList.remove('hidden');
    document.getElementById('topbarUser').textContent = `Bem-vindo, ${userEmail}`;
    showView('home');
  }

  function leaveApp() {
    appView.classList.add('hidden');
    loginView.classList.remove('hidden');
    loginForm.reset();
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    let valid = true;
    const emailValue = email.value.trim();

    if (!emailValue) {
      setError(email, emailError, 'Informe seu e-mail.');
      valid = false;
    } else if (!isValidEmail(emailValue)) {
      setError(email, emailError, 'Digite um e-mail válido.');
      valid = false;
    }

    if (!password.value) {
      setError(password, passwordError, 'Informe sua senha.');
      valid = false;
    } else if (password.value.length < 6) {
      setError(password, passwordError, 'A senha deve ter pelo menos 6 caracteres.');
      valid = false;
    }

    if (!valid) return;

    const btn = loginForm.querySelector('.btn-primary');
    btn.disabled = true;
    btn.textContent = 'Entrando...';

    try {
      const user = await apiLogin(emailValue, password.value);
      btn.disabled = false;
      btn.textContent = 'Entrar';
      loginForm.reset();
      enterApp(user.email);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Entrar';
      setError(password, passwordError, err.message);
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', leaveApp);

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuToggle = document.getElementById('menuToggle');

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });

  const VIEW_TITLES = {
    home: 'Início',
    clientes: 'Cadastro de Clientes',
    barbeiros: 'Cadastro de Barbeiros',
    cabeleireiros: 'Cadastro de Cabeleireiros',
    agenda: 'Agenda',
    caixa: 'Caixa',
    financeiro: 'Financeiro'
  };

  const navItems = document.querySelectorAll('.nav-item');

  const RENDERERS = {
    home: renderHome,
    clientes: () => renderCrud('clientes', CRUD_CFG.clientes),
    barbeiros: () => renderCrud('barbeiros', CRUD_CFG.barbeiros),
    cabeleireiros: () => renderCrud('cabeleireiros', CRUD_CFG.cabeleireiros),
    agenda: renderAgenda,
    caixa: renderCaixa,
    financeiro: renderFinanceiro
  };

  async function showView(viewId) {
    document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.dataset.view === viewId));
    navItems.forEach((n) => n.classList.toggle('active', n.dataset.view === viewId));
    document.getElementById('pageTitle').textContent = VIEW_TITLES[viewId];
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    try {
      await RENDERERS[viewId]();
    } catch (err) {
      alert(err.message);
    }
  }

  navItems.forEach((btn) => btn.addEventListener('click', () => showView(btn.dataset.view)));

  const CRUD_CFG = {
    clientes: {
      formId: 'formCliente',
      titleId: 'clientesTitle',
      tbodyId: 'tbodyClientes',
      titleNew: 'Cadastro de Clientes',
      titleEdit: 'Editar Cliente',
      fields: { nome: 'nome', telefone: 'telefone', email: 'email' }
    },
    barbeiros: {
      formId: 'formBarbeiro',
      titleId: 'barbeirosTitle',
      tbodyId: 'tbodyBarbeiros',
      titleNew: 'Cadastro de Barbeiros',
      titleEdit: 'Editar Barbeiro',
      fields: { nome: 'nome', especialidade: 'especialidade', telefone: 'telefone' }
    },
    cabeleireiros: {
      formId: 'formCabeleireiro',
      titleId: 'cabeleireirosTitle',
      tbodyId: 'tbodyCabeleireiros',
      titleNew: 'Cadastro de Cabeleireiros',
      titleEdit: 'Editar Cabeleireiro',
      fields: { nome: 'nome', especialidade: 'especialidade', telefone: 'telefone' }
    }
  };

  async function renderCrud(collection, cfg) {
    const list = await apiList(collection);
    const tbody = document.getElementById(cfg.tbodyId);
    tbody.innerHTML = list
      .map((item) => {
        const extra = cfg.fields.especialidade
          ? `<td>${esc(item.especialidade || '-')}</td>`
          : cfg.fields.email
            ? `<td>${esc(item.email || '-')}</td>`
            : '';
        return `
          <tr>
            <td>${esc(item.nome)}</td>
            ${extra}
            <td>${esc(item.telefone || '-')}</td>
            <td><div class="actions">
              <button class="btn-icon" data-edit="${collection}" data-id="${item.id}">Editar</button>
              <button class="btn-icon danger" data-del="${collection}" data-id="${item.id}">Excluir</button>
            </div></td>
          </tr>`;
      })
      .join('') || `<tr><td class="empty" colspan="4">Nenhum registro encontrado.</td></tr>`;
  }

  function setupCrud(collection, cfg) {
    const form = document.getElementById(cfg.formId);
    const idInput = form.querySelector('[name="editId"]');
    const title = document.getElementById(cfg.titleId);
    const cancel = form.querySelector('.btn-cancel');
    const tbody = document.getElementById(cfg.tbodyId);

    const reset = () => {
      form.reset();
      idInput.value = '';
      title.textContent = cfg.titleNew;
      cancel.classList.add('hidden');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = form.elements[cfg.fields.nome].value.trim();
      if (!nome) {
        form.elements[cfg.fields.nome].focus();
        return;
      }
      const data = { nome };
      if (cfg.fields.especialidade) data.especialidade = form.elements[cfg.fields.especialidade].value.trim();
      data.telefone = form.elements[cfg.fields.telefone].value.trim();
      if (cfg.fields.email) data.email = form.elements[cfg.fields.email].value.trim();

      try {
        if (idInput.value) {
          await apiUpdate(collection, Number(idInput.value), data);
        } else {
          await apiCreate(collection, data);
        }
        await renderCrud(collection, cfg);
        reset();
      } catch (err) {
        alert(err.message);
      }
    });

    tbody.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('[data-edit]');
      if (editBtn && editBtn.dataset.edit === collection) {
        try {
          const list = await apiList(collection);
          const item = list.find((x) => x.id === Number(editBtn.dataset.id));
          form.elements[cfg.fields.nome].value = item.nome;
          if (cfg.fields.especialidade) form.elements[cfg.fields.especialidade].value = item.especialidade;
          form.elements[cfg.fields.telefone].value = item.telefone;
          if (cfg.fields.email) form.elements[cfg.fields.email].value = item.email;
          idInput.value = item.id;
          title.textContent = cfg.titleEdit;
          cancel.classList.remove('hidden');
        } catch (err) {
          alert(err.message);
        }
        return;
      }

      const delBtn = e.target.closest('[data-del]');
      if (delBtn && delBtn.dataset.del === collection) {
        if (confirm('Excluir este registro?')) {
          try {
            await apiDelete(collection, Number(delBtn.dataset.id));
            await renderCrud(collection, cfg);
          } catch (err) {
            alert(err.message);
          }
        }
      }
    });

    cancel.addEventListener('click', reset);
  }

  Object.entries(CRUD_CFG).forEach(([collection, cfg]) => setupCrud(collection, cfg));

  const formAgenda = document.getElementById('formAgenda');
  const agendaCliente = document.getElementById('agendaCliente');
  const agendaTipoProf = document.getElementById('agendaTipoProf');
  const agendaProfissional = document.getElementById('agendaProfissional');
  const agendaList = document.getElementById('agendaList');

  async function fillAgendaSelects() {
    const [clientes, barbeiros, cabeleireiros] = await Promise.all([
      apiList('clientes'),
      apiList('barbeiros'),
      apiList('cabeleireiros')
    ]);
    agendaCliente.innerHTML = '<option value="">Selecione o cliente</option>' +
      clientes.map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join('');

    const lista = agendaTipoProf.value === 'cabeleireiro' ? cabeleireiros : barbeiros;
    agendaProfissional.innerHTML = '<option value="">Selecione o profissional</option>' +
      lista.map((p) => `<option value="${p.id}">${esc(p.nome)}</option>`).join('');
  }

  agendaTipoProf.addEventListener('change', fillAgendaSelects);

  formAgenda.addEventListener('submit', async (e) => {
    e.preventDefault();
    const clienteId = Number(agendaCliente.value);
    const profissionalId = Number(agendaProfissional.value);
    if (!clienteId || !profissionalId) return;

    const data = {
      clienteId,
      tipoProfissional: agendaTipoProf.value,
      profissionalId,
      servico: formAgenda.elements.servico.value.trim(),
      valor: parseFloat(formAgenda.elements.valor.value) || 0,
      data: formAgenda.elements.data.value,
      hora: formAgenda.elements.hora.value,
      status: formAgenda.elements.status.value
    };

    try {
      await apiCreate('agendamentos', data);
      formAgenda.reset();
      document.getElementById('agendaData').value = todayStr();
      await renderAgenda();
    } catch (err) {
      alert(err.message);
    }
  });

  async function renderAgenda() {
    await fillAgendaSelects();
    const appointments = await apiList('agendamentos');
    const filterDate = document.getElementById('filtroData').value || todayStr();
    const filterStatus = document.getElementById('filtroStatus').value;

    const list = appointments
      .filter((a) => a.data === filterDate)
      .filter((a) => !filterStatus || a.status === filterStatus)
      .sort((a, b) => a.hora.localeCompare(b.hora));

    agendaList.innerHTML = list
      .map((a) => {
        const concluido = a.status === 'Concluído';
        const cancelado = a.status === 'Cancelado';
        return `
          <div class="list-item">
            <div class="info">
              <div class="title">${esc(a.cliente_nome || 'Cliente')} - ${esc(a.servico)}</div>
              <div class="sub">${esc(a.profissional_nome || 'Profissional')} &bull; ${fmtDate(a.data)} às ${a.hora} &bull; ${fmtMoney(a.valor)}</div>
            </div>
            <span class="badge ${a.status.toLowerCase().replace('í', 'i')}">${a.status}</span>
            <div class="actions">
              ${!concluido && !cancelado ? `<button class="btn-icon" data-concluir="${a.id}">Concluir</button>` : ''}
              ${!cancelado ? `<button class="btn-icon" data-cancelar="${a.id}">Cancelar</button>` : ''}
              <button class="btn-icon danger" data-del-agenda="${a.id}">Excluir</button>
            </div>
          </div>`;
      })
      .join('') || '<div class="empty">Nenhum agendamento para esta data.</div>';
  }

  agendaList.addEventListener('click', async (e) => {
    try {
      const concluir = e.target.closest('[data-concluir]');
      if (concluir) {
        await apiUpdate('agendamentos', Number(concluir.dataset.concluir), { status: 'Concluído' });
        await renderAgenda();
        return;
      }

      const cancelar = e.target.closest('[data-cancelar]');
      if (cancelar) {
        await apiUpdate('agendamentos', Number(cancelar.dataset.cancelar), { status: 'Cancelado' });
        await renderAgenda();
        return;
      }

      const del = e.target.closest('[data-del-agenda]');
      if (del && confirm('Excluir este agendamento?')) {
        await apiDelete('agendamentos', Number(del.dataset.delAgenda));
        await renderAgenda();
      }
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById('filtroData').addEventListener('change', renderAgenda);
  document.getElementById('filtroStatus').addEventListener('change', renderAgenda);

  const formCaixa = document.getElementById('formCaixa');

  formCaixa.addEventListener('submit', async (e) => {
    e.preventDefault();
    const now = new Date();
    const data = {
      tipo: formCaixa.elements.tipo.value,
      descricao: formCaixa.elements.descricao.value.trim(),
      valor: parseFloat(formCaixa.elements.valor.value) || 0,
      forma: formCaixa.elements.forma.value,
      data: todayStr(),
      hora: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    };

    try {
      await apiCreate('movimentacoes', data);
      formCaixa.reset();
      await renderCaixa();
      await renderHome();
    } catch (err) {
      alert(err.message);
    }
  });

  async function renderCaixa() {
    const movs = (await apiList('movimentacoes')).filter((m) => m.data === todayStr());
    const entradas = movs.filter((m) => m.tipo === 'entrada').reduce((s, m) => s + m.valor, 0);
    const saidas = movs.filter((m) => m.tipo === 'saida').reduce((s, m) => s + m.valor, 0);

    document.getElementById('caixaEntradas').textContent = fmtMoney(entradas);
    document.getElementById('caixaSaidas').textContent = fmtMoney(saidas);
    document.getElementById('caixaTotal').textContent = fmtMoney(entradas - saidas);

    const sorted = [...movs].sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
    document.getElementById('caixaList').innerHTML = sorted
      .map(
        (m) => `
          <div class="list-item">
            <div class="info">
              <div class="title">${esc(m.descricao)}</div>
              <div class="sub">${esc(m.forma)} &bull; ${m.hora}</div>
            </div>
            <span class="badge ${m.tipo}">${m.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span>
            <span class="valor ${m.tipo}">${m.tipo === 'entrada' ? '+' : '-'} ${fmtMoney(m.valor)}</span>
          </div>`
      )
      .join('') || '<div class="empty">Nenhuma movimentação hoje.</div>';
  }

  async function renderFinanceiro() {
    const now = new Date();
    const mes = now.getMonth();
    const ano = now.getFullYear();

    const movs = (await apiList('movimentacoes'))
      .filter((m) => {
        const d = new Date(m.data + 'T00:00:00');
        return d.getFullYear() === ano && d.getMonth() === mes;
      })
      .sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));

    const receitas = movs.filter((m) => m.tipo === 'entrada').reduce((s, m) => s + m.valor, 0);
    const despesas = movs.filter((m) => m.tipo === 'saida').reduce((s, m) => s + m.valor, 0);

    document.getElementById('finReceitas').textContent = fmtMoney(receitas);
    document.getElementById('finDespesas').textContent = fmtMoney(despesas);
    document.getElementById('finSaldo').textContent = fmtMoney(receitas - despesas);

    const monthName = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][mes];
    document.getElementById('finTitle').textContent = `Movimentações de ${monthName} ${ano}`;

    document.getElementById('tbodyFinanceiro').innerHTML = movs
      .map(
        (m) => `
          <tr>
            <td>${fmtDate(m.data)} ${m.hora}</td>
            <td><span class="badge ${m.tipo}">${m.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span></td>
            <td>${esc(m.descricao)}</td>
            <td>${esc(m.forma)}</td>
            <td class="${m.tipo === 'entrada' ? 'pos' : 'neg'}">${m.tipo === 'entrada' ? '+' : '-'} ${fmtMoney(m.valor)}</td>
          </tr>`
      )
      .join('') || '<tr><td colspan="5" class="empty">Nenhuma movimentação no mês.</td></tr>';
  }

  async function renderHome() {
    const [clientes, barbeiros, cabeleireiros, agenda, movs] = await Promise.all([
      apiList('clientes'),
      apiList('barbeiros'),
      apiList('cabeleireiros'),
      apiList('agendamentos'),
      apiList('movimentacoes')
    ]);

    document.getElementById('statClientes').textContent = clientes.length;
    document.getElementById('statBarbeiros').textContent = barbeiros.length;
    document.getElementById('statCabelos').textContent = cabeleireiros.length;
    document.getElementById('statAgendaHoje').textContent = agenda.filter(
      (a) => a.data === todayStr() && a.status !== 'Cancelado'
    ).length;

    const hoje = movs.filter((m) => m.data === todayStr());
    document.getElementById('statCaixaHoje').textContent = fmtMoney(
      hoje.reduce((s, m) => s + (m.tipo === 'entrada' ? m.valor : -m.valor), 0)
    );

    const upcomings = agenda
      .filter((a) => a.data >= todayStr() && a.status !== 'Cancelado')
      .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora))
      .slice(0, 6);

    document.getElementById('homeAgendaList').innerHTML = upcomings
      .map((a) => `
        <div class="list-item">
          <div class="info">
            <div class="title">${esc(a.cliente_nome || 'Cliente')} - ${esc(a.servico)}</div>
            <div class="sub">${esc(a.profissional_nome || 'Profissional')} &bull; ${fmtDate(a.data)} às ${a.hora} &bull; ${fmtMoney(a.valor)}</div>
          </div>
          <span class="badge ${a.status.toLowerCase().replace('í', 'i')}">${a.status}</span>
        </div>`)
      .join('') || '<div class="empty">Nenhum agendamento futuro.</div>';
  }

  document.getElementById('agendaData').value = todayStr();
  document.getElementById('filtroData').value = todayStr();
});
