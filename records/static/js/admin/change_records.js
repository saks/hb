$(function() {
  var userId = $('meta[name="current-user-id"]').attr('content');
  var $amount = $('#id_amount_0')

  $('#id_transaction_type').val('EXP');
  $('#id_user').val(userId);
  if ($amount.val() == 0) {
    $amount.val('');
  };

  // calc
  $amount.wrap('<div id="id_with_calc" class="input-group"></div>')
  $('#id_with_calc').append('<span class="input-group-btn">\
      <button id="calc" class="btn btn-default" type="button">calculate</button>\
    </span>')
  $amount.focus();

  $('#calc').click(function(){
    $amount.val(eval($amount.val()));
    $amount.focus();
  });

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
