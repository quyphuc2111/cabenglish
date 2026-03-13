/**
 * Audio Utility Functions
 * Provides text-to-speech functionality using Web Speech API as fallback
 */

// Check if Web Speech API is supported
export const isSpeechSynthesisSupported = (): boolean => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

/**
 * Text-to-Speech using Web Speech API
 * @param text - The text to speak
 * @param lang - Language code (default: 'en-US')
 * @param rate - Speech rate (0.1 to 10, default: 1)
 * @param pitch - Speech pitch (0 to 2, default: 1)
 */
export const speakText = (
    text: string,
    lang: string = 'en-US',
    rate: number = 1,
    pitch: number = 1
): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!isSpeechSynthesisSupported()) {
            reject(new Error('Speech Synthesis API is not supported in this browser'));
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(event);

        window.speechSynthesis.speak(utterance);
    });
};

/**
 * Play audio from URL with fallback to Text-to-Speech
 * @param audioUrl - URL of the audio file
 * @param fallbackText - Text to speak if audio URL fails
 * @param lang - Language for TTS fallback
 */
export const playAudioWithFallback = async (
    audioUrl: string,
    fallbackText: string,
    lang: string = 'en-US'
): Promise<void> => {
    try {
        // Try to play from URL first
        const audio = new Audio(audioUrl);

        return new Promise((resolve, reject) => {
            audio.onended = () => resolve();
            audio.onerror = async () => {
                // Fallback to TTS if audio URL fails
                console.warn(`Audio URL failed, using TTS for: ${fallbackText}`);
                try {
                    await speakText(fallbackText, lang);
                    resolve();
                } catch (ttsError) {
                    reject(ttsError);
                }
            };

            audio.play().catch(async (playError) => {
                // Fallback to TTS if play fails
                console.warn(`Audio play failed, using TTS for: ${fallbackText}`);
                try {
                    await speakText(fallbackText, lang);
                    resolve();
                } catch (ttsError) {
                    reject(ttsError);
                }
            });
        });
    } catch (error) {
        // Fallback to TTS if Audio constructor fails
        console.warn(`Audio creation failed, using TTS for: ${fallbackText}`);
        return speakText(fallbackText, lang);
    }
};

/**
 * Get available voices for the given language
 * @param lang - Language code (e.g., 'en-US', 'vi-VN')
 */
export const getAvailableVoices = (lang?: string): SpeechSynthesisVoice[] => {
    if (!isSpeechSynthesisSupported()) {
        return [];
    }

    const voices = window.speechSynthesis.getVoices();

    if (lang) {
        return voices.filter(voice => voice.lang.startsWith(lang.split('-')[0]));
    }

    return voices;
};

/**
 * Preload audio file
 * @param audioUrl - URL of the audio file to preload
 */
export const preloadAudio = (audioUrl: string): Promise<HTMLAudioElement> => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.preload = 'auto';

        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = () => reject(new Error(`Failed to preload audio: ${audioUrl}`));

        audio.src = audioUrl;
    });
};

/**
 * Batch preload multiple audio files
 * @param audioUrls - Array of audio URLs to preload
 */
export const preloadMultipleAudios = async (
    audioUrls: string[]
): Promise<Map<string, HTMLAudioElement>> => {
    const audioMap = new Map<string, HTMLAudioElement>();

    const promises = audioUrls.map(async (url) => {
        try {
            const audio = await preloadAudio(url);
            audioMap.set(url, audio);
        } catch (error) {
            console.warn(`Failed to preload audio: ${url}`, error);
        }
    });

    await Promise.all(promises);
    return audioMap;
};

/**
 * Stop all ongoing speech
 */
export const stopSpeech = (): void => {
    if (isSpeechSynthesisSupported()) {
        window.speechSynthesis.cancel();
    }
};

/**
 * Generate audio URL using Google Translate TTS API (alternative fallback)
 * Note: This is an unofficial API and may have rate limits
 * @param text - Text to convert to speech
 * @param lang - Language code (default: 'en')
 */
export const getGoogleTTSUrl = (text: string, lang: string = 'en'): string => {
    const encodedText = encodeURIComponent(text);
    return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodedText}`;
};

/**
 * Play vocabulary item audio with smart fallback
 * @param word - The word to pronounce
 * @param audioUrl - Primary audio URL
 */
export const playVocabularyAudio = async (
    word: string,
    audioUrl: string
): Promise<void> => {
    try {
        // Try primary audio URL
        await playAudioWithFallback(audioUrl, word, 'en-US');
    } catch (error) {
        console.error('All audio playback methods failed:', error);
        throw error;
    }
};

/**
 * Create an audio player hook-ready object
 */
export class AudioPlayer {
    private currentAudio: HTMLAudioElement | null = null;
    private isSpeaking: boolean = false;

    async play(audioUrl: string, fallbackText: string, lang: string = 'en-US'): Promise<void> {
        this.stop();

        try {
            this.currentAudio = new Audio(audioUrl);

            return new Promise((resolve, reject) => {
                if (!this.currentAudio) {
                    reject(new Error('Audio creation failed'));
                    return;
                }

                this.currentAudio.onended = () => {
                    this.currentAudio = null;
                    resolve();
                };

                this.currentAudio.onerror = async () => {
                    this.currentAudio = null;
                    try {
                        await this.speak(fallbackText, lang);
                        resolve();
                    } catch (ttsError) {
                        reject(ttsError);
                    }
                };

                this.currentAudio.play().catch(async (playError) => {
                    this.currentAudio = null;
                    try {
                        await this.speak(fallbackText, lang);
                        resolve();
                    } catch (ttsError) {
                        reject(ttsError);
                    }
                });
            });
        } catch (error) {
            return this.speak(fallbackText, lang);
        }
    }

    async speak(text: string, lang: string = 'en-US'): Promise<void> {
        this.stop();
        this.isSpeaking = true;

        try {
            await speakText(text, lang);
        } finally {
            this.isSpeaking = false;
        }
    }

    stop(): void {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }

        if (this.isSpeaking) {
            stopSpeech();
            this.isSpeaking = false;
        }
    }

    isPlaying(): boolean {
        return (this.currentAudio !== null && !this.currentAudio.paused) || this.isSpeaking;
    }
}

// Export a singleton instance
export const globalAudioPlayer = new AudioPlayer();

// ============================================
// SOUND EFFECTS USING WEB AUDIO API
// ============================================

/**
 * Create and play a sound effect using Web Audio API
 */
class SoundEffect {
    private context: AudioContext | null = null;

    private getContext(): AudioContext {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.context;
    }

    /**
     * Play correct answer sound (happy, upward tone)
     */
    playCorrect(): void {
        try {
            const ctx = this.getContext();
            const now = ctx.currentTime;

            // Create oscillator for main tone
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            // Happy upward melody: C -> E -> G (major chord)
            oscillator.frequency.setValueAtTime(523.25, now); // C5
            oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5

            // Smooth envelope
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
            gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
            gainNode.gain.linearRampToValueAtTime(0.15, now + 0.2);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.35);

            oscillator.type = 'sine';
            oscillator.start(now);
            oscillator.stop(now + 0.35);
        } catch (error) {
            console.error('Failed to play correct sound:', error);
        }
    }

    /**
     * Play incorrect answer sound (sad, downward tone)
     */
    playIncorrect(): void {
        try {
            const ctx = this.getContext();
            const now = ctx.currentTime;

            // Create oscillator for main tone
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            // Sad downward tone: G -> D
            oscillator.frequency.setValueAtTime(392.00, now); // G4
            oscillator.frequency.linearRampToValueAtTime(293.66, now + 0.3); // D4

            // Envelope
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.35);

            oscillator.type = 'triangle';
            oscillator.start(now);
            oscillator.stop(now + 0.35);
        } catch (error) {
            console.error('Failed to play incorrect sound:', error);
        }
    }

    /**
     * Play click/tap sound
     */
    playClick(): void {
        try {
            const ctx = this.getContext();
            const now = ctx.currentTime;

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(800, now);

            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            oscillator.type = 'sine';
            oscillator.start(now);
            oscillator.stop(now + 0.1);
        } catch (error) {
            console.error('Failed to play click sound:', error);
        }
    }

    /**
     * Play success/completion sound (fanfare)
     */
    playSuccess(): void {
        try {
            const ctx = this.getContext();
            const now = ctx.currentTime;

            // Create multiple oscillators for chord
            const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

            frequencies.forEach((freq, index) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.setValueAtTime(freq, now);

                const delay = index * 0.05;
                gainNode.gain.setValueAtTime(0, now + delay);
                gainNode.gain.linearRampToValueAtTime(0.15, now + delay + 0.01);
                gainNode.gain.linearRampToValueAtTime(0, now + delay + 0.5);

                oscillator.type = 'sine';
                oscillator.start(now + delay);
                oscillator.stop(now + delay + 0.5);
            });
        } catch (error) {
            console.error('Failed to play success sound:', error);
        }
    }

    /**
     * Play level complete sound
     */
    playLevelComplete(): void {
        try {
            const ctx = this.getContext();
            const now = ctx.currentTime;

            // Ascending melody
            const melody = [
                { freq: 523.25, time: 0 },    // C5
                { freq: 587.33, time: 0.1 },  // D5
                { freq: 659.25, time: 0.2 },  // E5
                { freq: 783.99, time: 0.3 },  // G5
                { freq: 1046.50, time: 0.4 }  // C6
            ];

            melody.forEach(({ freq, time }) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.setValueAtTime(freq, now + time);

                gainNode.gain.setValueAtTime(0, now + time);
                gainNode.gain.linearRampToValueAtTime(0.2, now + time + 0.01);
                gainNode.gain.linearRampToValueAtTime(0, now + time + 0.15);

                oscillator.type = 'triangle';
                oscillator.start(now + time);
                oscillator.stop(now + time + 0.15);
            });
        } catch (error) {
            console.error('Failed to play level complete sound:', error);
        }
    }

    /**
     * Play countdown tick sound
     */
    playTick(): void {
        try {
            const ctx = this.getContext();
            const now = ctx.currentTime;

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(1000, now);

            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

            oscillator.type = 'square';
            oscillator.start(now);
            oscillator.stop(now + 0.05);
        } catch (error) {
            console.error('Failed to play tick sound:', error);
        }
    }
}

// Export singleton instance for sound effects
export const soundEffects = new SoundEffect();

// ============================================
// AUDIO FEEDBACK URLS (Optional external files)
// ============================================

export const AUDIO_FEEDBACK = {
    correct: 'https://static.edupia.vn/sounds/correct.mp3',
    incorrect: 'https://static.edupia.vn/sounds/incorrect.mp3',
    success: 'https://static.edupia.vn/sounds/success.mp3',
    click: 'https://static.edupia.vn/sounds/click.mp3',
} as const;

/**
 * Play feedback sound with fallback to Web Audio API
 */
export const playFeedbackSound = async (
    type: 'correct' | 'incorrect' | 'success' | 'click',
    useWebAudio: boolean = true
): Promise<void> => {
    if (useWebAudio) {
        // Use Web Audio API for instant feedback
        switch (type) {
            case 'correct':
                soundEffects.playCorrect();
                break;
            case 'incorrect':
                soundEffects.playIncorrect();
                break;
            case 'success':
                soundEffects.playSuccess();
                break;
            case 'click':
                soundEffects.playClick();
                break;
        }
    } else {
        // Try to play from URL (if available)
        try {
            const audio = new Audio(AUDIO_FEEDBACK[type]);
            await audio.play();
        } catch (error) {
            // Fallback to Web Audio API
            console.warn(`Failed to play ${type} sound from URL, using Web Audio API`);
            playFeedbackSound(type, true);
        }
    }
};
