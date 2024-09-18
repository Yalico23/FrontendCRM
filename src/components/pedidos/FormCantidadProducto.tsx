import type { CartProductoType } from "../../types"
import { useState, useEffect, useContext } from "react"
import type { ProductoType } from "../../types"
import AxiosConexion from "../../config/axios"
import { CRMContext } from "../../context/CRMContext"

type FormCantidadProductoProps = {
    cartPro: CartProductoType,
    restarCantidadProducto: (producto: CartProductoType) => void,
    sumarCantidadProducto: (producto: CartProductoType) => void,
    eliminaritemCart: (producto: CartProductoType) => void
}
const FormCantidadProducto = ({cartPro, restarCantidadProducto , sumarCantidadProducto, eliminaritemCart}: FormCantidadProductoProps) => {
    const [auth] = useContext(CRMContext)
    const [producto , setProducto] = useState<ProductoType>({
        _id: '',
        nombre: '',
        imagen: '',
        precio: 0
    })
    const productoApi = async () => {
        const res = await AxiosConexion.get(`/productos/product/${cartPro.producto}`, {
            headers:{
              Authorization:`Bearer ${auth.token}`
            }
          })
        setProducto(res.data)
    }

    useEffect(()=>{
        productoApi()
    },[])

    return (
        <li>
            <div className="texto-producto">
                <p className="nombre">{producto.nombre}</p>
                <p className="precio">S/.{producto.precio}</p>
            </div>
            <div className="acciones">
                <div className="contenedor-cantidad">
                    <i className="fas fa-minus" onClick={()=>restarCantidadProducto(cartPro)} ></i>
                    <input type="text" name="cantidad" value={cartPro.cantidad} readOnly />
                    <i className="fas fa-plus" onClick={()=>sumarCantidadProducto(cartPro)}></i>
                </div>
                <button type="button" className="btn btn-rojo" onClick={()=>eliminaritemCart(cartPro)}>
                    <i className="fas fa-minus-circle" ></i>
                    Eliminar Producto
                </button>
            </div>
        </li>
    )
}

export default FormCantidadProducto