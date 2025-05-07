import React, { useState } from 'react';
import Button from '@/components/ui/Button';

export interface QuizQuestionData {
    id: string;
    question: string;
    options: string[];
    reponseCorrecte: number;
    explication: string;
}

interface QuizQuestionProps {
    question: QuizQuestionData;
    onAnswer: (isCorrect: boolean, questionId: string, answerIndex: number) => void;
    showFeedback?: boolean;
    className?: string;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
                                                       question,
                                                       onAnswer,
                                                       showFeedback = true,
                                                       className = ''
                                                   }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;

        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null || isAnswered) return;

        const isCorrect = selectedOption === question.reponseCorrecte;
        setIsAnswered(true);
        onAnswer(isCorrect, question.id, selectedOption);
    };

    const getOptionClasses = (index: number) => {
        const baseClasses = 'p-3 rounded-md border transition-colors cursor-pointer select-none';

        if (!isAnswered) {
            return `${baseClasses} ${
                selectedOption === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
            }`;
        }

        if (index === question.reponseCorrecte) {
            return `${baseClasses} border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/20 dark:text-green-300`;
        }

        if (selectedOption === index) {
            return `${baseClasses} border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-900/20 dark:text-red-300`;
        }

        return `${baseClasses} opacity-50 border-gray-300 dark:border-gray-700`;
    };

    return (
        <div className={`${className}`}>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {question.question}
            </h3>

            <div className="space-y-3 mb-6">
                {question.options.map((option, index) => (
                    <div
                        key={index}
                        className={getOptionClasses(index)}
                        onClick={() => handleOptionSelect(index)}
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-5 h-5 mr-2">
                                {isAnswered && index === question.reponseCorrecte ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : isAnswered && selectedOption === index ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <div className={`w-4 h-4 rounded-full border mt-0.5 ${
                                        selectedOption === index
                                            ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400'
                                            : 'border-gray-500 dark:border-gray-400'
                                    }`}></div>
                                )}
                            </div>
                            <span>{option}</span>
                        </div>
                    </div>
                ))}
            </div>

            {isAnswered && showFeedback && (
                <div className={`p-3 rounded-md ${
                    selectedOption === question.reponseCorrecte
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                    <p className="font-medium mb-1">
                        {selectedOption === question.reponseCorrecte ? 'Correct !' : 'Incorrect'}
                    </p>
                    <p className="text-sm">{question.explication}</p>
                </div>
            )}

            {!isAnswered && (
                <div className="flex justify-end mt-4">
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={selectedOption === null}
                    >
                        Valider
                    </Button>
                </div>
            )}
        </div>
    );
};

export default QuizQuestion;