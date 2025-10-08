import React from 'react';
import Tooltip from '@mui/material/Tooltip';

export default function HeroIcon({
                                     icon: Icon,
                                     className = '',
                                     onClick,
                                     tooltipText,
                                     iconColor,
                                     size = {},
                                     tooltipPosition = 'bottom',
                                     isDisabled = false,
                                     ...rest
                                 }) {
    const { width = 'w-5', height = 'h-5' } = size;

    // Se iconColor è una classe Tailwind (es. "text-gray-500")
    const isTailwindColor = typeof iconColor === 'string' && iconColor.startsWith('text-');

    // Stili aggiuntivi quando disabled
    const disabledStyles = isDisabled
        ? 'opacity-50 cursor-not-allowed pointer-events-none'
        : 'cursor-pointer';

    return (
        <Tooltip title={tooltipText || ''} placement={tooltipPosition}>
            <div
                className={`${className} ${disabledStyles}`}
                onClick={isDisabled ? undefined : onClick}
            >
                <Icon
                    className={`${width} ${height} ${isTailwindColor ? iconColor : ''}`}
                    aria-hidden="true"
                    style={{
                        color: isTailwindColor ? undefined : iconColor,
                    }}
                    {...rest}
                />
            </div>
        </Tooltip>
    );
}
