import type { PedidoType, IdPedido } from "../../types"

type PedidoProps = {
  pedido: PedidoType,
  EliminarPedido: (id: IdPedido) => Promise<void>
}

const Pedido = ({pedido, EliminarPedido}:PedidoProps) => {
  return (
    <li className="pedido">
          <div className="info-pedido">
            <p className="id">ID: {pedido.cliente._id}</p>
            <p className="nombre">Cliente: {pedido.cliente.nombre + " " + pedido.cliente.apellido}</p>

            <div className="articulos-pedido">
              <p className="productos">Artículos Pedido: </p>
              <ul>
                {pedido.pedidos.map(articulos => (
                  <li key={articulos._id+pedido._id}>
                    <p>{articulos.nombre}</p>
                    <p>S/.{articulos.precio}</p>
                    <p>Cantidad: {articulos.cantidad}</p>
                  </li>
                ))}
              </ul>
            </div>
            <p className="total">Total: S/.{pedido.total} </p>
          </div>
          <div className="acciones">
            <button type="button" className="btn btn-rojo btn-eliminar" onClick={()=>EliminarPedido({_id: pedido._id})}>
              <i className="fas fa-times"></i>
              Eliminar Pedido
            </button>
          </div>
        </li>
  )
}

export default Pedido