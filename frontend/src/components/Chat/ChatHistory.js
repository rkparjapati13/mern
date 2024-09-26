import React from 'react';

const ChatHistory = ({ messages, chatEndRef }) => {
  const formatMessageTime = (date) => {
    let messageDate;

    // If date is a Unix timestamp (in seconds or milliseconds), create a Date object
    if (typeof date === 'number') {
      messageDate = new Date(date < 1000000000000 ? date * 1000 : date); // Convert seconds to milliseconds if needed
    } else {
      // For ISO date string
      messageDate = new Date(date);
    }

    // Check for invalid dates
    if (isNaN(messageDate.getTime())) {
      console.error('Invalid date:', date);
      return 'Invalid date'; // Handle the error as necessary
    }

    const now = new Date();
    const isToday = now.toDateString() === messageDate.toDateString();

    // Format the time part (e.g., 10:12 AM/PM)
    const timeOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(messageDate);

    return isToday ? `${formattedTime}, Today` : `${formattedTime}, ${messageDate.toDateString()}`;
  };

  return (
    <>
    <div className="chat-history">
      <ul className="m-b-0">
        {messages.map((message) => (
          <li key={message._id} className="clearfix"> {/* Use unique identifier like _id */}
            <div className={`message-data ${message.senderRole === "self" ? "text-right" : ""}`}>
              {/* {message.senderRole === "other" && (
                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
              )} */}
              <span className="message-data-time">{formatMessageTime(message.createdAt)}</span>
            </div>
            <div className={`message ${message.senderRole === "self" ? "my-message float-right" : "other-message "}`}>
              {message.text}
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div ref={chatEndRef} />
    </>
  );
};

export default ChatHistory;
