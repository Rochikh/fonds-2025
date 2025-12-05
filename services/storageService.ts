import { DonationState } from '../types';

// L'URL de votre script Google Apps
const API_URL = 'https://script.google.com/macros/s/AKfycbwvCBx_pJyuUYWl-6hGzUSscuve-knywyr15A2E45s9HsZKUan-v9mfN4Fb28NOUNvJ/exec';

// Valeur par défaut en cas d'erreur réseau
const defaultState: DonationState = {
  totalAmount: 0,
  count: 0
};

export const getFundState = async (): Promise<DonationState> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (e) {
    console.error("Erreur de connexion au serveur", e);
    return defaultState;
  }
};

export const addPledge = async (amount: number): Promise<DonationState> => {
  try {
    // Google Apps Script attend un POST avec le corps en string
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (e) {
    console.error("Erreur lors de l'envoi du don", e);
    throw e;
  }
};
