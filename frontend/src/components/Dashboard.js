import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Posts from './Posts';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Posts/>
    </div>
  );
};

export default Dashboard;
