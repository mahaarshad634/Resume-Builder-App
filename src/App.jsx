import { AuthProvider, useAuth } from "./context/AuthContext";

function AuthTest() {
  const { user, loading } = useAuth();
  console.log("Current user:", user);
  console.log("Loading:", loading);
  return <h1>Resume Builder</h1>;
}

function App() {
  return (
    <AuthProvider>
      <AuthTest />
    </AuthProvider>
  );
}

export default App;