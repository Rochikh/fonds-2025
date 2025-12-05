export interface DonationState {
  totalAmount: number;
  count: number;
}

export interface PledgeResponse {
  success: boolean;
  newTotal: number;
  message?: string;
}

export interface AIResponse {
  text: string;
}
