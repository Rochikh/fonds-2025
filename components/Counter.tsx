import React, { useEffect, useState } from 'react';

interface CounterProps {
  value: number;
}

export const Counter: React.FC<CounterProps> = ({ value }) => {
  // On initialise directement avec la valeur actuelle pour éviter le comptage depuis 0 au chargement
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // Si la valeur est identique (ex: au chargement depuis le cache), pas besoin d'animer
    if (displayValue === value) return;

    let startTimestamp: number | null = null;
    const duration = 1000; // Animation plus rapide (1s au lieu de 2s) pour un ressenti "temps réel"
    const startValue = displayValue;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const current = Math.floor(startValue + (value - startValue) * easeOutQuart);
      setDisplayValue(current);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className="tabular-nums tracking-tight">
      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(displayValue)}
    </span>
  );
};
