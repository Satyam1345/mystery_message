'use client';

import React, { useState } from 'react';
import { useParams} from 'next/navigation';

const Page = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const {username} = useParams() ;

  const sendMessage = async () => {
    console.log(username) ;
    if (!username || !message.trim()) {
      setStatus('Username or message cannot be empty.');
      return;
    }

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, content: message }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(data.message);
        setMessage(''); // Clear input after success
      } else {
        setStatus(data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('Unexpected error occurred.');
    }
  };

  return (
    
    <>
                    {/* <Navbar/> */}
    <div className="p-5 max-w-md mx-auto mt-40 bg-white shadow-xl rounded-md">

  <h1 className="text-2xl font-bold mb-4">Send a Secret Text to {username}🤭 </h1>
  
  <div className="mb-4">
    <label
      htmlFor="message"
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      Enter your message:
    </label>
    <input
      type="text"
      id="message"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
  
  <button
    onClick={sendMessage}
    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    Send Message
  </button>
  
  {status && (
    <p className={`mt-4 text-sm ${status === "Messages sent Successfully" ? 'text-green-600' : 'text-red-600'}`}>
      {status}
    </p>
  )}
</div>
    </>

  );
};

export default Page;
