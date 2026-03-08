export interface CatalogoItem {
  id: number
  nombre: string
}

export interface Catalogos {
  categorias: CatalogoItem[]
  unidades: CatalogoItem[]
  almacenes: CatalogoItem[]
  proveedores: CatalogoItem[]
  condiciones: CatalogoItem[]
}