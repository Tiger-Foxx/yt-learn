import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface ToastProps {
    message: string;
    type?: ToastType;
    position?: ToastPosition;
    duration?: number;
    onClose?: () => void;
    isVisible: boolean;
    id?: string;
}

const Toast: React.FC<ToastProps> = ({
                                         message,
                                         type = 'info',
                                         position = 'bottom-right',
                                         duration = 4000,
                                         onClose,
                                         isVisible,
                                         id
                                     }) => {
    const [isClosing, setIsClosing] = useState(false);

    // Gérer la fermeture automatique du toast
    useEffect(() => {
        if (!isVisible || !duration) return;

        const timer = setTimeout(() => {
            setIsClosing(true);
        }, duration);

        return () => clearTimeout(timer);
    }, [isVisible, duration]);

    // Gérer l'animation de fermeture
    useEffect(() => {
        if (isClosing) {
            const animationTimer = setTimeout(() => {
                onClose?.();
                setIsClosing(false);
            }, 300); // Durée de l'animation de disparition

            return () => clearTimeout(animationTimer);
        }
    }, [isClosing, onClose]);

    if (!isVisible) return null;

    // Classes pour le type de toast
    const typeClasses = {
        success: 'bg-green-50 text-green-800 border-green-400 dark:bg-green-900/50 dark:text-green-300',
        error: 'bg-red-50 text-red-800 border-red-400 dark:bg-red-900/50 dark:text-red-300',
        info: 'bg-blue-50 text-blue-800 border-blue-400 dark:bg-blue-900/50 dark:text-blue-300',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-400 dark:bg-yellow-900/50 dark:text-yellow-300'
    };

    // Icônes pour chaque type
    const icons = {
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        error: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        ),
        info: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        ),
        warning: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ),
    };

    // Positions pour le toast
    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 -translate-x-1/2',
        'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
    };

    const toastClasses = `
    fixed min-w-[300px] max-w-md shadow-lg rounded-lg border-l-4 p-4 pointer-events-auto
    flex items-center transform transition-all duration-300
    ${typeClasses[type]} 
    ${positionClasses[position]}
    ${isClosing ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
  `;

    // Créer un portail pour le toast
    return ReactDOM.createPortal(
        <div className={toastClasses} role="alert" aria-live="assertive" id={id}>
            <div className="flex-shrink-0 mr-3">
                {icons[type]}
            </div>
            <div className="flex-1">
                <p className="text-sm">{message}</p>
            </div>
            <button
                onClick={() => setIsClosing(true)}
                className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
                aria-label="Fermer"
            >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>,
        document.body
    );
};

export default Toast;