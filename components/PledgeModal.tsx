import React from 'react';
import { X, Heart } from 'lucide-react';

interface PledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const PledgeModal: React.FC<PledgeModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative transform transition-all scale-100 animate-in zoom-in-95 duration-300 border-t-4 border-gold-500">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center text-gold-600">
            <Heart size={32} fill="currentColor" />
          </div>
          
          <h3 className="text-2xl font-serif font-bold text-navy-900">
            Promesse Enregistrée
          </h3>
          
          <div className="prose prose-slate">
            <p className="text-lg text-slate-600 leading-relaxed italic">
              "{message}"
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-95 duration-200"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};
