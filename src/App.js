// src/App.js
import React, { useState } from 'react';
import './App.css';
import LoginScreen from './LoginScreen';
import OwnerDashboard from './OwnerDashboard';
import ManagerDashboard from './ManagerDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    // حفظ بيانات المستخدم في الحالة
    setUser(userData);
  };
  
  const handleLogout = () => {
    setUser(null);
  };

  // عرض الواجهة المناسبة بناءً على حالة تسجيل الدخول ودور المستخدم
  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  switch (user.user_role) {
    case 'owner':
      return <OwnerDashboard user={user} onLogout={handleLogout} />;
    case 'manager':
      return <ManagerDashboard user={user} onLogout={handleLogout} />;
    // يمكنك إضافة حالة الموظف هنا
    // case 'employee':
    //   return <EmployeeDashboard user={user} onLogout={handleLogout} />;
    default:
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }
}

export default App;