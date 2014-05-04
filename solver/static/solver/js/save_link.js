(function($){
  $.fn.save_link_control = function(controls){
    this.control_link({controls: controls, title: 'Save'});

    this.click($.proxy(function(event){
      this.controls.board.save_data();
    }, this));

    this.addClass('ui-icon-disk');
    if(!this.controls.board.is_writable){
      this.addClass('ui-state-disabled');;
    }else{
      this.remove_class('ui-state-disable');
    }

    return this;
  }

})(jQuery);
