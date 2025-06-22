import Navbar from "./scenes/navbar";
import Produtos from "./pages/Produtos";
import Home from "./pages/Home";
import Pedidos from "./pages/Pedidos";
import Perfil from "./pages/Perfil";
import { UserProvider } from "./pages/UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



function App() {
  return (
    <Router>
      <Navbar />
      <main className="App bg-gray-20">
        <UserProvider>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </UserProvider>
      </main>
    </Router>
  )
}

export default App
