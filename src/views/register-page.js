import { registerUser } from '../util/api';

export function renderRegisterPage(onRegister) {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>Register</h2>
    <form id="register-form">
      <label>Nama: <input type="text" id="name" required></label><br>
      <label>Email: <input type="email" id="email" required></label><br>
      <label>Password: <input type="password" id="password" required></label><br>
      <button type="submit">Register</button>
    </form>
  `;

  document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (onRegister) {
      onRegister(name, email, password);
    }
  });
}
