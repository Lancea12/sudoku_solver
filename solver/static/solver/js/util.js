
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
  };
  $.ajax('/accounts/login/', {
    success: signInSuccess,
    type: 'POST',
    data: data,
  });
}

signInSuccess = function(data, textStatus, jqXHR){
  //window.location = '/';
}
