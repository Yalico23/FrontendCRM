import Header from './components/layout/Header'
import Navegacion from './components/layout/Navegacion'
import Clientes from './components/clientes/Clientes'
import Pedidos from './components/pedidos/Pedidos'
import Productos from './components/productos/Productos'
import NuevoCliente from './components/clientes/NuevoCliente'
import EditarCliente from './components/clientes/EditarCliente'
import EditarProducto from './components/productos/EditarProducto'
import NuevoProducto from './components/productos/NuevoProducto'
import NuevoPedido from './components/pedidos/NuevoPedido'
import Login from './auth/Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { CRMProvider } from './context/CRMContext'

function App() {
  //Utilizar context
  return (
    <>
      <Router>
        <CRMProvider>
          <Header />
          <div className='grid contenedor contenido-principal'>
            <Navegacion />

            <main className="caja-contenido col-9">
              <Routes>
                <Route path='/' element={<Clientes />} />
                <Route path='/productos' element={<Productos />} />
                <Route path='/pedidos' element={<Pedidos />} />

                <Route path='/clientes/nuevo' element={<NuevoCliente />} />
                <Route path='/clientes/editar/:id' element={<EditarCliente />} />
                <Route path='/clientes/nuevo/:id' element={<NuevoPedido />} />

                <Route path='/productos/product/:id' element={<EditarProducto />} />
                <Route path='/productos/nuevoProducto' element={<NuevoProducto />} />

                <Route path='/login' element={<Login />} />
              </Routes>
            </main>
          </div>
        </CRMProvider>
      </Router>
    </>
  )
}

export default App
