import React, { useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { almacenamiento } from '../firebase/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const ProductoFormulario = ({ agregarProducto, productos }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    file: null,
    fileUrl: '',
  });

  const [validator] = useState(new SimpleReactValidator());
  const [errorMessage, setErrorMessage] = useState('');
  const [progreso, setProgreso] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const uploadFile = async () => {
    try {
      if (!formData.file) {
        alert("Por favor, selecciona un archivo.");
        return;
      }
      const fileRef = ref(almacenamiento, `uploads/${formData.file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, formData.file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progresoActual = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgreso(progresoActual);
        },
        (error) => {
          console.error("Error al subir el archivo:", error);
          alert("Hubo un error al subir el archivo. Por favor, intenta nuevamente.");
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prevData) => ({ ...prevData, fileUrl: url }));
          //alert("Archivo subido correctamente");
        }
      );
    } catch (error) {
      console.error("Error en el proceso de subida:", error);
      alert("Error al procesar la subida del archivo.");
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (validator.allValid()) {
      // Validar si el producto ya existe
      const productoExistente = productos.find(
        (producto) => producto.name.toLowerCase() === formData.name.toLowerCase()
      );

      if (productoExistente) {
        setErrorMessage(`El producto "${formData.name}" ya existe.`);
        return;
      }
      
      if (!formData.file && !formData.fileUrl) {
        console.warn("No se ha subido ningún archivo, pero es opcional.");
      }    

      // Intentar guardar el producto
      try {
        agregarProducto({
          name: formData.name,
          price: parseFloat(formData.price),
          fileUrl: formData.fileUrl || '',
        });
        alert('¡Producto agregado exitosamente!');
        setFormData({ name: '', price: '', file: null, fileUrl: '' });
        setErrorMessage('');
        setProgreso(0);
      } catch (error) {
        console.error('Error al guardar el producto:', error);
        setErrorMessage('Hubo un problema al guardar el producto. Inténtalo nuevamente.');
      }
    } else {
      validator.showMessages(); // Mostrar mensajes de error de validación
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Agregar Producto</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre del Producto:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />
          {validator.message('name', formData.name, 'required|alpha_space')}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Precio:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={styles.input}
          />
          {validator.message('price', formData.price, 'required|numeric|min:1,num')}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Subir Archivo:</label>
          <input type="file" onChange={handleFileChange} style={styles.input} />

          <button
            type="button"
            onClick={uploadFile}
            style={styles.button}
            disabled={progreso > 0 && progreso < 100} // Deshabilitado durante la subida
          >
            {progreso > 0 && progreso < 100 ? "Subiendo..." : "Subir Archivo"}


            {progreso > 0 && (
              <div style={{ width: '100%', backgroundColor: '#ddd', borderRadius: '5px', marginTop: '10px' }}>
                <div
                  style={{
                    width: `${progreso}%`,
                    backgroundColor: '#4caf50',
                    height: '10px',
                    borderRadius: '5px',
                  }}
                ></div>
              </div>
            )}
          </button>

        </div>
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#1976d3')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#2196f3')}
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: '90%',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9fffa',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 15px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
  },
};

export default ProductoFormulario;