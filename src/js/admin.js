var token = window.localStorage.getItem('token');
if (token) {
  $.ajaxSetup({
    headers: {
      'x-access-token': token
    }
  });
}
