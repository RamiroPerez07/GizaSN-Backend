import express, { Request, Response } from 'express';
import cors from "cors";
import { connectToDatabase } from './database/dbConfig';
import authRoutes from './auth/auth.routes';
import ordersRoutes from './orders/orders.routes';

const app = express();

app.use(cors())

const port = process.env.PORT || 3000;

//const DbConnection = new DatabaseConnection();

//DbConnection.connect(); //conexión a base de datos.

//Middleware para parsear JSON
app.use(express.json());

// Usar rutas de cada módulo
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);


// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('¡Bienvenido!');
});


// Función para iniciar la app
async function startServer() {
  try {

    await connectToDatabase();
    console.log('✅ Conectado a MongoDB Atlas');

    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

