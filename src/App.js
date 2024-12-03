import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';


import './App.css';
import ShoeItems from './component/user/ShoeItem';
import Home from './component/user/home'
import Login from './authenticate/Login';


function App() {
  return (

    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
              <Link to="/auth/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
