const express = require('express')
const path = require('path')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

const mongoDbUri = 'mongodb://nanny-services-cosmo-db:87PYFzHbQA9fZ6IIXIrq6q0MXs0iW9wotRjkMRgO3B9uEDFtSO7sigePVEP6i6qJTjqbl5rCEcciACDbxoSnrQ==@nanny-services-cosmo-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@nanny-services-cosmo-db@'; // Replace with your Cosmos DB connection string
const dbName = 'nanny-services-database'; // Replace with your Cosmos DB database name


const app = express()
app.use('/', express.static(path.join(__dirname, '../static')))
app.use(bodyParser.json())

async function connectToDatabase() {
	const client = new MongoClient(mongoDbUri, {
	  useNewUrlParser: true,
	  useUnifiedTopology: true,
	});
  
	try {
	  await client.connect();
	  console.log('Connected to the database');
	  return client.db(dbName);
	} catch (error) {
	  console.error('Error connecting to the database:', error);
	  throw error;
	}
  }
  
// Serve profile.html and profile.js
app.use('/profile', express.static(path.join(__dirname, 'static')));
app.use('/profile', express.static(path.join(__dirname, 'script')));

app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		const db = await connectToDatabase();
		await db.collection('users').updateOne(
		{ _id },
		{
			$set: { password },
		}
		);
		res.json({ status: 'ok' });
	} catch (error) {
		console.log(error);
		res.json({ status: 'error', error: ';))' });
	}
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login request:', { username, password });

        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ username });

        if (!user) {
            console.log('User not found');
            return res.json({ status: 'error', error: 'Invalid username/password' });
        }

        console.log('User found:', user);

        // Log hashed password from the database for debugging
        console.log('Hashed Password from Database:', user.password);

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            console.log('Password matched');
            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username
                },
                JWT_SECRET
            );

            return res.json({ status: 'ok', data: token });
        }

        console.log('Password did not match');

        res.json({ status: 'error', error: 'Invalid username/password' });
    } catch (error) {
        console.error('Login error:', error);
        res.json({ status: 'error', error: 'Login failed' });
    }
});

app.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)
	const db = await connectToDatabase();

	try {
        // Check if the username already exists
        const existingUser = await db.collection('users').findOne({ username });

        if (existingUser) {
            return res.json({ status: 'error', error: 'Username already in use' });
        }

        // If username is not taken, insert the new user
        const response = await db.collection('users').insertOne({
            username,
            password,
        });
        
        console.log('User created successfully: ', response);
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Error during registration:', error);

        if (error.code === 11000) {
            // Duplicate key (username already in use)
            return res.json({ status: 'error', error: 'Username already in use' });
        }

        res.json({ status: 'error', error: 'Registration failed' });
    }
});

app.listen(9999, () => {
	console.log('Server up at 9999')
})
