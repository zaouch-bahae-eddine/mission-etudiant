import { Sequelize } from 'sequelize-typescript';
import { User } from '../user.model.js';

describe('User serialization', () => {
    it('omits the password hash from direct, nested and list responses', () => {
        const sequelize = new Sequelize({ dialect: 'postgres', logging: false });
        sequelize.addModels([User]);
        const user = User.build({ email: 'student@example.com', passwordHash: 'secret-hash' });

        expect(user.passwordHash).toBe('secret-hash');
        expect(JSON.parse(JSON.stringify(user))).toEqual({
            id: null,
            email: 'student@example.com',
        });
        const response = JSON.stringify({ user, users: [user] });
        expect(response).not.toContain('passwordHash');
        expect(response).not.toContain('secret-hash');
    });
});
