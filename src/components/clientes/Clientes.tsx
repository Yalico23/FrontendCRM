import AxiosConexion from "../../config/axios";
import { useContext, useEffect, useState } from "react";
import Cliente from "./Cliente";
import { ClienteType } from "../../types";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../layout/Spinner";
// importar context
import { CRMContext } from "../../context/CRMContext";
//
import Swal from "sweetalert2";
const Clientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<ClienteType[]>([]);
  const [auth, setAuth] = useContext(CRMContext);

  // Consultar la API
  const consultarApi = async () => {
    try {
      const clientesConsultas = await AxiosConexion.get("/clientes/clientes", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setClientes(clientesConsultas.data);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // Si el token ha expirado o el usuario no está autenticado, actualiza el contexto y redirige
        Swal.fire({
          title: "Sesión expirada",
          icon: "error"
        }).then(() => {
          setAuth({ token: '', auth: false });
          navigate("/login", { replace: true });
        })
      }
    }
  };

  useEffect(() => {
    if (auth.auth && auth.token) {
      consultarApi();
    } else {
      navigate("/login", { replace: true });
    }
  }, [auth, navigate]);

  const eliminarClienteDelListado = (idCliente: string) => {
    setClientes(clientes.filter((cliente) => cliente._id !== idCliente));
  };

  if (!clientes.length) {
    return (
      <>
        <h2>Clientes</h2>
        <Link to="/clientes/nuevo" className="btn btn-verde nvo-cliente">
          <i className="fas fa-plus-circle"></i>
          Nuevo Cliente
        </Link>
        <Spinner />
      </>
    );
  }

  return (
    <>
      <h2>Clientes</h2>
      <Link to="/clientes/nuevo" className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>

      <ul className="listado-clientes">
        {clientes.map((cliente) => (
          <Cliente
            cliente={cliente}
            key={cliente._id}
            eliminarClienteDelListado={eliminarClienteDelListado}
          />
        ))}
      </ul>
    </>
  );
};

export default Clientes;
