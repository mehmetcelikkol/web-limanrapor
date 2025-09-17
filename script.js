// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form handling
    setupFormHandlers();
    
    // Initialize charts
    initializeCharts();
    
    // Update real-time data
    updateRealTimeData();
    
    // Start periodic updates
    setInterval(updateRealTimeData, 30000); // Update every 30 seconds
});

// Form submission handlers
function setupFormHandlers() {
    // Ship arrival form
    const shipArrivalForm = document.querySelector('#raporlar .report-form');
    if (shipArrivalForm) {
        shipArrivalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleShipArrival(this);
        });
    }

    // Cargo unloading form
    const cargoForms = document.querySelectorAll('#raporlar .report-form');
    if (cargoForms.length > 1) {
        cargoForms[1].addEventListener('submit', function(e) {
            e.preventDefault();
            handleCargoReport(this);
        });
    }
}

// Handle ship arrival form submission
function handleShipArrival(form) {
    const formData = new FormData(form);
    const shipData = {
        name: formData.get('gemi-adi'),
        type: formData.get('gemi-tipi'),
        arrivalTime: formData.get('gelis-tarihi'),
        dock: formData.get('rihti')
    };

    // Simulate API call
    showNotification('Gemi giriş raporu başarıyla kaydedildi!', 'success');
    
    // Add to ship list (simulate)
    addShipToList(shipData);
    
    // Reset form
    form.reset();
}

// Handle cargo report form submission
function handleCargoReport(form) {
    const formData = new FormData(form);
    const cargoData = {
        type: formData.get('yuk-tipi'),
        amount: formData.get('miktar'),
        startTime: formData.get('baslangic-saati'),
        endTime: formData.get('bitis-saati')
    };

    // Simulate API call
    showNotification('Yük boşaltma raporu başarıyla kaydedildi!', 'success');
    
    // Reset form
    form.reset();
}

// Add ship to the ships list
function addShipToList(shipData) {
    const shipsGrid = document.querySelector('.ships-grid');
    const shipCard = document.createElement('div');
    shipCard.className = 'ship-card';
    
    const statusClass = getRandomStatus();
    const statusText = getStatusText(statusClass);
    
    shipCard.innerHTML = `
        <div class="ship-header">
            <h3>${shipData.name}</h3>
            <span class="status ${statusClass}">${statusText}</span>
        </div>
        <div class="ship-info">
            <p><i class="fas fa-map-marker-alt"></i> Rıhtım ${shipData.dock}</p>
            <p><i class="fas fa-clock"></i> ${formatTime(shipData.arrivalTime)}</p>
            <p><i class="fas fa-boxes"></i> ${Math.floor(Math.random() * 500) + 100} Konteyner</p>
        </div>
    `;
    
    shipsGrid.appendChild(shipCard);
    
    // Animate in
    shipCard.style.opacity = '0';
    shipCard.style.transform = 'translateY(20px)';
    setTimeout(() => {
        shipCard.style.transition = 'all 0.5s ease';
        shipCard.style.opacity = '1';
        shipCard.style.transform = 'translateY(0)';
    }, 100);
}

// Utility functions
function getRandomStatus() {
    const statuses = ['status-loading', 'status-unloading', 'status-waiting'];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

function getStatusText(statusClass) {
    const statusMap = {
        'status-loading': 'Yükleniyor',
        'status-unloading': 'Boşaltılıyor',
        'status-waiting': 'Bekliyor'
    };
    return statusMap[statusClass];
}

function formatTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add close button styles
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Initialize charts (simple visualization)
function initializeCharts() {
    const chartCanvas = document.getElementById('daily-chart');
    if (chartCanvas) {
        // Simple chart simulation
        const ctx = chartCanvas.getContext('2d');
        
        // Sample data for daily operations
        const hours = Array.from({length: 24}, (_, i) => i);
        const data = hours.map(() => Math.floor(Math.random() * 50) + 10);
        
        drawBarChart(ctx, hours, data);
    }
}

// Simple bar chart drawing function
function drawBarChart(ctx, labels, data) {
    const canvas = ctx.canvas;
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const maxValue = Math.max(...data);
    const barWidth = chartWidth / data.length;
    
    // Draw bars
    ctx.fillStyle = '#2a5298';
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * barWidth;
        const y = height - padding - barHeight;
        
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
    });
    
    // Draw labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
        if (index % 3 === 0) { // Show every 3rd label to avoid crowding
            const x = padding + index * barWidth + barWidth / 2;
            ctx.fillText(label + ':00', x, height - 10);
        }
    });
    
    // Chart title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Saatlik Operasyon Yoğunluğu', width / 2, 25);
}

// Update real-time data
function updateRealTimeData() {
    updateStatistics();
    updateShipStatuses();
}

// Update statistics in hero section
function updateStatistics() {
    const statCards = document.querySelectorAll('.stat-card h3');
    
    if (statCards.length >= 3) {
        // Update daily ships count
        const currentShips = parseInt(statCards[0].textContent);
        const newShips = Math.max(30, currentShips + Math.floor(Math.random() * 5) - 2);
        animateNumber(statCards[0], newShips);
        
        // Update container count
        const containerText = statCards[1].textContent.replace(',', '');
        const currentContainers = isNaN(parseInt(containerText)) ? 1250 : parseInt(containerText);
        const newContainers = Math.max(1000, currentContainers + Math.floor(Math.random() * 100) - 50);
        animateNumber(statCards[1], newContainers.toLocaleString());
    }
}

// Update ship statuses randomly
function updateShipStatuses() {
    const shipCards = document.querySelectorAll('.ship-card');
    
    shipCards.forEach(card => {
        const status = card.querySelector('.status');
        if (Math.random() < 0.1) { // 10% chance to update status
            const newStatusClass = getRandomStatus();
            const newStatusText = getStatusText(newStatusClass);
            
            status.className = `status ${newStatusClass}`;
            status.textContent = newStatusText;
        }
    });
}

// Animate number changes
function animateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent.replace(',', ''));
    const increment = (newValue - currentValue) / 20;
    let current = currentValue;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= newValue) || (increment < 0 && current <= newValue)) {
            element.textContent = typeof newValue === 'string' ? newValue : newValue.toString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 50);
}

// Search functionality (can be extended)
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Gemi ara...';
    searchInput.className = 'search-input';
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const shipCards = document.querySelectorAll('.ship-card');
        
        shipCards.forEach(card => {
            const shipName = card.querySelector('h3').textContent.toLowerCase();
            if (shipName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    // Add search to ships section
    const shipsSection = document.querySelector('#gemiler .container');
    if (shipsSection) {
        shipsSection.insertBefore(searchInput, shipsSection.querySelector('.ships-grid'));
    }
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupSearch, 1000); // Add search after initial load
});

// Export functions for potential external use
window.LimanRapor = {
    showNotification,
    updateRealTimeData,
    addShipToList
};