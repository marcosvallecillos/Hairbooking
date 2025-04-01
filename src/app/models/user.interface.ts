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
  }

  export interface Reserva{
    id: number;
    nombre: string;
    apellidos: string;
    servicio:string;
    peluquero:string;
    dia: string;
    hora:string;
  }