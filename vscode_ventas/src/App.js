import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ProductoFormulario from './componentes/ProductoFormulario';
import ProductoLista from './componentes/ProductoLista';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import { FiTrash2 } from 'react-icons/fi';
import useFirebaseAuth from './auth/useFirebaseAuth';
import Login from './componentes/Login';
import 'bootstrap/dist/css/bootstrap.min.css'; // MODIFICACIÓN: Importar Bootstrap CSS

const App = () => {
  const { user, loading, logout } = useFirebaseAuth();
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  
  // Monitorear si la pantalla es móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600); // Actualiza si la pantalla es móvil o no
    };

    window.addEventListener('resize', handleResize); // Escucha cambios en el tamaño de la ventana

    return () => {
      window.removeEventListener('resize', handleResize); // Limpia el listener al desmontar
    };
  }, []);

  // Cargar productos desde Firestore al inicio
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const productosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(productosData);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    if (user) {
      fetchProductos();
    }
  }, [user]);

  // Función para agregar un producto a Firestore y actualizar la lista local
  const agregarProducto = async (producto) => {
    try {
      // const docRef = await addDoc(collection(db, 'productos'), producto);
      
      const docRef = await addDoc(collection(db, 'productos'), {...producto, imagen: producto.fileUrl, });
      setProductos([...productos, { id: docRef.id, ...producto, imagen: producto.fileUrl }]);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  // Función para eliminar un producto de Firestore y actualizar la lista local
  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, 'productos', id));
      setProductos(productos.filter((producto) => producto.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find((item) => item.id === producto.id);

      if (productoExistente) {
        return prevCarrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  // Función para disminuir la cantidad de un producto en el carrito
  const disminuirCantidad = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== id));
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <Router>
      <div style={styles.page}>
        {!user ? (
          <Routes>
            <Route path="/*" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        ) : (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Tienda de Compras</h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <p style={{ margin: 0 }}>Conectado como: {user.email}</p>
                <button
                  style={{
                    backgroundColor: '#bdbdbd',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '2px 15px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#ea1e63')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#bdbdbd')}
                  onClick={logout}
                >
                  Cerrar sesión
                </button>
              </div>

              <nav style={styles.nav}>
                <Link to="/" style={styles.link}>Inicio</Link> |{' '}
                <Link to="/agregar-producto" style={styles.link}>Agregar Producto</Link>
              </nav>
            </div>
            <Routes>
              <Route
                path="/"
                element={
                  <div style={styles.mainContainer}>
                    <div style={styles.productListContainer}>
                      <ProductoLista
                        productos={productos}
                        agregarAlCarrito={agregarAlCarrito}
                        eliminarProducto={eliminarProducto}
                      />
                    </div>
                    <div style={styles.carritoContainer}>
                      <h2 style={styles.carritoTitle}><i className="fas fa-shopping-cart"></i> Carrito de Compras</h2>
                      {carrito.length === 0 ? (
                        <p style={styles.emptyCarrito}>El carrito está vacío.</p>
                      ) : (
                        <div>
                          {carrito.map((item) => (
                            <div key={item.id} style={styles.carritoItem}>


                                {item.imagen ? (
                                  <img
                                    src={item.imagen}
                                    alt={item.name}
                                    style={styles.itemImage}
                                  />
                                ) : (
                                  <img
                                    src="https://previews.123rf.com/images/yoginta/yoginta2301/yoginta230100567/196853824-image-not-found-vector-illustration.jpg"
                                    alt="Imagen no disponible"
                                    style={styles.itemImage}
                                  />
                                )}


                              <div style={styles.itemInfo}>
                                <h3 style={styles.itemName}>{item.name}</h3>
                                <p style={styles.itemPrice}>${item.price}</p>
                              </div>
                              <div style={styles.quantityControls}>
                                <button
                                  style={styles.quantityButton}
                                  onClick={() => disminuirCantidad(item.id)}
                                >
                                  -
                                </button>
                                <span style={styles.quantity}>{item.cantidad}</span>
                                <button
                                  style={styles.quantityButton}
                                  onClick={() => agregarAlCarrito(item)}
                                >
                                  +
                                </button>
                                <FiTrash2 className="trash-icon" color="red" size={20} style={{ cursor: 'pointer' }} onClick={() => eliminarDelCarrito(item.id)} />
                              </div>
                            </div>
                          ))}
                          <div style={styles.totalContainer}>
                            <span style={styles.totalLabel}>Total</span>
                            <span style={styles.totalValue}>
                              ${carrito.reduce(
                                (total, item) => total + item.price * item.cantidad,
                                0
                              )}
                            </span>
                          </div>
                          <button
                            $1 style={styles.checkoutButton}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#28a745'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#2196f3'}
                          >
                            Proceder al Pago
                          </button>





                        </div>
                      )}
                    </div>
                  </div>
                }
              />
              <Route
                path="/agregar-producto"
                element={
                  <ProductoFormulario
                    agregarProducto={agregarProducto}
                    productos={productos}
                  />
                }
              />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};


const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#e0e0e0',
  },
  header: {
    textAlign: 'left',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '1200px',
  },
  title: {
    marginBottom: '10px',
    fontWeight: 'bold',
    fontSize: '48px',
  },
  nav: {
    marginTop: '10px',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
  },
  mainContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1200px',
    gap: '20px', // Espaciado entre productos y carrito
  },
  productListContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Adaptable según el espacio disponible
    gap: '20px',
    flex: '1 1 70%',
  },
  carritoContainer: {
    flex: '1 1 25%',
    maxWidth: '400px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  carritoTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  carritoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px',
  },
  itemImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    marginRight: '10px',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  itemPrice: {
    fontSize: '16px',
    color: '#555',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '16px',
  },
  quantity: {
    fontSize: '16px',
  },
  totalContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  totalLabel: {
    color: '#333',
  },
  totalValue: {
    color: '#000',
  },
  checkoutButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
  },
  emptyCarrito: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#777',
  },
};

// Media queries para pantallas pequeñas
const mediaQuery = `
@media (max-width: 768px) {
  .mainContainer {
    flex-direction: column; /* Apila los elementos en pantallas pequeñas */
  }
  .carritoContainer {
    max-width: 100%; /* Asegura que el carrito ocupe todo el ancho disponible */
    margin-left: 0; /* Elimina el margen izquierdo */
  }
}`;

export default App;
