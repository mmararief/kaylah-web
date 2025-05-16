import { registerUser } from '../util/api';
import { renderRegisterPage } from '../views/register-page';

export const handleRegisterPage = () => {
  renderRegisterPage((name, email, password) => {
    registerUser(name, email, password)
      .then(result => {
        if (result && !result.error) {
          window.location.hash = '#login';
        }
      })
      .catch(error => {
        console.error('Error in register presenter:', error);
      });
  });
};