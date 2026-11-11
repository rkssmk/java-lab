(() => {
  'use strict';

  const PROGRESS_KEY = 'java-lab-progress-v1';
  const SYNC_META_KEY = 'java-lab-cloud-sync-info-v1';
  const API = '/api';
  let user = null;
  let meta = null;
  let revision = 0;
  let syncEnabled = false;
  let syncPaused = false;
  let syncTimer = null;
  let syncInFlight = Promise.resolve();
  let modal = null;

  const byId = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function ensureCsrf() {
    const response = await fetch(`${API}/auth/csrf`, { credentials: 'same-origin', cache: 'no-store' });
    if (!response.ok) throw new Error('Не удалось получить защитный токен. Обнови страницу.');
    const payload = await response.json();
    if (!payload.token) throw new Error('Защитный токен не получен. Обнови страницу.');
    return payload.token;
  }

  async function api(path, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const headers = { 'Accept': 'application/json', ...(options.headers || {}) };
    if (options.body !== undefined) headers['Content-Type'] = 'application/json';
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const token = await ensureCsrf();
      headers['X-XSRF-TOKEN'] = token;
    }
    const response = await fetch(`${API}${path}`, {
      ...options,
      method,
      headers,
      credentials: 'same-origin',
      cache: 'no-store'
    });
    const type = response.headers.get('content-type') || '';
    const body = type.includes('application/json') ? await response.json().catch(() => ({})) : {};
    if (!response.ok) {
      const error = new Error(body.message || `Ошибка запроса: HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return body;
  }

  function localState() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); }
    catch { return {}; }
  }

  function readSyncMeta() {
    try { return JSON.parse(localStorage.getItem(SYNC_META_KEY) || 'null'); } catch { return null; }
  }

  function fingerprintState(state) {
    const source = JSON.stringify(state ?? {});
    let hash = 2166136261;
    for (let i = 0; i < source.length; i++) {
      hash ^= source.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
  }

  function markSynced(rev, syncedState = localState()) {
    if (!user) return;
    localStorage.setItem(SYNC_META_KEY, JSON.stringify({
      username: user.username,
      revision: Number(rev) || 0,
      fingerprint: fingerprintState(syncedState),
      savedAt: new Date().toISOString()
    }));
  }

  function hasMeaningfulProgress(state) {
    if (!state || typeof state !== 'object') return false;
    return (Array.isArray(state.completedLessons) && state.completedLessons.length > 0)
      || Object.keys(state.drafts || {}).length > 0
      || Object.keys(state.taskStatus || {}).length > 0
      || (Array.isArray(state.attempts) && state.attempts.length > 0)
      || Object.keys(state.notes || {}).length > 0
      || Object.keys(state.taskNotes || {}).length > 0
      || Object.keys(state.journals || {}).length > 0
      || Object.keys(state.reviewQueue || {}).length > 0;
  }

  function setSaveLabel(text, tone = '') {
    const target = byId('cloud-save-state');
    if (!target) return;
    target.innerHTML = `<span class="save-dot ${tone}"></span><span>${escapeHtml(text)}</span>`;
  }

  function updateAccountControls() {
    const button = byId('account-open');
    if (button) button.textContent = user ? user.username : 'Войти';
    const chip = document.querySelector('.profile-chip');
    if (chip) {
      const name = user ? escapeHtml(user.username) : 'Мой профиль';
      const status = user ? 'Облачный аккаунт' : (meta ? 'Локальный режим' : 'Облачный режим не настроен');
      chip.innerHTML = `<div class="avatar">${user ? escapeHtml(user.username.slice(0,1).toUpperCase()) : 'J'}</div><div><strong>${name}</strong><small>${escapeHtml(status)}</small></div><span class="online-dot"></span>`;
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');
      chip.onclick = openAccount;
      chip.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') openAccount(); };
    }
    if (!user) setSaveLabel(meta ? 'Локальное сохранение · войди для синхронизации' : 'Сохраняется на этом устройстве');
    else if (syncPaused) setSaveLabel('Синхронизация приостановлена', 'warning');
    else setSaveLabel('Облако подключено', 'good');
  }

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'cloud-modal-backdrop';
    modal.id = 'cloud-account-modal';
    modal.innerHTML = `<section class="cloud-modal" role="dialog" aria-modal="true" aria-labelledby="cloud-modal-title">
      <div class="cloud-modal-top"><div><div class="eyebrow">JAVA LAB · АККАУНТ</div><h2 id="cloud-modal-title">Вход и синхронизация</h2></div><button class="icon-button" type="button" data-close-cloud aria-label="Закрыть">×</button></div>
      <div id="cloud-modal-content"></div>
    </section>`;
    modal.addEventListener('click', event => { if (event.target === modal || event.target.closest('[data-close-cloud]')) closeAccount(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('show')) closeAccount(); });
    document.body.appendChild(modal);
    return modal;
  }

  function openAccount() {
    ensureModal();
    renderModal();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeAccount() {
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  function messageBox(text, tone = '') {
    return `<div class="cloud-message ${tone}">${escapeHtml(text)}</div>`;
  }

  function renderModal(extra = '') {
    const content = byId('cloud-modal-content');
    if (!content) return;
    if (!meta) {
      content.innerHTML = `<p class="lead">Облачный аккаунт появится после размещения Java Lab вместе с API и базой данных на одном российском сервере.</p>${messageBox('На текущем GitVerse Pages пока нет backend API. Локальный прогресс продолжает работать.', 'warning')}`;
      return;
    }
    if (user) {
      content.innerHTML = `<div class="cloud-profile"><div class="cloud-avatar">${escapeHtml(user.username.slice(0,1).toUpperCase())}</div><div><strong>${escapeHtml(user.username)}</strong><small>Аккаунт Java Lab · данные синхронизируются с сервером</small></div></div>
        ${extra}
        <div class="cloud-actions"><button class="btn btn-light" type="button" id="cloud-download">Скачать облачный прогресс</button><button class="btn btn-light" type="button" id="cloud-password">Сменить пароль</button><button class="btn btn-light" type="button" id="cloud-logout">Выйти</button><button class="btn btn-danger" type="button" id="cloud-delete">Удалить аккаунт</button></div>
        <p class="small-muted">Пароль и ключ восстановления никому не отправляй. Синхронизация использует защищённую сессию браузера.</p>`;
      byId('cloud-download')?.addEventListener('click', downloadCloudBackup);
      byId('cloud-password')?.addEventListener('click', changePassword);
      byId('cloud-logout')?.addEventListener('click', logout);
      byId('cloud-delete')?.addEventListener('click', deleteAccount);
      return;
    }

    const registrationUnavailable = !meta.registrationEnabled;
    content.innerHTML = `<div class="cloud-tabs"><button type="button" class="active" data-auth-tab="login">Войти</button><button type="button" data-auth-tab="register" ${registrationUnavailable ? 'disabled title="Регистрация временно отключена"' : ''}>Создать аккаунт</button><button type="button" data-auth-tab="recover">Забыли пароль?</button></div>
      <div id="cloud-auth-panel">${renderLoginForm()}</div>
      ${registrationUnavailable ? messageBox(meta.registrationDisabledReason || 'Регистрация пока выключена администратором.', 'warning') : ''}
      <p class="small-muted">Для первой версии используется логин без электронной почты. Перед регистрацией прочитай <a href="/privacy.html" target="_blank" rel="noopener">политику конфиденциальности</a>. Ключ восстановления нужно сохранить отдельно — он показывается только один раз.</p>`;
    content.querySelectorAll('[data-auth-tab]').forEach(tab => tab.addEventListener('click', () => {
      if (tab.disabled) return;
      content.querySelectorAll('[data-auth-tab]').forEach(item => item.classList.toggle('active', item === tab));
      const panel = byId('cloud-auth-panel');
      panel.innerHTML = tab.dataset.authTab === 'register' ? renderRegisterForm() : tab.dataset.authTab === 'recover' ? renderRecoverForm() : renderLoginForm();
      bindAuthForm(tab.dataset.authTab);
    }));
    bindAuthForm('login');
  }

  function renderLoginForm() {
    return `<form id="cloud-login-form" class="cloud-form">
      <label>Логин<input name="username" required minlength="3" maxlength="32" pattern="[A-Za-z0-9_-]{3,32}" autocomplete="username" placeholder="Например, java_student"></label>
      <label>Пароль<input name="password" required minlength="12" maxlength="128" type="password" autocomplete="current-password"></label>
      <button class="btn btn-primary" type="submit">Войти</button>
      <div id="cloud-form-message" aria-live="polite"></div>
    </form>`;
  }

  function renderRegisterForm() {
    return `<form id="cloud-register-form" class="cloud-form">
      <label>Логин<input name="username" required minlength="3" maxlength="32" pattern="[A-Za-z0-9_-]{3,32}" autocomplete="username" placeholder="Только латинские буквы, цифры, _ и -"></label>
      <label>Пароль (не менее 12 символов)<input name="password" required minlength="12" maxlength="128" type="password" autocomplete="new-password"></label>
      <label class="cloud-check"><input type="checkbox" name="age18Confirmed" required><span>Подтверждаю, что мне исполнилось 18 лет.</span></label>
      <label class="cloud-check"><input type="checkbox" name="termsAccepted" required><span>Принимаю <a href="/terms.html" target="_blank" rel="noopener">правила использования</a>.</span></label>
      <section class="cloud-consent"><strong>Отдельное согласие на обработку персональных данных</strong><p>Открой <a href="/consent.html" target="_blank" rel="noopener">текст отдельного согласия</a>. Оно не объединено с правилами использования.</p>
        <label class="cloud-check"><input type="checkbox" name="privacyConsentAccepted" required><span>Даю отдельное согласие на обработку данных в целях создания аккаунта и синхронизации моего учебного прогресса.</span></label>
      </section>
      <button class="btn btn-primary" type="submit">Создать аккаунт</button>
      <div id="cloud-form-message" aria-live="polite"></div>
    </form>`;
  }

  function renderRecoverForm() {
    return `<form id="cloud-recover-form" class="cloud-form">
      <label>Логин<input name="username" required minlength="3" maxlength="32" autocomplete="username"></label>
      <label>Ключ восстановления<input name="recoveryCode" required minlength="20" maxlength="80" autocomplete="off"></label>
      <label>Новый пароль<input name="newPassword" required minlength="12" maxlength="128" type="password" autocomplete="new-password"></label>
      <button class="btn btn-primary" type="submit">Восстановить доступ</button>
      <div id="cloud-form-message" aria-live="polite"></div>
    </form>`;
  }

  function bindAuthForm(mode) {
    if (mode === 'login') {
      byId('cloud-login-form')?.addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        try {
          await api('/auth/login', { method: 'POST', body: JSON.stringify({ username: data.get('username'), password: data.get('password') }) });
          user = await api('/auth/me');
          await syncOnLogin();
          syncEnabled = !syncPaused;
          updateAccountControls();
          renderModal(messageBox('Вход выполнен.', 'good'));
        } catch (error) {
          const target = byId('cloud-form-message');
          if (target) target.innerHTML = messageBox(error.message, 'error');
        } finally { button.disabled = false; }
      });
    } else if (mode === 'register') {
      byId('cloud-register-form')?.addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        try {
          const response = await api('/auth/register', { method: 'POST', body: JSON.stringify({
            username: data.get('username'), password: data.get('password'),
            age18Confirmed: data.has('age18Confirmed'), termsAccepted: data.has('termsAccepted'),
            privacyConsentAccepted: data.has('privacyConsentAccepted'), consentVersion: meta.consentVersion
          }) });
          showRecoveryCode(response.recoveryCode, 'Аккаунт создан. Сохрани ключ восстановления сейчас — повторно он не показывается.');
        } catch (error) {
          const target = byId('cloud-form-message');
          if (target) target.innerHTML = messageBox(error.message, 'error');
        } finally { button.disabled = false; }
      });
    } else if (mode === 'recover') {
      byId('cloud-recover-form')?.addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        try {
          const result = await api('/auth/recover', { method: 'POST', body: JSON.stringify({ username: data.get('username'), recoveryCode: data.get('recoveryCode'), newPassword: data.get('newPassword') }) });
          showRecoveryCode(result.recoveryCode, 'Пароль изменён. Старый ключ восстановления больше не действует — сохрани новый.');
        } catch (error) {
          const target = byId('cloud-form-message');
          if (target) target.innerHTML = messageBox(error.message, 'error');
        } finally { button.disabled = false; }
      });
    }
  }

  function showRecoveryCode(code, message) {
    const panel = byId('cloud-auth-panel');
    if (!panel) return;
    panel.innerHTML = `<div class="cloud-message success">${escapeHtml(message)}</div><div class="recovery-code" id="cloud-recovery-code">${escapeHtml(code)}</div><div class="cloud-actions"><button class="btn btn-light" id="copy-recovery">Скопировать ключ</button><button class="btn btn-primary" id="recovery-done">Я сохранил ключ</button></div><p class="small-muted">Ключ не хранится в открытом виде на сервере и не может быть показан повторно. Не отправляй его никому.</p>`;
    byId('copy-recovery')?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(code); byId('copy-recovery').textContent = 'Скопировано ✓'; }
      catch { byId('copy-recovery').textContent = 'Выдели и скопируй ключ'; }
    });
    byId('recovery-done')?.addEventListener('click', () => {
      const content = byId('cloud-modal-content');
      content.querySelector('[data-auth-tab="login"]')?.click();
    });
  }

  async function syncOnLogin() {
    syncPaused = true;
    setSaveLabel('Загружаю облачный прогресс…');
    const cloud = await api('/progress');
    const local = localState();
    const localHasData = hasMeaningfulProgress(local);
    if (!cloud.exists) {
      if (localHasData) {
        const upload = confirm('В облачном аккаунте ещё нет прогресса. Загрузить текущие данные этого браузера в аккаунт? Нажми «Отмена», чтобы оставить синхронизацию выключенной.');
        if (!upload) { syncPaused = true; setSaveLabel('Вход выполнен · синхронизация не настроена', 'warning'); return; }
        revision = 0;
        await writeCloud(local);
      } else {
        revision = 0;
        await writeCloud(local);
      }
    } else if (!localHasData) {
      revision = Number(cloud.revision) || 0;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(cloud.state || {}));
      markSynced(revision, cloud.state || {});
      syncPaused = false;
      setSaveLabel('Облачный прогресс загружен', 'good');
      if (hasMeaningfulProgress(cloud.state || {})) {
        location.reload();
        return;
      }
    } else {
      const syncMeta = readSyncMeta();
      if (syncMeta && syncMeta.username !== user.username) localStorage.removeItem(SYNC_META_KEY);
      if (syncMeta && syncMeta.username === user.username
          && Number(syncMeta.revision) === Number(cloud.revision)
          && syncMeta.fingerprint === fingerprintState(local)) {
        revision = Number(cloud.revision) || 0;
        syncPaused = false;
        return;
      }
      const choice = prompt('В аккаунте уже есть облачный прогресс, и в этом браузере есть локальные данные. Введи 1, чтобы загрузить облачную копию на это устройство; 2, чтобы заменить облачную копию текущими локальными данными; оставь поле пустым, чтобы отменить синхронизацию.');
      if (choice === '1') {
        revision = Number(cloud.revision) || 0;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(cloud.state || {}));
        markSynced(revision);
        syncPaused = false;
        location.reload();
        return;
      } else if (choice === '2') {
        revision = Number(cloud.revision) || 0;
        await writeCloud(local);
      } else {
        syncPaused = true;
        setSaveLabel('Вход выполнен · выбери источник прогресса', 'warning');
        return;
      }
    }
    syncPaused = false;
    setSaveLabel('Синхронизация включена', 'good');
  }

  async function writeCloud(state) {
    const result = await api('/progress', { method: 'PUT', body: JSON.stringify({ expectedRevision: revision, state }) });
    revision = Number(result.revision) || revision + 1;
    markSynced(revision);
    setSaveLabel('Облако сохранено', 'good');
  }

  async function flushSync() {
    if (!user) return true;
    if (!syncEnabled || syncPaused) return false;
    const snapshot = localState();
    let saved = true;
    syncInFlight = syncInFlight.then(() => writeCloud(snapshot)).catch(error => {
      saved = false;
      if (error.status === 409) {
        syncPaused = true;
        setSaveLabel('Изменения на другом устройстве · нужна синхронизация', 'warning');
        showConflictNotice();
      } else {
        setSaveLabel('Не удалось сохранить в облако', 'warning');
      }
    });
    await syncInFlight;
    return saved;
  }

  function showConflictNotice() {
    const content = byId('page-content');
    if (!content || byId('cloud-conflict-notice')) return;
    const notice = document.createElement('div');
    notice.id = 'cloud-conflict-notice';
    notice.className = 'cloud-conflict-notice';
    notice.innerHTML = `<strong>Облачный прогресс изменился на другом устройстве.</strong><p>Чтобы не перезаписать более свежие данные, автоматическая синхронизация остановлена.</p><button type="button" class="btn btn-light" id="cloud-reload-remote">Загрузить облачную копию</button>`;
    content.prepend(notice);
    byId('cloud-reload-remote')?.addEventListener('click', async () => {
      try {
        const cloud = await api('/progress');
        revision = Number(cloud.revision) || 0;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(cloud.state || {}));
        markSynced(revision);
        syncPaused = false;
        location.reload();
      } catch (error) { alert(error.message); }
    });
  }

  function scheduleSync() {
    if (!user || syncPaused) return;
    setSaveLabel('Есть изменения · синхронизирую…');
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(flushSync, 900);
  }

  async function downloadCloudBackup() {
    try {
      const cloud = await api('/progress');
      const payload = { app: 'Java Lab', version: '4.0', exportedAt: new Date().toISOString(), account: user.username, state: cloud.state || {} };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `java-lab-cloud-backup-${new Date().toISOString().slice(0,10)}.json`;
      link.click(); URL.revokeObjectURL(url);
    } catch (error) { alert(error.message); }
  }

  async function changePassword() {
    const currentPassword = prompt('Введи текущий пароль:');
    if (currentPassword === null) return;
    const newPassword = prompt('Введи новый пароль (не менее 12 символов):');
    if (!newPassword) return;
    try {
      await api('/account/password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) });
      alert('Пароль изменён.');
    } catch (error) { alert(error.message); }
  }

  async function logout() {
    if (!confirm('Выйти из аккаунта на этом устройстве? Сначала убедимся, что изменения сохранены в облаке.')) return;
    const saved = await flushSync();
    if (!saved) {
      alert('Не удалось подтвердить сохранение. Чтобы не потерять изменения, выход остановлен. Разреши конфликт или проверь соединение, затем повтори выход.');
      return;
    }
    try {
      await api('/auth/logout', { method: 'POST', body: '{}' });
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(SYNC_META_KEY);
      user = null; syncEnabled = false; syncPaused = false; revision = 0;
      closeAccount();
      location.reload();
    } catch (error) { alert(`Не удалось выйти: ${error.message}`); }
  }

  async function deleteAccount() {
    const password = prompt('Для удаления аккаунта введи пароль. Аккаунт и облачный прогресс будут удалены без возможности восстановления.');
    if (password === null) return;
    if (!confirm('Подтверждаешь окончательное удаление аккаунта и облачного прогресса?')) return;
    try {
      await api('/account', { method: 'DELETE', body: JSON.stringify({ password }) });
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(SYNC_META_KEY);
      user = null; syncEnabled = false; syncPaused = true;
      alert('Аккаунт удалён.');
      location.reload();
    } catch (error) { alert(error.message); }
  }

  async function initialise() {
    const button = byId('account-open');
    if (button) button.addEventListener('click', openAccount);
    try {
      meta = await api('/meta/public');
      // Seed the CSRF cookie on initial page load so the authenticated Java runner
      // can later submit requests without an unsafe token embedded in the page.
      await ensureCsrf();
    } catch {
      meta = null;
      updateAccountControls();
      return;
    }
    try {
      user = await api('/auth/me');
      await syncOnLogin();
      syncEnabled = !syncPaused;
    } catch (error) {
      user = null;
      syncEnabled = false;
      if (error.status !== 401) console.warn('Cloud profile unavailable:', error.message);
    }
    updateAccountControls();
  }

  window.JavaLabCloudSync = { scheduleSync, flushSync, csrfToken: ensureCsrf };
  window.addEventListener('online', () => { if (user && !syncPaused) flushSync(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && user && syncEnabled && !syncPaused) flushSync();
  });
  initialise();
})();
