export interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    confirm_password: string;
    telefono: string;
    citas_reservadas: Reserva[];
  }

  export interface Valoracion {
    id: number;
    servicioRating: number;
    peluqueroRating: number;
    comentario: string;
    fecha: string;
    usuario_id: number;
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
    nombre: string;
    image:string,
    fecha: Date;
    total: number;
    cantidadTotal: number;
    precio:number,
    descuento?: number;
    detalles: {
      productoId: number;
      nombre: string;
      cantidad: number;
      precioUnitario: number;
      total: number;
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