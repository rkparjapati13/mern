import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const PeopleList = ({ onSelectUser, selectedUserId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await api.get('/users/all');
    setUsers(response.data);
  };

  return (
    <div id="plist" className="people-list">
      <div className="input-group">
        <input type="text" className="form-control" placeholder="Search..." />
      </div>
      <ul className="list-unstyled chat-list mt-2 mb-0">
        {users.map((user, index) => (
          <li
            key={index}
            className={`clearfix ${selectedUserId === user._id ? 'active' : ''}`}
            onClick={() => onSelectUser(user)}
          >
            <img src={`https://bootdey.com/img/Content/avatar/avatar${index + 1}.png`} alt="avatar" />
            <div className="about">
              <div className="name">{user.name}</div>
              <div className="status">
                <i className={`fa fa-circle ${index === 1 ? 'online' : 'offline'}`}></i> 
                {index === 1 ? 'online' : `left ${index * 2 + 7} mins ago`}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeopleList;
