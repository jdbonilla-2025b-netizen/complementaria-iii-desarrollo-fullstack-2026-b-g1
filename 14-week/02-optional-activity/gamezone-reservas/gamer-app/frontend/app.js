const api = createApi(window.API_URL);
let token = null; // el token vive solo en memoria

const $ = (id) => document.getElementById(id);

async function showConsoles() {
  const consoles = await api.getConsoles(token);
  $('list').innerHTML = '';
  consoles.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'card';
    const title = document.createElement('strong');
    title.textContent = c.name;
    card.appendChild(title);
    card.appendChild(document.createElement('br'));
    c.slots.forEach((s) => {
      const span = document.createElement('span');
      span.className = 'slot ' + (s.available ? 'free' : 'busy');
      span.textContent = s.time;
      card.appendChild(span);
    });
    $('list').appendChild(card);
  });
  $('login-view').hidden = true;
  $('data-view').hidden = false;
}

$('login-btn').addEventListener('click', async () => {
  $('msg').textContent = '';
  try {
    token = await api.login($('username').value, $('password').value);
    await showConsoles();
  } catch (e) {
    $('msg').textContent = e.message;
  }
});

$('logout-btn').addEventListener('click', () => {
  token = null;
  $('data-view').hidden = true;
  $('login-view').hidden = false;
});
