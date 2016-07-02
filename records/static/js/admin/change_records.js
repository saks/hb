$(function() {
  var userId = $('meta[name="current-user-id"]').attr('content');

  $('#id_transaction_type').val('EXP');
  $('#id_user').val(userId);
  $('#id_amount_0').val('').focus();

  $('#id_user').parents('.form-group').hide()
});
