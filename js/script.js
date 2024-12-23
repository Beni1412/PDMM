// toggle class active hamburger-menu
const navbarNav = document.querySelector('.navbar-nav');
// ketika di klik
document.querySelector('#hamburger-menu').onclick = () => {
  navbarNav.classList.toggle('active');
};

// togle login
authButton.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation(); // Cegah propagasi event ke listener global
  authModal.classList.toggle('active');
});

window.addEventListener('click', (e) => {
  if (!authModal.contains(e.target) && e.target !== authButton) {
    authModal.classList.remove('active');
  }
});

// toggle class active search-form
const searchForm = document.querySelector('.search-form');
const searchbox = document.querySelector('#search-box');

document.querySelector('#search-button').onclick = (e) => {
  searchForm.classList.toggle('active');
  searchbox.focus();
  e.preventDefault();
};

// toggle shoping cart
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
  shoppingCart.classList.toggle('active');
  e.preventDefault();
};

// klik diluar side bar
const hm = document.querySelector('#hamburger-menu');
const sb = document.querySelector('#search-button');
const sc = document.querySelector('#shopping-cart-button');

document.addEventListener('click', function (e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove('active');
  }
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove('active');
  }

  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove('active');
  }
});
// Create admin account if it doesn't exist
document.addEventListener('DOMContentLoaded', () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const adminAccountExists = users.some((user) => user.username === 'admin');

  // If admin account does not exist, create it
  if (!adminAccountExists) {
    const adminAccount = {
      username: 'admin',
      password: 'admin123', // Replace with a stronger password in production
      role: 'admin',
    };
    users.push(adminAccount);
    localStorage.setItem('users', JSON.stringify(users));
    console.log(
      'Admin account created with username: admin and password: admin123'
    );
  }

  // Handle login functionality
  const authButton = document.getElementById('auth-button');
  const authModal = document.getElementById('auth-modal');

  // Toggle auth modal (Login/Register)
  authButton.addEventListener('click', (e) => {
    e.preventDefault();

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      // If already logged in, show username and logout option
      const user = JSON.parse(loggedInUser);
      authButton.innerHTML = `${user.username} <span>Logout</span>`;
      authButton.style.color = user.role === 'admin' ? 'red' : 'white';

      // Logout handler
      authButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        window.location.reload();
      });
    } else {
      // If not logged in, show the modal
      authModal.classList.toggle('active');
    }
  });

  // Handle login logic
  const usersData = JSON.parse(localStorage.getItem('users')) || [];

  document.querySelector('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();

    const user = usersData.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      alert('Invalid login details!');
      return;
    }

    // Save logged-in user data to localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    alert('Login successful!');
    window.location.reload(); // Reload the page to display username
  });

  // Handle register logic
  document.querySelector('#registerForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.querySelector('#reg-username').value.trim();
    const password = document.querySelector('#reg-password').value.trim();
    const role = document.querySelector('#reg-role').value;

    if (usersData.some((user) => user.username === username)) {
      alert('Username already taken!');
      return;
    }

    // Register the user
    usersData.push({ username, password, role });
    localStorage.setItem('users', JSON.stringify(usersData));
    alert('Registration successful! Please login.');

    // Reset form and switch to login section
    document.querySelector('#registerForm').reset();
    document.getElementById('login').style.display = 'block';
    document.getElementById('register').style.display = 'none';
  });
});

// chat
document.addEventListener('DOMContentLoaded', () => {
  const floatingChat = document.getElementById('floating-chat');
  const chatWindow = document.getElementById('chat-window');
  const closeChat = document.getElementById('close-chat');
  const chatForm = document.getElementById('chat-form');
  const chatMessage = document.getElementById('chat-message');
  const chatContent = document.getElementById('chat-content');

  const adminChatWindow = document.getElementById('admin-chat-window');
  const adminChatList = document.getElementById('admin-chat-list');
  const adminChatContent = document.getElementById('admin-chat-content');
  const adminChatForm = document.getElementById('admin-chat-form');
  const adminChatMessage = document.getElementById('admin-chat-message');
  const closeAdminChat = document.getElementById('close-admin-chat');

  // Persistent Chat History (localStorage)
  let chatHistory = JSON.parse(localStorage.getItem('globalChatHistory')) || {};

  // Simulate logged-in user
  let currentUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;

  // Simulate Login Prompt if no user is logged in
  if (!currentUser) {
    const username = prompt('Enter your username:');
    currentUser = {
      username,
      role: username === 'admin' ? 'admin' : 'user',
      lastLogin: Date.now(),
    };
    localStorage.setItem('loggedInUser', JSON.stringify(currentUser));
  }

  // Ensure chat history exists for the current user
  if (!chatHistory[currentUser.username]) {
    chatHistory[currentUser.username] = [];
  }

  // Save chat history function
  const saveChatHistory = () => {
    localStorage.setItem('globalChatHistory', JSON.stringify(chatHistory));
  };

  // Render Chat for User or Admin
  const renderChat = (username) => {
    if (!chatHistory[username]) return;

    const messages = chatHistory[username]
      .map((msg) => `<p><strong>${msg.sender}:</strong> ${msg.message}</p>`)
      .join('');

    if (currentUser.role === 'admin') {
      adminChatContent.innerHTML = messages;
      adminChatContent.scrollTop = adminChatContent.scrollHeight;
    } else {
      chatContent.innerHTML = messages;
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  };

  // Render Admin User List
  const renderAdminUserList = () => {
    const userChats = Object.keys(chatHistory)
      .filter((user) => user !== 'admin' && chatHistory[user].length > 0)
      .sort((a, b) => {
        // Sort by most recent message
        const lastMsgA =
          chatHistory[a][chatHistory[a].length - 1].timestamp || 0;
        const lastMsgB =
          chatHistory[b][chatHistory[b].length - 1].timestamp || 0;
        return lastMsgB - lastMsgA;
      });

    adminChatList.innerHTML = userChats
      .map(
        (user) =>
          `<button data-user="${user}" class="user-button">${user}</button>`
      )
      .join('');
  };

  // Floating Chat Icon Logic
  floatingChat.addEventListener('click', () => {
    if (currentUser.role === 'admin') {
      adminChatWindow.classList.toggle('hidden');
      renderAdminUserList(); // Ensure the list is rendered when admin opens chat
    } else {
      chatWindow.classList.toggle('hidden');
      renderChat(currentUser.username); // Ensure user chat is displayed
    }
  });

  closeChat.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
  });

  closeAdminChat.addEventListener('click', () => {
    adminChatWindow.classList.add('hidden');
  });

  // User Chat Functionality
  const sendUserMessage = (message) => {
    if (!message.trim()) return;

    // Add message to chat history with timestamp
    chatHistory[currentUser.username].push({
      sender: currentUser.username,
      message: message.trim(),
      timestamp: Date.now(),
    });

    // Save updated chat history to localStorage
    saveChatHistory();
    renderChat(currentUser.username);
  };

  // User Chat Form Submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendUserMessage(chatMessage.value);
    chatMessage.value = '';
  });

  // Admin Chat Functionality
  let selectedAdminUser = null;

  // Admin Select User and Chat
  adminChatList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      selectedAdminUser = e.target.dataset.user;
      adminChatContent.classList.remove('hidden');
      adminChatForm.classList.remove('hidden');
      renderChat(selectedAdminUser); // Render the selected user's chat history
    }
  });

  // Admin Chat Form Submit
  adminChatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const adminMessage = adminChatMessage.value.trim();
    if (!adminMessage || !selectedAdminUser) return;

    // Add message to the selected user's chat history
    if (!chatHistory[selectedAdminUser]) {
      chatHistory[selectedAdminUser] = [];
    }

    chatHistory[selectedAdminUser].push({
      sender: 'admin',
      message: adminMessage,
      timestamp: Date.now(),
    });

    // Save updated chat history to localStorage
    saveChatHistory();

    adminChatMessage.value = '';
    renderChat(selectedAdminUser); // Re-render chat after sending admin's message
    renderAdminUserList(); // Update user list to reflect new message
  });

  // Initialize Chat
  renderChat(currentUser.username);
});
document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkoutForm');
  const floatingAdminOrders = document.createElement('div');
  floatingAdminOrders.id = 'admin-orders';

  floatingAdminOrders.classList.add('admin-orders-popup', 'hidden');
  document.body.appendChild(floatingAdminOrders);

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  let chatHistory = JSON.parse(localStorage.getItem('globalChatHistory')) || {};

  // Improved admin authentication
  const isAdmin = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return loggedInUser && loggedInUser.role === 'admin';
  };

  // Create order details popup (only visible to admin)
  const createOrderDetailsPopup = () => {
    const orderDetailsPopup = document.createElement('div');
    orderDetailsPopup.id = 'order-details-popup';
    orderDetailsPopup.classList.add('order-details-popup');
    document.body.appendChild(orderDetailsPopup);
    return orderDetailsPopup;
  };

  // Improved Food Icon with Fixed Positioning (only for admin view)
  const createFoodOrderIcon = (order) => {
    // Only show for admin
    if (!isAdmin()) return null;

    const foodIcon = document.createElement('div');
    foodIcon.classList.add('food-order-icon');
    foodIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <span class="order-count">${order.items.length}</span>
    `;

    foodIcon.addEventListener('click', () => {
      // Double-check admin access
      if (!isAdmin()) {
        alert('Access denied. Admin privileges required.');
        return;
      }

      const orderDetailsPopup = document.getElementById('order-details-popup');
      orderDetailsPopup.innerHTML = `
        <div class="order-details-content">
          <h3>Detail Pesanan</h3>
          <p><strong>Nama:</strong> ${order.customer.name}</p>
          <p><strong>Nomor Telepon:</strong> ${order.customer.phone}</p>
          <p><strong>Email:</strong> ${order.customer.email}</p>
          <div class="order-items">
            <h4>Daftar Pesanan:</h4>
            ${order.items
              .map(
                (item) => `
              <div class="item-detail">
                <span>${item.name}</span>
                <span>x${item.quantity}</span>
              </div>
            `
              )
              .join('')}
          </div>
          <p><strong>Total:</strong> ${order.total}</p>
          <div class="order-actions">
            <button class="accept-order" data-order-id="${
              order.id
            }">Terima</button>
            <button class="reject-order" data-order-id="${
              order.id
            }">Tolak</button>
          </div>
        </div>
      `;

      // Add event listeners for accepting/rejecting orders (admin only)
      const acceptButton = orderDetailsPopup.querySelector('.accept-order');
      const rejectButton = orderDetailsPopup.querySelector('.reject-order');

      // Remove any existing event listeners first
      const oldAcceptButton = acceptButton.cloneNode(true);
      const oldRejectButton = rejectButton.cloneNode(true);
      acceptButton.parentNode.replaceChild(oldAcceptButton, acceptButton);
      rejectButton.parentNode.replaceChild(oldRejectButton, rejectButton);

      // Add new event listeners
      oldAcceptButton.addEventListener('click', () => {
        updateOrderStatus(order.id, 'Accepted');
        orderDetailsPopup.classList.remove('active');
      });

      oldRejectButton.addEventListener('click', () => {
        updateOrderStatus(order.id, 'Rejected');
        orderDetailsPopup.classList.remove('active');
      });

      orderDetailsPopup.classList.add('active');
    });

    return foodIcon;
  };

  // Save user order
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
      alert('Please log in to place an order.');
      return;
    }

    const order = {
      id: new Date().getTime(),
      items: JSON.parse(checkoutForm.elements['items'].value),
      total: checkoutForm.elements['total'].value,
      customer: {
        name: loggedInUser.username, // Use logged-in username
        email: checkoutForm.elements['email'].value,
        phone: checkoutForm.elements['phone'].value,
      },
      status: 'Pending',
      timestamp: new Date().toLocaleString(),
    };
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    alert('Pesanan berhasil dikirim!');
    checkoutForm.reset();
    document.querySelector('.shopping-cart').classList.remove('active');
  });

  // Update order icons on page (only for admin)
  const updateOrderIcons = () => {
    if (!isAdmin()) return;

    // Remove old order icons
    document.querySelectorAll('.food-order-icon').forEach((el) => el.remove());

    // Add new order icons at the bottom-left corner
    const pendingOrders = orders.filter((order) => order.status === 'Pending');
    pendingOrders.forEach((order, index) => {
      const foodIcon = createFoodOrderIcon(order);
      if (foodIcon) {
        foodIcon.style.bottom = `${20 + index * 70}px`; // Vertically space the icons
        document.body.appendChild(foodIcon);
      }
    });
  };

  // Update order status
  const updateOrderStatus = (id, status) => {
    // Ensure only admin can update order status
    if (!isAdmin()) {
      alert('Access denied. Admin privileges required.');
      return;
    }

    const orderIndex = orders.findIndex((o) => o.id === id);
    if (orderIndex !== -1) {
      // Update order status
      orders[orderIndex].status = status;
      localStorage.setItem('orders', JSON.stringify(orders));

      // Prepare detailed order message
      const order = orders[orderIndex];
      const messageDetails = order.items
        .map((item) => `- ${item.name} (x${item.quantity})`)
        .join('\n');

      // Ensure chat history for this user exists
      if (!chatHistory[order.customer.name]) {
        chatHistory[order.customer.name] = [];
      }

      // Prepare message based on order status
      const message =
        status === 'Accepted'
          ? `Pesanan Anda telah diterima. Berikut detail pesanan Anda:\n\n${messageDetails}\n\nTotal: ${order.total}\n\nTerima kasih!`
          : `Maaf, pesanan Anda ditolak. Silakan hubungi kami untuk informasi lebih lanjut.`;

      // Add message to user's chat history
      chatHistory[order.customer.name].push({
        sender: 'admin',
        message,
        timestamp: new Date().toLocaleString(),
      });

      // Save updated chat history
      localStorage.setItem('globalChatHistory', JSON.stringify(chatHistory));

      // Update the order icons (only for admin)
      updateOrderIcons();
    }
  };

  // Create order details popup
  createOrderDetailsPopup();

  // Click outside popup to close (for admin)
  document.addEventListener('click', (e) => {
    const orderDetailsPopup = document.getElementById('order-details-popup');
    if (
      isAdmin() &&
      orderDetailsPopup.classList.contains('active') &&
      !orderDetailsPopup.contains(e.target) &&
      e.target.closest('.food-order-icon') === null
    ) {
      orderDetailsPopup.classList.remove('active');
    }
  });

  // Initialize order icons (only for admin)
  if (isAdmin()) {
    updateOrderIcons();
  }
});
// Tambahkan event listener untuk mengecek role user saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Cek apakah user adalah admin
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Tambahkan tombol history untuk admin di navbar
  if (loggedInUser && loggedInUser.role === 'admin') {
    const navbar = document.querySelector('.navbar-nav');
    const historyLink = document.createElement('a');
    historyLink.href = '#history';
    historyLink.textContent = 'History Transaksi';
    navbar.appendChild(historyLink);

    // Tambahkan section history transaksi
    const mainContent = document.querySelector('main') || document.body;
    const historySection = document.createElement('section');
    historySection.id = 'history';
    historySection.classList.add('history');
    historySection.style.display = 'none';

    historySection.innerHTML = `
      <h2><span>History</span> Transaksi</h2>
      <div class="history-container">
        <div class="filter-container">
          <input type="date" id="historyDate" class="history-date">
        </div>
        <div class="stats-container">
          <div class="stat-card">
            <h3>Total Pesanan</h3>
            <p id="totalOrders">0</p>
          </div>
          <div class="stat-card">
            <h3>Total Pendapatan</h3>
            <p id="totalRevenue">Rp 0</p>
          </div>
          <div class="stat-card">
            <h3>Rata-rata Pesanan</h3>
            <p id="averageOrder">Rp 0</p>
          </div>
        </div>
        <div class="table-container">
          <table class="transaction-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>ID Pesanan</th>
                <th>Pelanggan</th>
                <th>Item</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="transactionTableBody">
            </tbody>
          </table>
        </div>
      </div>
    `;

    mainContent.appendChild(historySection);

    // Tambahkan event listener untuk menampilkan/menyembunyikan section
    historyLink.addEventListener('click', (e) => {
      e.preventDefault();
      const allSections = document.querySelectorAll('section');
      allSections.forEach((section) => (section.style.display = 'none'));
      historySection.style.display = 'block';
      loadTransactionHistory();
    });

    // Event listener untuk filter berdasarkan tanggal
    const dateFilter = document.getElementById('historyDate');
    dateFilter.addEventListener('change', loadTransactionHistory);

    function loadTransactionHistory() {
      const selectedDate = document.getElementById('historyDate').value;
      const orders = JSON.parse(localStorage.getItem('orders')) || [];

      // Filter orders berdasarkan tanggal jika ada
      const filteredOrders = selectedDate
        ? orders.filter((order) => {
            const orderDate = new Date(order.timestamp)
              .toISOString()
              .split('T')[0];
            return orderDate === selectedDate;
          })
        : orders;

      // Update statistics
      const totalOrders = filteredOrders.length;
      const totalRevenue = filteredOrders.reduce(
        (sum, order) => sum + parseFloat(order.total),
        0
      );
      const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      document.getElementById('totalOrders').textContent = totalOrders;
      document.getElementById('totalRevenue').textContent =
        formatCurrency(totalRevenue);
      document.getElementById('averageOrder').textContent =
        formatCurrency(averageOrder);

      // Update table
      const tableBody = document.getElementById('transactionTableBody');
      tableBody.innerHTML = filteredOrders
        .map(
          (order) => `
        <tr>
          <td>${new Date(order.timestamp).toLocaleString()}</td>
          <td>${order.id}</td>
          <td>${order.customer.name}</td>
          <td>${order.items
            .map((item) => `${item.name} (${item.quantity})`)
            .join(', ')}</td>
          <td>${formatCurrency(order.total)}</td>
          <td>
            <span class="status-badge status-${order.status.toLowerCase()}">
              ${order.status}
            </span>
          </td>
        </tr>
      `
        )
        .join('');
    }

    function formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount);
    }
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const historySection = document.getElementById('history');

  if (!loggedInUser || loggedInUser.role !== 'admin') {
    if (historySection) {
      historySection.style.display = 'none';
      alert('Anda tidak memiliki akses ke fitur ini.');
      window.location.href = '#home'; // Redirect ke halaman utama
    }
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Periksa apakah user adalah admin
  if (loggedInUser && loggedInUser.role === 'admin') {
    // Tampilkan fitur "History Transaksi"
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    adminOnlyElements.forEach((element) => {
      element.style.display = 'block';
    });
  } else {
    // Sembunyikan fitur untuk non-admin
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    adminOnlyElements.forEach((element) => {
      element.style.display = 'none';
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const paymentForm = document.getElementById('paymentForm');
  const paymentMethod = document.getElementById('paymentMethod');
  const paymentDetails = document.getElementById('paymentDetails');

  // Sembunyikan detail kartu secara default
  paymentDetails.style.display = 'none';

  // Ubah tampilan berdasarkan metode pembayaran
  paymentMethod.addEventListener('change', (e) => {
    const method = e.target.value;
    paymentDetails.style.display = method === 'credit' ? 'block' : 'none';
  });

  // Tangani pengiriman form pembayaran
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const method = paymentMethod.value;

    // Validasi input jika menggunakan kartu kredit
    if (method === 'credit') {
      const cardNumber = document.getElementById('cardNumber').value.trim();
      const expiryDate = document.getElementById('expiryDate').value.trim();
      const cvv = document.getElementById('cvv').value.trim();

      if (!cardNumber || !expiryDate || !cvv) {
        alert('Mohon lengkapi informasi kartu.');
        return;
      }
    }

    // Simpan data pembayaran
    const paymentData = {
      method,
      details:
        method === 'credit'
          ? {
              cardNumber: document.getElementById('cardNumber').value.trim(),
              expiryDate: document.getElementById('expiryDate').value.trim(),
              cvv: document.getElementById('cvv').value.trim(),
            }
          : 'N/A',
    };
    localStorage.setItem('paymentData', JSON.stringify(paymentData));

    alert('Pembayaran berhasil!');
    paymentForm.reset();
    window.location.reload(); // Refresh halaman
  });
});
