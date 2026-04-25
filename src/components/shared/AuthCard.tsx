import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { LoginPayload, RegisterFormData } from '../../types/auth';
import { Role } from '../../types/auth';
import { authService } from '../../services/authService';

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
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<LoginPayload>(initialLoginData);
  const [registerData, setRegisterData] = useState<RegisterFormData>(initialRegisterData);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(loginData.email, loginData.password);
        toast.success('Uspešno ste se prijavili!');
        const role = authService.getRole();
        navigate(role === Role.Employee ? '/admin/dashboard' : '/');
      } else {
        if (registerData.password !== registerData.confirmPassword) {
          toast.error('Lozinke se ne poklapaju.');
          return;
        }
        const { confirmPassword, ...payload } = registerData;
        await authService.register(payload);
        toast.success('Nalog je uspešno kreiran! Prijavite se.');
        setIsLogin(true);
        setRegisterData(initialRegisterData);
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Došlo je do greške.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[calc(600px)] bg-white rounded-xl border border-neutral-100 p-8">
      {/* Header */}
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

      {/* Form */}
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
                required
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
                required
                placeholder="••••••••"
                className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
              />
            </div>

            <div className="text-right">
              <button type="button" className="text-xs text-neutral-400 hover:text-black transition-colors">
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
                  required
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
                  required
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
                required
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
                required
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
                required
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
                required
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
                required
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

      {/* Footer */}
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
  );
};

export default AuthCard;
