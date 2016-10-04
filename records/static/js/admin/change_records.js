$(function() {
  var userId = $('meta[name="current-user-id"]').attr('content');
  var $amount = $('#id_amount_0');
  var $tagsCloud = $('#id_tags');

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
    var val = eval($amount.val());
    val = Math.round(val * 100) / 100;

    $amount.val(val);
    $amount.focus();
  });

  $('#id_user').parents('.form-group').hide();

  //----- tags -----//

  // fix tag buttons
  $tagsCloud.find('div')
    .removeClass('checkbox')
    .addClass('btn btn-default')
  ;

  // handle click on tag buttons -> delegate to a checkbox click
  $tagsCloud.on('click', 'div', function(e) {
    if (e.target == e.currentTarget) {
      $(e.target).find('input').click();
    };
  });

  // handle click on tag checkbox
  $tagsCloud.on('click', 'input', function(e) {
    $(e.target).closest('div.btn').toggleClass('btn-danger btn-default');
  });
});
