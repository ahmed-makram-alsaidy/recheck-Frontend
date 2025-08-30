// src/OwnerDashboard.js
import React, { useState, useEffect } from 'react';
import { getManagers } from './api';

function OwnerDashboard({ user, onLogout }) {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await getManagers(user.access_token);
        setManagers(response.data);
      } catch (error) {
        console.error("Failed to fetch managers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchManagers();
  }, [user.access_token]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>لوحة تحكم المالك - مرحباً, {user.user_name}</h2>
        <button onClick={onLogout}>تسجيل الخروج</button>
      </header>
      <div className="dashboard-content">
        <h3>قائمة المدراء</h3>
        {loading ? <p>جاري تحميل المدراء...</p> : (
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>اسم المستخدم</th>
                <th>شركة</th>
              </tr>
            </thead>
            <tbody>
              {managers.map(manager => (
                <tr key={manager.id}>
                  <td>{manager.name}</td>
                  <td>{manager.username}</td>
                  <td>{manager.company_name} ({manager.company_id})</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* سنضيف نموذج إضافة مدير هنا لاحقًا */}
      </div>
    </div>
  );
}

export default OwnerDashboard;