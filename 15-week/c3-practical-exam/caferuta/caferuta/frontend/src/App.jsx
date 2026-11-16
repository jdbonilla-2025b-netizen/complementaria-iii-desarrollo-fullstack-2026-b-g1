import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './auth/ProtectedRoute';
import Explorar from './pages/Explorar';
import FincaDetalle from './pages/FincaDetalle';
import Login from './pages/Login';
import Registro from './pages/Registro';
import MisReservas from './pages/MisReservas';
import PanelCaficultor from './pages/PanelCaficultor';
import PanelAdmin from './pages/PanelAdmin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Explorar />} />
          <Route path="/fincas/:id" element={<FincaDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas protegidas por rol: el backend vuelve a validar todo */}
          <Route element={<ProtectedRoute roles={['visitante']} />}>
            <Route path="/mis-reservas" element={<MisReservas />} />
          </Route>
          <Route element={<ProtectedRoute roles={['caficultor']} />}>
            <Route path="/panel" element={<PanelCaficultor />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<PanelAdmin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        CafeRuta · Proyecto académico de Juan Diego Bonilla Orozco · Café de origen, directo desde la finca
      </footer>
    </>
  );
}
