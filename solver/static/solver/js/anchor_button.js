(function($){
  $.fn.anchor_button_control = function(board){

    this.build_anchor_button = function (){
      this.button_el.addClass('control_button');
      this.button_el.click($.proxy(function(event){
        if(this.board.toggle_anchor_base()){
          this.name = 'unanchor';
        }else{
          this.name = 'anchor';
        }
      }, this));
    }

    this.board = board;
    this.button_el = $('<button>anchor</board>');
    this.build_anchor_button();

    return this;
  }

})(jQuery);
