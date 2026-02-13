// ==================== //
// App State Management //
// ==================== //

class LaundryTracker {
    constructor() {
        this.items = [];
        this.settings = {
            totalPackageWeight: 90,
            currentWeight: 45,
            expirationDate: '2026-05-01',
            minLoadWeight: 2,
            maxLoadWeight: 10
        };
        this.currentFilter = 'all';
        this.editingItemId = null;
        this.currentImage = null; // For add form
        this.editImage = null; // For edit modal

        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateUI();
        this.updateLaundryHistory();
        this.startExpirationTimer();
        // Set today's date as default for laundry submission
        document.getElementById('laundryDate').valueAsDate = new Date();
    }

    // ==================== //
    // Event Listeners      //
    // ==================== //

    setupEventListeners() {
        // Add item form
        document.getElementById('addItemForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addItem();
        });

        // Settings modal
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettings();
        });
        document.getElementById('closeSettings').addEventListener('click', () => {
            this.closeModal('settingsModal');
        });
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Edit modal
        document.getElementById('closeEdit').addEventListener('click', () => {
            this.closeModal('editModal');
        });
        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeModal('editModal');
        });
        document.getElementById('saveEdit').addEventListener('click', () => {
            this.saveEdit();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Import/Export
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });
        document.getElementById('importData').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.importData(e);
        });

        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Image upload - Add form
        document.getElementById('imageUploadBtn').addEventListener('click', () => {
            document.getElementById('itemImage').click();
        });
        document.getElementById('itemImage').addEventListener('change', (e) => {
            this.handleImageUpload(e, 'add');
        });
        document.getElementById('removeImageBtn').addEventListener('click', () => {
            this.removeImagePreview('add');
        });

        // Image upload - Edit modal
        document.getElementById('editImageUploadBtn').addEventListener('click', () => {
            document.getElementById('editItemImage').click();
        });
        document.getElementById('editItemImage').addEventListener('change', (e) => {
            this.handleImageUpload(e, 'edit');
        });
        document.getElementById('editRemoveImageBtn').addEventListener('click', () => {
            this.removeImagePreview('edit');
        });

        // Submit Laundry form
        document.getElementById('submitLaundryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitLaundry();
        });

        // History toggle
        document.getElementById('historyToggle').addEventListener('click', () => {
            this.toggleHistory();
        });
    }

    // ==================== //
    // Item Management      //
    // ==================== //

    addItem() {
        const name = document.getElementById('itemName').value.trim();
        const status = document.getElementById('itemStatus').value;

        if (!name) return;

        const item = {
            id: Date.now().toString(),
            name,
            status,
            image: this.currentImage || null,
            dateAdded: new Date().toISOString()
        };

        this.items.push(item);
        this.saveToStorage();
        this.updateUI();

        // Reset form
        document.getElementById('addItemForm').reset();
        if (this.removeImagePreview) this.removeImagePreview('add');
        this.currentImage = null;

        // Show success feedback
        this.showToast('Item added successfully! ✅');
    }

    deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.items = this.items.filter(item => item.id !== id);
            this.saveToStorage();
            this.updateUI();
            this.showToast('Item deleted');
        }
    }

    toggleItemStatus(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.status = item.status === 'laundry' ? 'cupboard' : 'laundry';
            this.saveToStorage();
            this.updateUI();
        }
    }

    openEditModal(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            this.editingItemId = id;
            document.getElementById('editItemName').value = item.name;

            // Show existing image if available
            if (item.image) {
                this.editImage = item.image;
                document.getElementById('editPreviewImg').src = item.image;
                document.getElementById('editImagePreview').style.display = 'block';
                document.getElementById('editImageUploadBtn').style.display = 'none';
            } else {
                this.removeImagePreview('edit');
            }

            this.openModal('editModal');
        }
    }

    saveEdit() {
        const item = this.items.find(item => item.id === this.editingItemId);
        if (item) {
            const name = document.getElementById('editItemName').value.trim();

            if (name) {
                item.name = name;
                item.image = this.editImage;
                this.saveToStorage();
                this.updateUI();
                this.closeModal('editModal');
                this.editImage = null;
                this.showToast('Item updated ✅');
            }
        }
    }

    // ==================== //
    // UI Updates           //
    // ==================== //

    updateUI() {
        this.updateStats();
        this.updateItemsList();
        this.updateWeightDisplay();
    }

    updateStats() {
        const itemsInLaundry = this.items.filter(item => item.status === 'laundry').length;
        const itemsInCupboard = this.items.filter(item => item.status === 'cupboard').length;
        const weightUsed = this.settings.totalPackageWeight - this.settings.currentWeight;
        const avgLoadWeight = (this.settings.minLoadWeight + this.settings.maxLoadWeight) / 2;
        const loadsRemaining = Math.floor(this.settings.currentWeight / avgLoadWeight);

        document.getElementById('itemsInLaundry').textContent = itemsInLaundry;
        document.getElementById('itemsInCupboard').textContent = itemsInCupboard;
        document.getElementById('weightUsed').textContent = weightUsed.toFixed(1);
        document.getElementById('loadsRemaining').textContent = loadsRemaining;
    }

    updateWeightDisplay() {
        const remainingElement = document.getElementById('remainingWeight');
        remainingElement.textContent = this.settings.currentWeight.toFixed(1);

        // Add warning colors based on remaining weight
        const percentRemaining = (this.settings.currentWeight / this.settings.totalPackageWeight) * 100;

        if (percentRemaining < 15) {
            remainingElement.classList.add('danger');
        } else if (percentRemaining < 30) {
            remainingElement.classList.add('warning');
        } else {
            remainingElement.classList.remove('danger', 'warning');
        }
    }

    updateItemsList() {
        const listContainer = document.getElementById('itemsList');

        if (this.items.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p class="empty-text">No items yet. Add your first clothing item!</p>
                </div>
            `;
            return;
        }

        const filteredItems = this.currentFilter === 'all'
            ? this.items
            : this.items.filter(item => item.status === this.currentFilter);

        if (filteredItems.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <p class="empty-text">No items in this category</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = filteredItems.map(item => `
            <div class="item-card" data-status="${item.status}">
                <label class="item-checkbox">
                    <input 
                        type="checkbox" 
                        ${item.status === 'laundry' ? 'checked' : ''} 
                        onchange="app.toggleItemStatus('${item.id}')"
                        class="checkbox-input"
                    >
                    <span class="checkbox-custom"></span>
                </label>
                ${item.image ? `<img src="${item.image}" alt="${this.escapeHtml(item.name)}" class="item-image">` : '<div class="item-placeholder">📷</div>'}
                <div class="item-info">
                    <div class="item-name">${this.escapeHtml(item.name)}</div>
                    <div class="item-status-text">${item.status === 'laundry' ? '🧺 In Laundry' : '🏠 In Cupboard'}</div>
                </div>
                <div class="item-actions">
                    <button class="action-btn" onclick="app.openEditModal('${item.id}')" title="Edit">✏️</button>
                    <button class="action-btn delete-btn" onclick="app.deleteItem('${item.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==================== //
    // Image Management     //
    // ==================== //

    handleImageUpload(event, context) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;

            if (context === 'add') {
                this.currentImage = imageData;
                document.getElementById('previewImg').src = imageData;
                document.getElementById('imagePreview').style.display = 'block';
                document.getElementById('imageUploadBtn').style.display = 'none';
            } else if (context === 'edit') {
                this.editImage = imageData;
                document.getElementById('editPreviewImg').src = imageData;
                document.getElementById('editImagePreview').style.display = 'block';
                document.getElementById('editImageUploadBtn').style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }

    removeImagePreview(context) {
        if (context === 'add') {
            this.currentImage = null;
            document.getElementById('previewImg').src = '';
            document.getElementById('imagePreview').style.display = 'none';
            document.getElementById('imageUploadBtn').style.display = 'block';
            document.getElementById('itemImage').value = '';
        } else if (context === 'edit') {
            this.editImage = null;
            document.getElementById('editPreviewImg').src = '';
            document.getElementById('editImagePreview').style.display = 'none';
            document.getElementById('editImageUploadBtn').style.display = 'block';
            document.getElementById('editItemImage').value = '';
        }
    }

    // ==================== //
    // Laundry History      //
    // ==================== //

    submitLaundry() {
        const date = document.getElementById('laundryDate').value;
        const weight = parseFloat(document.getElementById('laundryWeight').value);

        if (!date || !weight) return;

        // Check if enough weight remaining
        if (weight > this.settings.currentWeight) {
            alert(`Not enough weight remaining! You only have ${this.settings.currentWeight.toFixed(1)} kg left.`);
            return;
        }

        const record = {
            id: Date.now().toString(),
            date: date,
            weight: weight,
            itemsCount: this.items.filter(item => item.status === 'laundry').length,
            timestamp: new Date().toISOString()
        };

        this.laundryHistory.unshift(record); // Add to beginning
        this.settings.currentWeight -= weight;

        this.saveToStorage();
        this.updateUI();
        this.updateLaundryHistory();

        // Reset form
        document.getElementById('submitLaundryForm').reset();
        // Set today's date as default
        document.getElementById('laundryDate').valueAsDate = new Date();

        this.showToast('Laundry submitted! ✅');
    }

    toggleHistory() {
        this.historyExpanded = !this.historyExpanded;
        const container = document.getElementById('historyContainer');
        const toggleIcon = document.querySelector('.toggle-icon');

        if (this.historyExpanded) {
            container.style.display = 'block';
            toggleIcon.textContent = '▲';
        } else {
            container.style.display = 'none';
            toggleIcon.textContent = '▼';
        }
    }

    updateLaundryHistory() {
        const historyList = document.getElementById('historyList');

        if (this.laundryHistory.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p class="empty-text">No laundry history yet</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = this.laundryHistory.map(record => `
            <div class="history-card">
                <div class="history-info">
                    <div class="history-date">${this.formatDate(record.date)}</div>
                    <div class="history-details">
                        <span class="history-weight">${record.weight.toFixed(1)} kg</span>
                        <span class="history-separator">•</span>
                        <span class="history-items">${record.itemsCount} items</span>
                    </div>
                </div>
                <button class="action-btn delete-btn" onclick="app.deleteLaundryRecord('${record.id}')" title="Delete">🗑️</button>
            </div>
        `).join('');
    }

    deleteLaundryRecord(id) {
        if (confirm('Delete this laundry record?')) {
            const record = this.laundryHistory.find(r => r.id === id);
            if (record) {
                // Add weight back
                this.settings.currentWeight += record.weight;
                this.laundryHistory = this.laundryHistory.filter(r => r.id !== id);
                this.saveToStorage();
                this.updateUI();
                this.updateLaundryHistory();
                this.showToast('Record deleted');
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // ==================== //
    // Filter Management    //
    // ==================== //

    setFilter(filter) {
        this.currentFilter = filter;

        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.updateItemsList();
    }

    // ==================== //
    // Settings Management  //
    // ==================== //

    openSettings() {
        document.getElementById('settingTotalWeight').value = this.settings.totalPackageWeight;
        document.getElementById('settingCurrentWeight').value = this.settings.currentWeight;
        document.getElementById('settingExpirationDate').value = this.settings.expirationDate;
        document.getElementById('settingMinLoad').value = this.settings.minLoadWeight;
        document.getElementById('settingMaxLoad').value = this.settings.maxLoadWeight;

        this.openModal('settingsModal');
    }

    saveSettings() {
        this.settings.totalPackageWeight = parseFloat(document.getElementById('settingTotalWeight').value);
        this.settings.currentWeight = parseFloat(document.getElementById('settingCurrentWeight').value);
        this.settings.expirationDate = document.getElementById('settingExpirationDate').value;
        this.settings.minLoadWeight = parseFloat(document.getElementById('settingMinLoad').value);
        this.settings.maxLoadWeight = parseFloat(document.getElementById('settingMaxLoad').value);

        this.saveToStorage();
        this.updateUI();
        this.closeModal('settingsModal');
        this.showToast('Settings saved ✅');
    }

    // ==================== //
    // Expiration Timer     //
    // ==================== //

    startExpirationTimer() {
        this.updateExpirationDisplay();
        setInterval(() => {
            this.updateExpirationDisplay();
        }, 60000); // Update every minute
    }

    updateExpirationDisplay() {
        const expirationDate = new Date(this.settings.expirationDate);
        const now = new Date();
        const diff = expirationDate - now;

        const element = document.getElementById('expirationText');

        if (diff < 0) {
            element.textContent = 'Expired';
            element.parentElement.classList.add('danger');
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 7) {
            element.textContent = `${days} days left`;
            element.parentElement.classList.remove('warning', 'danger');
        } else if (days > 2) {
            element.textContent = `${days} days left`;
            element.parentElement.classList.add('warning');
            element.parentElement.classList.remove('danger');
        } else if (days > 0) {
            element.textContent = `${days}d ${hours}h left`;
            element.parentElement.classList.add('danger');
            element.parentElement.classList.remove('warning');
        } else {
            element.textContent = `${hours}h left`;
            element.parentElement.classList.add('danger');
        }
    }

    // ==================== //
    // Modal Management     //
    // ==================== //

    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // ==================== //
    // Data Persistence     //
    // ==================== //

    saveToStorage() {
        const data = {
            items: this.items,
            settings: this.settings,
            laundryHistory: this.laundryHistory
        };
        localStorage.setItem('laundryTrackerData', JSON.stringify(data));
    }

    loadFromStorage() {
        const data = localStorage.getItem('laundryTrackerData');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.items = parsed.items || [];
                this.settings = { ...this.settings, ...parsed.settings };
                this.laundryHistory = parsed.laundryHistory || [];
            } catch (e) {
                console.error('Error loading data from storage:', e);
            }
        }
    }

    // ==================== //
    // Import/Export        //
    // ==================== //

    exportData() {
        const data = {
            items: this.items,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `laundry-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Data exported ✅');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.items && data.settings) {
                    if (confirm('This will replace all current data. Continue?')) {
                        this.items = data.items;
                        this.settings = { ...this.settings, ...data.settings };
                        this.saveToStorage();
                        this.updateUI();
                        this.showToast('Data imported successfully ✅');
                    }
                } else {
                    alert('Invalid backup file format');
                }
            } catch (error) {
                alert('Error importing file: ' + error.message);
            }
        };
        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    }

    // ==================== //
    // Toast Notifications  //
    // ==================== //

    showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                transition: transform 0.3s ease;
                backdrop-filter: blur(10px);
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = message;

        // Show toast
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        // Hide toast after 2 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
        }, 2000);
    }
}

// ==================== //
// Initialize App       //
// ==================== //

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new LaundryTracker();
});
