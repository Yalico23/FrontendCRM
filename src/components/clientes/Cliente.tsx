import type { ClienteType } from "../../types"
import { Link } from "react-router-dom"
import type { IDClienteType } from "../../types"
import AxiosConexion from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";
//
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';
import { useContext } from "react";

type ClienteProps = {
    cliente: ClienteType,
    eliminarClienteDelListado: (idCliente: string) => void;
}

const Cliente = ({ cliente, eliminarClienteDelListado }: ClienteProps) => {
    const [auth] = useContext(CRMContext)
    const { _id, nombre, apellido, empresa, email, telefono } = cliente

    const EliminarCliente = (idCliente : IDClienteType['_id']) => {
        Swal.fire({
            title: "Deseas eliminar a este cliente?",
            text: "Los cambios no podran recuperarse!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si"
        }).then((result) => {
            if (result.isConfirmed) {
                //logica
                AxiosConexion.delete(`/clientes/client/${idCliente}`, {
                    headers:{
                      Authorization:`Bearer ${auth.token}`
                    }
                  }).then(()=>{
                    Swal.fire({
                        title: "Eliminado!",
                        icon: "success"
                    }).then(()=>{
                        eliminarClienteDelListado(idCliente)
                    })
                })
            }
        });
    }

    return (
        <li className="cliente" >
            <div className="info-cliente">
                <p className="nombre">{`${nombre} ${apellido}`}</p>
                <p className="empresa">{empresa}</p>
                <p>{email}</p>
                <p>Tel: {telefono}</p>
            </div>
            <div className="acciones">
                <Link to={`/clientes/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Cliente
                </Link>
                <Link to={`/clientes/nuevo/${_id}`} className="btn btn-amarillo">
                    <i className="fas fa-plus"></i>
                    Nuevo Pedido
                </Link>
                <button type="button" className="btn btn-rojo btn-eliminar" onClick={() => EliminarCliente(_id)}>
                    <i className="fas fa-times"></i>
                    Eliminar Cliente
                </button>
            </div>
        </li >
    )
}

export default Cliente