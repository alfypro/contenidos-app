// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// Documentación: https://v4-alpha.getbootstrap.com/
import 'bootstrap/dist/css/bootstrap.css'
// Documentación: https://bootstrap-vue.github.io/docs/
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Documentación: http://fontawesome.io/icons/
import './assets/css/font-awesome.min.css';
import './assets/css/general.css';
import 'vue-wysiwyg/dist/vueWysiwyg.css';

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

import wysiwyg from "vue-wysiwyg";
Vue.use(wysiwyg, {hideModules: { "image": true, "table": true }});

import conexion from './mixins/conexion.js';
import { API_CABECERA } from './config/constantes';

import App from './App'
import Cabecera from './components/Cabecera.vue'
import Pie from './components/Pie.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  data () {
    return {
      api: API_CABECERA,
      datosCabecera: { centro: '', imagen: '', notificaciones: 0 },
      datosPath: { centro: '', apartado: 'APP' },
    }
  },
  template: '<div><dweb-cabecera :cabecera="datosCabecera"/><App :path="datosPath"/><dweb-pie/></div>',
  components: { 
    'App': App,
    'dweb-cabecera': Cabecera,
    'dweb-pie': Pie
  },
  mixins: [conexion],
  methods: {
    tratarDatos() {
      let self = this;
      let data = new FormData();
      data.append('opcion', 'cabeceraDatos');
      this.obtenerDatos(data,this.api).then(function (respuesta) {
        if (respuesta.datos.centro){
          self.datosCabecera = respuesta.datos;          
          self.datosPath.centro = respuesta.datos.centro;
        }
      });
    }
  },
  mounted() {
    this.tratarDatos();
  }
});