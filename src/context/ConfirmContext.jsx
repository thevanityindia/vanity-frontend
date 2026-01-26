import React, { createContext, useContext, useState } from 'react';
import CustomModal from '../components/common/CustomModal';

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
    const [config, setConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'primary'
    });

    const confirm = (options) => {
        return new Promise((resolve) => {
            setConfig({
                isOpen: true,
                title: options.title || 'Confirm Action',
                message: options.message || 'Are you sure?',
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                type: options.type || 'primary',
                onConfirm: () => {
                    setConfig(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                }
            });
        });
    };

    const handleCancel = () => {
        setConfig(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <CustomModal
                isOpen={config.isOpen}
                title={config.title}
                message={config.message}
                confirmText={config.confirmText}
                cancelText={config.cancelText}
                type={config.type}
                onConfirm={config.onConfirm}
                onCancel={handleCancel}
            />
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
};
