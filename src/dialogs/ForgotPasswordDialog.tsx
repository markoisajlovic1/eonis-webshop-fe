import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';

interface Props {
  onClose: () => void;
}

const ForgotPasswordDialog: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('Link za resetovanje lozinke je poslat na vašu email adresu.');
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? 'Došlo je do greške.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-neutral-100 p-8">
        <h2 className="text-2xl text-black mb-2">Resetuj lozinku</h2>
        <p className="text-neutral-500 text-sm mb-6">
          Unesite email adresu vašeg naloga i poslaćemo vam link za resetovanje lozinke.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-700 ml-1">Email adresa</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="primer@email.com"
              className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Slanje...' : 'Resetuj šifru'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 border border-neutral-200 text-neutral-600 rounded-xl font-medium hover:bg-neutral-50 transition-all"
          >
            Otkaži
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordDialog;
