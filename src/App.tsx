import { Routes, Route, useNavigate, NavigateOptions, useHref } from "react-router"
import Dashboard from "./pages/Dashboard"
import LayoutAdmin from "./layout/LayoutAdmin"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import { HeroUIProvider } from "@heroui/system"
import DeletedPlots from "./pages/DeletedPlots"
import Otp from "./pages/auth/Otp"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

function App() {
  const navigate = useNavigate();
  return (
    <AuthProvider>
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } />
          <Route path="register" element={
            <ProtectedRoute requireAuth={false}>
              <Register />
            </ProtectedRoute>
          } />
          <Route path="otp" element={
            <ProtectedRoute requireAuth={false}>
              <Otp />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="admin" element={
            <ProtectedRoute>
              <LayoutAdmin />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="deletedPlots" element={<DeletedPlots/>}/>
          </Route>
        </Routes>
      </HeroUIProvider>
    </AuthProvider>
  )
}

export default App
