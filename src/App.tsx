import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Gastos } from './pages/Gastos';
import { Compromissos } from './pages/Compromissos';
import { Receitas } from './pages/Receitas';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gastos" element={<Gastos />} />
      <Route path="/compromissos" element={<Compromissos />} />
      <Route path="/receitas" element={<Receitas />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
