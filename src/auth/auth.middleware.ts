import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from './auth.model';
 // Asegúrate de que la ruta a tu modelo de usuario sea correcta

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  
  const secret = "este_es_un_secreto_que_debe_ser_reemplazado_por_otro"
  
  const token = req.headers['authorization']?.split(' ')[1]; // Se espera que el token se envíe en el formato "Bearer <token>"

  if (!token) {
    res.status(401).json({ message: 'Token no proporcionado' });
    return
  }

  try {
    const decoded: any = jwt.verify(token, secret); // Asegúrate de utilizar tu propia clave secreta
    const user = await User.findById(decoded.id); // Busca al usuario en la base de datos

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return
    }

    // Agrega el usuario a la solicitud para que esté disponible en los controladores
    req.body.userId = user._id; // Puedes modificar esto según necesites (e.g., req.user)
    next(); // Llama al siguiente middleware o controlador
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token inválido' });
  }
};

export default authMiddleware;