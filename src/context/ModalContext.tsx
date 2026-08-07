import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, Trash2, X } from 'lucide-react';

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface ModalOptions {
  title: string;
  message: string;
  type?: ModalType;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
}

interface ModalContextType {
  showFeedback: (options: ModalOptions) => void;
  showConfirm: (options: Omit<ModalOptions, 'type'> & { onConfirm: () => void | Promise<void> }) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalOptions>({
    title: '',
    message: '',
    type: 'info'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showFeedback = (options: ModalOptions) => {
    setModalData({
      type: 'info',
      confirmLabel: 'Continue',
      ...options
    });
    setIsOpen(true);
  };

  const showConfirm = (options: Omit<ModalOptions, 'type'> & { onConfirm: () => void | Promise<void> }) => {
    setModalData({
      type: 'confirm',
      confirmLabel: options.confirmLabel || 'Confirm Delete',
      cancelLabel: options.cancelLabel || 'Cancel',
      ...options
    });
    setIsOpen(true);
  };

  const hideModal = () => {
    if (isSubmitting) return;
    setIsOpen(false);
  };

  const handleConfirmAction = async () => {
    if (modalData.onConfirm) {
      try {
        setIsSubmitting(true);
        await modalData.onConfirm();
      } catch (err) {
        console.error('Error in modal onConfirm action:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ showFeedback, showConfirm, hideModal }}>
      {children}

      {/* Global Feedback & Confirmation Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-zinc-200/90 shadow-2xl space-y-5">
            
            {/* Modal Header Icon & Close Button */}
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 font-bold">
                {modalData.type === 'success' && (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={26} />
                  </div>
                )}
                {modalData.type === 'error' && (
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <XCircle size={26} />
                  </div>
                )}
                {modalData.type === 'warning' && (
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <AlertTriangle size={26} />
                  </div>
                )}
                {modalData.type === 'confirm' && (
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Trash2 size={24} />
                  </div>
                )}
                {modalData.type === 'info' && (
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
                    <Info size={24} />
                  </div>
                )}
              </div>

              <button
                onClick={hideModal}
                disabled={isSubmitting}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Title & Message Content */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-zinc-900 leading-tight">{modalData.title}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-normal">{modalData.message}</p>
            </div>

            {/* Modal Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-100">
              {modalData.type === 'confirm' ? (
                <>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={hideModal}
                    className="template-btn-outline px-4 py-2.5 text-xs"
                  >
                    {modalData.cancelLabel || 'Cancel'}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmAction}
                    className="bg-rose-600 text-white hover:bg-rose-700 font-bold rounded-xl px-5 py-2.5 text-xs transition-all shadow-md"
                  >
                    {isSubmitting ? 'Processing...' : modalData.confirmLabel || 'Confirm Delete'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className="template-btn-black w-full py-2.5 text-xs font-bold shadow-md"
                >
                  {modalData.confirmLabel || 'Continue'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
