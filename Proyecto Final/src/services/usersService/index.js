
import { UserService } from './usersService.js';
import { usersDao } from '../../daos/usersDao/index.js'

export const servicioDeUsuarios = new UserService( usersDao )