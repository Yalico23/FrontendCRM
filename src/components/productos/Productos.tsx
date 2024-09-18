import { useState, useEffect, useContext } from "react";
import AxiosConexion from "../../config/axios";
import type { ProductoType } from "../../types";
import Producto from "./Producto";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { CRMContext } from "../../context/CRMContext";
import Swal from "sweetalert2";

const Productos = () => {
  const [auth, setAuth] = useContext(CRMContext); // Añadido setAuth para actualizar el contexto
  const [productos, setProductos] = useState<ProductoType[]>([]);
  const navigate = useNavigate();

  // Consultar la API para obtener productos
  const consultarApi = async () => {
    try {
      const productosConsultados = await AxiosConexion.get("/productos/product", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setProductos(productosConsultados.data);
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

  // Función para eliminar un producto del listado
  const eliminarProductoDelListado = (idProducto: string) => {
    setProductos(productos.filter((producto) => producto._id !== idProducto));
  };

  if (!productos.length) {
    return (
      <>
        <h2>Productos</h2>
        <Link to="/productos/nuevoProducto" className="btn btn-verde nvo-cliente">
          <i className="fas fa-plus-circle"></i> Nuevo Producto
        </Link>
        <Spinner />
      </>
    );
  }

  return (
    <>
      <h2>Productos</h2>
      <Link to="/productos/nuevoProducto" className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i> Nuevo Producto
      </Link>
      <ul className="listado-productos">
        {productos.map((producto) => (
          <Producto key={producto._id} producto={producto} eliminarProductoDelListado={eliminarProductoDelListado} />
        ))}
      </ul>
    </>
  );
};

export default Productos;
