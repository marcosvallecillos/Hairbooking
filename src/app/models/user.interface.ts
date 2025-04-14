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
    id: number;
    name: string;
    price: number;
    image: string;
    cantidad:number;
    isFavorite: boolean;
    insidecart: boolean;
    fecha?: Date;
  }

  export interface Compra{
    id: number;
    name: string;
    image: string;
    cantidad: number;
    price: number;
    fecha: Date;
    productos: Product[];
  }

  export interface Reserva{
    id: number;
    servicio:string;
    peluquero:string;
    dia: string;
    hora:string;
    precio?: string;
  }