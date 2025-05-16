import { loginUser } from '../util/api';
import { renderLoginPage } from '../views/login-page';

export const handleLoginPage = () => {
  renderLoginPage((email, password) => {
    loginUser(email, password)
      .then(result => {
        if (result && !result.error) {
          window.location.hash = '#home';
        }
      })
      .catch(error => {
        console.error('Error in login presenter:', error);
      });
  });
}; 