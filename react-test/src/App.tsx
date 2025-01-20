import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import './App.module.css'


const App = () => {
  return (
    <BrowserRouter>
     <Routes>
     <Route path="/" element={<Login />} />
     <Route path="/home" element={<Home />} />
     </Routes>
    </BrowserRouter>
  )
}

export default App;