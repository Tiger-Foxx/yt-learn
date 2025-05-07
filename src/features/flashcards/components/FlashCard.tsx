import React, { useState } from 'react';
import Card from '@/components/ui/Card';

export interface FlashcardData {
    id: string;
    recto: string;
    verso: string;
}

interface FlashcardProps {
    card: FlashcardData;
    isFront?: boolean;
    onFlip?: () => void;
    className?: string;
}

const Flashcard: React.FC<FlashcardProps> = ({
                                                 card,
                                                 isFront = true,
                                                 onFlip,
                                                 className = ''
                                             }) => {
    const [isFlipping, setIsFlipping] = useState(false);

    const handleClick = () => {
        if (!onFlip) return;

        setIsFlipping(true);
        setTimeout(() => {
            onFlip();
            setIsFlipping(false);
        }, 250); // La moitié de la durée de l'animation pour basculer au milieu
    };

    const cardClasses = `
    cursor-pointer h-full transition-transform duration-500 transform-gpu
    ${isFlipping ? 'scale-95' : 'scale-100'}
    ${className}
  `;

    return (
        <Card
            className={cardClasses}
            onClick={handleClick}
        >
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                    {isFront ? card.recto : card.verso}
                </div>

                <div className="mt-auto text-sm text-gray-500 dark:text-gray-400">
                    {isFront ? 'Cliquez pour retourner' : 'Retour'}
                </div>
            </div>
        </Card>
    );
};

export default Flashcard;