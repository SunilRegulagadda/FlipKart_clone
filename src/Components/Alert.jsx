import { useEffect } from 'react';

function Alert({ message, type = 'success', onClose, autoDismiss = true, dismissTime = 3000 }) {
    useEffect(() => {
        if (autoDismiss && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, dismissTime);
            return () => clearTimeout(timer);
        }
    }, [autoDismiss, onClose, dismissTime]);

    return (
        <div className={`alert alert-${type} alert-dismissible fade show`} role="alert" style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 1050, minWidth: '300px' }}>
            {message}
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
    );
}

export default Alert;
