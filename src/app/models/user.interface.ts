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
    price: string;
    image: string;
  }