import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        // Registro
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Usuario registrado correctamente');
      } else {
        // Inicio de sesión
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (error) {
      console.error('Error en autenticación:', error);
      alert('Error en autenticación: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isRegistering ? 'Registrar cuenta' : 'Iniciar sesión'}</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit"
          style={styles.button} 
          onMouseOver={(e) => e.target.style.backgroundColor = '#1976d3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2196f3'}>
          {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
        </button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)} style={styles.toggleButton}>
        {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    width: '300px',
    margin: 'auto',
    textAlign: 'center',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  toggleButton: {
    marginTop: '15px',
    color: '#007bff',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Login;