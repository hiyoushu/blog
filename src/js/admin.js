$(function () {
  if ($('#jwt-token').length > 0) {
    var token = $('#jwt-token').val();
  } else {
    var token = window.localStorage.getItem('token');
  }

  if (token) {
    $.ajaxSetup({
      headers: {
        'X-Token': token
      }
    });
  }
})
