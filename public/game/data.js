// ========================================
// AZERA ENJOY - Data Game (Bahasa Indonesia)
// ========================================

const GAME_DATA = {
    // Menu Kopi
    menu: [
        { id: 'espresso', name: 'Espresso', price: 15000, caffeine: 2, minTier: 'free' },
        { id: 'americano', name: 'Americano', price: 18000, caffeine: 2, minTier: 'free' },
        { id: 'latte', name: 'Latte', price: 22000, caffeine: 1, minTier: 'free' },
        { id: 'cappuccino', name: 'Cappuccino', price: 22000, caffeine: 1, minTier: 'free' },
        { id: 'mocha', name: 'Mocha', price: 25000, caffeine: 2, minTier: 'free' },
        { id: 'cold_brew', name: 'Cold Brew', price: 25000, caffeine: 3, minTier: 'pro' },
        { id: 'nitro', name: 'Nitro Cold Brew', price: 32000, caffeine: 4, minTier: 'pro' },
        { id: 'affogato', name: 'Affogato', price: 35000, caffeine: 2, minTier: 'pro' },
        { id: 'turkish', name: 'Kopi Turki', price: 28000, caffeine: 3, minTier: 'enterprise' },
        { id: 'bulletproof', name: 'Bulletproof Coffee', price: 40000, caffeine: 5, minTier: 'enterprise' },
        { id: 'debug_brew', name: 'Debug Brew ☕️', price: 50000, caffeine: 6, minTier: 'enterprise' }
    ],

    // Tier Membership
    tiers: {
        free: { name: 'Free Tier', discount: 0, maxCaffeine: 6, color: '#888' },
        pro: { name: 'Pro Tier', discount: 10, maxCaffeine: 10, color: '#60a5fa' },
        enterprise: { name: 'Enterprise', discount: 20, maxCaffeine: 15, color: '#a78bfa' }
    },

    // Role Pelanggan
    roles: [
        { id: 'intern', name: 'Anak Magang', emoji: '🐣', typoChance: 0.4, budgetRange: [25000, 50000] },
        { id: 'junior', name: 'Junior Dev', emoji: '👶', typoChance: 0.3, budgetRange: [40000, 80000] },
        { id: 'midlevel', name: 'Mid-Level Dev', emoji: '👨‍💻', typoChance: 0.15, budgetRange: [60000, 120000] },
        { id: 'senior', name: 'Senior Dev', emoji: '👴', typoChance: 0.05, budgetRange: [80000, 200000] },
        { id: 'techlead', name: 'Tech Lead', emoji: '🎖️', typoChance: 0.02, budgetRange: [100000, 250000] },
        { id: 'devops', name: 'DevOps Engineer', emoji: '🔧', typoChance: 0.1, budgetRange: [80000, 180000] },
        { id: 'qa', name: 'QA Engineer', emoji: '🔍', typoChance: 0.01, budgetRange: [60000, 120000] },
        { id: 'pm', name: 'Product Manager', emoji: '📊', typoChance: 0.25, budgetRange: [80000, 150000] },
        { id: 'designer', name: 'UI/UX Designer', emoji: '🎨', typoChance: 0.2, budgetRange: [60000, 130000] },
        { id: 'freelancer', name: 'Freelancer', emoji: '💼', typoChance: 0.2, budgetRange: [30000, 300000] }
    ],

    // Nama Depan
    firstNames: [
        'Adi', 'Budi', 'Citra', 'Dimas', 'Eka', 'Fajar', 'Gilang', 'Hendra',
        'Ivan', 'Joko', 'Kevin', 'Lukman', 'Maya', 'Naufal', 'Oscar', 'Putra',
        'Reza', 'Sinta', 'Tono', 'Umar', 'Vina', 'Wawan', 'Yudi', 'Zahra',
        'Agus', 'Bayu', 'Dewi', 'Edi', 'Fitri', 'Gunawan', 'Haris', 'Indra'
    ],

    // Nama Belakang
    lastNames: [
        'Pratama', 'Wijaya', 'Kusuma', 'Saputra', 'Hidayat', 'Santoso', 'Nugroho', 'Putra',
        'Permana', 'Suryadi', 'Hartono', 'Setiawan', 'Wibowo', 'Pranoto', 'Susanto', 'Siregar',
        'Hakim', 'Ramadhan', 'Firmansyah', 'Aditya', 'Cahyono', 'Kurniawan', 'Utomo', 'Perdana'
    ],

    // Dialog
    dialogues: {
        normal: [
            "Butuh kopi buat compile pikiran gue.",
            "Kode gue gak jalan tanpa kafein.",
            "Satu kopi dulu, baru fix bug itu.",
            "Udah 3 jam sejak kopi terakhir.",
            "Deadline besok. Kopi, dong.",
            "console.log('butuh kopi');",
            "// TODO: minum kopi dulu",
            "Otak gue butuh refresh. Kopi refresh.",
            "Gabisa debug kalo gelas kosong.",
            "Kopi: minuman energi pertama."
        ],
        burnout: [
            "*nguap* Udah coding 20 jam...",
            "Belum tidur sejak sprint mulai...",
            "*mata hampir merem*",
            "Mungkin... satu gelas lagi...",
            "Kayaknya gue liat bug merayap di layar...",
            "Ini hari Senin apa Jumat? Gue bingung..."
        ],
        highCaffeine: [
            "*tangan gemetar* Satu espresso lagi...",
            "Gue bisa rasain detak jantung di bola mata!",
            "*ngomong super cepat* Kopi kopi kopi!",
            "Tidur itu buat yang gak ada deadline!",
            "*kedutan* Kode... dia ngomong sama gue sekarang..."
        ],
        rejected: [
            "Apa? Gue BUTUH kopi ini!",
            "Ini diskriminasi terhadap developer!",
            "Produktivitas gue bakal crash!",
            "404: Kopi Tidak Ditemukan... di tangan gue.",
            "return kesedihan;",
            "Gue bikin kopi sendiri aja deh!"
        ],
        approved: [
            "Makasih! Waktunya deploy fitur!",
            "Mantap! Sekarang bisa fix regex itu.",
            "Penyelamat hidup nih! *kasih tips banyak*",
            "Akhirnya! Mari mulai coding!",
            "console.log('kebahagiaan');",
            "Ini yang gue butuhin!"
        ]
    },

    // Kode Promo
    promoCodes: {
        'DEBUGME': { discount: 15, validDays: [1, 2, 3, 4, 5], minOrder: 25000 },
        'SHIPIT': { discount: 20, validDays: [5], minOrder: 50000 },
        'HOTFIX': { discount: 10, validDays: [1, 2, 3, 4, 5], minOrder: 0 },
        'SPRINT': { discount: 25, validDays: [1], minOrder: 60000 },
        'DEVOPS': { discount: 30, validDays: [3], minOrder: 80000 },
        'COMPILE': { discount: 5, validDays: [1, 2, 3, 4, 5], minOrder: 0 },
        'REFACT0R': { discount: 0, validDays: [], minOrder: 0 }, // Invalid - typo
        'NGOPI': { discount: 15, validDays: [2, 4], minOrder: 35000 }
    },

    // Typo umum (untuk mendeteksi bug dalam pesanan)
    typos: {
        'espresso': ['expresso', 'espreso', 'espresoo', 'esspresso'],
        'americano': ['americno', 'amerciano', 'americanoo', 'amaricano'],
        'latte': ['latee', 'lattee', 'late', 'ltte'],
        'cappuccino': ['capuccino', 'cappucino', 'cappucinno', 'capucino'],
        'mocha': ['mocah', 'moca', 'mokka', 'moha'],
        'cold_brew': ['cold brew', 'coldbrew', 'cold_bew', 'col_brew'],
        'nitro': ['nitrio', 'nito', 'nitrro', 'nitr0'],
        'affogato': ['afogato', 'affogatto', 'affagato', 'afogatto'],
        'turkish': ['turksh', 'turkissh', 'turksih', 'turiksh'],
        'bulletproof': ['bulletprof', 'bullerproof', 'bulletpoof', 'bulletprof'],
        'debug_brew': ['debug brew', 'debub_brew', 'debug_bew', 'debg_brew']
    },

    // Aturan Harian (kumulatif - setiap hari menambahkan aturan baru)
    dailyRules: [
        // Hari 1 - Aturan dasar
        [
            { icon: '☕', text: 'Verifikasi <strong>pesanan kopi</strong> sesuai menu kami', type: 'base' },
            { icon: '💰', text: 'Cek apakah pelanggan punya <strong>budget cukup</strong>', type: 'base' },
            { icon: '🎫', text: 'Verifikasi <strong>tier membership</strong> mengizinkan pesanan', type: 'base' }
        ],
        // Hari 2 - Batas kafein
        [
            { icon: '⚡', text: 'BARU: Cek <strong>batas kafein harian</strong>. Free: 6, Pro: 10, Enterprise: 15', type: 'new' }
        ],
        // Hari 3 - Kode promo
        [
            { icon: '🏷️', text: 'BARU: Validasi <strong>kode promo</strong>. Cek hari berlaku dan min order!', type: 'new' }
        ],
        // Hari 4 - Deteksi burnout
        [
            { icon: '😴', text: 'BARU: <strong>Pelanggan burnout</strong> harus DITOLAK. Tidak boleh kafein lagi!', type: 'new' }
        ],
        // Hari 5 - Deteksi typo
        [
            { icon: '🐛', text: 'BARU: Deteksi <strong>typo/bug</strong> di nama pesanan. Tolak item tidak valid!', type: 'new' }
        ],
        // Hari 6 - Spesial Jumat
        [
            { icon: '🎉', text: 'BARU: <strong>Spesial Jumat</strong>! Semua member Enterprise dapat diskon ekstra 10%', type: 'new' }
        ],
        // Hari 7 - Verifikasi combo
        [
            { icon: '📦', text: 'BARU: <strong>Pesanan combo</strong> maksimal 3 item per order', type: 'new' }
        ]
    ],

    // Alasan Penolakan
    rejectionReasons: [
        { id: 'insufficient_budget', text: 'Budget Tidak Cukup' },
        { id: 'invalid_tier', text: 'Tier Membership Tidak Valid' },
        { id: 'caffeine_limit', text: 'Batas Kafein Terlampaui' },
        { id: 'invalid_promo', text: 'Kode Promo Tidak Valid' },
        { id: 'burnout', text: 'Pelanggan Burnout Terdeteksi' },
        { id: 'typo_bug', text: 'Pesanan Mengandung Bug/Typo' },
        { id: 'invalid_item', text: 'Item Tidak Ada di Menu' },
        { id: 'too_many_items', text: 'Terlalu Banyak Item' }
    ],

    // Target dan pengaturan harian
    daySettings: [
        { target: 150000, customers: 6, maxViolations: 3 },   // Hari 1
        { target: 250000, customers: 8, maxViolations: 3 },   // Hari 2
        { target: 350000, customers: 10, maxViolations: 3 },  // Hari 3
        { target: 450000, customers: 12, maxViolations: 2 },  // Hari 4
        { target: 600000, customers: 14, maxViolations: 2 },  // Hari 5
        { target: 750000, customers: 16, maxViolations: 2 },  // Hari 6
        { target: 900000, customers: 18, maxViolations: 1 }   // Hari 7+
    ],

    // Nama hari dalam Bahasa Indonesia
    dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
};

// Helper untuk format Rupiah
function formatRupiah(amount) {
    return 'Rp' + amount.toLocaleString('id-ID');
}

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_DATA;
}
