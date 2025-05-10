import React, { useState, useEffect } from 'react';
import { QuizQuestionData } from './QuizQuestion';
import QuizQuestion from './QuizQuestion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export interface QuizData {
    id: string;
    titre: string;
    questions: QuizQuestionData[];
}

interface QuizGameProps {
    quiz: QuizData;
    onComplete?: (score: number, total: number) => void;
    className?: string;
}

const QuizGame: React.FC<QuizGameProps> = ({
                                               quiz,
                                               onComplete,
                                               className = ''
                                           }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, { isCorrect: boolean, selectedOption: number }>>({});
    const [isComplete, setIsComplete] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const totalQuestions = quiz.questions.length;
    const answeredCount = Object.keys(answeredQuestions).length;
    const isCurrentAnswered = currentQuestion ? !!answeredQuestions[currentQuestion.id] : false;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    useEffect(() => {
        if (answeredCount === totalQuestions && !isComplete) {
            setIsComplete(true);
            const finalScore = Object.values(answeredQuestions).filter(q => q.isCorrect).length;
            setScore(finalScore);
            console.log(score)
            onComplete?.(finalScore, totalQuestions);
        }
    }, [answeredCount, totalQuestions, isComplete, answeredQuestions, onComplete]);

    const handleAnswer = (isCorrect: boolean, questionId: string, selectedOption: number) => {
        setAnsweredQuestions(prev => ({
            ...prev,
            [questionId]: { isCorrect, selectedOption }
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setAnsweredQuestions({});
        setIsComplete(false);
        setScore(0);
    };

    // Si le quiz est terminé, afficher un récapitulatif
    if (isComplete) {
        const correctCount = Object.values(answeredQuestions).filter(q => q.isCorrect).length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);

        return (
            <Card className={`p-6 ${className}`}>
                <div className="text-center">
                    <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold
            ${percentage >= 80 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        percentage >= 60 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                        {percentage}%
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Quiz terminé !
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Votre score : {correctCount} sur {totalQuestions} questions
                    </p>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {percentage >= 80 ? 'Excellent travail ! Vous maîtrisez le sujet.' :
                            percentage >= 60 ? 'Bon travail ! Vous comprenez bien les concepts essentiels.' :
                                'Continuez à pratiquer pour améliorer votre compréhension.'}
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
                            Recommencer le quiz
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                // Revenir à la première question pour révision
                                setIsComplete(false);
                                setCurrentQuestionIndex(0);
                            }}
                        >
                            Réviser les questions
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className={className}>
            {/* Header */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{quiz.titre}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Question {currentQuestionIndex + 1} sur {totalQuestions} • {answeredCount} répondue(s)
                    </p>
                </div>

                {/* Progression */}
                <div className="mt-2 sm:mt-0 w-full sm:w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                        style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-4">
                {currentQuestion && (
                    <QuizQuestion
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                        showFeedback={true}
                    />
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
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
                    variant={isCurrentAnswered ? "primary" : "tertiary"}
                    onClick={handleNextQuestion}
                    disabled={!isCurrentAnswered || isLastQuestion}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    }
                    iconPosition="right"
                >
                    {isCurrentAnswered && isLastQuestion && answeredCount === totalQuestions
                        ? "Terminer le quiz"
                        : "Suivant"
                    }
                </Button>
            </div>
        </div>
    );
};

export default QuizGame;