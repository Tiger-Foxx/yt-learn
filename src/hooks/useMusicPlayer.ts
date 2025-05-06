import { useState, useCallback, useEffect, useRef } from 'react';
import { Track } from '../types/music';
import { VOLUME_DEFAULT } from '../config/constants';

/**
 * Hook pour gérer le lecteur de musique intégré
 */
export const useMusicPlayer = () => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(VOLUME_DEFAULT);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressIntervalRef = useRef<number | null>(null);

    // Créer l'élément audio une fois
    useEffect(() => {
        audioRef.current = new Audio();

        // Ajouter les écouteurs d'événements
        const audio = audioRef.current;

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            clearProgressInterval();
        };

        const handleDurationChange = () => {
            setDuration(audio.duration);
        };

        const handleError = () => {
            console.error('Audio playback error');
            setIsPlaying(false);
            clearProgressInterval();
        };

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('error', handleError);
            audio.pause();
            clearProgressInterval();
        };
    }, []);

    // Mettre à jour le volume lorsqu'il change
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    /**
     * Lance la lecture d'une piste
     */
    const playTrack = useCallback((track: Track) => {
        if (!track.preview_url) {
            console.warn('No preview URL available for this track');
            return;
        }

        // Si c'est une nouvelle piste
        if (!currentTrack || currentTrack.id !== track.id) {
            setCurrentTrack(track);

            if (audioRef.current) {
                audioRef.current.src = track.preview_url;
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(error => {
                    console.error('Error playing track:', error);
                });
            }

            setIsPlaying(true);
            startProgressInterval();
        } else {
            // Toggle play/pause pour la même piste
            togglePlay();
        }
    }, [currentTrack]);

    /**
     * Démarre/pause la lecture
     */
    const togglePlay = useCallback(() => {
        if (!audioRef.current || !currentTrack) return;

        if (isPlaying) {
            audioRef.current.pause();
            clearProgressInterval();
        } else {
            audioRef.current.play().catch(error => {
                console.error('Error playing track:', error);
            });
            startProgressInterval();
        }

        setIsPlaying(!isPlaying);
    }, [isPlaying, currentTrack]);

    /**
     * Arrête la lecture
     */
    const stopPlayback = useCallback(() => {
        if (!audioRef.current) return;

        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setProgress(0);
        clearProgressInterval();
    }, []);

    /**
     * Change le volume
     */
    const changeVolume = useCallback((newVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        setVolume(clampedVolume);
    }, []);

    /**
     * Change la position de lecture
     */
    const seekTo = useCallback((newProgress: number) => {
        if (!audioRef.current) return;

        const newTime = (newProgress / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setProgress(newProgress);
    }, []);

    /**
     * Démarre l'intervalle pour suivre la progression de lecture
     */
    const startProgressInterval = useCallback(() => {
        clearProgressInterval();

        progressIntervalRef.current = window.setInterval(() => {
            if (audioRef.current) {
                const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                setProgress(progressPercent);
            }
        }, 100) as unknown as number;
    }, []);

    /**
     * Efface l'intervalle de progression
     */
    const clearProgressInterval = useCallback(() => {
        if (progressIntervalRef.current !== null) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    }, []);

    // Si la piste change, mettre à jour l'audio
    useEffect(() => {
        if (currentTrack?.preview_url && audioRef.current) {
            audioRef.current.src = currentTrack.preview_url;
            audioRef.current.load();

            if (isPlaying) {
                audioRef.current.play().catch(error => {
                    console.error('Error playing track:', error);
                    setIsPlaying(false);
                });
            }
        }
    }, [currentTrack]);

    return {
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        playTrack,
        togglePlay,
        stopPlayback,
        changeVolume,
        seekTo
    };
};

export default useMusicPlayer;