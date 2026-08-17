import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    loading?: boolean;
    variant?: 'danger' | 'primary'; // danger = red, primary = cyan
}

const ConfirmModal = ({
                          isOpen,
                          onClose,
                          onConfirm,
                          title,
                          message,
                          confirmButtonText = 'Confirm',
                          cancelButtonText = 'Cancel',
                          loading = false,
                          variant = 'danger'
                      }: ConfirmModalProps) => {
    if (!isOpen) return null;

    const confirmBgColor = variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700';
    const iconBgColor = variant === 'danger' ? 'bg-red-100' : 'bg-cyan-100';
    const iconColor = variant === 'danger' ? 'text-red-600' : 'text-cyan-600';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative p-6 text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>

                <div className={`mx-auto w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center mb-4`}>
                    <AlertTriangle size={24} className={iconColor} />
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 font-medium ${confirmBgColor}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Processing...
                            </>
                        ) : (
                            confirmButtonText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;