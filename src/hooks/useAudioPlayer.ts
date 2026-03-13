import { useState, useCallback, useEffect, useRef } from 'react';
import { AudioPlayer, isSpeechSynthesisSupported, soundEffects, playFeedbackSound } from '@/utils/audio';

interface UseAudioPlayerReturn {
    play: (audioUrl: string, fallbackText: string, lang?: string) => Promise<void>;
    stop: () => void;
    isPlaying: boolean;
    isSupported: boolean;
}

/**
 * React Hook for playing audio with TTS fallback
 */
export const useAudioPlayer = (): UseAudioPlayerReturn => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioPlayerRef = useRef<AudioPlayer>(new AudioPlayer());

    const play = useCallback(async (
        audioUrl: string,
        fallbackText: string,
        lang: string = 'en-US'
    ) => {
        try {
            setIsPlaying(true);
            await audioPlayerRef.current.play(audioUrl, fallbackText, lang);
        } catch (error) {
            console.error('Failed to play audio:', error);
        } finally {
            setIsPlaying(false);
        }
    }, []);

    const stop = useCallback(() => {
        audioPlayerRef.current.stop();
        setIsPlaying(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            audioPlayerRef.current.stop();
        };
    }, []);

    return {
        play,
        stop,
        isPlaying,
        isSupported: isSpeechSynthesisSupported()
    };
};

/**
 * React Hook for playing vocabulary audio
 */
interface VocabularyItem {
    word: string;
    audio: string;
}

export const useVocabularyAudio = () => {
    const { play, stop, isPlaying } = useAudioPlayer();

    const playVocabulary = useCallback(async (item: VocabularyItem) => {
        await play(item.audio, item.word, 'en-US');
    }, [play]);

    return {
        playVocabulary,
        stop,
        isPlaying
    };
};

/**
 * React Hook for playing game feedback sounds (correct/incorrect/success)
 */
interface UseFeedbackSoundReturn {
    playCorrect: () => void;
    playIncorrect: () => void;
    playSuccess: () => void;
    playLevelComplete: () => void;
    playClick: () => void;
    playTick: () => void;
}

export const useFeedbackSound = (): UseFeedbackSoundReturn => {
    const playCorrect = useCallback(() => {
        soundEffects.playCorrect();
    }, []);

    const playIncorrect = useCallback(() => {
        soundEffects.playIncorrect();
    }, []);

    const playSuccess = useCallback(() => {
        soundEffects.playSuccess();
    }, []);

    const playLevelComplete = useCallback(() => {
        soundEffects.playLevelComplete();
    }, []);

    const playClick = useCallback(() => {
        soundEffects.playClick();
    }, []);

    const playTick = useCallback(() => {
        soundEffects.playTick();
    }, []);

    return {
        playCorrect,
        playIncorrect,
        playSuccess,
        playLevelComplete,
        playClick,
        playTick
    };
};

/**
 * Combined hook for game audio (vocabulary + feedback sounds)
 */
interface UseGameAudioReturn {
    playVocabulary: (item: VocabularyItem) => Promise<void>;
    playCorrect: () => void;
    playIncorrect: () => void;
    playSuccess: () => void;
    playLevelComplete: () => void;
    playClick: () => void;
    stopVocabulary: () => void;
    isPlayingVocabulary: boolean;
}

export const useGameAudio = (): UseGameAudioReturn => {
    const { playVocabulary, stop, isPlaying } = useVocabularyAudio();
    const feedbackSounds = useFeedbackSound();

    return {
        playVocabulary,
        stopVocabulary: stop,
        isPlayingVocabulary: isPlaying,
        ...feedbackSounds
    };
};
