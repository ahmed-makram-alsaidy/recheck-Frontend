// src/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { login } from './api';

function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // سنحتاج لقائمة المستخدمين لإظهار حقل الشركة بذكاء
  // هذه ميزة متقدمة، سنبسطها الآن
  const [showCompanyId, setShowCompanyId] = useState(false);
  const [companyId, setCompanyId] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleUsernameChange = (value) => {
    setUsername(value);
    // في تطبيق حقيقي، ستبحث عن دور المستخدم هنا
    // للتبسيط، سنفترض أن المالك لا يحتوي على أرقام
    if (/\d/.test(value) && value !== 'owner' && value !== 'ahmed4965') {
        setShowCompanyId(true);
    } else {
        setShowCompanyId(false);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(username, password);
      
      const userData = response.data;

      // التحقق من معرّف الشركة في الواجهة الأمامية
      if (userData.user_role === 'manager' || userData.user_role === 'employee') {
        if (!companyId) {
          setError('يجب إدخال معرّف الشركة لهذا المستخدم.');
          setIsLoading(false);
          return;
        }
        // في تطبيق حقيقي، الـ API يجب أن يعيد company_id للتحقق
        // سنفترض الآن أنه صحيح
      }

      onLoginSuccess(userData);

    } catch (err) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>أهلاً بك</h1>
        <p>سجل الدخول للمتابعة إلى نظام recheck</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {showCompanyId && (
            <input
              type="text"
              placeholder="معرّف الشركة"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
            />
          )}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'جاري التحقق...' : 'دخــــول'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;