<template>
  <div class="card card-outline-primary mb-4">
    <div class="card-header card-inverse card-primary">
      <strong>Lista de Contenidos</strong>
    </div>
    <div class="card-block">
     
      <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
        <!-- Documentación: https://bootstrap-vue.github.io/docs/components/alert/ -->
        <b-alert :show="mensaje.contador" dismissible :variant="mensaje.tipo" @dismiss-count-down="cuentaAtras">{{mensaje.texto}}</b-alert>
      </transition>

      <div class="row" v-if="!edicion">
        <div class="col-md-6">
          <button type="button" class="btn btn-success btn-block-xs mb-4" @click="nuevoContenido">Añadir Contenido</button>
        </div>
        
        <div class="col-md-6 text-right">
          <select class="form-control mb-4" @change="tratarCategoria" v-model="currentCat">
            <option value="0">Todas las Categorías</option>
            <option v-for="categoria in categorias" :value="categoria.id">{{ categoria.nombre }}</option>
          </select>
        </div>
      </div>

      <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
        <template transition v-if="edicion">  
          <form v-on:submit.prevent="guardarContenido">
            <input type="hidden" v-model="contenido.id">
            <input type="hidden" v-model="contenido.push">
            <div class="card card-block bg-faded mb-4">
              <div class="row">
                <div class="col-md-9">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Categoría</label>
                        <select class="form-control" v-model="contenido.categoria" required>
                          <option v-for="categoria in categorias" :value="categoria.id">{{ categoria.nombre }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-4 offset-md-2">
                      <div class="form-group">
                        <label class="custom-control custom-checkbox">
                          <input type="checkbox" class="custom-control-input" v-model="contenido.activo">
                          <span class="custom-control-indicator"></span>
                          <span class="custom-control-description">Activo</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label>Título</label>
                        <input type="text" maxlength="50" class="form-control" placeholder="Título" title="El título del contenido es obligatorio" v-model="contenido.titulo" required>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Fecha de publicación</label>
                        <!-- <input type="datetime-local" class="form-control" value="2017-05-15T22:00" data-date-format="dd/MM/YYYY HH:mm:ss" v-model="contenido.fecha">
                        <input type="datetime-local" class="form-control" value="29/08/1976 03:05:12" /> -->
                        <input type="text" class="form-control" v-model="contenido.fecha"  pattern="\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}" title="dd/mm/aaaa hh:mm:ss" placeholder="dd/mm/aaaa hh:mm:ss" required>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label>Resumen</label>
                        <textarea rows="3" cols="20" class="form-control" placeholder="Resumen" v-if="!comprobarCampoHtml(contenido.categoria, 'Resumen')" v-model="contenido.resumen" required></textarea>
                        <wysiwyg v-if="comprobarCampoHtml(contenido.categoria, 'Resumen')" v-model="contenido.resumen" placeholder="Introduce texto..." />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label>Descripción</label>
                        <textarea rows="5" cols="20" class="form-control" placeholder="Descripción" v-if="!comprobarCampoHtml(contenido.categoria, 'Descripcion')" v-model="contenido.descripcion"></textarea>
                        <wysiwyg v-if="comprobarCampoHtml(contenido.categoria, 'Descripcion')" v-model="contenido.descripcion" placeholder="Introduce texto..." />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label>Enlace a la noticia</label>
                        <input type="url" maxlength="300" class="form-control" placeholder="http://" v-model="contenido.enlace">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label>Enlace PDF</label>
                        <input type="url" maxlength="300" class="form-control" placeholder="http://" v-model="contenido.pdf">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <p class="text-center">
                      <img class="img-thumbnail img-fluid" src="../assets/img/noimage.jpg" v-if="!contenido.imagen" alt="Imagen contenido" style="border-width:0px; width:100%">
                      <img class="img-thumbnail img-fluid" :src="contenido.imagen" v-if="contenido.imagen" alt="Imagen contenido" style="border-width:0px;">
                    </p>
                    <span class="btn btn-block btn-sm btn-info btn-file">
                      {{ botonImagen }}<input type="file" accept="image/*" @change="tratarImagen($event,250)" />
                    </span>
                    <input type="button" value="Quitar foto" @click="contenido.imagen=''" class="btn btn-block btn-sm btn-secondary" v-if="contenido.imagen">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <input type="submit" value="Guardar" class="btn btn-success btn-block-xs">
                  <input type="button" value="Generar Aviso Push" class="btn btn-outline-success btn-block-xs" v-if="contenido.id && comprobarCategoria(contenido.categoria)" @click="guardarAvisoPush">
                </div>
                <div class="col-md-6 text-right">
                  <input type="button" value="Cerrar" class="btn btn-secondary btn-block-xs" @click="cancelar">
                </div>
              </div>
            </div>
          </form>
        </template>
      </transition>

      <template v-if="tabla.items.length">
        <!-- Documentación: https://bootstrap-vue.github.io/docs/components/table/ -->
        <div class="row">
          <div class="col-sm-6">
            <label>
              Mostrar
              <b-form-select :options="[{text:20,value:20},{text:50,value:50},{text:100,value:100}]" v-model="tabla.perPage"></b-form-select>
              elementos
            </label>
          </div>
          <div class="col-sm-6 text-right">
            <label>
              <b-form-input v-model="tabla.filter" placeholder="Buscar"/></b-form-input>
            </label>
          </div>
        </div>

        <b-table striped hover :items="tabla.items" :fields="tabla.fields" :current-page="tabla.currentPage" :per-page="tabla.perPage" :filter="tabla.filter" class="table-bordered">
          <template slot="fecha" scope="item">
            <span v-html="item.item.fecha"></span>
          </template>
          <template slot="push" scope="item">
            {{ item.item.push | sino }}
          </template>
          <template slot="activo" scope="item">
            {{ item.item.activo | sino }}
          </template>
          <template slot="actions" scope="item">
            <button type="button" class="btn btn-success btn-sm" @click="editarContenido(item.item)">Editar</button>
          </template>
        </b-table>

        <b-pagination size="md" :total-rows="this.tabla.items.length" :per-page="tabla.perPage" v-model="tabla.currentPage" class="justify-content-end" />
      
      </template>
      
    </div>
  </div>
</template>

<script>
import conexion from '../mixins/conexion.js';
import comun from '../mixins/comun.js';
import utilidades from '../mixins/utilidades.js';
import moment from 'moment'

export default {
  name: 'contenidos',
  data () {
    return {
      edicion: false,
      mensaje: { texto: '', tipo: '', contador: 0 },
      botonImagen: 'Seleccionar Imagen',
      contenido: { id:0, fecha:'', categoria: 0, activo: true, push: false, titulo: '', resumen: '', descripcion: '', enlace: '', pdf: '', imagen: '' },
      categorias: {},
      currentItem: {},
      currentCat: 0,
      // Estructura de la tabla
      tabla: {
        currentPage: 1,
        perPage: 20,
        filter: null,
        fields: {
          fecha: { label: 'Publicación', sortable: true, class: 'hidden-sm-down' },
          titulo: { label: 'Título', sortable: true },
          nombreCategoria: { label: 'Categoría', sortable: true },
          push: { label: 'Push', sortable: true, class: 'width50 text-center hidden-sm-down' },
          activo: { label: 'Activo', sortable: true, class: 'width50 text-center hidden-sm-down' },
          actions: { label: ' ', class: 'width50 text-right' }
        },
        items: {}
      }
    }
  },
  mixins: [conexion, comun, utilidades],
  methods: {
    // moment(date) {
    //   return moment(date);
    // },
    editarContenido(item) {
      this.currentItem.state = '';
      item.state = 'success'
      this.currentItem = item;
      let self = this;
      let data = new FormData();
      data.append('opcion', 'contenidosEditar');
      data.append('id', item.id);
      this.obtenerDatos(data).then(function (respuesta) {
        if (respuesta.datos.id){ self.tratarContenido(respuesta.datos); }
        else self.mensaje = { texto: 'No hay datos para mostrar.', tipo: 'warning', contador: 100000 };
      }, function(error) {
          console.error('Failed!', error);
          self.mensaje = { texto: 'Ha ocurrido un error al intentar obtener el "Contenido Id:"'+item.id, tipo: 'warning', contador: 300 };
      });
    },
    nuevoContenido(){
      this.currentItem.state = '';
      this.tratarContenido({ id:0, fecha: moment().format('DD/MM/YYYY HH:mm:ss'), categoria: this.currentCat, activo: true, push: false, titulo: '', resumen: '', descripcion: '', enlace: '', pdf: '', imagen: '' });
    },
    guardarContenido(){
      let self = this;
      let data = new FormData();
      data.append('opcion', 'contenidosGuardar');
      data.append('contenido', JSON.stringify(this.contenido));
      this.obtenerDatos(data).then(function (respuesta) {
        if (respuesta.datos.correcto){
          if(self.currentCat) self.currentCat = self.contenido.categoria;
          self.contenido.id = respuesta.datos.id;
          self.tratarLista(self.currentCat, respuesta.datos.id);
        }
      });
    },
    guardarAvisoPush(){
      if(this.contenido.push===false || confirm('Anteriormente ya fue creado un Aviso para Este Contendido, ¿desea continuar?')){
        let self = this;
        let data = new FormData();
        data.append('opcion', 'contenidosGuardarAviso');
        data.append('id', this.contenido.id);
        this.obtenerDatos(data).then(function (respuesta) {
          if (respuesta.datos.push){
            self.contenido.push = true;
          }
        });
      }
    },
    tratarContenido(contenido) {
      let self = this;
      let data = new FormData();
      //data.append('opcion', 'contenidosCategorias');
      data.append('opcion', 'categoriasLista');
      this.obtenerDatos(data).then(function (respuesta) {
        if (respuesta.datos.length > 0){
          self.categorias = respuesta.datos;
          self.contenido = contenido;
          self.edicion = true;
          if((document.body.scrollTop || document.documentElement.scrollTop) > document.getElementById('cabecera-contenidos').getBoundingClientRect().top)
            document.body.scrollTop = document.documentElement.scrollTop = (document.body.scrollTop || document.documentElement.scrollTop) + document.getElementById('cabecera-contenidos').getBoundingClientRect().top;
        }
        else self.mensaje = { texto: 'Debes crear al menos una categoría para poder continuar.', tipo: 'warning', contador: 100000 };
      }, function(error) {
          console.error('Failed!', error);
          self.mensaje = { texto: 'Ha ocurrido un error al intentar obtener el listado de "Categorías"', tipo: 'warning', contador: 300 };
      });
    },
    tratarValores(valores,id){
      for(let i in valores){
        valores[i].fecha = this.tratarFecha(valores[i].fecha);
        if(id && id===valores[i].id){
          valores[i].state = 'success';
          this.currentItem = valores[i];
        }
        else valores[i].state = '';
      }
      this.tabla.items = valores;
    },
    tratarLista(id, idItem=0){
      let self = this;
      let data = new FormData();
      data.append('opcion', 'contenidosLista');
      data.append('id', id);
      this.obtenerDatos(data).then(function (respuesta) {
        if (respuesta.datos.length > 0) self.tratarValores(respuesta.datos, idItem);
        else{
          self.tabla.items = {};
          self.mensaje = { texto: 'No hay datos para mostrar.', tipo: 'warning', contador: 100000 };
        }
      }, function(error) {
          console.error('Failed!', error);
          self.mensaje = { texto: 'Ha ocurrido un error al intentar obtener el listado de "Contenidos"', tipo: 'warning', contador: 300 };
      });
    },
    tratarCategoria(e){
      this.currentCat = e.target.value;
      this.tratarLista(e.target.value);
    },
    tratarCategorias() {
      let self = this;
      let data = new FormData();
      data.append('opcion', 'contenidosCategorias');
      this.obtenerDatos(data).then(function (respuesta) {
        if (respuesta.datos.length > 0){
          self.categorias = respuesta.datos;
        }
      }, function(error) {
          console.error('Failed!', error);
          self.mensaje = { texto: 'Ha ocurrido un error al intentar obtener el listado de "Categorías"', tipo: 'warning', contador: 300 };
      });
    },
    comprobarCategoria(id){
      const categoria = this.categorias.filter(categoria => categoria.id===parseInt(id));
      return categoria.length? categoria[0].push : false;
    },
    comprobarCampoHtml(idCategoria, campo='Resumen'){
      const categoria = this.categorias.filter(categoria => categoria.id===parseInt(idCategoria));
      try{
        if(categoria.length){
          const plantilla = JSON.parse(categoria[0].plantilla);
          if(campo=='Resumen'){
            return plantilla.resumenHtml;
          }
          else if(campo=='Descripcion'){
            return plantilla.descripcionHtml;
          }
        }
        else{
          return false;
        }
      }
      catch(e){
        return false
      }
    }
  },
  mounted() {
    this.tratarLista(0);
    this.tratarCategorias(0);
  }
}
</script>

<style>
.editr--content { background-color: #FFF; }
</style>