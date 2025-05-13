export interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    confirm_password: string;
    telefono: number;
    citas_reservadas: Reserva[];
    rol?: string;
  }

  export interface Valoracion {
    id?: number;
    servicioRating: number;
    peluqueroRating: number;
    comentario: string;
    fecha?: string;
    usuario_id: number;
    reserva_id: number;
    usuario?: Usuario;
    reserva?: Reserva;
    
}
export interface ValoracionesResponse {
  valoraciones: Valoracion[];
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
    image: string;
    fecha: Date;
    total: number;
    cantidad: number;
    precio: number;
    descuento?: number;
    detalles: {
      productoId: number;
      nombre: string;
      cantidad: number;
      precioUnitario: number;
      total: number;
    }[];
    usuario?: Usuario;
  }

  export interface Reserva{
    id:         number;
    servicio:   string;
    peluquero:  string;
    precio:     string;
    dia:        string;
    hora:       string;
    usuario_id: number;
    usuario?: Usuario;
    valoracion: number | null; //id de la valoracion 
    valoracion_comentario?: string | null;
    valoracion_servicio?: number | null;
    valoracion_peluquero?: number | null;
  }

  export interface Reservation{
    id:         number;
    servicio:   string;
    peluquero:  string;
    precio:     string;
    dia:        string;
    hora:       string;
    usuario_id: number;
    usuario?: Usuario;
    valoracion: number | null; //id de la valoracion 
    valoracion_comentario?: string | null;
    valoracion_servicio?: number | null;
    valoracion_peluquero?: number | null;
  }
  export interface ReservaAnulada {
    id:            number;
    servicio:      string;
    peluquero:     string;
    precio:        number;
    dia:           string;
    hora:          string;
    usuario_id:    number;
    fecha_anulada: Date;
}