#!/usr/bin/env python3
"""Build single-file HTML for Azera Enjoy game"""

import os

os.chdir('/Users/rezamubarok/Documents/2026/rezamubarok.com')

# Read all source files
with open('game/style.css', 'r', encoding='utf-8') as f:
    css = f.read()
with open('game/sounds.js', 'r', encoding='utf-8') as f:
    sounds_js = f.read()
with open('game/data.js', 'r', encoding='utf-8') as f:
    data_js = f.read()
with open('game/game.js', 'r', encoding='utf-8') as f:
    game_js = f.read()

html_template = '''<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#1a1714">
    <title>Azera Enjoy - Kedai Kopi untuk Programmer</title>
    <meta name="description" content="Game terinspirasi Papers Please dimana kamu mengelola kedai kopi untuk programmer.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
{CSS}
    </style>
</head>
<body>
    <!-- INTRO SCREEN -->
    <div id="intro-screen" class="screen active">
        <div class="intro-content">
            <div class="logo-container">
                <div class="coffee-steam"><span></span><span></span><span></span></div>
                <div class="logo-icon">☕</div>
            </div>
            <h1 class="game-title">AZERA ENJOY</h1>
            <p class="game-subtitle">Kedai Kopi untuk Programmer</p>
            <div class="intro-description">
                <p>Selamat datang di <strong>Azera Code Café</strong>.</p>
                <p>Kamu adalah barista. Programmer akan datang dengan pesanan kopi mereka.</p>
                <p>Tugasmu: <em>Verifikasi setiap pesanan. Tangkap bug-nya. Sajikan kode-nya.</em></p>
            </div>
            <button id="start-btn" class="btn-primary">
                <span class="btn-icon">▶</span>
                <span>MULAI SHIFT</span>
            </button>
            <div class="intro-footer">
                <span class="version">v1.0.0</span>
                <button id="sound-toggle" class="sound-btn" title="Toggle Sound">🔊</button>
                <span class="credits">Terinspirasi dari Papers, Please</span>
            </div>
        </div>
    </div>

    <!-- DAY BRIEFING SCREEN -->
    <div id="briefing-screen" class="screen">
        <div class="briefing-content">
            <div class="briefing-header">
                <div class="day-badge">HARI <span id="briefing-day">1</span></div>
                <div class="date-display" id="briefing-date">Senin, 10 Januari 2026</div>
            </div>
            <div class="briefing-scroll">
                <div class="briefing-title">☕ BRIEFING HARIAN</div>
                <div class="rules-container" id="daily-rules"></div>
                <div class="targets-container">
                    <div class="target-item">
                        <span class="target-label">Target Hari Ini:</span>
                        <span class="target-value" id="target-orders">Rp50.000</span>
                    </div>
                    <div class="target-item">
                        <span class="target-label">Maks Pelanggaran:</span>
                        <span class="target-value" id="max-violations">3</span>
                    </div>
                </div>
            </div>
            <button id="start-day-btn" class="btn-primary"><span>BUKA KEDAI</span></button>
        </div>
    </div>

    <!-- MAIN GAME SCREEN -->
    <div id="game-screen" class="screen">
        <div class="game-hud">
            <div class="hud-left">
                <div class="hud-item day-display">
                    <span class="hud-label">HARI</span>
                    <span class="hud-value" id="current-day">1</span>
                </div>
                <div class="hud-item time-display">
                    <span class="hud-label">JAM</span>
                    <span class="hud-value" id="current-time">09:00</span>
                </div>
            </div>
            <div class="hud-center">
                <div class="hud-item money-display">
                    <span class="hud-label">PENDAPATAN</span>
                    <span class="hud-value money" id="current-money">Rp0</span>
                </div>
            </div>
            <div class="hud-right">
                <div class="hud-item violations-display">
                    <span class="hud-label">PELANGGARAN</span>
                    <span class="hud-value violations" id="violations">0/3</span>
                </div>
            </div>
        </div>

        <div class="mobile-tabs">
            <button class="mobile-tab active" data-panel="customer">👤 Pelanggan</button>
            <button class="mobile-tab" data-panel="order">📋 Pesanan</button>
            <button class="mobile-tab" data-panel="rules">📖 Aturan</button>
        </div>

        <div class="game-area">
            <div class="panel customer-panel active" id="panel-customer">
                <div class="panel-header"><span class="panel-title">👤 PELANGGAN</span></div>
                <div class="customer-area" id="customer-area">
                    <div class="empty-state">
                        <span class="empty-icon">🚪</span>
                        <p>Menunggu pelanggan...</p>
                        <button id="next-customer-btn" class="btn-secondary">PELANGGAN BERIKUTNYA</button>
                    </div>
                </div>
            </div>

            <div class="panel order-panel" id="panel-order">
                <div class="panel-header">
                    <span class="panel-title">📋 SLIP PESANAN</span>
                    <button id="inspect-btn" class="btn-small" disabled>🔍 PERIKSA</button>
                </div>
                <div class="order-area" id="order-area">
                    <div class="empty-state">
                        <span class="empty-icon">📄</span>
                        <p>Belum ada pesanan</p>
                    </div>
                </div>
            </div>

            <div class="panel rules-panel" id="panel-rules">
                <div class="panel-header"><span class="panel-title">📖 BUKU ATURAN</span></div>
                <div class="rules-area" id="rules-area">
                    <div class="rulebook-tabs">
                        <button class="tab-btn active" data-tab="rules">Aturan</button>
                        <button class="tab-btn" data-tab="menu">Menu</button>
                        <button class="tab-btn" data-tab="members">Member</button>
                    </div>
                    <div class="rulebook-content" id="rulebook-content"></div>
                </div>
            </div>
        </div>

        <div class="action-panel">
            <div class="action-buttons">
                <button id="reject-btn" class="btn-action btn-reject" disabled>
                    <span class="action-icon">❌</span>
                    <span class="action-label">TOLAK</span>
                </button>
                <div class="stamp-container" id="stamp-container">
                    <div class="stamp stamp-approved" id="stamp-approved">✓ DITERIMA</div>
                    <div class="stamp stamp-rejected" id="stamp-rejected">✗ DITOLAK</div>
                </div>
                <button id="approve-btn" class="btn-action btn-approve" disabled>
                    <span class="action-icon">✓</span>
                    <span class="action-label">TERIMA</span>
                </button>
            </div>
            <div class="reason-selector" id="reason-selector" style="display: none;">
                <div class="reason-title">Pilih alasan penolakan:</div>
                <div class="reason-buttons" id="reason-buttons"></div>
                <button id="cancel-reject-btn" class="btn-cancel">Batal</button>
            </div>
        </div>
    </div>

    <!-- RESULT POPUP -->
    <div id="result-popup" class="popup">
        <div class="popup-content result-content">
            <div class="result-icon" id="result-icon">✓</div>
            <div class="result-title" id="result-title">BENAR!</div>
            <div class="result-message" id="result-message">Pesanan diproses dengan benar.</div>
            <div class="result-earnings" id="result-earnings">+Rp5.000</div>
            <button id="continue-btn" class="btn-primary">LANJUT</button>
        </div>
    </div>

    <!-- DAY END SCREEN -->
    <div id="dayend-screen" class="screen">
        <div class="dayend-content">
            <div class="dayend-header">
                <div class="dayend-title">AKHIR HARI <span id="end-day">1</span></div>
            </div>
            <div class="dayend-report">
                <div class="report-section">
                    <div class="report-title">📊 LAPORAN HARIAN</div>
                    <div class="report-grid">
                        <div class="report-item">
                            <span class="report-label">Pelanggan Dilayani</span>
                            <span class="report-value" id="report-customers">0</span>
                        </div>
                        <div class="report-item">
                            <span class="report-label">Pesanan Diterima</span>
                            <span class="report-value" id="report-approved">0</span>
                        </div>
                        <div class="report-item">
                            <span class="report-label">Pesanan Ditolak</span>
                            <span class="report-value" id="report-rejected">0</span>
                        </div>
                        <div class="report-item">
                            <span class="report-label">Pelanggaran</span>
                            <span class="report-value violations" id="report-violations">0</span>
                        </div>
                    </div>
                </div>
                <div class="report-section finances">
                    <div class="report-title">💰 KEUANGAN</div>
                    <div class="finance-breakdown">
                        <div class="finance-row">
                            <span>Pendapatan Hari Ini</span>
                            <span class="positive" id="finance-earnings">+Rp0</span>
                        </div>
                        <div class="finance-row">
                            <span>Tips Diterima</span>
                            <span class="positive" id="finance-tips">+Rp0</span>
                        </div>
                        <div class="finance-row">
                            <span>Denda Pelanggaran</span>
                            <span class="negative" id="finance-penalties">-Rp0</span>
                        </div>
                        <div class="finance-row total-row">
                            <span>TOTAL BERSIH</span>
                            <span id="finance-total">Rp0</span>
                        </div>
                    </div>
                </div>
                <div class="report-section status-section">
                    <div class="status-badge" id="day-status"></div>
                </div>
            </div>
            <button id="next-day-btn" class="btn-primary"><span>HARI BERIKUTNYA</span></button>
        </div>
    </div>

    <!-- GAME OVER SCREEN -->
    <div id="gameover-screen" class="screen">
        <div class="gameover-content">
            <div class="gameover-icon">💀</div>
            <h1 class="gameover-title">DIPECAT</h1>
            <p class="gameover-message" id="gameover-message">Kamu telah dipecat dari Azera Code Café.</p>
            <div class="gameover-stats">
                <div class="stat-item">
                    <span class="stat-label">Hari Bertahan</span>
                    <span class="stat-value" id="final-days">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Pendapatan</span>
                    <span class="stat-value" id="final-money">Rp0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Pelanggan Dilayani</span>
                    <span class="stat-value" id="final-customers">0</span>
                </div>
            </div>
            <button id="restart-btn" class="btn-primary">COBA LAGI</button>
        </div>
    </div>

    <!-- Inspection Modal -->
    <div id="inspection-modal" class="modal">
        <div class="modal-content inspection-content">
            <div class="modal-header">
                <span class="modal-title">🔍 MODE INSPEKSI</span>
                <button class="modal-close" id="close-inspection">&times;</button>
            </div>
            <div class="inspection-body">
                <div class="inspection-document" id="inspection-document"></div>
                <div class="inspection-reference" id="inspection-reference"></div>
            </div>
            <div class="inspection-notes">
                <div class="notes-title">📝 Ketidaksesuaian Ditemukan:</div>
                <div class="notes-list" id="discrepancies-list">
                    <p class="no-discrepancies">Klik item yang mencurigakan untuk menyorot</p>
                </div>
            </div>
        </div>
    </div>

    <script>
{SOUNDS_JS}
    </script>
    <script>
{DATA_JS}
    </script>
    <script>
{GAME_JS}
    </script>
</body>
</html>'''

# Build final HTML
final_html = html_template.replace('{CSS}', css)
final_html = final_html.replace('{SOUNDS_JS}', sounds_js)
final_html = final_html.replace('{DATA_JS}', data_js)
final_html = final_html.replace('{GAME_JS}', game_js)

# Write output
with open('game/index.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print(f"Done! Created game/index.html ({len(final_html)} bytes)")
