declare var $: any;

export function drawPopup(el) {
  $(el).find('.swal2-title')
    .css('font-family', 'Omnes')
    .css('font-size', '28px')
    .css('font-weight', '500')
    .css('font-style', 'normal')
    .css('font-stretch', 'normal')
    .css('line-height', 'normal')
    .css('letter-spacing', 'normal');
  $(el).find('.swal2-content')
    .css('font-family', 'Omnes')
    .css('font-size', '16px')
    .css('font-weight', 'normal')
    .css('font-style', 'normal')
    .css('font-stretch', 'normal')
    .css('line-height', 'normal')
    .css('letter-spacing', 'normal');
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
