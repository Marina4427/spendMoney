import Auth from "./pages/auth/Auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import './styles/main.css';

function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="auth" element={ <Auth/> } />
          <Route path="" element={ <Home/> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
