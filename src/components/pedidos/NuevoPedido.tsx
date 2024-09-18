import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AxiosConexion from "../../config/axios"
import type { ClienteType, ProductoType, CartProductoType } from "../../types"
import FormBuscarProducto from "./FormBuscarProducto"
import FormCantidadProducto from "./FormCantidadProducto"
import { CRMContext } from "../../context/CRMContext"
//
import Swal from "sweetalert2"

const NuevoPedido = () => {
  const [auth] = useContext(CRMContext)
  //navigate
  const navigate = useNavigate()
  // Estado del cliente
  const { id } = useParams()
  const [cliente, setCliente] = useState<ClienteType>({
    _id: '',
    nombre: '',
    apellido: '',
    email: '',
    empresa: '',
    telefono: ''
  })

  // Estado para todos los productos
  const [productos, setProducto] = useState<ProductoType[]>([])

  // Estado para productos filtrados
  const [productosFiltrados, setProductosFiltrados] = useState<ProductoType[]>([])

  // Estado para productos en el carrito
  const [cartProducto, setCartProducto] = useState<CartProductoType[]>([])

  // Estado para almacenar el total
  const [total, setTotal] = useState<number>(0)

  // Función para obtener el cliente de la API
  const apiGetCliente = async () => {
    const res = await AxiosConexion.get(`/clientes/client/${id}`, {
          headers:{
            Authorization:`Bearer ${auth.token}`
          }
        })
    setCliente(res.data)
  }

  // Llamar a la API al cargar el componente
  useEffect(() => {
    apiGetCliente()
  }, [id])

  // Función para obtener los productos de la API
  const getProductosApi = async () => {
    const res = await AxiosConexion.get('/productos/product' , {
      headers:{
        Authorization:`Bearer ${auth.token}`
      }
    })
    setProducto(res.data)
  }

  // Llamar a la API para productos al cargar el componente
  useEffect(() => {
    getProductosApi()
  }, [])

  // Actualizar el total cada vez que cambia el carrito
  useEffect(() => {
    const calcularTotal = () => {
      const nuevoTotal = cartProducto.reduce((total, cartItem) => {
        const producto = productos.find(p => p._id === cartItem.producto);
        return total + (producto?.precio ?? 0) * cartItem.cantidad;
      }, 0)
      setTotal(nuevoTotal)
    }

    calcularTotal()
  }, [cartProducto, productos])

  // Función para manejar la búsqueda de productos
  const leerDatosBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    const termino = e.target.value.toLowerCase().trim()
    if (!termino) {
      setProductosFiltrados([]);
      return;
    }
    const productosFiltrados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(termino)
    )
    setProductosFiltrados(productosFiltrados)
  }

  // Funciones para manejar el carrito
  const AgregarCartProducto = (item: ProductoType) => {
    setCartProducto((prevCartProducto) => {
      const productoExistente = prevCartProducto.find(producto => producto.producto === item._id);
      if (productoExistente) {
        return prevCartProducto.map(producto => 
          producto.producto === item._id 
            ? { ...producto, cantidad: producto.cantidad + 1 }
            : producto
        );
      } else {
        const productoResultado = {
          producto: item._id,
          cantidad: 1
        };
        return [...prevCartProducto, productoResultado];
      }
    });
  }

  const restarCantidadProducto = (producto: CartProductoType) => {
    setCartProducto((prevCart) =>
      prevCart.map((item) =>
        item.producto === producto.producto && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    );
  }

  const sumarCantidadProducto = (producto: CartProductoType) => {
    setCartProducto((prevCart) =>
      prevCart.map((item) =>
        item.producto === producto.producto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  }
  //Eliminar producto
  const eliminaritemCart = (producto: CartProductoType) => {
    Swal.fire({
      title: "Deseas Eliminarlo?",
      text: "El producto no se podra recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        setCartProducto((prevCart) => prevCart.filter(item => item.producto !== producto.producto))
      }
    });
    
  }

  // Función para limpiar el buscador
  const LimpiarBuscador = () => {
    setProductosFiltrados([])
    document.querySelector<HTMLInputElement>('#buscador')!.value = ''
  }

  //Realizar Pedido
  const realizarPedido = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const pedido = 
      {
        "cliente" : {
          "client":id
        },
        "pedidos" : cartProducto,
        "total" : total
    }
    //alamacer a BD
    const res = await AxiosConexion.post('/pedidos/pedidos', pedido , {
      headers:{
        Authorization:`Bearer ${auth.token}`
      }
    })
    Swal.fire({
      title: "Exito!!",
      text: res.data.mensaje,
      icon: "success"
    }).then(()=>{
      navigate('/', { replace: true });
    })
  }

  return (
    <>
      <h2>Nuevo Pedido</h2>

      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>Nombre: {`${cliente.nombre} ${cliente.apellido}`}</p>
        <p>Telefono: {`${cliente.telefono}`}</p>
      </div>

      <FormBuscarProducto
        leerDatosBusqueda={leerDatosBusqueda}
        productosFiltrados={productosFiltrados}
        LimpiarBuscador={LimpiarBuscador}
        AgregarCartProducto={AgregarCartProducto}
      />

      <ul className="resumen">
        {cartProducto.map(cartPro => (
          <FormCantidadProducto 
            key={cartPro.producto}
            cartPro={cartPro}
            restarCantidadProducto={restarCantidadProducto}
            sumarCantidadProducto={sumarCantidadProducto}
            eliminaritemCart={eliminaritemCart}
          />
        ))}
      </ul>
      <p className="total">Total a Pagar: <span>S/.{total}</span></p>
      {
        total > 0 ? (
          <form onSubmit={realizarPedido}>
            <input type="submit" className="btn btn-verde btn-block" value='Realizar Pedido' />
          </form>
        ): null
      }
    </>
  )
}

export default NuevoPedido
