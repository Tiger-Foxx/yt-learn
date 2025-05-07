import React from 'react';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    footer?: React.ReactNode;
    image?: string;
    imageAlt?: string;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
    bordered?: boolean;
    shadow?: boolean;
    compact?: boolean;
}

const Card: React.FC<CardProps> = ({
                                       children,
                                       title,
                                       subtitle,
                                       footer,
                                       image,
                                       imageAlt = '',
                                       className = '',
                                       onClick,
                                       hoverable = false,
                                       bordered = true,
                                       shadow = true,
                                       compact = false,
                                   }) => {
    const baseStyles = 'bg-white dark:bg-gray-800 rounded-lg overflow-hidden';
    const hoverStyles = hoverable
        ? 'transition-transform duration-200 hover:-translate-y-1 cursor-pointer'
        : '';
    const borderStyles = bordered
        ? 'border border-gray-200 dark:border-gray-700'
        : '';
    const shadowStyles = shadow
        ? 'shadow-md dark:shadow-gray-900/30'
        : '';
    const paddingStyles = compact
        ? 'p-3'
        : 'p-5';

    const cardClasses = `
    ${baseStyles}
    ${hoverStyles}
    ${borderStyles}
    ${shadowStyles}
    ${className}
  `;

    return (
        <div className={cardClasses} onClick={onClick}>
            {image && (
                <div className="w-full">
                    <img
                        src={image}
                        alt={imageAlt}
                        className="w-full h-48 object-cover object-center"
                    />
                </div>
            )}
            <div className={paddingStyles}>
                {title && (
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {title}
                    </h3>
                )}
                {subtitle && (
                    <h4 className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {subtitle}
                    </h4>
                )}
                <div className="text-gray-700 dark:text-gray-300">
                    {children}
                </div>
            </div>
            {footer && (
                <div className={`${paddingStyles} pt-0 border-t border-gray-200 dark:border-gray-700 mt-auto`}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;