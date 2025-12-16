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
    codigoCorteGratis: string;

  }

  export interface Valoracion {
    id?: number;
    servicioRating: number;   // 1–5 por ejemplo
    peluqueroRating: number;  // 1–5
    comentario: string;
    fecha?: string;           // ISO string 'YYYY-MM-DD' o 'YYYY-MM-DDTHH:mm:ss'
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

  export interface Reserva {
    id:         number;
    servicio:   string;
    peluquero:  string;
    precio:     number;
    dia:        string;                 // 'YYYY-MM-DD'
    hora:       string;                 // 'HH:mm'
    usuarioId:  number;
    usuario?:   Usuario;
    // Datos de la valoración asociada (si existe)
    valoracionId:           number | null;
    valoracionComentario?:  string | null;
    valoracionServicio?:    number | null;
    valoracionPeluquero?:   number | null;
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

export interface FilterDateResponse {
  status: string;
  total: number;
  compras: Compra[];
}