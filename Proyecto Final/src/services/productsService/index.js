
import { ProductService } from './productsService.js';
import { productsDao } from '../../daos/productsDao/index.js'

export const servicioDeProductos = new ProductService( productsDao )