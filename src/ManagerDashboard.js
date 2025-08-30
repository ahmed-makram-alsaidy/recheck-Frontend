// src/ManagerDashboard.js
import React, { useState, useEffect } from 'react';
import { getManagerDashboardData, searchShipment, addEmployee, deleteEmployee } from './api';

function ManagerDashboard({ user, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // حالة لنموذج إضافة موظف
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // حالة للبحث عن شحنة
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  // دالة لجلب البيانات عند تحميل المكون
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getManagerDashboardData(user.access_token);
      setEmployees(response.data);
    } catch (err) {
      setError('فشل في تحميل بيانات الموظفين.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.access_token]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await addEmployee({ name: newName, username: newUsername, password: newPassword }, user.access_token);
      // مسح الحقول وتحديث القائمة
      setNewName('');
      setNewUsername('');
      setNewPassword('');
      fetchData(); 
    } catch (err) {
      alert('فشل في إضافة الموظف. قد يكون اسم المستخدم موجودًا بالفعل.');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      try {
        await deleteEmployee(employeeId, user.access_token);
        fetchData(); // تحديث القائمة بعد الحذف
      } catch (err) {
        alert('فشل في حذف الموظف.');
      }
    }
  };
  
  const handleSearch = async () => {
    if (!searchTerm) return;
    setSearchError('');
    setSearchResult(null);
    try {
      const response = await searchShipment(searchTerm, user.access_token);
      setSearchResult(response.data);
    } catch (err) {
      setSearchError(`لم يتم العثور على الشحنة بالرقم: ${searchTerm}`);
    }
  };

  if (loading) {
    return <div className="dashboard-container">جاري تحميل البيانات...</div>;
  }
  
  if (error) {
    return <div className="dashboard-container error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>لوحة تحكم المدير - مرحباً, {user.user_name}</h2>
        <button onClick={onLogout}>تسجيل الخروج</button>
      </header>
      
      <div className="dashboard-grid">
        {/* قسم إضافة موظف */}
        <div className="card">
          <h3>إضافة موظف جديد</h3>
          <form onSubmit={handleAddEmployee} className="vertical-form">
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="اسم الموظف الكامل" required />
            <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="اسم المستخدم (بالانجليزية)" required />
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="كلمة المرور" required />
            <button type="submit">إضافة</button>
          </form>
        </div>

        {/* قسم البحث عن شحنة */}
        <div className="card">
          <h3>البحث عن شحنة</h3>
          <div className="search-form">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="أدخل رقم الشحنة" />
            <button onClick={handleSearch}>بحث</button>
          </div>
          {searchResult && (
            <div className="search-result">
              <h4>نتيجة البحث:</h4>
              <p><strong>رقم الشحنة:</strong> {searchResult.shipment_id}</p>
              <p><strong>الحالة:</strong> {searchResult.status}</p>
              <p><strong>تم الفحص:</strong> {searchResult.checked ? 'نعم' : 'لا'}</p>
              <p><strong>بواسطة:</strong> {searchResult.inspector_name}</p>
              <p><strong>تاريخ الفحص:</strong> {searchResult.inspected_date ? new Date(searchResult.inspected_date).toLocaleString() : 'N/A'}</p>
            </div>
          )}
          {searchError && <p className="error-message">{searchError}</p>}
        </div>
      </div>
      
      {/* قسم قائمة الموظفين */}
      <div className="card">
        <h3>أداء الموظفين</h3>
        <table>
          <thead>
            <tr>
              <th>اسم الموظف</th>
              <th>عدد الشحنات المفحوصة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.employee_id}>
                <td>{emp.employee_name}</td>
                <td>{emp.inspected_count}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteEmployee(emp.employee_id)}>
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagerDashboard;




