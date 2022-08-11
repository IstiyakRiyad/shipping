require('dotenv').config();

const connection = require('./server/config/mongodb');
const User = require('./server/models/user');
const db = require('mongoose').connection;
const bcrypt = require('bcrypt');

const adminUsers = require('./server/config/adminUsers');


connection()
.then(async () => {
    try {
        // Drop the database
        await db.dropDatabase();
        console.log('\x1b[31m%s\x1b[0m', `Database is droped`);

        // Create Admin
        const users = await User.insertMany(
            adminUsers.map(({name, email, password}) => {
                return {
                    name,
                    email,
                    password: bcrypt.hashSync(password, 12)
                }
            })
        );


        console.log('\x1b[32m%s\x1b[0m', `Admin User is created.`, users);
        db.close();
    }
    catch(error) {
        console.log(error.message);
        db.close();
    }
});
