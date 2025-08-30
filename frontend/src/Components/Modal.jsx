import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

// In your Modal component, add a prop for fullWidth
const Modal = ({ isOpen, onClose, children, fullWidth = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-white rounded-3xl shadow-xl ${
                fullWidth ? "w-full max-w-6xl" : "max-w-md w-full"
              } max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 relative left-[-120px] top-[40px]" />
              </button>
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default Modal;
