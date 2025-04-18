import React, { useState } from 'react';
import axios from 'axios';
import './LoginSingup.css';

import emailIcon from '../Assets/email.svg';
import passwordIcon from '../Assets/password.svg';
import personIcon from '../Assets/person.svg';
import eyeFill from '../Assets/eye-fill.svg';
import eyeSlashFill from '../Assets/eye-slash-fill.svg';

export default function LoginSingup() {
  const [action, setAction] = useState("login");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: ''
    };

    let isValid = true;

    if (action === 'signup') {
      if (!formData.name.trim()) {
        newErrors.name = 'Nome é obrigatório';
        isValid = false;
      } else if (formData.name.length < 1) {
        newErrors.name = 'Nome deve ter pelo menos 1 caractere';
        isValid = false;
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
      isValid = false;
    } else {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
      
      const missingRequirements = [];
      
      if (!hasUpperCase) missingRequirements.push('uma letra maiúscula');
      if (!hasNumber) missingRequirements.push('um número');
      if (!hasSpecialChar) missingRequirements.push('um caractere especial');
      
      if (missingRequirements.length > 0) {
        newErrors.password = `A senha deve conter ${missingRequirements.join(', ')}`;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({ name: '', email: '', password: '' });

    const endpoint = action === 'login' ? '/login' : '/signup';
    const payload = action === 'login' 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await axios.post(`http://localhost:4000${endpoint}`, payload);
      
      if(action === 'login') {
        alert(`Bem-vindo, ${response.data.user.name}!`);
      } else {
        alert('Cadastro realizado com sucesso!');
        setAction('login');
      }
      
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao processar sua solicitação';
      setErrors(prev => ({ ...prev, form: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action === 'login' ? 'Entrar' : 'Cadastrar'}</div>
        <div className="underline"></div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="inputs">
          {action === 'signup' && (
            <div className="input-container">
              <div className="input">
                <img src={personIcon} alt="Nome" />
                <input
                  type="text"
                  name="name"
                  placeholder="Nome"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              {errors.name && <span className="error-field">{errors.name}</span>}
            </div>
          )}

          <div className="input-container">
            <div className="input">
              <img src={emailIcon} alt="Email" />
              <input
                type="email"
                name="email"
                placeholder="nome@mail.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            {errors.email && <span className="error-field">{errors.email}</span>}
          </div>

          <div className="input-container" style={{ paddingBottom: '17px' }}>
            <div className="input">
              <img src={passwordIcon} alt="Senha" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleInputChange}
              />
              <img 
                src={showPassword ? eyeSlashFill : eyeFill} 
                alt="Toggle visibilidade" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
              />
            </div>
            {errors.password && <span className="error-field">{errors.password}</span>}
          </div>
        </div>

        {errors.form && <div className="error-message">{errors.form}</div>}

        <div className="submitContainer">
          <button
            type="submit"
            className={`submit ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Processando...' : (action === 'login' ? 'Entrar' : 'Cadastrar')}
          </button>
        </div>

        <div className="toggle-link">
          {action === 'login' ? (
            <>
              Não possui conta? {' '}
              <span onClick={() => setAction('signup')}>Cadastre-se</span>
            </>
          ) : (
            <>
              Já possui conta? {' '}
              <span onClick={() => setAction('login')}>Entrar</span>
            </>
          )}
        </div>
      </form>
    </div>
  );
}