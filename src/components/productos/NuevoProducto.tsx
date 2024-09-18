import AOS from 'aos';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';
//
import React, { useContext, useEffect, useState } from 'react';
import type { PostProductoType } from '../../types';
import AxiosConexion from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

const NuevoProducto = () => {

    const [auth] = useContext(CRMContext)

    useEffect(() => {
        AOS.init();
    }, [])
    //logica
    const navigate = useNavigate()

    const [producto, setProducto] = useState<PostProductoType>({
        nombre: '',
        precio: 0
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
        const {nombre , precio} = producto
        let validar  = !nombre || !precio
        return validar
    }

    const agregarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('nombre', producto.nombre)
        formData.append('precio', producto.precio.toString()) //formdata no acepta number
        if (archivo) {
            formData.append('imagen', archivo); // Solo agregar si archivo no es null
        } else {
            Swal.fire({
                title: "Hubo un error",
                text: "No se subio una imagen",
                icon: "error"
            });
            return; // Salir de la función si no hay archivo
        }
        try {
            await AxiosConexion.post('/productos/product', formData, {
                headers:{
                    'Content-Type' : 'multipart/form-data',
                    Authorization: `Bearer ${auth.token}`
                }
            })
            .then(res => {
                if(res.status === 200){
                    Swal.fire({
                        title: "Agregado Correctamente",
                        text: res.data.mensaje,
                        icon: "success"
                    });
                }
                navigate('/productos', {replace: true})
            })
            
        } catch (error) {
            Swal.fire({
                title: "Hubo un error",
                text: "Vuelva a intentarlo",
                icon: "error"
            });
        }
    }

    return (
        <>
            <h2>Nuevo Producto</h2>

            <form action="/productos" method="POST" onSubmit={agregarProducto}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" placeholder="Nombre Producto" name="nombre" onChange={actualizarState} />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input type="number" name="precio" min="0.00" step="1" placeholder="Precio" onChange={actualizarState} />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    <input type="file" name="imagen" onChange={actualizarArchivo} />
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Agregar Producto" disabled={validarProductos()} />
                </div>
            </form>
        </>
    )
}

export default NuevoProducto