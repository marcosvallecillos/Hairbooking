export interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    telefono: string;
    citas_reservadas: [];
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

  export interface Reserva{
    id: number;
    servicio:string;
    peluquero:string;
    dia: string;
    hora:string;
    precio?: string;
  }
  export interface Productos {
    id: number;
    name: string;
    price: number;
    image: string;
    isFavorite: boolean;
    insidecart: boolean;
    cantidad: number;
  }