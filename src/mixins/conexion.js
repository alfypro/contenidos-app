import { API_CONTENIDOS } from '../config/constantes';

export default {
  //name: 'conexion',
  methods: {
    obtenerDatos(data,api='') {
      let self = this;
      return new Promise(function(resolve, reject) {
        let respuesta;
        let rq = new XMLHttpRequest();
        rq.open("POST", (api===''?API_CONTENIDOS:api) );
        rq.send(data); 
        rq.onreadystatechange = function(respuesta) {
          if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
              try{
                respuesta = JSON.parse(this.responseText);
                if (!respuesta.acceso){ document.location = '/gestion/login.aspx'; reject(Error('opcion: ' + data.get('opcion') + ' - Error: Debe iniciar sesión.')); }
                else if (!respuesta.permiso){ document.location = '/index.aspx'; reject(Error('opcion: ' + data.get('opcion') + ' - Error: El usuario no tiene permisos.')); }
                else if(respuesta.mensaje.texto) self.mensaje = respuesta.mensaje;
                resolve(respuesta);
              }
              catch(e){
                console.error('opcion: ' + data.get('opcion'));
                console.error(this.responseText);
                console.error(e);
                document.location = '/gestion/error.aspx';
              }
            }
            else {
              reject(Error(data.get('opcion')));
            }
          }
        }.bind(rq, respuesta); 
      });
    }
  }
}