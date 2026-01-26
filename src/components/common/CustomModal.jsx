import React from 'react';
import './CustomModal.css';

const CustomModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
    if (!isOpen) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-container">
                <div className="custom-modal-header">
                    <h3>{title}</h3>
                </div>
                <div className="custom-modal-body">
                    <p>{message}</p>
                </div>
                <div className="custom-modal-footer">
                    <button className="modal-btn-cancel" onClick={onCancel}>{cancelText}</button>
                    <button className={`modal-btn-confirm ${type}`} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
