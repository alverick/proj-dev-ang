declare var $: any;

export function drawPopup(el) {
  $(el).find('.swal2-actions').css('display', 'grid');
  $(el).find('.swal2-confirm')
    .css('background-color', '')
    .css('border-left-color', '')
    .css('border-right-color', '')
    .addClass('btn-eureca-green');
  $(el).find('.swal2-cancel')
    .css('background-color', '')
    .addClass('btn-outline-green');
}
