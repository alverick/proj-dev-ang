import Swal from 'sweetalert2';

export function drawPopup(el: HTMLElement) {
  el.parentElement.classList.add('cs-alert', 'cs-alert-legacy');
}

export const swalAlert = Swal.mixin({
  customClass: {
    container: 'cs-alert',
  },
});
