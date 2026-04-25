// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import Signup from "./Signup";
import Login from "./Login";
import OllamaChat from "./Ollamachat";
import ClientLayout from "./Client/ClientLayout";
import ClientDashboard from "./Client/ClientDashboard"; // Import the child

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<OllamaChat />} />

        
        <Route path="/client" element={<ClientLayout />}>
          <Route path="home" element={<ClientDashboard />} />
          
        </Route>
      </Routes>
    </Router>
  );
}
