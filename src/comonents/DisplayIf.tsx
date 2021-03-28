import React from 'react';

interface DisplayIfProps {
    expr: boolean;
    onElse?: JSX.Element;
}

export const DisplayIf: React.FC<DisplayIfProps> = ({ children, expr, onElse }) => {
    if (expr) {
        return <>{children}</>;
    }
    if (onElse) {
        return onElse;
    }
    return null;
};
