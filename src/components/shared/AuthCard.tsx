import React, { useState, type FormEvent } from 'react';

const AuthCard: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(`Submitted ${isLogin ? 'Login' : 'Registration'} data:`, formData);
    alert(`${isLogin ? 'Login' : 'Registracija'} uspešna! (Podaci su u konzoli)`);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl border border-neutral-100 p-8">
      {/* Header */}
      <div className=" mb-8">
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
        {!isLogin && (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-700 ml-1">Ime i prezime</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Marko Marković"
              className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-700 ml-1">Email adresa</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
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
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="••••••••"
            className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
          />
        </div>

        {!isLogin && (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-700 ml-1">Potvrdi lozinku</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="••••••••"
              className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
            />
          </div>
        )}

        {isLogin && (
          <div className="text-right">
            <button type="button" className="text-xs text-neutral-400 hover:text-black transition-colors">
              Zaboravili ste lozinku?
            </button>
          </div>
        )}

        <button
          type="submit"
          className="mt-4 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-black/10"
        >
          {isLogin ? 'Prijavi se' : 'Registruj se'}
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