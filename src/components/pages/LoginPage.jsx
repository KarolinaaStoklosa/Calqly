import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  // Jeśli użytkownik został tu przekierowany z innej strony, wróć tam po zalogowaniu. Jeśli nie - idź do /
  const from = location.state?.from?.pathname || '/';

  // Mapowanie błędów Firebase na polski
  const mapAuthError = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Nieprawidłowy email lub hasło.';
      case 'auth/too-many-requests':
        return 'Zbyt wiele prób logowania. Spróbuj później.';
      default:
        return 'Wystąpił błąd logowania. Spróbuj ponownie.';
    }
  };

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);
      await login(data.email, data.password);
      navigate(from, { replace: true }); // Używamy 'replace' żeby nie można było cofnąć do logowania
    } catch (err) {
      console.error(err);
      setError(mapAuthError(err.code));
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError('Nie udało się zalogować przez Google.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Witaj ponownie</h1>
          <p className="text-gray-500 mt-2">Zaloguj się, aby zarządzać projektami</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-100">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">Hasło</label>
                {/* Opcjonalnie: Link do resetu hasła */}
                <Link to="/forgot-password" class="text-xs text-blue-600 hover:underline">Zapomniałeś hasła?</Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                {...register('password', { required: 'Hasło jest wymagane' })} 
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

          <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-md">
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
          <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500 font-medium">LUB</span></div>
        </div>

        <button onClick={handleGoogleLogin} className="w-full py-2.5 flex justify-center items-center gap-3 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 bg-white">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5"/>
          Zaloguj się przez Google
        </button>

        <p className="text-sm text-center text-gray-600">
          Nie masz konta? <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;