const request = require('supertest');
// Note: You'll need to export app from server.js for testing

describe('Authentication', () => {
    describe('POST /api/v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser',
                    password: 'Test@123',
                    role: 'Viewer'
                });
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('success', true);
        });

        it('should reject registration with weak password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser2',
                    password: 'weak',
                    role: 'Viewer'
                });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'admin',
                    password: 'Admin@123'
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty('token');
        });

        it('should reject login with incorrect credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'admin',
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toBe(401);
        });
    });
});