import { Router } from 'express';
import userService from '../services/user.service.js';

const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
	const userData = req.body;
	try {
		const newUser = await userService.createUser(userData);
		res.status(201).json(newUser);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const admin = {
	email: 'adminCoder@coder.com',
	password: 'adminCod3r123'
}

usersRouter.post('/auth', async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await userService.getByEmail(email);

		if (email !== admin.email || password !== admin.password) {
		
			if (!user) throw new Error('Invalid data'); // Comprobo si existe el usuario
			if (user.password !== password) throw new Error('Invalid password'); // Comprobo si la contraseña coincide

			// Guardo la session
			req.session.user = user;

			res.redirect('/');


		} else {
			const user = admin.email
			// Guardo la session
			req.session.user = user;
			
			res.redirect('/');
		}


	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

usersRouter.post('/logout', (req, res) => {
	req.session.destroy();

	res.redirect('/login');
});

export default usersRouter;
