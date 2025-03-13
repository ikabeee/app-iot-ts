import { Routes, Route } from "react-router"
import Dashboard from "./pages/Dashboard"
import LayoutAdmin from "./layout/LayoutAdmin"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
function App() {


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="register" element={<Register />} />
      {/* Admin Routes */}
      <Route path="admin" element={<LayoutAdmin />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
