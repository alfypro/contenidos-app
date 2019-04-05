<template>
  <div class="container-fluid">
    <ol class="breadcrumb mt-4">
      <li class="breadcrumb-item"><a href="/">{{ path.centro }}</a></li>
      <li class="breadcrumb-item"><a href="./#">{{ path.apartado }}</a></li>
      <li class="breadcrumb-item active">{{ $route.name }}</li>
    </ol>
    <div class="row">
      <div class="col-md-3 push-md-9">
        <div class="list-group">
          <router-link to="/" class="list-group-item list-group-item-action" active-class="active" exact>Contenidos</router-link>
          <router-link to="/categorias" class="list-group-item list-group-item-action" active-class="active">Categorías</router-link>
        </div>
      </div>
      <div class="col-md-9 pull-md-3" id="cabecera-contenidos">
        <h1 class="mb-3 mt-3"><i class="fa fa-file-text-o" aria-hidden="true"> &nbsp; </i>Contenidos</h1>
        <router-view></router-view>
      </div>  
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  props: ['path']
}
</script>