import React from 'react';
import { Link } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    isLoading?: boolean;
    loadingText?: string;
    asLink?: boolean;
    to?: string;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = 'primary',
                                           size = 'md',
                                           fullWidth = false,
                                           icon,
                                           iconPosition = 'left',
                                           isLoading = false,
                                           loadingText = 'Chargement...',
                                           asLink = false,
                                           to = '',
                                           className = '',
                                           disabled,
                                           ...props
                                       }) => {
    // Styles de base pour tous les boutons
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900';

    // Styles spécifiques au variant
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800 disabled:bg-blue-300',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400 disabled:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
        tertiary: 'bg-transparent text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:ring-blue-500 active:text-blue-900 disabled:text-blue-300 dark:text-blue-400 dark:hover:bg-gray-800',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800 disabled:bg-red-300',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800 disabled:bg-green-300',
        outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 active:bg-gray-100 disabled:text-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
    };

    // Styles spécifiques à la taille
    const sizeStyles = {
        xs: 'text-xs px-2 py-1',
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-5 py-2.5',
        xl: 'text-xl px-6 py-3'
    };

    // Application des styles
    const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || isLoading ? 'cursor-not-allowed opacity-70' : ''}
    ${className}
  `;

    // Composant de chargement
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    // Gestion de l'affichage de l'icône et du contenu
    const renderContent = () => {
        if (isLoading) {
            return (
                <>
                    <LoadingSpinner />
                    {loadingText || children}
                </>
            );
        }

        if (icon && iconPosition === 'left') {
            return (
                <>
                    <span className="mr-2">{icon}</span>
                    {children}
                </>
            );
        }

        if (icon && iconPosition === 'right') {
            return (
                <>
                    {children}
                    <span className="ml-2">{icon}</span>
                </>
            );
        }

        return children;
    };

    // Rendu sous forme de lien si asLink est true
    if (asLink && to) {
        return (
            <Link to={to} className={buttonStyles} {...(props as any)}>
                {renderContent()}
            </Link>
        );
    }

    // Rendu standard comme bouton
    return (
        <button
            className={buttonStyles}
            disabled={disabled || isLoading}
            {...props}
        >
            {renderContent()}
        </button>
    );
};

export default Button;