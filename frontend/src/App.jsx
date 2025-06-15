import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Container from './components/Container'
import Home from './pages/Home'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Container/>} />
      </Routes>
    </Router>
  );
};

export default App;
