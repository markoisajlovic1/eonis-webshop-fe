import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import type { LoginPayload, RegisterFormData } from '../../types/auth';
import { Role } from '../../types/auth';
import { authService, CLAIMS } from '../../services/authService';
import { loginSuccess } from '../../store/slices/authSlice';
import type { AppDispatch } from '../../store/store';
import ForgotPasswordDialog from '../../dialogs/ForgotPasswordDialog';

const initialLoginData: LoginPayload = {
  email: '',
  password: '',
};

const initialRegisterData: RegisterFormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
};

const AuthCard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<LoginPayload>(initialLoginData);
  const [registerData, setRegisterData] = useState<RegisterFormData>(initialRegisterData);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setLoginData(initialLoginData);
    setRegisterData(initialRegisterData);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authService.login(loginData.email, loginData.password);
      const role = authService.getRole();
      const username = authService.getUsername();
      const email = authService.getEmail();
      const decoded = authService.getUserFromToken();
      const userId = decoded ? (decoded[CLAIMS.ID] as string) ?? '' : '';
      if (role && username && email) {
        dispatch(loginSuccess({ userId, username, email, role }));
      }
      toast.success('Uspešno ste se prijavili!');
      navigate(role === Role.Employee ? '/admin/dashboard' : '/');
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message ?? 'Došlo je do greške.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Lozinke se ne poklapaju.');
      return;
    }
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payload } = registerData;
      await authService.register(payload);
      toast.success('Nalog je uspešno kreiran! Prijavite se.');
      setIsLogin(true);
      setRegisterData(initialRegisterData);
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message ?? 'Došlo je do greške.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) await handleLogin();
    else await handleRegister();
  };

  return (
    <>
      {showForgotPassword && (
        <ForgotPasswordDialog onClose={() => setShowForgotPassword(false)} />
      )}

      <div className="w-full max-w-[calc(600px)] bg-white rounded-xl border border-neutral-100 p-8">
        <div className="mb-8">
          <h2 className="text-3xl text-black mb-2">
            {isLogin ? 'Dobrodošli nazad' : 'Napravi nalog'}
          </h2>
          <p className="text-neutral-500 text-sm">
            {isLogin
              ? 'Prijavite se da biste nastavili kupovinu'
              : 'Pridružite se našoj zajednici kupaca'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isLogin ? (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-neutral-700 ml-1">Email adresa</label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="primer@email.com"
                  className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-neutral-700 ml-1">Lozinka</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-neutral-400 hover:text-black transition-colors"
                >
                  Zaboravili ste lozinku?
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm text-neutral-700 ml-1">Ime</label>
                  <input
                    type="text"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    placeholder="Marko"
                    className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm text-neutral-700 ml-1">Prezime</label>
                  <input
                    type="text"
                    name="lastName"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    placeholder="Marković"
                    className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-neutral-700 ml-1">Korisničko ime</label>
                <input
                  type="text"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  placeholder="marko123"
                  className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-neutral-700 ml-1">Email adresa</label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="primer@email.com"
                  className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-neutral-700 ml-1">Broj telefona</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={registerData.phoneNumber}
                  onChange={handleRegisterChange}
                  placeholder="+381 60 123 4567"
                  className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-neutral-700 ml-1">Lozinka</label>
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="••••••••"
                  className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-neutral-700 ml-1">Potvrdi lozinku</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="••••••••"
                  className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Učitavanje...' : isLogin ? 'Prijavi se' : 'Registruj se'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <p className="text-sm text-neutral-500">
            {isLogin ? 'Nemate nalog?' : 'Već imate nalog?'}
            <button
              onClick={toggleMode}
              className="ml-2 font-bold text-black hover:underline underline-offset-4"
            >
              {isLogin ? 'Registrujte se' : 'Prijavite se'}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthCard;
