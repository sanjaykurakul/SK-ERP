document.addEventListener('DOMContentLoaded', () => {
    
    // --- Login Logic ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            const errorMsg = document.getElementById('loginError');
            const btnText = loginBtn.querySelector('.btn-text');
            const loader = loginBtn.querySelector('.loader');

            // Show loading state
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
            loginBtn.disabled = true;
            errorMsg.style.display = 'none';

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    // Store user data
                    localStorage.setItem('user', JSON.stringify(data.user));
                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                } else {
                    errorMsg.textContent = data.message || 'Invalid credentials';
                    errorMsg.style.display = 'block';
                }
            } catch (error) {
                errorMsg.textContent = 'Connection error. Please try again later.';
                errorMsg.style.display = 'block';
            } finally {
                // Restore button state
                btnText.classList.remove('hidden');
                loader.classList.add('hidden');
                loginBtn.disabled = false;
            }
        });
    }

    // --- Dashboard Logic ---
    const dashboardBody = document.querySelector('.dashboard-body');
    if (dashboardBody) {
        
        // Check authentication
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = '/';
            return;
        }

        // Display user name
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay) {
            userNameDisplay.textContent = user.username;
        }

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = '/';
        });

        // Mobile menu toggle
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.querySelector('.sidebar');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Navigation
        const navLinks = document.querySelectorAll('.nav-links li');
        const sections = document.querySelectorAll('.module-section');
        const pageTitle = document.getElementById('pageTitle');

        const sectionTitles = {
            'overview': 'Dashboard Overview',
            'inventory': 'Inventory Management',
            'students': 'Student ERP',
            'billing': 'Billing & Invoices'
        };

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');

                // Hide all sections
                sections.forEach(s => s.classList.remove('active'));
                
                // Show target section
                const targetId = link.getAttribute('data-target');
                document.getElementById(targetId).classList.add('active');
                
                // Update title
                pageTitle.textContent = sectionTitles[targetId];

                // Close mobile sidebar if open
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }

                // Load data for section if not loaded
                loadSectionData(targetId);
            });
        });

        // Data Loading Functions
        async function loadSectionData(section) {
            if (section === 'overview') {
                loadDashboardStats();
            } else if (section === 'inventory') {
                loadInventory();
            } else if (section === 'students') {
                loadStudents();
            } else if (section === 'billing') {
                loadBilling();
            }
        }

        async function loadDashboardStats() {
            try {
                const response = await fetch('/api/dashboard/stats');
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('statInventory').textContent = data.stats.inventory_items || 0;
                    document.getElementById('statStudents').textContent = data.stats.active_students || 0;
                    // Format currency
                    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
                    document.getElementById('statSales').textContent = formatter.format(data.stats.total_sales || 0);
                }
            } catch (error) {
                console.error("Error loading stats:", error);
            }
        }

        async function loadInventory() {
            try {
                const response = await fetch('/api/inventory');
                const data = await response.json();
                
                const tbody = document.getElementById('inventoryTableBody');
                if (data.success && data.data.length > 0) {
                    tbody.innerHTML = '';
                    data.data.forEach(item => {
                        // Low stock warning
                        let statusClass = 'status-active';
                        let statusText = 'In Stock';
                        if (item.quantity <= 0) {
                            statusClass = 'status-inactive';
                            statusText = 'Out of Stock';
                        } else if (item.quantity < 10) {
                            statusClass = 'status-pending';
                            statusText = 'Low Stock';
                        }
                        
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>#${item.id}</td>
                            <td><strong>${item.item_name}</strong></td>
                            <td>${item.category || 'N/A'}</td>
                            <td>${item.quantity}</td>
                            <td>$${parseFloat(item.unit_price).toFixed(2)}</td>
                            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                            <td>
                                <div class="action-btns">
                                    <button class="action-btn"><i class="fa-solid fa-pen"></i></button>
                                    <button class="action-btn delete"><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No inventory items found. Add some to get started.</td></tr>';
                }
            } catch (error) {
                console.error("Error loading inventory:", error);
                document.getElementById('inventoryTableBody').innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--danger);">Failed to load data.</td></tr>';
            }
        }

        async function loadStudents() {
            try {
                const response = await fetch('/api/students');
                const data = await response.json();
                
                const tbody = document.getElementById('studentsTableBody');
                if (data.success && data.data.length > 0) {
                    tbody.innerHTML = '';
                    data.data.forEach(student => {
                        let statusClass = student.status === 'Active' ? 'status-active' : 'status-inactive';
                        
                        const tr = document.createElement('tr');
                        const date = new Date(student.enrollment_date).toLocaleDateString();
                        tr.innerHTML = `
                            <td>${student.student_id}</td>
                            <td><strong>${student.first_name} ${student.last_name}</strong></td>
                            <td>${student.course}</td>
                            <td>${date}</td>
                            <td><span class="status-badge ${statusClass}">${student.status}</span></td>
                            <td>
                                <div class="action-btns">
                                    <button class="action-btn"><i class="fa-solid fa-pen"></i></button>
                                    <button class="action-btn"><i class="fa-solid fa-eye"></i></button>
                                </div>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No students found.</td></tr>';
                }
            } catch (error) {
                console.error("Error loading students:", error);
                document.getElementById('studentsTableBody').innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--danger);">Failed to load data.</td></tr>';
            }
        }

        async function loadBilling() {
            try {
                const response = await fetch('/api/billing');
                const data = await response.json();
                
                const tbody = document.getElementById('billingTableBody');
                if (data.success && data.data.length > 0) {
                    tbody.innerHTML = '';
                    data.data.forEach(invoice => {
                        let statusClass = invoice.status === 'Paid' ? 'status-paid' : 'status-pending';
                        
                        const tr = document.createElement('tr');
                        const date = new Date(invoice.date).toLocaleDateString();
                        tr.innerHTML = `
                            <td>${invoice.invoice_number}</td>
                            <td><strong>${invoice.customer_name}</strong></td>
                            <td>${date}</td>
                            <td>$${parseFloat(invoice.total_amount).toFixed(2)}</td>
                            <td><span class="status-badge ${statusClass}">${invoice.status}</span></td>
                            <td>
                                <div class="action-btns">
                                    <button class="action-btn"><i class="fa-solid fa-eye"></i></button>
                                    <button class="action-btn"><i class="fa-solid fa-print"></i></button>
                                </div>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No invoices found.</td></tr>';
                }
            } catch (error) {
                console.error("Error loading billing:", error);
                document.getElementById('billingTableBody').innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--danger);">Failed to load data.</td></tr>';
            }
        }

        // Initial load
        loadDashboardStats();
    }
});
