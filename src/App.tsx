import { Routes, Route, useNavigate, NavigateOptions, useHref } from "react-router"
import Dashboard from "./pages/Dashboard"
import LayoutAdmin from "./layout/LayoutAdmin"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import { HeroUIProvider } from "@heroui/system"
import DeletedPlots from "./pages/DeletedPlots"
import Otp from "./pages/auth/Otp"
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
        <Route path="otp" element={<Otp />} />
        
        {/* Admin Routes */}
        <Route path="admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="deletedPlots" element={<DeletedPlots/>}/>
        </Route>
      </Routes>
    </HeroUIProvider>

  )
}

export default App
