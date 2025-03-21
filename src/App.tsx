import { Routes, Route, useNavigate, NavigateOptions, useHref } from "react-router"
import Dashboard from "./pages/Dashboard"
import LayoutAdmin from "./layout/LayoutAdmin"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import { HeroUIProvider } from "@heroui/system"
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}
function App() {
  const navigate = useNavigate();
  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />
        {/* Admin Routes */}
        <Route path="admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </HeroUIProvider>

  )
}

export default App
