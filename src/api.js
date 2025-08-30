// src/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_URL,
});

// دالة لتسجيل الدخول
export const login = (username, password, companyId) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  // FastAPI يتوقع company_id كجزء من الطلب، لكننا سنتحقق منه في الواجهة
  return apiClient.post('/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

// يمكنك إضافة بقية دوال الـ API هنا
// مثال:
export const getManagers = (token) => {
  return apiClient.get('/owner/managers', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getManagerDashboardData = (token) => {
  return apiClient.get('/manager/performance', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const searchShipment = (shipmentId, token) => {
  return apiClient.get(`/manager/search/${shipmentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addEmployee = (employeeData, token) => {
  return apiClient.post('/manager/employees', employeeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteEmployee = (employeeId, token) => {
  return apiClient.delete(`/manager/employees/${employeeId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};