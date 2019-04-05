export default {
  //name: 'comun',
  filters: {
    sino(valor) {
      return (valor?'Sí':'No');
    }
  },
  methods: {
    cuentaAtras(dismissCountDown) {
      this.mensaje.contador = dismissCountDown;
    },
    cancelar() {
      this.edicion=false;
      this.currentItem.state = '';
    },
    tratarFecha(fecha){ // se añade una etiqueta oculta para que a la hora de ordenar la fecha lo haga correctamente
      return '<span class="hidden">'+(fecha || '').split(' ', 1)[0].split('/').reverse().join('')+'</span>'+fecha;
    }
  }
}