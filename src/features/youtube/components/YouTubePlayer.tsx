import React, { useRef, useEffect, useState } from 'react';
import Loader from '@/components/layout/Loader';

interface YouTubePlayerProps {
    videoId: string;
    width?: string | number;
    height?: string | number;
    autoplay?: boolean;
    className?: string;
    onPlayerReady?: () => void;
    onPlayerStateChange?: (state: number) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
                                                         videoId,
                                                         width = '100%',
                                                         height = '315',
                                                         autoplay = false,
                                                         className = '',
                                                         onPlayerReady,
                                                         onPlayerStateChange
                                                     }) => {
    const playerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [playerInstance, setPlayerInstance] = useState<any>(null);
    const playerInstanceRef = useRef<any>(null);

    useEffect(() => {
        // Function to load the YouTube IFrame API
        const loadYouTubeAPI = () => {
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';

                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

                window.onYouTubeIframeAPIReady = initPlayer;
            } else if (window.YT.Player) {
                initPlayer();
            }
        };

        // Initialize the player
        const initPlayer = () => {
            if (!playerRef.current) return;

            const player = new window.YT.Player(playerRef.current, {
                videoId: videoId,
                width: width,
                height: height,
                playerVars: {
                    autoplay: autoplay ? 1 : 0,
                    modestbranding: 1,
                    rel: 0,
                },
                events: {
                    onReady: handlePlayerReady,
                    onStateChange: handlePlayerStateChange,
                    onError: handlePlayerError
                }
            });

            setPlayerInstance(player);
            playerInstanceRef.current = player;
        };

        // Handle player ready event
        const handlePlayerReady = () => {
            setIsLoading(false);
            onPlayerReady?.();
        };

        // Handle player state change event
        const handlePlayerStateChange = (event: any) => {
            onPlayerStateChange?.(event.data);
        };

        // Handle player error event
        const handlePlayerError = (event: any) => {
            console.error('YouTube Player Error:', event.data);
            setIsLoading(false);
        };

        loadYouTubeAPI();

        // Cleanup
        return () => {
            if (playerInstanceRef.current) {
                try {
                    playerInstanceRef.current.destroy();
                } catch (error) {
                    console.error('Error destroying YouTube player:', error);
                }
            }
        };
    }, [videoId, width, height, autoplay, onPlayerReady, onPlayerStateChange]);

    // Update video if videoId changes
    useEffect(() => {
        if (playerInstance && playerInstance.loadVideoById) {
            playerInstance.loadVideoById(videoId);
        }
    }, [videoId, playerInstance]);

    return (
        <div className={`relative ${className}`} style={{ width }}>
            {isLoading && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md"
                    style={{ height }}
                >
                    <Loader size="md" label="Chargement de la vidéo..." />
                </div>
            )}
            <div ref={playerRef} className="rounded-md overflow-hidden" />
        </div>
    );
};

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export default YouTubePlayer;