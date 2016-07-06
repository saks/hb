$(function() {
  var userId = $('meta[name="current-user-id"]').attr('content');

  $('#id_transaction_type').val('EXP');
  $('#id_user').val(userId);
  if ($('#id_amount_0').val() == 0) {
    $('#id_amount_0').val('');
  };
  $('#id_amount_0').focus();

  $('#id_user').parents('.form-group').hide();

  // tags
  updateTags = function(){
    $('div#id_tags div').attr('class', 'btn btn-default');
    $('#id_tags div input:checked').parent().parent().removeClass('btn-default');
    $('#id_tags div input:checked').parent().parent().addClass('btn-danger');
  };
  updateTags();
  $('#id_tags div').click(updateTags);
});
