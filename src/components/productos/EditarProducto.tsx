import React, { useState, useEffect, useContext } from "react"
import AxiosConexion from "../../config/axios"
import { useParams, useNavigate } from 'react-router-dom'
import type { ProductoType } from "../../types"
import Swal from "sweetalert2"
import { CRMContext } from "../../context/CRMContext"

const EditarProducto = () => {
  const [auth] = useContext(CRMContext)
  const { id } = useParams()
  const navigate = useNavigate()
  const URLNODE = import.meta.env.VITE_API_BACKEND//env

  const consultarApi = async () => {
    const res = await AxiosConexion.get(`/productos/product/${id}`, {
      headers:{
        Authorization: `Bearer ${auth.token}`
      }
    })
    setProducto(res.data)
  }
  useEffect(() => {
    consultarApi()
  }, [id])

  const [producto, setProducto] = useState<ProductoType>({
    _id: '',
    nombre: '',
    precio: 0,
    imagen: ''
  })

  const [archivo, setArchivo] = useState<File | null>(null)

  const actualizarState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    })
  }

  const actualizarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setArchivo(files[0]); // Almacena el primer archivo en el estado
    } else {
      setArchivo(null); // O maneja el caso cuando no hay archivo seleccionado
    }
  }
  const validarProductos = () => {
    const { nombre, precio } = producto
    let validar = !nombre || precio<=0
    return validar
  }


  const agregarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('nombre', producto.nombre)
    formData.append('precio', producto.precio.toString())
    if (archivo) {
      formData.append('imagen', archivo); // Solo agregar si archivo no es null

    }
    try {
      const res = await AxiosConexion.put(`/productos/product/${producto._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`
        }
      });

      if (res.status === 200) {
        Swal.fire({
          title: "Agregado Correctamente",
          text: res.data.mensaje,
          icon: "success"
        });
        navigate('/productos', { replace: true });
      }

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Hubo un error",
        text: "Vuelva a intentarlo",
        icon: "error"
      });
    }

  }

  return (
    <>
      <h2>Editar Producto</h2>

      <form action="/productos" method="POST" onSubmit={agregarProducto}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input type="text" placeholder="Nombre Producto" name="nombre" onChange={actualizarState} value={producto.nombre} />
        </div>

        <div className="campo">
          <label>Precio:</label>
          <input type="number" name="precio" min="0.00" step="1" placeholder="Precio" onChange={actualizarState} value={producto.precio} />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          {producto.imagen ? (
            <img src={`${URLNODE}/${producto.imagen}`} alt="imagen" width={300} />
          ) : null}
          <input type="file" name="imagen" onChange={actualizarArchivo} />
        </div>

        <div className="enviar">
          <input type="submit" className="btn btn-azul" value="Agregar Producto" disabled={validarProductos()} />
        </div>
      </form>
    </>
  )
}

export default EditarProducto