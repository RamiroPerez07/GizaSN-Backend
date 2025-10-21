import mongoose from 'mongoose';

// export class DatabaseConnection{

//     mongoURI : string = "mongodb+srv://giza:sX5X2Niuh1HNH1YG@chequesgen.rhdwy7o.mongodb.net/Giza";

//     connect(){
//         mongoose.connect(this.mongoURI)
//         .then(() => console.log('Conectado a MongoDB Atlas'))
//         .catch((err) => console.error('Error al conectar a MongoDB Atlas', err));
//     }
// }

export async function connectToDatabase(): Promise<void> {
  const mongoURI = "mongodb+srv://giza:sX5X2Niuh1HNH1YG@chequesgen.rhdwy7o.mongodb.net/Giza";

  if (!mongoURI) {
    throw new Error('MONGO_URI no está definida en las variables de entorno');
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    throw error;
  }
}