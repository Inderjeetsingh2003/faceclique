import './index.css'
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import  Login  from './Components/Login';
import  Signup  from './Components/Signup';
import  Home  from './Components/Home';

function App() {
  return (
    <>
    <Router>
      
      <Routes>
        <Route exact path="/" element={ <Home />} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/signup" element={<Signup/>} />
      </Routes>
     
    </Router>
    </>
  );
}

export default App;
