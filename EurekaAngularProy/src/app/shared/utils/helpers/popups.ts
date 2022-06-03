declare var $: any;

export function drawPopup(el) {
  $(el)
    .find('.swal2-close')
    .css('background-image', 'url("/assets/images/cerrar.svg")')
    .css('background-repeat', 'no-repeat')
    .css('background-position', 'center')
    .css('width', '16px')
    .css('height', '16px')
    .css('margin-top', '16px')
    .css('margin-right', '16px')
    .css('background-position', 'center')
    .html('');
  $(el)
    .find('.swal2-title')
    .css('font-family', 'Geometria')
    .css('font-size', '24px')
    .css('font-weight', '500')
    .css('font-style', 'normal')
    .css('font-stretch', 'normal')
    .css('line-height', 'normal')
    .css('letter-spacing', 'normal')
    .css('color', '#0d131d');
  $(el)
    .find('.swal2-content')
    .css('font-family', 'Geometria')
    .css('font-size', '16px')
    .css('font-weight', 'normal')
    .css('font-style', 'normal')
    .css('font-stretch', 'normal')
    .css('line-height', 'normal')
    .css('letter-spacing', '#0d131d')
    .css('color', 'normal');
  $(el).find('.swal2-actions').css('display', 'grid');
  $(el)
    .find('.swal2-confirm')
    .css('background-color', '')
    .css('border-left-color', '')
    .css('border-right-color', '')
    .addClass('btn-eureca-green-alert');
  $(el)
    .find('.swal2-cancel')
    .css('background-color', '')
    .addClass('btn-outline-green-alert');
}
