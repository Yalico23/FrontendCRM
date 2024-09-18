import AxiosConexion from "../../config/axios";
import { useState, useEffect, useContext } from "react";
import Pedido from "./Pedido";
import type { PedidoType, IdPedido } from "../../types";
import Spinner from "../layout/Spinner";
import { CRMContext } from "../../context/CRMContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Pedidos = () => {
  const [auth, setAuth] = useContext(CRMContext);
  const [pedidos, setPedidos] = useState<PedidoType[]>([]);
  const navigate = useNavigate();
  const ObtenerPedidos = async () => {
    try {
      const res = await AxiosConexion.get('/pedidos/pedidos', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setPedidos(res.data);
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
    };
  }
  useEffect(() => {
    if (auth.auth && auth.token) {
      ObtenerPedidos();
    } else if (!auth.auth) {
      navigate('/login', { replace: true });
    }
  }, [auth, navigate]);

  // Eliminar Pedido
  const EliminarPedido = async (id: IdPedido) => {
    const resultado = await Swal.fire({
      title: "¿Deseas eliminar este pedido?",
      text: "No se podrá recuperar el archivo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, elimínalo!",
    });

    if (resultado.isConfirmed) {
      try {
        await AxiosConexion.delete(`/pedidos/pedidos/${id._id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        Swal.fire("¡Eliminado!", "El pedido ha sido eliminado.", "success").then(() => {
          setPedidos(pedidos.filter((pedido) => id._id !== pedido._id));
        });
      } catch (error) {
        Swal.fire("Error", "Hubo un problema al eliminar el pedido.", "error");
      }
    }
  };

  if (!pedidos.length)
    return (
      <>
        <h2>Pedidos</h2>
        <Spinner />
      </>
    );

  return (
    <>
      <h2>Pedidos</h2>

      <ul className="listado-pedidos">
        {pedidos.map((pedido) => (
          <Pedido key={pedido._id} pedido={pedido} EliminarPedido={EliminarPedido} />
        ))}
      </ul>
    </>
  );
};

export default Pedidos;
