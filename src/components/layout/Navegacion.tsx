import { Link } from "react-router-dom"
import { CRMContext } from "../../context/CRMContext"
import { useContext } from "react"

const Navegacion = () => {

  const [auth] = useContext(CRMContext)

  if(!auth.auth) return null;

  return (
    <aside className="sidebar col-3">
      <h2>Administración</h2>

      <nav className="navegacion">
        <Link to={"/"} className="clientes">Clientes</Link>
        <Link to={"/productos"} className="productos">Productos</Link>
        <Link to={"pedidos"} className="pedidos">Pedidos</Link>
      </nav>
    </aside>
  )
}

export default Navegacion