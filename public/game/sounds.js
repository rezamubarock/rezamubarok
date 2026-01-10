// ========================================
// AZERA ENJOY - Sound Manager
// Menggunakan Web Audio API (no external files!)
// ========================================

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.3;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API tidak didukung');
            this.enabled = false;
        }
    }

    // Resume audio context (required after user interaction)
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    // ========================================
    // SOUND GENERATORS
    // ========================================

    // Play a beep with specific frequency and duration
    playTone(frequency, duration, type = 'sine', volumeMultiplier = 1) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        const now = this.audioContext.currentTime;
        const vol = this.volume * volumeMultiplier;

        // Attack
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(vol, now + 0.01);

        // Decay
        gainNode.gain.exponentialRampToValueAtTime(vol * 0.5, now + duration * 0.3);

        // Release
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    // Play noise burst (for impact sounds)
    playNoise(duration, volumeMultiplier = 1) {
        if (!this.enabled || !this.audioContext) return;

        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        source.buffer = buffer;
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        const now = this.audioContext.currentTime;
        const vol = this.volume * volumeMultiplier * 0.3;

        gainNode.gain.setValueAtTime(vol, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        source.start(now);
    }

    // ========================================
    // GAME SOUND EFFECTS
    // ========================================

    // Button click
    click() {
        this.playTone(800, 0.05, 'sine', 0.5);
    }

    // Customer arrives (doorbell)
    customerArrive() {
        this.playTone(523, 0.15, 'sine', 0.7); // C5
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.7), 100); // E5
        setTimeout(() => this.playTone(784, 0.2, 'sine', 0.7), 200); // G5
    }

    // Order stamp - approved
    stampApprove() {
        this.playNoise(0.1, 0.8);
        setTimeout(() => this.playTone(523, 0.1, 'square', 0.5), 50);
        setTimeout(() => this.playTone(659, 0.1, 'square', 0.5), 100);
        setTimeout(() => this.playTone(784, 0.15, 'square', 0.5), 150);
    }

    // Order stamp - rejected
    stampReject() {
        this.playNoise(0.15, 1);
        setTimeout(() => this.playTone(300, 0.1, 'square', 0.6), 50);
        setTimeout(() => this.playTone(250, 0.15, 'square', 0.6), 120);
    }

    // Correct decision
    correct() {
        this.playTone(440, 0.1, 'sine', 0.6); // A4
        setTimeout(() => this.playTone(554, 0.1, 'sine', 0.6), 80); // C#5
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.7), 160); // E5
        setTimeout(() => this.playTone(880, 0.25, 'sine', 0.8), 240); // A5
    }

    // Wrong decision (violation)
    violation() {
        this.playTone(200, 0.15, 'sawtooth', 0.5);
        setTimeout(() => this.playTone(150, 0.15, 'sawtooth', 0.5), 150);
        setTimeout(() => this.playTone(100, 0.3, 'sawtooth', 0.6), 300);
    }

    // Money sound (ka-ching!)
    money() {
        this.playTone(1200, 0.05, 'sine', 0.4);
        setTimeout(() => this.playTone(1500, 0.05, 'sine', 0.4), 50);
        setTimeout(() => this.playTone(1800, 0.1, 'sine', 0.5), 100);
    }

    // Day start
    dayStart() {
        this.playTone(262, 0.15, 'sine', 0.5); // C4
        setTimeout(() => this.playTone(330, 0.15, 'sine', 0.5), 150); // E4
        setTimeout(() => this.playTone(392, 0.15, 'sine', 0.5), 300); // G4
        setTimeout(() => this.playTone(523, 0.3, 'sine', 0.6), 450); // C5
    }

    // Day end
    dayEnd() {
        this.playTone(523, 0.2, 'sine', 0.5); // C5
        setTimeout(() => this.playTone(440, 0.2, 'sine', 0.5), 200); // A4
        setTimeout(() => this.playTone(349, 0.2, 'sine', 0.5), 400); // F4
        setTimeout(() => this.playTone(262, 0.4, 'sine', 0.6), 600); // C4
    }

    // Game over
    gameOver() {
        this.playTone(440, 0.3, 'sawtooth', 0.4);
        setTimeout(() => this.playTone(370, 0.3, 'sawtooth', 0.4), 300);
        setTimeout(() => this.playTone(311, 0.3, 'sawtooth', 0.4), 600);
        setTimeout(() => this.playTone(262, 0.5, 'sawtooth', 0.5), 900);
    }

    // Tab switch
    tabSwitch() {
        this.playTone(600, 0.03, 'sine', 0.3);
    }

    // Hover (subtle)
    hover() {
        this.playTone(1000, 0.02, 'sine', 0.15);
    }

    // Paper slide
    paperSlide() {
        this.playNoise(0.2, 0.3);
    }

    // Coffee pour (ambient)
    coffeePour() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.playNoise(0.1, 0.2);
            }, i * 100);
        }
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}
