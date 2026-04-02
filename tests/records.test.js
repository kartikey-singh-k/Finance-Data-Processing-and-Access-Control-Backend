const request = require('supertest');

describe('Financial Records', () => {
    let adminToken;

    beforeAll(async () => {
        // Login as admin to get token
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                username: 'admin',
                password: 'Admin@123'
            });
        adminToken = res.body.data.token;
    });

    describe('POST /api/v1/records', () => {
        it('should create a new record', async () => {
            const res = await request(app)
                .post('/api/v1/records')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    amount: 100,
                    type: 'income',
                    category: 'Test',
                    date: '2024-03-15',
                    notes: 'Test record'
                });
            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should reject record with invalid amount', async () => {
            const res = await request(app)
                .post('/api/v1/records')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    amount: -100,
                    type: 'income',
                    category: 'Test',
                    date: '2024-03-15'
                });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/v1/records', () => {
        it('should retrieve records with pagination', async () => {
            const res = await request(app)
                .get('/api/v1/records?page=1&limit=10')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('pagination');
        });
    });
});