import { UsersList } from '../repositories/usersList/index.js'

class UserService {
    async guardar(user) {
        await UsersList.guardar(user)
        .then(result => {
            return result
        })
    }
    async buscar(username) {
        const users = await UsersList.buscarPorUsername(username)
        if (users) {
            return users
        }
    }
}

export const UsersService = new UserService()