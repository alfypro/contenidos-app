<template>
  <!-- Documentación: https://bootstrap-vue.github.io/docs/components/navbar -->
  <b-navbar toggleable type="inverse" variant="inverse">

    <b-nav-toggle target="nav_collapse"></b-nav-toggle>

    <b-link class="navbar-brand" href="/" v-if="cabecera.imagen">
      <img :src="cabecera.imagen" :alt="cabecera.centro" align="middle" />
    </b-link>

    <b-collapse is-nav id="nav_collapse">

      <b-nav is-nav-bar class="ml-auto">

        <b-nav-item href="/gestion/caja.aspx"><i class="fa fa-eur" aria-hidden="true"> &nbsp; </i>Caja</b-nav-item>

        <b-nav-item-dropdown right-alignment>
          <template slot="text"><i class="fa fa-th-list" aria-hidden="true"> &nbsp; </i>Menú principal</template>
          <template v-for="menu in menus">
            <a :class="menu.activo?'dropdown-item':'dropdown-item disabled'" :href="menu.enlace" data-toggle="dropdown"><i :class="menu.icono" aria-hidden="true" > &nbsp; </i>{{menu.alias}}</a>
            <!-- <b-dropdown-item :to="menu.activo?menu.enlace:'#'" :class="menu.activo?'':'disabled'"><i :class="menu.icono" aria-hidden="true" > &nbsp; </i>{{menu.alias}}</b-dropdown-item> -->
          </template>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right-alignment>
          <template slot="text"><i class="fa fa-user" aria-hidden="true"> &nbsp; </i>sportconsultingsl@gmail.com <span class="badge badge-pill badge-danger" v-if="cabecera.notificaciones">{{cabecera.notificaciones}}</span></template>
          <b-dropdown-item href="" disabled="true">Administrador</b-dropdown-item>
          <b-dropdown-item href="/reservas" disabled="false">Cambiar clave</b-dropdown-item>
          <div class="dropdown-divider"></div>
          <b-dropdown-item href="/gestion/notificaciones.aspx">Ver notificaciones <span class="badge badge-pill badge-danger" v-if="cabecera.notificaciones">{{cabecera.notificaciones}}</span></b-dropdown-item>
          <div class="dropdown-divider"></div>
          <b-dropdown-item href="/gestion/login.aspx?logout=true"><i class="fa fa-power-off" aria-hidden="true"> &nbsp; </i>Cerrar sesión</b-dropdown-item>
        </b-nav-item-dropdown>
        
        <b-nav-item href="/"><i class="fa fa-home" aria-hidden="true"></i>&nbsp; Inicio</b-nav-item>

      </b-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import conexion from '../mixins/conexion.js';
import { API_CABECERA } from '../config/constantes';
export default {
  name: 'dweb-cabecera',
  data () {
    return {
      api: API_CABECERA,
      menus: {}
    }
  },
  props: ['cabecera'],
  mixins: [conexion],
  methods: {
    tratarNotificaciones() {
      let self = this;
      let data = new FormData();
      data.append('opcion', 'cabeceraNotificaciones');
      this.obtenerDatos(data,this.api).then(function (respuesta) {
        self.cabecera.notificaciones = respuesta.datos.notificaciones;
      });
    },
    tratarMenu(){
      let self = this;
      let data = new FormData();
      data.append('opcion', 'cabeceraMenu');
      this.obtenerDatos(data,this.api).then(function (respuesta) {
        self.menus = respuesta.datos;
      });
    }
  },
  mounted() {
    this.tratarMenu();
    let minutos = 1;
    setInterval(function () { this.tratarNotificaciones(); }.bind(this), minutos * 60 * 1000);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar-brand img{ height:72px; border-width:0px; }
</style>