export interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    telefono: string;
    citas_reservadas: Reserva[];
  }

  
  export interface Product {
    id:            number;
    name:          string;
    price:         number;
    image:         string;
    cantidad:      number;
    favorite:      boolean;
    cart:          boolean;
    date:          Date[];
    compras:       Compra[];
    categorias:    string;
    subcategorias: null | string;
  }

  export interface Compra{
    id: number;
    name: string;
    image: string;
    cantidad: number;
    price: number;
    fecha: Date;
    productos: {
      productoId: number;
      cantidad: number;
    }[];
  }

  export interface Reserva{
    id:         number;
    servicio:   string;
    peluquero:  string;
    precio:     string;
    dia:        string;
    hora:       string;
    usuario_id: number;
  }