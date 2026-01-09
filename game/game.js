// ========================================
// AZERA ENJOY - Logic Game (Bahasa Indonesia)
// ========================================

class AzeraGame {
    constructor() {
        // State Game
        this.state = {
            day: 1,
            money: 0,
            totalMoney: 0,
            violations: 0,
            customersServed: 0,
            customersApproved: 0,
            customersRejected: 0,
            todayEarnings: 0,
            todayTips: 0,
            todayPenalties: 0,
            currentCustomer: null,
            currentOrder: null,
            dayCustomerIndex: 0,
            isGameOver: false,
            activeRules: []
        };

        // Tracking kafein pelanggan untuk hari ini
        this.caffeineTracker = new Map();

        // DOM Elements
        this.screens = {
            intro: document.getElementById('intro-screen'),
            briefing: document.getElementById('briefing-screen'),
            game: document.getElementById('game-screen'),
            dayend: document.getElementById('dayend-screen'),
            gameover: document.getElementById('gameover-screen')
        };

        this.elements = {
            // Briefing
            briefingDay: document.getElementById('briefing-day'),
            briefingDate: document.getElementById('briefing-date'),
            dailyRules: document.getElementById('daily-rules'),
            targetOrders: document.getElementById('target-orders'),
            maxViolations: document.getElementById('max-violations'),

            // Game HUD
            currentDay: document.getElementById('current-day'),
            currentTime: document.getElementById('current-time'),
            currentMoney: document.getElementById('current-money'),
            violations: document.getElementById('violations'),
            customersServed: document.getElementById('customers-served'),

            // Panels
            customerArea: document.getElementById('customer-area'),
            orderArea: document.getElementById('order-area'),
            rulebookContent: document.getElementById('rulebook-content'),

            // Actions
            nextCustomerBtn: document.getElementById('next-customer-btn'),
            inspectBtn: document.getElementById('inspect-btn'),
            approveBtn: document.getElementById('approve-btn'),
            rejectBtn: document.getElementById('reject-btn'),
            reasonSelector: document.getElementById('reason-selector'),
            reasonButtons: document.getElementById('reason-buttons'),
            stampApproved: document.getElementById('stamp-approved'),
            stampRejected: document.getElementById('stamp-rejected'),

            // Result Popup
            resultPopup: document.getElementById('result-popup'),
            resultIcon: document.getElementById('result-icon'),
            resultTitle: document.getElementById('result-title'),
            resultMessage: document.getElementById('result-message'),
            resultEarnings: document.getElementById('result-earnings'),
            continueBtn: document.getElementById('continue-btn'),

            // Day End
            endDay: document.getElementById('end-day'),
            reportCustomers: document.getElementById('report-customers'),
            reportApproved: document.getElementById('report-approved'),
            reportRejected: document.getElementById('report-rejected'),
            reportViolations: document.getElementById('report-violations'),
            financeEarnings: document.getElementById('finance-earnings'),
            financeTips: document.getElementById('finance-tips'),
            financePenalties: document.getElementById('finance-penalties'),
            financeTotal: document.getElementById('finance-total'),
            dayStatus: document.getElementById('day-status'),

            // Game Over
            gameoverMessage: document.getElementById('gameover-message'),
            finalDays: document.getElementById('final-days'),
            finalMoney: document.getElementById('final-money'),
            finalCustomers: document.getElementById('final-customers'),

            // Inspection Modal
            inspectionModal: document.getElementById('inspection-modal'),
            inspectionDocument: document.getElementById('inspection-document'),
            inspectionReference: document.getElementById('inspection-reference'),
            discrepanciesList: document.getElementById('discrepancies-list')
        };

        this.panels = {
            customer: document.getElementById('panel-customer'),
            order: document.getElementById('panel-order'),
            rules: document.getElementById('panel-rules')
        };

        this.init();
    }

    // Safe element text content setter
    safeSetText(element, text) {
        if (element) element.textContent = text;
    }

    // Safe element innerHTML setter
    safeSetHTML(element, html) {
        if (element) element.innerHTML = html;
    }

    init() {
        try {
            this.bindEvents();
            this.updateRulebook('rules');
            this.setActivePanel('customer');
        } catch (error) {
            console.error('Game init error:', error);
        }
    }

    bindEvents() {
        // Start button - also initializes audio context
        document.getElementById('start-btn').addEventListener('click', () => {
            soundManager.init();
            soundManager.resume();
            soundManager.click();
            this.showBriefing();
        });
        document.getElementById('start-day-btn').addEventListener('click', () => {
            soundManager.click();
            soundManager.dayStart();
            this.startDay();
        });

        // Sound toggle button
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                soundManager.init();
                const enabled = soundManager.toggle();
                soundToggle.textContent = enabled ? '🔊' : '🔇';
                soundToggle.classList.toggle('muted', !enabled);
                if (enabled) soundManager.click();
            });
        }

        // Action buttons
        this.elements.approveBtn.addEventListener('click', () => {
            soundManager.click();
            this.handleApprove();
        });
        this.elements.rejectBtn.addEventListener('click', () => {
            soundManager.click();
            this.showReasonSelector();
        });
        this.elements.inspectBtn.addEventListener('click', () => {
            soundManager.click();
            this.showInspection();
        });

        // Continue button
        this.elements.continueBtn.addEventListener('click', () => {
            soundManager.click();
            this.hideResultPopup();
        });

        // Next day
        document.getElementById('next-day-btn').addEventListener('click', () => {
            soundManager.click();
            soundManager.dayStart();
            this.nextDay();
        });

        // Restart
        document.getElementById('restart-btn').addEventListener('click', () => {
            soundManager.click();
            this.restart();
        });

        // Close inspection
        document.getElementById('close-inspection').addEventListener('click', () => this.hideInspection());

        // Cancel reject
        const cancelBtn = document.getElementById('cancel-reject-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.elements.reasonSelector.style.display = 'none';
            });
        }

        // Rulebook tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                soundManager.tabSwitch();
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateRulebook(e.target.dataset.tab);
            });
        });

        // Mobile tabs
        document.querySelectorAll('.mobile-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                soundManager.tabSwitch();
                document.querySelectorAll('.mobile-tab').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.setActivePanel(e.target.dataset.panel);
            });
        });

        // Keyboard shortcuts (for desktop)
        document.addEventListener('keydown', (e) => {
            if (this.state.currentOrder && !this.elements.resultPopup.classList.contains('show')) {
                if (e.key === 'a' || e.key === 'A') {
                    this.handleApprove();
                } else if (e.key === 'r' || e.key === 'R') {
                    this.showReasonSelector();
                }
            }
        });

        // Touch feedback
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('touchstart', () => {
                btn.style.transform = 'scale(0.98)';
            });
            btn.addEventListener('touchend', () => {
                btn.style.transform = '';
            });
        });
    }

    setActivePanel(panelName) {
        Object.values(this.panels).forEach(panel => {
            if (panel) panel.classList.remove('active');
        });
        if (this.panels[panelName]) {
            this.panels[panelName].classList.add('active');
        }
    }

    // Helper to safely update mobile tab active states
    setActiveMobileTab(activePanel) {
        document.querySelectorAll('.mobile-tab').forEach(tab => {
            if (tab.dataset.panel === activePanel) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // ========================================
    // SCREEN MANAGEMENT
    // ========================================

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.screens[screenName].classList.add('active');
    }

    // ========================================
    // GAME FLOW
    // ========================================

    showBriefing() {
        this.updateBriefing();
        this.showScreen('briefing');
    }

    updateBriefing() {
        const day = this.state.day;
        const settings = this.getDaySettings();

        this.elements.briefingDay.textContent = day;
        this.elements.briefingDate.textContent = this.getDateString();
        this.elements.targetOrders.textContent = formatRupiah(settings.target);
        this.elements.maxViolations.textContent = settings.maxViolations;

        // Build active rules
        this.state.activeRules = [];
        for (let i = 0; i < Math.min(day, GAME_DATA.dailyRules.length); i++) {
            this.state.activeRules = [...this.state.activeRules, ...GAME_DATA.dailyRules[i]];
        }

        // Render rules
        const rulesHtml = this.state.activeRules.map(rule => `
            <div class="rule-item ${rule.type === 'new' && day > 1 ? 'new' : ''}">
                <span class="rule-icon">${rule.icon}</span>
                <span class="rule-text">${rule.text}</span>
            </div>
        `).join('');

        this.elements.dailyRules.innerHTML = rulesHtml;
    }

    startDay() {
        // Reset daily stats
        this.state.todayEarnings = 0;
        this.state.todayTips = 0;
        this.state.todayPenalties = 0;
        this.state.dayCustomerIndex = 0;
        this.caffeineTracker.clear();

        // Update HUD
        this.updateHUD();

        // Show game screen
        this.showScreen('game');

        // Set active panel to customer
        this.setActivePanel('customer');

        // Show empty customer area with next button
        this.showEmptyCustomerArea();
    }

    showEmptyCustomerArea() {
        this.elements.customerArea.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🚪</span>
                <p>Menunggu pelanggan...</p>
                <button id="next-customer-btn" class="btn-secondary">PELANGGAN BERIKUTNYA</button>
            </div>
        `;

        this.elements.orderArea.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📄</span>
                <p>Belum ada pesanan</p>
            </div>
        `;

        // Rebind next customer button
        document.getElementById('next-customer-btn').addEventListener('click', () => {
            soundManager.click();
            this.nextCustomer();
        });

        // Disable action buttons
        this.toggleActionButtons(false);
    }

    nextCustomer() {
        const settings = this.getDaySettings();

        // Check if day is over
        if (this.state.dayCustomerIndex >= settings.customers) {
            this.endDay();
            return;
        }

        // Generate customer and order
        this.state.currentCustomer = this.generateCustomer();
        this.state.currentOrder = this.generateOrder(this.state.currentCustomer);
        this.state.dayCustomerIndex++;

        // Update time
        const hour = 9 + Math.floor(this.state.dayCustomerIndex * (8 / settings.customers));
        const minute = Math.floor(Math.random() * 60);
        this.elements.currentTime.textContent = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Play customer arrive sound
        soundManager.customerArrive();

        // Render customer and order
        this.renderCustomer();
        this.renderOrder();

        // Play paper slide sound
        setTimeout(() => soundManager.paperSlide(), 300);

        // Enable action buttons
        this.toggleActionButtons(true);

        // On mobile, switch to order panel
        if (window.innerWidth < 768) {
            setTimeout(() => {
                this.setActivePanel('order');
                this.setActiveMobileTab('order');
            }, 500);
        }
    }

    handleApprove() {
        if (!this.state.currentOrder) return;

        // Check if this approval is correct
        const validation = this.validateOrder();

        this.showStamp('approved');
        soundManager.stampApprove();

        setTimeout(() => {
            if (validation.shouldApprove) {
                // Correct approval
                const earnings = this.calculateEarnings();
                const tip = (Math.floor(Math.random() * 3) + 1) * 2000;

                this.state.todayEarnings += earnings;
                this.state.todayTips += tip;
                this.state.money += earnings + tip;
                this.state.customersApproved++;
                this.state.customersServed++;

                // Track caffeine
                this.trackCaffeine();

                // Play success sounds
                soundManager.correct();
                soundManager.money();

                this.showResult(true, 'Pesanan diproses dengan benar!', earnings + tip);
            } else {
                // Wrong approval - should have rejected
                this.state.violations++;
                this.state.todayPenalties += 25000;
                this.state.money = Math.max(0, this.state.money - 25000);
                this.state.customersApproved++;
                this.state.customersServed++;

                // Play violation sound
                soundManager.violation();

                this.showResult(false, `Salah! Harusnya ditolak: ${validation.reason}`, -25000);
            }

            this.updateHUD();
            this.checkGameOver();
        }, 600);
    }

    showReasonSelector() {
        if (!this.state.currentOrder) return;

        // Build reason buttons based on active rules
        const reasonsHtml = GAME_DATA.rejectionReasons.map(reason => `
            <button class="reason-btn" data-reason="${reason.id}">${reason.text}</button>
        `).join('');

        this.elements.reasonButtons.innerHTML = reasonsHtml;
        this.elements.reasonSelector.style.display = 'block';

        // Bind reason buttons
        this.elements.reasonButtons.querySelectorAll('.reason-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleReject(e.target.dataset.reason));
        });
    }

    handleReject(reason) {
        if (!this.state.currentOrder) return;

        const validation = this.validateOrder();

        this.elements.reasonSelector.style.display = 'none';
        this.showStamp('rejected');
        soundManager.stampReject();

        setTimeout(() => {
            if (!validation.shouldApprove && validation.reasonId === reason) {
                // Correct rejection with correct reason
                const tip = 10000;
                this.state.todayEarnings += 10000;
                this.state.todayTips += tip;
                this.state.money += 10000 + tip;
                this.state.customersRejected++;
                this.state.customersServed++;

                // Play success sounds
                soundManager.correct();
                soundManager.money();

                this.showResult(true, 'Masalah teridentifikasi dengan benar!', 20000);
            } else if (!validation.shouldApprove) {
                // Correct rejection but wrong reason
                this.state.todayEarnings += 5000;
                this.state.money += 5000;
                this.state.customersRejected++;
                this.state.customersServed++;

                // Play partial success sound
                soundManager.correct();

                this.showResult(true, `Ditolak benar, tapi alasannya: ${validation.reason}`, 5000);
            } else {
                // Wrong rejection - should have approved
                this.state.violations++;
                this.state.todayPenalties += 25000;
                this.state.money = Math.max(0, this.state.money - 25000);
                this.state.customersRejected++;
                this.state.customersServed++;

                // Play violation sound
                soundManager.violation();

                this.showResult(false, 'Salah! Pesanan ini valid.', -25000);
            }

            this.updateHUD();
            this.checkGameOver();
        }, 600);
    }

    showStamp(type) {
        const stamp = type === 'approved' ? this.elements.stampApproved : this.elements.stampRejected;
        stamp.classList.add('show');

        // Vibrate on mobile if supported
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        setTimeout(() => {
            stamp.classList.remove('show');
        }, 1000);
    }

    showResult(success, message, amount) {
        this.elements.resultIcon.textContent = success ? '✓' : '✗';
        this.elements.resultIcon.className = 'result-icon ' + (success ? 'success' : 'error');
        this.elements.resultTitle.textContent = success ? 'BENAR!' : 'PELANGGARAN!';
        this.elements.resultTitle.className = 'result-title ' + (success ? 'success' : 'error');
        this.elements.resultMessage.textContent = message;
        this.elements.resultEarnings.textContent = (amount >= 0 ? '+' : '') + formatRupiah(amount);
        this.elements.resultEarnings.className = 'result-earnings ' + (amount >= 0 ? 'positive' : 'negative');

        this.elements.resultPopup.classList.add('show');
    }

    hideResultPopup() {
        this.elements.resultPopup.classList.remove('show');

        const settings = this.getDaySettings();
        if (this.state.dayCustomerIndex >= settings.customers) {
            this.endDay();
        } else {
            this.setActivePanel('customer');
            this.setActiveMobileTab('customer');
            this.showEmptyCustomerArea();
        }
    }

    endDay() {
        // Calculate totals
        const netTotal = this.state.todayEarnings + this.state.todayTips - this.state.todayPenalties;
        const settings = this.getDaySettings();

        // Update day end screen
        this.elements.endDay.textContent = this.state.day;
        this.elements.reportCustomers.textContent = this.state.customersServed;
        this.elements.reportApproved.textContent = this.state.customersApproved;
        this.elements.reportRejected.textContent = this.state.customersRejected;
        this.elements.reportViolations.textContent = this.state.violations;

        this.elements.financeEarnings.textContent = `+${formatRupiah(this.state.todayEarnings)}`;
        this.elements.financeTips.textContent = `+${formatRupiah(this.state.todayTips)}`;
        this.elements.financePenalties.textContent = `-${formatRupiah(this.state.todayPenalties)}`;
        this.elements.financeTotal.textContent = formatRupiah(netTotal);
        this.elements.financeTotal.className = netTotal >= 0 ? 'positive' : 'negative';

        // Determine status
        let statusClass, statusText;
        if (this.state.todayEarnings >= settings.target && this.state.violations === 0) {
            statusClass = 'success';
            statusText = '⭐ PERFORMA LUAR BIASA!';
        } else if (this.state.todayEarnings >= settings.target) {
            statusClass = 'success';
            statusText = '✓ TARGET TERCAPAI';
        } else if (this.state.todayEarnings >= settings.target * 0.7) {
            statusClass = 'warning';
            statusText = '⚠ DI BAWAH TARGET';
        } else {
            statusClass = 'danger';
            statusText = '✗ PERFORMA BURUK';
        }

        this.elements.dayStatus.className = 'status-badge ' + statusClass;
        this.elements.dayStatus.textContent = statusText;

        this.state.totalMoney += netTotal;

        // Play day end sound
        soundManager.dayEnd();

        this.showScreen('dayend');
    }

    nextDay() {
        // Reset for new day
        this.state.day++;
        this.state.violations = 0;
        this.state.customersServed = 0;
        this.state.customersApproved = 0;
        this.state.customersRejected = 0;

        this.showBriefing();
    }

    checkGameOver() {
        const settings = this.getDaySettings();

        if (this.state.violations >= settings.maxViolations) {
            this.gameOver('Terlalu banyak pelanggaran! Hak ngopi kamu telah dicabut.');
        }
    }

    gameOver(message) {
        this.state.isGameOver = true;

        this.elements.gameoverMessage.textContent = message;
        this.elements.finalDays.textContent = this.state.day;
        this.elements.finalMoney.textContent = formatRupiah(this.state.totalMoney);
        this.elements.finalCustomers.textContent = this.state.customersServed;

        // Play game over sound
        soundManager.gameOver();

        setTimeout(() => {
            this.showScreen('gameover');
        }, 500);
    }

    restart() {
        // Reset all state
        this.state = {
            day: 1,
            money: 0,
            totalMoney: 0,
            violations: 0,
            customersServed: 0,
            customersApproved: 0,
            customersRejected: 0,
            todayEarnings: 0,
            todayTips: 0,
            todayPenalties: 0,
            currentCustomer: null,
            currentOrder: null,
            dayCustomerIndex: 0,
            isGameOver: false,
            activeRules: []
        };

        this.caffeineTracker.clear();
        this.showScreen('intro');
    }

    // ========================================
    // CUSTOMER & ORDER GENERATION
    // ========================================

    generateCustomer() {
        const role = GAME_DATA.roles[Math.floor(Math.random() * GAME_DATA.roles.length)];
        const firstName = GAME_DATA.firstNames[Math.floor(Math.random() * GAME_DATA.firstNames.length)];
        const lastName = GAME_DATA.lastNames[Math.floor(Math.random() * GAME_DATA.lastNames.length)];

        // Determine membership tier (weighted)
        const tierRoll = Math.random();
        let tier;
        if (tierRoll < 0.5) {
            tier = 'free';
        } else if (tierRoll < 0.8) {
            tier = 'pro';
        } else {
            tier = 'enterprise';
        }

        // Budget based on role
        const [minBudget, maxBudget] = role.budgetRange;
        const budget = Math.floor(Math.random() * (maxBudget - minBudget + 1)) + minBudget;

        // Caffeine already consumed today
        const customerId = `${firstName}_${lastName}`;
        const previousCaffeine = this.caffeineTracker.get(customerId) || 0;

        // Burnout status (more likely after day 3)
        const burnoutChance = this.state.day >= 4 ? 0.15 : 0;
        const isBurnout = Math.random() < burnoutChance;

        return {
            id: customerId,
            name: `${firstName} ${lastName}`,
            role: role,
            tier: tier,
            budget: budget,
            caffeine: previousCaffeine,
            isBurnout: isBurnout,
            typoChance: role.typoChance
        };
    }

    generateOrder(customer) {
        const availableItems = GAME_DATA.menu.filter(item => {
            const tierOrder = ['free', 'pro', 'enterprise'];
            return tierOrder.indexOf(customer.tier) >= tierOrder.indexOf(item.minTier);
        });

        // Number of items (1-3)
        const numItems = Math.min(1 + Math.floor(Math.random() * 3), this.state.day >= 7 ? 4 : 3);

        let items = [];
        let hasTypo = false;
        let typoItemIndex = -1;

        for (let i = 0; i < numItems; i++) {
            const item = availableItems[Math.floor(Math.random() * availableItems.length)];
            let itemName = item.name;
            let itemId = item.id;
            let isTypo = false;

            // Introduce typo based on customer and day
            if (this.state.day >= 5 && !hasTypo && Math.random() < customer.typoChance) {
                const typos = GAME_DATA.typos[item.id];
                if (typos && typos.length > 0) {
                    itemName = typos[Math.floor(Math.random() * typos.length)];
                    isTypo = true;
                    hasTypo = true;
                    typoItemIndex = i;
                }
            }

            items.push({
                ...item,
                displayName: itemName,
                isTypo: isTypo
            });
        }

        // Generate promo code (sometimes)
        let promoCode = null;
        let promoValid = true;
        if (Math.random() < 0.3 && this.state.day >= 3) {
            const codes = Object.keys(GAME_DATA.promoCodes);
            promoCode = codes[Math.floor(Math.random() * codes.length)];

            const promo = GAME_DATA.promoCodes[promoCode];
            const dayOfWeek = (this.state.day % 5) + 1; // 1-5

            // Check validity
            if (!promo.validDays.includes(dayOfWeek)) {
                promoValid = false;
            }
        }

        // Calculate totals
        let subtotal = items.reduce((sum, item) => sum + item.price, 0);
        let discount = 0;

        // Tier discount
        discount += subtotal * (GAME_DATA.tiers[customer.tier].discount / 100);

        // Promo discount
        if (promoCode && promoValid) {
            const promo = GAME_DATA.promoCodes[promoCode];
            if (subtotal >= promo.minOrder) {
                discount += subtotal * (promo.discount / 100);
            }
        }

        const total = Math.max(1000, Math.round((subtotal - discount) / 1000) * 1000);
        const totalCaffeine = items.reduce((sum, item) => sum + item.caffeine, 0);

        return {
            items: items,
            subtotal: subtotal,
            discount: Math.round(discount / 1000) * 1000,
            total: total,
            promoCode: promoCode,
            promoValid: promoValid,
            caffeine: totalCaffeine,
            hasTypo: hasTypo,
            typoItemIndex: typoItemIndex,
            orderNumber: `#${Date.now().toString(36).toUpperCase()}`
        };
    }

    // ========================================
    // VALIDATION
    // ========================================

    validateOrder() {
        const customer = this.state.currentCustomer;
        const order = this.state.currentOrder;
        const day = this.state.day;

        // Day 1+: Check budget
        if (order.total > customer.budget) {
            return { shouldApprove: false, reason: 'Budget tidak cukup', reasonId: 'insufficient_budget' };
        }

        // Day 1+: Check tier restrictions
        for (const item of order.items) {
            const tierOrder = ['free', 'pro', 'enterprise'];
            if (tierOrder.indexOf(customer.tier) < tierOrder.indexOf(item.minTier)) {
                return { shouldApprove: false, reason: 'Tier membership tidak valid untuk item ini', reasonId: 'invalid_tier' };
            }
        }

        // Day 2+: Check caffeine limit
        if (day >= 2) {
            const maxCaffeine = GAME_DATA.tiers[customer.tier].maxCaffeine;
            if (customer.caffeine + order.caffeine > maxCaffeine) {
                return { shouldApprove: false, reason: 'Batas kafein terlampaui', reasonId: 'caffeine_limit' };
            }
        }

        // Day 3+: Check promo code
        if (day >= 3 && order.promoCode && !order.promoValid) {
            return { shouldApprove: false, reason: 'Kode promo tidak valid', reasonId: 'invalid_promo' };
        }

        // Day 4+: Check burnout
        if (day >= 4 && customer.isBurnout) {
            return { shouldApprove: false, reason: 'Pelanggan burnout terdeteksi', reasonId: 'burnout' };
        }

        // Day 5+: Check typos
        if (day >= 5 && order.hasTypo) {
            return { shouldApprove: false, reason: 'Pesanan mengandung typo/bug', reasonId: 'typo_bug' };
        }

        // Day 7+: Check max items
        if (day >= 7 && order.items.length > 3) {
            return { shouldApprove: false, reason: 'Terlalu banyak item (maks 3)', reasonId: 'too_many_items' };
        }

        return { shouldApprove: true, reason: null, reasonId: null };
    }

    // ========================================
    // RENDERING
    // ========================================

    renderCustomer() {
        const customer = this.state.currentCustomer;
        const tierInfo = GAME_DATA.tiers[customer.tier];

        let badges = '';
        if (customer.isBurnout) {
            badges += `<div class="stat-badge danger">😴 Burnout</div>`;
        }
        if (customer.caffeine > 0) {
            const maxCaffeine = tierInfo.maxCaffeine;
            const caffeinePercent = (customer.caffeine / maxCaffeine) * 100;
            const badgeClass = caffeinePercent >= 80 ? 'danger' : caffeinePercent >= 50 ? 'warning' : '';
            badges += `<div class="stat-badge ${badgeClass}">☕ ${customer.caffeine}/${maxCaffeine}</div>`;
        }

        const dialogue = customer.isBurnout
            ? GAME_DATA.dialogues.burnout[Math.floor(Math.random() * GAME_DATA.dialogues.burnout.length)]
            : customer.caffeine >= GAME_DATA.tiers[customer.tier].maxCaffeine * 0.8
                ? GAME_DATA.dialogues.highCaffeine[Math.floor(Math.random() * GAME_DATA.dialogues.highCaffeine.length)]
                : GAME_DATA.dialogues.normal[Math.floor(Math.random() * GAME_DATA.dialogues.normal.length)];

        this.elements.customerArea.innerHTML = `
            <div class="customer-card">
                <div class="customer-avatar">${customer.role.emoji}</div>
                <div class="customer-name">${customer.name}</div>
                <div class="customer-role" style="color: ${tierInfo.color}">${customer.role.name} • ${tierInfo.name}</div>
                <div class="customer-stats">
                    <div class="stat-badge">💰 ${formatRupiah(customer.budget)}</div>
                    ${badges}
                </div>
                <div class="customer-dialogue">${dialogue}</div>
            </div>
        `;
    }

    renderOrder() {
        const order = this.state.currentOrder;
        const customer = this.state.currentCustomer;

        // Build code-style order
        const itemsCode = order.items.map((item, i) => {
            const nameClass = item.isTypo ? 'error' : 'string';
            return `  <span class="variable">item${i + 1}</span>: <span class="${nameClass}">"${item.displayName}"</span>, <span class="comment">// ${formatRupiah(item.price)}</span>`;
        }).join('\n');

        const promoSection = order.promoCode ? `
            <div class="promo-code">
                PROMO: <strong>${order.promoCode}</strong>
            </div>
        ` : '';

        this.elements.orderArea.innerHTML = `
            <div class="order-document">
                <div class="order-header">
                    <div class="order-logo">☕ AZERA CODE CAFÉ</div>
                    <div class="order-title">SLIP PESANAN</div>
                    <div class="order-number">${order.orderNumber}</div>
                </div>
                
                <div class="order-code">
<span class="keyword">const</span> <span class="function">pesanan</span> = {
${itemsCode}
};
<span class="comment">// Pelanggan: ${customer.name}</span>
<span class="comment">// Tier: ${customer.tier}</span>
                </div>

                <div class="order-details">
                    <div class="order-row">
                        <span class="order-label">Subtotal</span>
                        <span class="order-value">${formatRupiah(order.subtotal)}</span>
                    </div>
                    <div class="order-row">
                        <span class="order-label">Diskon</span>
                        <span class="order-value">-${formatRupiah(order.discount)}</span>
                    </div>
                    <div class="order-row">
                        <span class="order-label">Kafein</span>
                        <span class="order-value">${order.caffeine} unit</span>
                    </div>
                </div>

                <div class="order-total">
                    <span>TOTAL</span>
                    <span>${formatRupiah(order.total)}</span>
                </div>

                ${promoSection}
            </div>
        `;
    }

    updateRulebook(tab) {
        let content = '';

        if (tab === 'rules') {
            content = `
                <div class="rulebook-section">
                    <div class="rulebook-section-title">📋 Aturan Aktif (Hari ${this.state.day})</div>
                    ${this.state.activeRules.map(rule => `
                        <div class="rulebook-item">${rule.text}</div>
                    `).join('')}
                </div>
            `;
        } else if (tab === 'menu') {
            content = `
                <div class="rulebook-section">
                    <div class="rulebook-section-title">☕ Menu Kopi</div>
                    ${GAME_DATA.menu.map(item => `
                        <div class="menu-item">
                            <span class="menu-item-name">${item.name}</span>
                            <span class="menu-item-price">${formatRupiah(item.price)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (tab === 'members') {
            content = `
                <div class="rulebook-section">
                    <div class="rulebook-section-title">🎫 Tier Membership</div>
                    ${Object.entries(GAME_DATA.tiers).map(([key, tier]) => `
                        <div class="member-tier" style="border-left-color: ${tier.color}">
                            <div class="member-tier-name">${tier.name}</div>
                            <div class="member-tier-perks">
                                Diskon: ${tier.discount}% • Maks Kafein: ${tier.maxCaffeine}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        this.elements.rulebookContent.innerHTML = content;
    }

    showInspection() {
        const order = this.state.currentOrder;
        const customer = this.state.currentCustomer;

        // Document side
        this.elements.inspectionDocument.innerHTML = `
            <h3 style="color: var(--accent-primary); margin-bottom: var(--space-md); font-size: 0.9rem;">📋 Dokumen Pesanan</h3>
            <div style="margin-bottom: var(--space-sm); font-size: 0.85rem;">
                <strong>Pelanggan:</strong> ${customer.name}
            </div>
            <div style="margin-bottom: var(--space-sm); font-size: 0.85rem;">
                <strong>Role:</strong> ${customer.role.name}
            </div>
            <div style="margin-bottom: var(--space-sm); font-size: 0.85rem;">
                <strong>Tier:</strong> ${customer.tier}
            </div>
            <div style="margin-bottom: var(--space-sm); font-size: 0.85rem;">
                <strong>Budget:</strong> ${formatRupiah(customer.budget)}
            </div>
            <div style="margin-bottom: var(--space-md); font-size: 0.85rem;">
                <strong>Kafein Saat Ini:</strong> ${customer.caffeine}
            </div>
            <hr style="border-color: var(--bg-card); margin: var(--space-md) 0;">
            <div style="margin-bottom: var(--space-sm); font-size: 0.85rem;">
                <strong>Item Pesanan:</strong>
            </div>
            ${order.items.map(item => `
                <div style="padding: var(--space-xs) 0; font-size: 0.8rem; ${item.isTypo ? 'color: var(--accent-error);' : ''}">
                    • ${item.displayName} - ${formatRupiah(item.price)}
                </div>
            `).join('')}
            <div style="margin-top: var(--space-md); font-size: 0.85rem;">
                <strong>Total:</strong> ${formatRupiah(order.total)}
            </div>
            ${order.promoCode ? `<div style="font-size: 0.85rem;"><strong>Promo:</strong> ${order.promoCode}</div>` : ''}
        `;

        // Reference side
        const tierInfo = GAME_DATA.tiers[customer.tier];
        this.elements.inspectionReference.innerHTML = `
            <h3 style="color: var(--accent-primary); margin-bottom: var(--space-md); font-size: 0.9rem;">📖 Referensi</h3>
            <div style="margin-bottom: var(--space-md); font-size: 0.85rem;">
                <strong>Batas ${tierInfo.name}:</strong>
                <div style="font-size: 0.8rem;">• Maks Kafein: ${tierInfo.maxCaffeine} unit</div>
                <div style="font-size: 0.8rem;">• Diskon: ${tierInfo.discount}%</div>
            </div>
            <div style="margin-bottom: var(--space-md); font-size: 0.85rem;">
                <strong>Menu Valid:</strong>
                ${GAME_DATA.menu.slice(0, 6).map(item => `
                    <div style="font-size: 0.8rem;">• ${item.name}</div>
                `).join('')}
            </div>
            ${order.promoCode ? `
                <div style="font-size: 0.85rem;">
                    <strong>Info Kode Promo:</strong>
                    <div style="font-size: 0.8rem;">Kode: ${order.promoCode}</div>
                    <div style="font-size: 0.8rem;">Status: ${order.promoValid ? '✓ Valid' : '✗ Tidak Valid'}</div>
                </div>
            ` : ''}
        `;

        this.elements.inspectionModal.classList.add('show');
    }

    hideInspection() {
        this.elements.inspectionModal.classList.remove('show');
    }

    // ========================================
    // HELPERS
    // ========================================

    updateHUD() {
        const settings = this.getDaySettings();

        this.elements.currentDay.textContent = this.state.day;
        this.elements.currentMoney.textContent = formatRupiah(this.state.money);
        this.elements.violations.textContent = `${this.state.violations}/${settings.maxViolations}`;
    }

    toggleActionButtons(enabled) {
        this.elements.approveBtn.disabled = !enabled;
        this.elements.rejectBtn.disabled = !enabled;
        this.elements.inspectBtn.disabled = !enabled;
        this.elements.reasonSelector.style.display = 'none';
    }

    getDaySettings() {
        const day = this.state.day;
        if (day <= GAME_DATA.daySettings.length) {
            return GAME_DATA.daySettings[day - 1];
        }
        // Scale for later days
        const lastSettings = GAME_DATA.daySettings[GAME_DATA.daySettings.length - 1];
        return {
            target: lastSettings.target + (day - 7) * 150000,
            customers: Math.min(lastSettings.customers + (day - 7) * 2, 30),
            maxViolations: 1
        };
    }

    calculateEarnings() {
        return this.state.currentOrder.total;
    }

    trackCaffeine() {
        const customer = this.state.currentCustomer;
        const order = this.state.currentOrder;

        const currentCaffeine = this.caffeineTracker.get(customer.id) || 0;
        this.caffeineTracker.set(customer.id, currentCaffeine + order.caffeine);
    }

    getDateString() {
        const baseDate = new Date(2026, 0, 10); // 10 Januari 2026
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + this.state.day - 1);

        return `${GAME_DATA.dayNames[currentDate.getDay()]}, ${currentDate.getDate()} ${GAME_DATA.monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new AzeraGame();
});
