import { loginUser } from '../util/api';

export function renderLoginPage(onLogin) {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>Login</h2>
    <form id="login-form">
      <div>
        <label for="email">Email:</label><br>
        <input type="email" id="email" required />
      </div>
      <div>
        <label for="password">Password:</label><br>
        <input type="password" id="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
  `;

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (onLogin) {
      onLogin(email, password);
    }
  });
}
