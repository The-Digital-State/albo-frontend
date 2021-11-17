import Vue from 'vue';
import swal from 'sweetalert2';
import '@sweetalert2/themes/material-ui/material-ui.css';

Vue.use({
  install(V, options = {}) {
    V.prototype.$swal = swal.mixin(options);
  },
});
