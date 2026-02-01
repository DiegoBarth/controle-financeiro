import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Gastos } from './pages/Gastos';
import { Compromissos } from './pages/Compromissos';
import { Receitas } from './pages/Receitas';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gastos" element={<Gastos />} />
      <Route path="/compromissos" element={<Compromissos />} />
      <Route path="/receitas" element={<Receitas />} />
    </Routes>
  );
}

export default App;
