export default {
  //name: 'utilidades',
  methods: {
    tratarImagen(event, pesoMaximo = 250) {
      let input = event.target;
      if (input.files && input.files[0]) {
        if (input.files[0].size > pesoMaximo * 1024) {
          if (this.isCanvasSupported()) {
            var dataurl = null;
            var file = input.files[0];
            this.botonImagen = 'Cargando...';
            var self = this;
            // Create an image
            var img = document.createElement("img");
            // Create a file reader
            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = function (e) {
              img.src = e.target.result;

              img.onload = function () {
                let canvas = document.createElement("canvas");
                var ctx1 = canvas.getContext("2d");
                ctx1.drawImage(img, 0, 0);

                var MAX_WIDTH = 800;
                var MAX_HEIGHT = 600;
                var width = img.width;
                var height = img.height;

                if (width > height) {
                  if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                  }
                } else {
                  if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                  }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx2 = canvas.getContext("2d");
                ctx2.drawImage(img, 0, 0, width, height);

                dataurl = canvas.toDataURL("image/jpeg");
                self.contenido.imagen = dataurl;
                self.botonImagen = 'Seleccionar Imagen';
              }
            }
            // Load files into file reader
            reader.readAsDataURL(file);
          }
          else {
            this.contenido.imagen = '';
            this.mensaje = { texto: 'La imagen no puede superar los ' + pesoMaximo + ' KB', tipo: 'danger', contador: 5 };
            input.value = '';
            return;
          }
        }
        else {
          let reader = new FileReader();
          reader.onload = (e) => {
            this.contenido.imagen = e.target.result.replace('data:;', "data:image/jpeg;");
          }
          reader.readAsDataURL(input.files[0]);
        }
      }

    },
    isCanvasSupported() {
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    }
  }
}
