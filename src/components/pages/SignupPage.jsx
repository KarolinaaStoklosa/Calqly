import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const password = watch('password');

  const mapAuthError = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Ten adres email jest już zajęty.';
      case 'auth/invalid-email':
        return 'Nieprawidłowy format adresu email.';
      case 'auth/weak-password':
        return 'Hasło jest zbyt słabe.';
      default:
        return 'Nie udało się utworzyć konta. Spróbuj ponownie.';
    }
  };

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);
      await signup(data.email, data.password);
      navigate('/'); 
    } catch (err) {
      setError(mapAuthError(err.code));
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Dołącz do nas</h1>
          <p className="text-gray-500 mt-2">Utwórz darmowe konto, aby zacząć</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-100">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* EMAIL */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                placeholder="twoj@email.com"
                {...register('email', { required: 'Email jest wymagany' })} 
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* HASŁO */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Hasło</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Min. 6 znaków"
                {...register('password', { 
                    required: 'Hasło jest wymagane', 
                    minLength: { value: 6, message: 'Hasło musi mieć co najmniej 6 znaków' } 
                })} 
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              />
               <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* POTWIERDŹ HASŁO */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Potwierdź Hasło</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Powtórz hasło"
                {...register('confirmPassword', { 
                    required: 'Potwierdzenie hasła jest wymagane', 
                    validate: value => value === password || 'Hasła nie są takie same' 
                })} 
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* CHECKBOX */}
          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <div className="flex items-start">
              <input 
                id="accept-disclaimer"
                type="checkbox" 
                {...register('acceptDisclaimer', { required: 'Akceptacja jest wymagana' })}
                className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="accept-disclaimer" className="ml-3 text-xs text-gray-600 leading-relaxed cursor-pointer">
                Rozumiem, że Qalqly jest narzędziem wspomagającym i zobowiązuję się do weryfikacji wyników. 
                Akceptuję <Link to="/disclaimer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Regulamin i Oświadczenie</Link>.
              </label>
            </div>
            {errors.acceptDisclaimer && <p className="text-red-500 text-xs mt-1 ml-7">{errors.acceptDisclaimer.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-md">
            {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Masz już konto? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;