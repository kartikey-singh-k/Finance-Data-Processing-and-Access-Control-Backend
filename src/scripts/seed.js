require('dotenv').config();
const bcrypt = require('bcryptjs');
const { dbRun, dbGet } = require('../db');

async function seed() {
    try {
        console.log('🌱 Starting database seeding...');

        // Create admin user
        const adminPassword = await bcrypt.hash('Admin@123', 10);
        await dbRun(
            'INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)',
            ['admin', adminPassword, 'Admin']
        );
        console.log('✅ Admin user created (username: admin, password: Admin@123)');

        // Create analyst user
        const analystPassword = await bcrypt.hash('Analyst@123', 10);
        await dbRun(
            'INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)',
            ['analyst', analystPassword, 'Analyst']
        );
        console.log('✅ Analyst user created (username: analyst, password: Analyst@123)');

        // Create viewer user
        const viewerPassword = await bcrypt.hash('Viewer@123', 10);
        await dbRun(
            'INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)',
            ['viewer', viewerPassword, 'Viewer']
        );
        console.log('✅ Viewer user created (username: viewer, password: Viewer@123)');

        // Get admin ID for creating records
        const admin = await dbGet('SELECT id FROM users WHERE username = ?', ['admin']);

        // Seed sample income records
        const incomeRecords = [
            { amount: 5000, category: 'Salary', date: '2024-03-01', notes: 'Monthly salary' },
            { amount: 500, category: 'Freelance', date: '2024-03-05', notes: 'Web development project' },
            { amount: 200, category: 'Investment', date: '2024-03-10', notes: 'Stock dividends' },
        ];

        for (const record of incomeRecords) {
            await dbRun(
                'INSERT INTO records (amount, type, category, date, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
                [record.amount, 'income', record.category, record.date, record.notes, admin.id]
            );
        }
        console.log(`✅ ${incomeRecords.length} income records created`);

        // Seed sample expense records
        const expenseRecords = [
            { amount: 800, category: 'Rent', date: '2024-03-01', notes: 'Monthly rent payment' },
            { amount: 200, category: 'Groceries', date: '2024-03-03', notes: 'Weekly groceries' },
            { amount: 50, category: 'Utilities', date: '2024-03-05', notes: 'Electricity bill' },
            { amount: 100, category: 'Transportation', date: '2024-03-07', notes: 'Gas and maintenance' },
            { amount: 150, category: 'Entertainment', date: '2024-03-12', notes: 'Movie and dinner' },
        ];

        for (const record of expenseRecords) {
            await dbRun(
                'INSERT INTO records (amount, type, category, date, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
                [record.amount, 'expense', record.category, record.date, record.notes, admin.id]
            );
        }
        console.log(`✅ ${expenseRecords.length} expense records created`);

        console.log('\n✨ Database seeding completed successfully!');
        console.log('\n📋 Test Users:');
        console.log('   Admin    - username: admin,    password: Admin@123');
        console.log('   Analyst  - username: analyst,  password: Analyst@123');
        console.log('   Viewer   - username: viewer,   password: Viewer@123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();