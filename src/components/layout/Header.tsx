import { useContext } from "react"
import { CRMContext } from "../../context/CRMContext"
import { useNavigate } from "react-router-dom"

export default function Header({ }) {

  const navigate = useNavigate()

  const [auth, setAuth] = useContext(CRMContext)

  const cerrarSesion = () => {
    setAuth( {token: '', auth: false})
    navigate('/login', {replace: true})
  }

  return (
    <header className="barra">
      <div className="contenedor">
        <div className="contenido-barra">
          <h1>CRM - Administrador de clientes</h1>

          {auth.auth ? (
            <button type="button" className="btn btn-rojo" onClick={cerrarSesion}>
              <i className="far fa-times-circle"></i> Cerrar Sesión
            </button>
          ) : null}

        </div>
      </div>
    </header>
  )
}