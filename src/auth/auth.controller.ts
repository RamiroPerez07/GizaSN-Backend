import { Request, Response } from 'express';
import User, { IUser } from './auth.model';
import jwt from 'jsonwebtoken';

export class AuthController {

  async login(req: Request, res: Response) {

    const secret = "este_es_un_secreto_que_debe_ser_reemplazado_por_otro"

    const { username, password } = req.body;

    try {
      const user: IUser | null = await User.findOne({ username });
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(400).json({ message: 'Contraseña incorrecta' });
        return;
      }

      // Generar un token JWT
      const token = jwt.sign({ id: user._id }, secret /*, { expiresIn: '1h' } */);
      
      res.status(200).json({username: user.username, name: user.name , _id: user._id, token });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Error del servidor', error });
    }
  }

  async register(req: Request, res: Response) {
    const { username, name, password } = req.body;

    try {
      const newUser = new User({ username, name, password });
      await newUser.save();
      res.status(201).json({ newUser, message: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'Error al registrar el usuario', error });
    }
  }
}