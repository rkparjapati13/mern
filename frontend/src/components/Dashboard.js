import React, { useState, useEffect } from 'react';
import Posts from './Posts';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Posts/>
    </div>
  );
};

export default Dashboard;
