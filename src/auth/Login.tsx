import React, { useContext, useState , useEffect } from "react";
import AxiosConexion from "../config/axios";
import { useNavigate } from "react-router-dom";
import { CRMContext } from "../context/CRMContext";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useContext(CRMContext);
  //redireccionar en caso de estar logueado
  useEffect(() => {
    if (auth.auth) {
      navigate('/', { replace: true });
    }
  }, [auth, navigate]); // Se ejecuta cuando `auth` o `navigate` cambian
  // State para los datos del formulario
  const [credenciales, setCredenciales] = useState({
    email: '',
    password: ''
  });

  // Almacenar lo que el usuario escribe en el state
  const leerDatos = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
  };

  // Iniciar sesión en el servidor
  const iniciarSesion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await AxiosConexion.post('/usuarios/login', credenciales);

      // Extraer el token y actualizar el estado global
      const { token } = res.data;
      setAuth({
        token,
        auth: true
      });

      Swal.fire({
        title: "Login Correcto",
        text: "Iniciaste Sesión",
        icon: "success"
      }).then(() => {
        navigate('/', { replace: true });
      });

    } catch (error: any) {
      if (error.response) {
        Swal.fire({
          title: "Hubo un error",
          text: error.response.data.mensaje,
          icon: "error"
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Ocurrió un error inesperado",
          icon: "error"
        });
      }
    }
  };

  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <div className="contenedor-formulario">
        <form autoComplete="off" onSubmit={iniciarSesion}>
          <div className="campo">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              placeholder="Email para iniciar Sesión"
              required
              onChange={leerDatos}
            />
          </div>
          <div className="campo">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              placeholder="Password para iniciar Sesión"
              required
              onChange={leerDatos}
            />
          </div>
          <input type="submit" value="Iniciar Sesión" className="btn btn-verde btn-block" />
        </form>
      </div>  
    </div>
  );
};

export default Login;
