import User from '../model/userModel.js';

class UserService{
    static async createUser(name, telefone) {
        try {
            const user = await User.create({ name: String(name), telefone: String(telefone) });
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async listUsers() {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            throw error;
        }
    }

    static async getUser(id) {
        try {
            const user = await User.findByPk(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(id, name, telefone) {
        try {
            const user = await User.findByPk(id);
            if (user) {
                await user.update({ name, telefone });
                return "Usuário atualizado com sucesso!"
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            const user = await User.findByPk(id);
            if (user) {
                await user.destroy();
                return "Usuário deletado com sucesso!";
            }
            return null;
        } catch (error) {
            throw error;
        }
    }


}


export default UserService;