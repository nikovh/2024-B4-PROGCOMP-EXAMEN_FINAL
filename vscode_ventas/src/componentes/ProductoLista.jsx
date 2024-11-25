import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const ProductoLista = ({ productos, agregarAlCarrito, eliminarProducto }) => {
  return (
    <div>
      <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>Productos Disponibles</h2>
      <div style={styles.productContainer}>
        {productos.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          productos.map((producto) => (
            <div key={producto.id} style={styles.productCard}>
              {producto.imagen ? (
                <img src={producto.imagen} alt={producto.name} style={styles.productImage} />
              ) : (
                <img
                  src="https://previews.123rf.com/images/yoginta/yoginta2301/yoginta230100567/196853824-image-not-found-vector-illustration.jpg"
                  alt="Imagen no disponible"
                  style={styles.productImage}
                />
              )}

              <h3 style={styles.productName}>{producto.name}</h3>
              <p style={styles.productPrice}>$ {producto.price}</p>

              <div style={styles.buttonContainer}>
                <button
                  style={styles.addButton}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#f6ba00')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#2196F3')}
                  onClick={() => agregarAlCarrito(producto)}
                >
                  Agregar
                </button>
                <FiTrash2
                  className="trash-icon"
                  color="red"
                  size={24}
                  style={{ cursor: 'pointer' }}
                  onClick={() => eliminarProducto(producto.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  productContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    padding: '10px',
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '10px',
    backgroundColor: '#f9fffa',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  productImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  productName: {
    display: 'flex',
    justifyContent: 'left',
  },
  productPrice: {
    display: 'flex',
    justifyContent: 'start',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'top',
    gap: '10px',
    marginBottom: '10px',
  },
  addButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '2px 15px',
    cursor: 'pointer',
    flex: '1',
    transition: 'background-color 0.3s ease',
  },
};

export default ProductoLista;

