(function($){
  $.fn.load_button_control = function(board){
    var button = $(document.body).button_control(board, {label: 'Load'});
    var opts = $.extend(this, button);


    this.click($.proxy(function(event){
      this.di.load_list();
      this.di.dialog('open');
    }, this));

    this.di = $(document.body).load_dialog(board);

    return this;
  }

})(jQuery);
