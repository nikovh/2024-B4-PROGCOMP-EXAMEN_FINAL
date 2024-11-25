import React from 'react';
import '../styles/ProductoItem.css'

const ProductoItem = ({ producto, agregarAlCarrito }) => {
  return (
    <div className="producto-item">
      <h3>{producto.name}</h3>
      <p>Precio: ${producto.price}</p>
      <button
        className="agregar-carrito-btn"
        onClick={() => agregarAlCarrito(producto)}
      >
        Agregar al Carrito
      </button>
    </div>
  );
};

export default ProductoItem;
