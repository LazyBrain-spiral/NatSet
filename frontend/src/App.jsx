import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import Signup from "./Signup";
import Login from "./Login";
import OllamaChat from "./Ollamachat";
import ClientLayout from "./Client/ClientLayout";
import ClientDashboard from "./Client/ClientDashboard";
import OllamaNewTask from "./Client/OllamaNewTask";
import ClientProject from "./Client/ClientProject";
import FreelancerLayout from "./Freelancer/FreelancerLayout";
import FreelancerDashboard from "./Freelancer/FreelancerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import FreelancerProject from "./Freelancer/FreelancerProject"
import FreelancerView from "./Freelancer/FreelancerView"
import FreelancerExecution from "./Freelancer/FreelancerExecution";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<OllamaChat />} />

        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<ClientDashboard />} />
          <Route path="messages" element={<OllamaNewTask />} />
          <Route path="projects/:id" element={<ClientProject />} />
        </Route>

        <Route
          path="/freelancer"
          element={
            <ProtectedRoute allowedRole="freelancer">
              <FreelancerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<FreelancerDashboard />} />
          <Route path="projects" element={<FreelancerProject />} />
          <Route path="projects/:id" element={<FreelancerView />} />
          <Route path="execution/:id" element={<FreelancerExecution />} />
        </Route>
      </Routes>
    </Router>
  );
}
