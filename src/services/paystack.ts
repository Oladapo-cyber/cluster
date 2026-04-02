interface PaystackHandler {
  openIframe: () => void;
}

interface PaystackPopType {
  setup: (options: PaystackOptions) => PaystackHandler;
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  ref: string;
  currency: 'NGN';
  firstname?: string;
  callback: (response: { reference?: string }) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop?: PaystackPopType;
  }
}

export type PaystackCheckoutResult =
  | { status: 'success'; reference: string }
  | { status: 'cancelled' };

let paystackScriptPromise: Promise<void> | null = null;

const loadPaystackInlineScript = async (): Promise<void> => {
  if (window.PaystackPop) {
    return;
  }

  if (!paystackScriptPromise) {
    paystackScriptPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://js.paystack.co/v1/inline.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Failed to load Paystack checkout script.')), {
          once: true,
        });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack checkout script.'));
      document.body.appendChild(script);
    });
  }

  return paystackScriptPromise;
};

interface LaunchPaystackParams {
  publicKey: string;
  email: string;
  amountKobo: number;
  reference: string;
  firstName?: string;
}

export const launchPaystackCheckout = async (params: LaunchPaystackParams): Promise<PaystackCheckoutResult> => {
  await loadPaystackInlineScript();

  if (!window.PaystackPop) {
    throw new Error('Paystack checkout failed to initialize.');
  }

  return new Promise<PaystackCheckoutResult>((resolve, reject) => {
    const handler = window.PaystackPop?.setup({
      key: params.publicKey,
      email: params.email,
      amount: params.amountKobo,
      ref: params.reference,
      currency: 'NGN',
      firstname: params.firstName,
      callback: (response) => {
        if (!response.reference) {
          reject(new Error('Paystack did not return a transaction reference.'));
          return;
        }
        resolve({ status: 'success', reference: response.reference });
      },
      onClose: () => {
        resolve({ status: 'cancelled' });
      },
    });

    if (!handler) {
      reject(new Error('Unable to open Paystack checkout.'));
      return;
    }

    handler.openIframe();
  });
};
