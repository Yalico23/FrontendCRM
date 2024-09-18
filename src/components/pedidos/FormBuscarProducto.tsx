import React from "react"
import type { ProductoType } from "../../types"

type FormBuscarProps = {
    leerDatosBusqueda: (e: React.ChangeEvent<HTMLInputElement>) => void,
    productosFiltrados: ProductoType[],
    LimpiarBuscador: () => void,
    AgregarCartProducto: (item: ProductoType) => void
}

const FormBuscarProducto = ({ leerDatosBusqueda, productosFiltrados, LimpiarBuscador, AgregarCartProducto }: FormBuscarProps) => {
    return (
        <>
            <form>
                <legend>Buscar un Producto y agrega una cantidad</legend>
                <div className="campo">
                    <label htmlFor="">Productos:</label>
                    <input type="text" id="buscador" placeholder="Nombre Procutos" name="productos" onChange={leerDatosBusqueda} />
                </div>
                <button type="button" className="btn btn-azul btn-block" onClick={LimpiarBuscador} >Limpiar Buscador</button>
            </form>
            <ul>
                {productosFiltrados.map(producto => (
                    <li className="item-compra" key={producto._id}>
                        <div className="flex"> 
                            <p>{producto.nombre}</p>
                            <button className="btn btn-rojo" onClick={()=>AgregarCartProducto(producto)}>Agregar</button>    
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default FormBuscarProducto