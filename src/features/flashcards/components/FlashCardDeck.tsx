import React, { useState, useEffect } from 'react';
import { FlashcardData } from './Flashcard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface FlashcardDeckProps {
    cards: FlashcardData[];
    title?: string;
    className?: string;
    onComplete?: () => void;
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
                                                         cards,
                                                         title,
                                                         className = '',
                                                         onComplete
                                                     }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFront, setIsFront] = useState(true);
    const [completedCards, setCompletedCards] = useState<string[]>([]);
    const [animation, setAnimation] = useState<'slide-left' | 'slide-right' | ''>('');

    const currentCard = cards[currentIndex];
    const hasStarted = currentIndex > 0 || !isFront;
    const isComplete = currentIndex >= cards.length;

    // Réinitialiser l'animation après qu'elle soit terminée
    useEffect(() => {
        if (animation) {
            const timer = setTimeout(() => setAnimation(''), 300);
            return () => clearTimeout(timer);
        }
    }, [animation]);

    const handleFlip = () => {
        setIsFront(!isFront);
    };

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setAnimation('slide-left');
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setIsFront(true);

                // Marquer la carte comme complétée
                if (!completedCards.includes(currentCard.id)) {
                    setCompletedCards([...completedCards, currentCard.id]);
                }
            }, 200);
        } else {
            // Dernière carte complétée
            setCompletedCards([...completedCards, currentCard.id]);
            setIsComplete(true);
            onComplete?.();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setAnimation('slide-right');
            setTimeout(() => {
                setCurrentIndex(currentIndex - 1);
                setIsFront(true);
            }, 200);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setIsFront(true);
        setCompletedCards([]);
    };

    // Si toutes les cartes sont complétées
    if (isComplete) {
        return (
            <Card className={`p-6 ${className}`}>
                <div className="text-center">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full inline-block mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Félicitations !
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Vous avez terminé toutes les flashcards de ce jeu.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <Button
                            variant="primary"
                            onClick={handleRestart}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                            }
                        >
                            Recommencer
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className={className}>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title || 'Flashcards'}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Carte {currentIndex + 1} sur {cards.length} • {completedCards.length} terminées
                    </p>
                </div>

                <div className="mt-2 sm:mt-0 flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRestart}
                        disabled={!hasStarted}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                        }
                    >
                        Recommencer
                    </Button>
                </div>
            </div>

            <div className={`transition-transform duration-300 transform ${animation === 'slide-left' ? '-translate-x-full opacity-0' : animation === 'slide-right' ? 'translate-x-full opacity-0' : ''}`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-4 min-h-[300px] flex flex-col">
                    <div className="flex-grow flex items-center justify-center">
                        <div className="text-lg md:text-xl">
                            {isFront ? currentCard.recto : currentCard.verso}
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <Button
                            variant="tertiary"
                            size="md"
                            onClick={handleFlip}
                        >
                            {isFront ? 'Voir la réponse' : 'Voir la question'}
                        </Button>
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        }
                        iconPosition="left"
                    >
                        Précédent
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleNext}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        }
                        iconPosition="right"
                    >
                        {currentIndex === cards.length - 1 ? 'Terminer' : 'Suivant'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FlashcardDeck;