import AOS from 'aos';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';
//
import React, { useContext, useEffect, useState } from 'react';
import { ClienteType} from '../../types';
import AxiosConexion from '../../config/axios';
import { useNavigate , useParams} from 'react-router-dom'
import { CRMContext } from '../../context/CRMContext';

const EditarCliente = () => {
    const [auth] = useContext(CRMContext)
    //_id
    const {id}  = useParams()
    //console.log(id)
    //Navigate con router dom
    const navigate = useNavigate()
    //Efecto AOS
    useEffect(() => {
      AOS.init();
    }, [])
    //logica del componente //porque trabajaremos con un objeto y no un arreglo de objetos
    const [cliente, setCliente] = useState<ClienteType>({
      _id: '',
      nombre: '',
      apellido: '',
      empresa: '',
      email: '',
      telefono: ''
    })

    //Query api
    const consultarApi = async () =>{
        const clienteConsulta = await AxiosConexion.get(`/clientes/client/${id}`, {
          headers:{
            Authorization:`Bearer ${auth.token}`
          }
        })
        //console.log(clienteConsulta.data)
        setCliente(clienteConsulta.data)
    }
    //useEffect api
    useEffect(()=>{
        consultarApi()
    },[])
  
    const actualizarState = (e: React.ChangeEvent<HTMLInputElement>) => {
      //console.log("escribiendo...", e.target.value)
      setCliente({
        ...cliente,//una copia para no perder los valores
        [e.target.name]: e.target.value
      })
    }
  
    const ValidarCliente = () => {
      const { nombre, apellido, email, empresa, telefono } = cliente
      let valido = !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono.length
  
      return valido
    }
  
    const ActualizarCliente = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      AxiosConexion.put(`/clientes/client/${cliente._id}`, cliente , {
        headers:{
          Authorization:`Bearer ${auth.token}`
        }
      })
        .then(res => {
          //console.log(res.data.code)
          if (res.data.code === 11000) {
            Swal.fire({
              title: "Hubo un error",
              text: "Ese Cliente ya esta registrado",
              icon: "error",
              width: '40em',
              padding: '1rem'
            });
          } else {
            Swal.fire({
              title: "Ejecucion Exitosa",
              text: res.data.mensaje,
              icon: "success",
              width: '40em',
              padding: '1rem'
            });
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 1500);
          }
        })
    }
  
    return (
      <>
        <h2>Editar Cliente</h2>
        <form action="/clientes" onSubmit={ActualizarCliente} autoComplete='off'>
          <legend>Llena todos los campos</legend>
  
          <div className="campo">
            <label htmlFor="nombre" >Nombre:</label>
            <input type="text" placeholder="Nombre Cliente" name="nombre" id="nombre" onChange={actualizarState} defaultValue={cliente.nombre}/>
          </div>
  
          <div className="campo">
            <label htmlFor="apellido">Apellido:</label>
            <input type="text" placeholder="Apellido Cliente" name="apellido" id="apellido" onChange={actualizarState} defaultValue={cliente.apellido}/>
          </div>
  
          <div className="campo">
            <label htmlFor="empresa">Empresa:</label>
            <input type="text" placeholder="Empresa Cliente" name="empresa" id="empresa" onChange={actualizarState} defaultValue={cliente.empresa}/>
          </div>
  
          <div className="campo" data-aos="fade-in">
            <label htmlFor="email">Email:</label>
            <input type="email" placeholder="Email Cliente" name="email" id="email" onChange={actualizarState} defaultValue={cliente.email}/>
          </div>
  
          <div className="campo" data-aos="fade-in">
            <label htmlFor="telefono">Teléfono:</label>
            <input type="tel" placeholder="Teléfono Cliente" name="telefono" id="telefono" onChange={actualizarState} defaultValue={cliente.telefono}/>
          </div>
  
          <div className="enviar" data-aos="fade-in">
            <input type="submit" className="btn btn-azul" defaultValue="Actualizar Cliente" disabled={ValidarCliente()} />
          </div >
  
        </form>
      </>
    )
}

export default EditarCliente