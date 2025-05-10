import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
         label,
         error,
         helper,
         leftIcon,
         rightIcon,
         fullWidth = false,
         className = '',
         containerClassName = '',
         ...props
     }, ref) => {
    //     const inputWrapperClasses = `
    //   flex items-center bg-white dark:bg-gray-900 border rounded-md overflow-hidden
    //   ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500'}
    //   ${fullWidth ? 'w-full' : ''}
    //   ${props.disabled ? 'bg-gray-100 dark:bg-gray-800' : ''}
    // `;

        const inputClasses = `
      block w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-transparent 
      focus:outline-none disabled:cursor-not-allowed disabled:opacity-70
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
      ${className}
    `;

        const iconClasses = "absolute inset-y-0 flex items-center pointer-events-none text-gray-500 dark:text-gray-400";

        return (
            <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className={`${iconClasses} left-0 pl-3`}>
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        className={inputClasses}
                        {...props}
                    />

                    {rightIcon && (
                        <div className={`${iconClasses} right-0 pr-3`}>
                            {rightIcon}
                        </div>
                    )}
                </div>

                {helper && !error && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {helper}
                    </p>
                )}

                {error && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;