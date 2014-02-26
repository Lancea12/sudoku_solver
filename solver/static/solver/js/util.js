
Array.prototype.element_count = function(){
  var count = 0;
  for(var i=0; i<this.length; i++){
    if(this[i] != undefined){
      count++;
    }
  }
  return count;
}

delete_board = function(id){
  $.fn.board_table.delete_data(id);
}
  
signInCallback = function(authResult){
  var data = {
    csrfmiddlewaretoken: $('#csrf_form input[name="csrfmiddlewaretoken"]')[0].value,
    id_token: authResult.id_token,
    code: authResult.code,
    login_method: authResult.status.method
  };
  $.ajax('/accounts/login/', {
    success: signInSuccess,
    type: 'POST',
    data: data,
  });
}

parseQueryParams = function(query){
  var pat = /([^&=]+)=?([^&]*)/g;
  var params = {};
  while(mat = pat.exec(query)){
    params[mat[1]] = mat[2];
  }  
  return params;
}

signInSuccess = function(data, textStatus, jqXHR){
  if(data != 'None' && data != 'error: code or id_token missing' &&
    data != 'error: attempt to auto login'){
    var params = parseQueryParams(window.location.search.substring(1))
    window.location = window.location.origin + params['next']
  }
}

