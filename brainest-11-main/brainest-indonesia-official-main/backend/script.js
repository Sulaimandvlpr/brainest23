const baseUrl = "http://localhost:5000"; // Ganti dengan URL API backend Anda
let token = ""; // Untuk menyimpan token autentikasi
let attemptId = ""; // Menyimpan attemptId yang didapat setelah memulai tryout
let responses = []; // Array untuk menyimpan jawaban siswa

// Fungsi Registrasi
document.getElementById('registerBtn').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role: 'siswa' })
  });

  const data = await response.json();
  alert(data.msg);
});

// Fungsi Login
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (data.token) {
    token = data.token;
    localStorage.setItem('authToken', token); // Simpan token di localStorage
    alert('Login successful');
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('tryout').style.display = 'block';
  } else {
    alert('Login failed');
  }
});

// Fungsi Start Tryout
document.getElementById('startTryoutBtn').addEventListener('click', async () => {
  const category = document.getElementById('category').value; // Mengambil kategori yang dipilih

  const response = await fetch(`${baseUrl}/api/tryout/start?category=${category}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  if (data.attemptId) {
    attemptId = data.attemptId; // Menyimpan attemptId
    responses = []; // Reset responses
    showQuestion(data.nextItems); // Tampilkan soal pertama
  } else {
    alert('Error starting tryout');
  }
});

// Fungsi Menampilkan Soal
function showQuestion(items) {
  const questionContainer = document.getElementById('question-container');
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options');

  let currentItem = items[0]; // Menampilkan soal pertama

  questionText.textContent = currentItem.text;
  optionsContainer.innerHTML = '';
  Object.keys(currentItem.options).forEach(optionKey => {
    const button = document.createElement('button');
    button.textContent = `${optionKey}: ${currentItem.options[optionKey]}`;
    button.addEventListener('click', () => storeAnswer(currentItem.id, optionKey));
    optionsContainer.appendChild(button);
  });

  questionContainer.style.display = 'block';
}

// Fungsi Menyimpan Jawaban Sementara
function storeAnswer(itemId, answer) {
  // Simpan jawaban sementara dalam array responses
  const existingResponse = responses.find(r => r.itemId === itemId);
  if (existingResponse) {
    existingResponse.answer = answer; // Update jawaban jika sudah ada
  } else {
    responses.push({ itemId, answer }); // Tambahkan jawaban baru
  }
}

// Fungsi Mengirim Semua Jawaban saat Next Question
document.getElementById('nextBtn').addEventListener('click', async () => {
  const response = await fetch(`${baseUrl}/api/tryout/answer`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attemptId: attemptId,  // Menggunakan attemptId yang disimpan
      responses: responses
    })
  });

  const data = await response.json();
  if (data.nextItem) {
    showQuestion([data.nextItem]);  // Tampilkan soal berikutnya
  } else {
    alert('Tryout finished! Final score: ' + data.points); // Tampilkan hasil akhir
  }
});

// Cek token saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    token = storedToken;
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('tryout').style.display = 'block';
  }
});

// Fungsi Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('authToken');
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('tryout').style.display = 'none';
  alert('Logged out successfully');
});
