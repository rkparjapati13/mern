import React from 'react';

const ChatHeader = ({ user }) => {
  return (
    <div className="chat-header clearfix">
      <div className="row">
        <div className="col-lg-6">
          {/* <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info"> */}
            <img src={`https://bootdey.com/img/Content/avatar/avatar${user ? 1 : 0}.png`} alt="avatar" />
          {/* </a> */}
          <div className="chat-about">
            <h6 className="m-b-0">{user?.name || "Select a user"}</h6>
            {/* Optionally display last seen or status */}
            {/* <small>Last seen: {user?.lastSeen || "Unknown"}</small> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
