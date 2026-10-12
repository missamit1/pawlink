import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import MyDogs from './pages/MyDogs.jsx'
import WelcomeDog from './pages/WelcomeDog.jsx'
import SafeZoneEditor from './pages/SafeZoneEditor.jsx'
import RequireAuth from './components/RequireAuth.jsx'

function App() {
  return (
    <div className="app-layout">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/welcome-dog"
          element={
            <RequireAuth>
              <WelcomeDog />
            </RequireAuth>
          }
        />
        <Route
          path="/my-dogs"
          element={
            <RequireAuth>
              <MyDogs />
            </RequireAuth>
          }
        />
        <Route
          path="/safe-zone"
          element={
            <RequireAuth>
              <SafeZoneEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  )
}

export default App
