export const agregarAlCarrito = (carrito, producto) => {
    const productoExistente = carrito.find((item) => item.id === producto.id);
    if (productoExistente) {
      return carrito.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    }
    return [...carrito, { ...producto, cantidad: 1 }];
  };
  
  export const disminuirCantidad = (carrito, id) => {
    return carrito
      .map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
      )
      .filter((item) => item.cantidad > 0);
  };
  
  export const eliminarDelCarrito = (carrito, id) => {
    return carrito.filter((item) => item.id !== id);
  };
  