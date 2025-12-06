import React, { useState, useEffect } from 'react';
import { getFundState, addPledge } from './services/storageService';
import { Counter } from './components/Counter';
import { PledgeModal } from './components/PledgeModal';
import confetti from 'canvas-confetti';
import { ArrowRight, Lock, Calendar, Quote } from 'lucide-react';

const App: React.FC = () => {
  // Initialisation immédiate avec la valeur en cache pour éviter le "0" au chargement
  const [total, setTotal] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fund_total');
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });
  
  const [pledgeAmount, setPledgeAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  // Sauvegarde dans le cache local à chaque changement du total
  useEffect(() => {
    if (total > 0) {
      localStorage.setItem('fund_total', total.toString());
    }
  }, [total]);

  // Chargement initial et Polling (rafraîchissement automatique)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFundState();
        // On ne met à jour que si le montant est valide et différent de 0 (sauf initialement)
        if (data && typeof data.totalAmount === 'number') {
          setTotal(data.totalAmount);
        }
      } catch (error) {
        console.error("Impossible de récupérer le total:", error);
      }
    };

    // Premier appel immédiat
    fetchData();

    // Appel toutes les 5 secondes pour plus de réactivité (au lieu de 10)
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ca8a04', '#1e293b', '#fbbf24'] 
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ca8a04', '#1e293b', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(pledgeAmount);
    
    if (!amount || amount <= 0) return;

    setIsSubmitting(true);

    try {
      // Envoi vers Google Sheets
      const newState = await addPledge(amount);
      
      // Mise à jour du total avec la réponse du serveur
      setTotal(newState.totalAmount);
      
      triggerConfetti();
      
      setModalMessage("Merci");
      setModalOpen(true);
      setPledgeAmount('');
    } catch (error) {
      console.error("Error processing pledge", error);
      alert("Une erreur de connexion est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPledgeAmount(value);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-amber-50/50 font-sans">
      
      {/* Header */}
      <header className="pt-12 pb-6 px-6 text-center space-y-2">
        <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-6 opacity-50"></div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 tracking-tight pt-2">
          Week-end du fonds national
        </h1>
        <p className="text-xl md:text-2xl font-serif text-slate-600 mt-1 italic">
          Bahá’ís de Lille
        </p>
        
        <div className="inline-flex items-center justify-center space-x-2 mt-4 text-gold-700 bg-gold-50 px-4 py-1.5 rounded-full border border-gold-100">
          <Calendar size={14} />
          <span className="text-sm font-medium tracking-wide">5, 6 et 7 Décembre 2025</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-6 w-full max-w-lg mx-auto space-y-8">
        
        {/* Quote Card */}
        <div className="text-center px-4 md:px-8">
          <Quote className="w-8 h-8 text-gold-300 mx-auto mb-3 opacity-50 transform -scale-x-100" />
          <p className="font-serif text-lg md:text-xl text-slate-600 italic leading-relaxed">
            « Nous devons être comme la fontaine ou la source qui se vide continuellement jusqu’à se tarir et qui est continuellement alimentée par un flux invisible. »
          </p>
          <p className="mt-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">— Shoghi Effendi</p>
        </div>

        {/* Total Display */}
        <div className="w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 md:p-10 text-center border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600"></div>
          
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Contributions Validées
          </h2>
          <div className="text-5xl md:text-6xl font-serif font-bold text-navy-900 mb-2 tracking-tight">
            <Counter value={total} />
          </div>
        </div>

        {/* Action Card */}
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <label htmlFor="amount" className="block text-center text-sm font-medium text-slate-600 uppercase tracking-wide">
                Ma promesse de contribution
              </label>
              <div className="relative max-w-xs mx-auto">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-serif italic">€</span>
                <input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  value={pledgeAmount}
                  onChange={handleAmountChange}
                  placeholder="Montant libre"
                  className="w-full pl-10 pr-4 py-4 text-center text-3xl font-serif font-bold text-navy-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all outline-none placeholder:text-slate-300 placeholder:font-sans placeholder:text-lg placeholder:font-normal"
                  required
                />
              </div>
              <p className="flex justify-center items-center text-xs text-slate-400 pt-1">
                <Lock size={10} className="mr-1.5" />
                Anonyme • Confidentiel • Sacré
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !pledgeAmount || parseFloat(pledgeAmount) <= 0}
              className="w-full group relative flex items-center justify-center py-4 px-6 border border-transparent text-lg font-medium rounded-xl text-white bg-navy-900 hover:bg-navy-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-xl active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Validation...
                </span>
              ) : (
                <span className="flex items-center">
                  Je valide ma promesse <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              )}
            </button>
          </form>
        </div>
      </main>

      <PledgeModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        message={modalMessage} 
      />
    </div>
  );
};

export default App;
