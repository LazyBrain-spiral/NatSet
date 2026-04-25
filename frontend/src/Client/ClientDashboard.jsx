import React from 'react'
import { useState } from 'react';



function ClientDashboard() {
    const [loggedInUser] = useState(localStorage.getItem("loggedInUser"));
  return (
    <div >
      
        <h1 className="text-xl font-bold tracking-tight text-white font-montserrat md:text-3xl justify-center align-middle flex items-center h-screen">
          Welcome {loggedInUser} to your dashboard
        </h1>
      
    </div>
  );
}

export default ClientDashboard
