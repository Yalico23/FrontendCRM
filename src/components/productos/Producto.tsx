import type { ProductoType } from "../../types"
import { Link } from "react-router-dom"
import type { IDProductoType } from "../../types"
import AxiosConexion from "../../config/axios"
import { CRMContext } from "../../context/CRMContext"
//
import Swal from 'sweetalert2';
import { useContext } from "react"

type ProductosProps = {
    producto : ProductoType,
    eliminarProductoDelListado: (idProducto: string) => void
}

const Producto = ({producto, eliminarProductoDelListado} : ProductosProps) => {
    const URL = import.meta.env.VITE_API_BACKEND
    const [auth] = useContext(CRMContext)
    const { _id, nombre , precio, imagen }  = producto

    const eliminarProducto = (id : IDProductoType['_id']) => {
        Swal.fire({
            title: "Deseas eliminar este producto?",
            text: "Los cambios no podran recuperarse!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si"
        }).then( async (result) => {
            if (result.isConfirmed) {
                //logica
                await AxiosConexion.delete(`/productos/product/${id}`, {
                    headers:{
                        Authorization:`Bearer ${auth.token}`
                    }
                })
                Swal.fire({
                    title: "Eliminado!",
                    icon: "success"
                }).then(()=>{
                    eliminarProductoDelListado(id)
                })
            }
        });
    }

    return (
        <li className="producto">
            <div className="info-producto">
                <p className="nombre">{nombre}</p>
                <p className="precio">S/.{precio}</p>
                {imagen ? (
                    <img src={`${URL}/${imagen}`} alt={imagen} />
                ) : null
                }
            </div>
            <div className="acciones">
                <Link to={`/productos/product/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Producto
                </Link>

                <button type="button" className="btn btn-rojo btn-eliminar" onClick={() => eliminarProducto(_id)}>
                    <i className="fas fa-times"></i>
                    Eliminar Producto
                </button>
            </div>
        </li>
    )
}

export default Producto