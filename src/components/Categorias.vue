<template>
  <div class="card card-outline-primary mb-4">
    <div class="card-header card-inverse card-primary">
      <strong>Lista de Categorias</strong>
    </div>
    <div class="card-block">
     
      <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
        <!-- Documentación: https://bootstrap-vue.github.io/docs/components/alert/ -->
        <b-alert :show="mensaje.contador" dismissible :variant="mensaje.tipo" @dismiss-count-down="cuentaAtras">{{mensaje.texto}}</b-alert>
      </transition>

      <div class="row" v-if="!edicion">
        <div class="col-md-12">
          <button type="button" class="btn btn-success btn-block-xs mb-4" @click="nuevaCategoria()">Añadir Categoria</button>
        </div>
      </div>

      <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
        <template transition v-if="edicion">  
          <form v-on:submit.prevent="guardarCategoria">
            <input type="hidden" v-model="categoria.id">
            <div class="card card-block bg-faded mb-4">
              <div class="row">
                <div class="col-md-9">
                  <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" maxlength="150" class="form-control" placeholder="Nombre de Categoría" title="El nombre de la categoría es obligatorio" v-model="categoria.nombre" required>
                  </div>
                </div>
                <div class="col-md-3 text-left">
                  <div class="form-group">
                    <label class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" v-model="categoria.activo">
                      <span class="custom-control-indicator"></span>
                      <span class="custom-control-description">Activo</span>
                    </label>
                    <br>
                    <label class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" v-model="categoria.push">
                      <span class="custom-control-indicator"></span>
                      <span class="custom-control-description">Con envíos Push</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Plantilla</label>
                    <textarea rows="3" cols="20" class="form-control" placeholder="A cumplimentar por personal cualificado (no es requerido)." v-model="categoria.plantilla"></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <input type="submit" value="Guardar" class="btn btn-success btn-block-xs">
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
          <template slot="activo" scope="item">
            {{ item.item.activo | sino }}
          </template>
          <template slot="actions" scope="item">
            <button type="button" class="btn btn-success btn-sm" @click="editarCategoria(item.item)">Editar</button>
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

export default {
  name: 'categorias',
  data () {
    return {
      edicion: false,
      mensaje: { texto: '', tipo: '', contador: 0 },
      categoria: { id:0, activo: true, push: false, nombre: '', plantilla: '' },
      currentItem: {},
      // Estructura de la tabla
      tabla: {
        currentPage: 1,
        perPage: 20,
        filter: null,
        fields: {
          fecha: { label: 'Publicación', sortable: true, class: 'hidden-sm-down' },
          nombre: { label: 'Nombre', sortable: true },
          activo: { label: 'Activo', sortable: true, class: 'width50 text-center hidden-sm-down' },
          actions: {  label: ' ', class: 'width50 text-right' }
        },
        items: {}
      }
    }
  },
  mixins: [conexion, comun],
  methods: {
    editarCategoria(item) {
      this.currentItem.state = '';
      item.state = 'success'
      this.currentItem = item;
      let self = this;
      let data = new FormData();
      data.append('opcion', 'categoriasEditar');
      data.append('id', item.id);
      this.obtenerDatos(data).then(function (respuesta) {
        if (respuesta.datos.id){ self.tratarCategoria(respuesta.datos); }
        else self.mensaje = { texto: 'No hay datos para mostrar.', tipo: 'warning', contador: 100000 };
      }, function(error) {
          console.error('Failed!', error);
          self.mensaje = { texto: 'Ha ocurrido un error al intentar obtener la "Categoria Id:"'+item.id, tipo: 'warning', contador: 300 };
      });
    },
    nuevaCategoria(){
      this.currentItem.state = '';
      this.tratarCategoria({ id:0, activo: true, push: false, nombre: '', plantilla: '' });
    },
    guardarCategoria(){
      let self = this;
      let data = new FormData();
      data.append('opcion', 'categoriasGuardar');
      data.append('categoria', JSON.stringify(this.categoria));
      this.obtenerDatos(data).then(function (respuesta) {
        if (respuesta.datos.correcto){
          self.tratarLista(respuesta.datos.id);
        }
      });
    },
    tratarCategoria(categoria) {
      let data = new FormData();
      this.categoria = categoria;
      this.edicion = true;
      if((document.body.scrollTop || document.documentElement.scrollTop) > document.getElementById('cabecera-contenidos').getBoundingClientRect().top)
        document.body.scrollTop = document.documentElement.scrollTop = (document.body.scrollTop || document.documentElement.scrollTop) + document.getElementById('cabecera-contenidos').getBoundingClientRect().top;
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
    tratarLista(id){
      let self = this;
      let data = new FormData();
      data.append('opcion', 'categoriasLista');
      this.obtenerDatos(data).then(function (respuesta) {
        if (respuesta.datos.length > 0) self.tratarValores(respuesta.datos,id);
        else self.mensaje = { texto: 'No hay datos para mostrar.', tipo: 'warning', contador: 100000 };
      }, function(error) {
          console.error('Failed!', error);
          self.mensaje = { texto: 'Ha ocurrido un error al intentar obtener el listado de "Categorias"', tipo: 'warning', contador: 300 };
      });
    }
  },
  mounted() {
    this.tratarLista(0);
  }
}
</script>