import jwtDecode from 'jwt-decode';
import { ObjectId } from 'mongodb';
import { getDB } from '../../db/db.js';
import jwt_decode from 'jwt-decode';

const queryAllUsers = async (callback) => {
  const baseDeDatos = getDB();
  console.log('query');
  await baseDeDatos.collection('usuario').find({}).limit(50).toArray(callback);
};

const crearUsuario = async (datosUsuario, callback) => {
  const baseDeDatos = getDB();
  await baseDeDatos.collection('usuario').insertOne(datosUsuario, callback);
};

const consultarUsuario = async (id, callback) => {
  const baseDeDatos = getDB();
  await baseDeDatos.collection('usuario').findOne({ _id: new ObjectId(id) }, callback);
};

const consultarOCrearUsuario = async (req, callback) => {
  //1.Obtener datos del usuario desde el token
 const token = req.headers.authorization.split('Bearer')[1];

 const user = jwt_decode(token)['http://localhost/userdata'];
 console.log(user);

 const baseDeDatos = getDB();
 await baseDeDatos.collection('usuario').findOne({email: user.email}, async (err, response) => {
   console.log('response consulta bd', response);
   if(response){

    callback(err, response);

   } else {

    user.auth0ID = user._id;
    delete user._id;
    user.rol = 'inactivo';
    await crearUsuario(user, (err, respuesta) =>callback(err,user));
   }
 });
  
}

const editarUsuario = async (id, edicion, callback) => {
  const filtroUsuario = { _id: new ObjectId(id) };
  const operacion = {
    $set: edicion,
  };
  const baseDeDatos = getDB();
  await baseDeDatos
    .collection('usuario')
    .findOneAndUpdate(filtroUsuario, operacion, { upsert: true, returnOriginal: true }, callback);
};

const eliminarUsuario = async (id, callback) => {
  const filtroUsuario = { _id: new ObjectId(id) };
  const baseDeDatos = getDB();
  await baseDeDatos.collection('usuario').deleteOne(filtroUsuario, callback);
};

export { queryAllUsers, crearUsuario, consultarUsuario, editarUsuario, eliminarUsuario, consultarOCrearUsuario, };
