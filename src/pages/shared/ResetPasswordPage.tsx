import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Lozinke se ne poklapaju.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, email, newPassword);
      toast.success('Lozinka je uspešno promenjena. Prijavite se.');
      navigate('/auth');
    } catch (err: any) {
      toast.error(err?.message ?? 'Link je nevažeći ili je istekao.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-neutral-100 p-8">
        <div className="mb-8">
          <h2 className="text-3xl text-black mb-2">Nova lozinka</h2>
          <p className="text-neutral-500 text-sm">Unesite novu lozinku za vaš nalog.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-700 ml-1">Nova lozinka</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-700 ml-1">Potvrdi lozinku</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Čuvanje...' : 'Potvrdi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
