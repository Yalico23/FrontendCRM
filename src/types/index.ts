//Clientes
export type ClienteType = {
    _id:string
    nombre: string
    apellido: string
    empresa: string
    email: string
    telefono: string
}

export type PostClienteType = Omit<ClienteType, '_id'> &{}

export type IDClienteType = Pick<ClienteType, '_id'> &{}

//Productos
export type ProductoType = {
    _id:string,
    nombre:string,
    precio:number,
    imagen:string
}

export type PostProductoType = Omit<ProductoType, '_id' | 'imagen'> &{}

export type IDProductoType = Pick<ClienteType, '_id'> &{}

export type EditProductoType = Omit<ProductoType, '_id' > &{}

//Pedidos
export type CartProductoType = {
    producto: string; // El ID del producto
    cantidad: number; // Cantidad del producto en el carrito
  };

export type PedidoUserType = {
    client: ClienteType,
    _id: string,
    nombre: string,
    apellido:string
}  
export type PedidoItemType = {
    _id: string;
    producto: ProductoType; // Aquí ahora es un objeto Producto
    cantidad: number;
    precio: number;
    nombre: string
}

// Define el tipo para un Pedido
export type PedidoType = {
    _id: string;
    cliente: PedidoUserType; // Aquí ahora es un objeto Cliente
    pedidos: PedidoItemType[];
    total: number;
}

export type IdPedido = Pick<PedidoType, '_id' & {}>