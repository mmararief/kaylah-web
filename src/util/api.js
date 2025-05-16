const API_URL = 'https://story-api.dicoding.dev/v1';

export const fetchStories = async (token) => {
  try {
    const response = await fetch(`${API_URL}/stories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.message);
    }
    return data.listStory;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return [];
  }
};

export const addStory = async (description, photo, lat, lon) => {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  if (lat && lon) {
    formData.append('lat', lat);
    formData.append('lon', lon);
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Token tidak ditemukan. Silakan login terlebih dahulu.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/stories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error('Gagal menambahkan cerita:', error);
    return { error: true, message: error.message };
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (!data.error) {
      alert('Registrasi berhasil! Silakan login.');
      window.location.hash = '#login';
    } else {
      alert(`Registrasi gagal: ${data.message}`);
    }
  } catch (error) {
    console.error('Error saat register:', error);
    alert('Terjadi kesalahan saat mendaftar.');
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!data.error) {
      localStorage.setItem('token', data.loginResult.token);
      alert('Login berhasil!');
      return data;
    } else {
      alert(`Login gagal: ${data.message}`);
      return data;
    }
  } catch (error) {
    console.error('Error saat login:', error);
    alert('Terjadi kesalahan saat login.');
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  window.location.hash = '#login';
  return { success: true };
};

export const fetchStoryDetail = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Token tidak ditemukan. Silakan login terlebih dahulu.');
    window.location.hash = '#login';
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/stories/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.message);
    }
    return data.story;
  } catch (error) {
    console.error('Error fetching story detail:', error);
    alert('Gagal memuat detail cerita.');
    return null;
  }
};