(function($){
  $.fn.board_group = function(board, group_index){

    this.fill_choices = function(){
      for(var index in this.cells){
        var cell = this.cells[index];
        if(cell.num_choices == 0){
          cell.add_all_choices();
        }
      }
    }

    this.remove_redundant_choices = function(){
      var mod = false;
      for(var test_index in this.cells){
        var test_cell = this.cells[test_index];
        var remove_val = test_cell.get_single_choice();
        if(remove_val == null){
          continue;
        }
        for(var mod_index in this.cells){
          if(mod_index == test_index){
            continue;
          }
          var mod_cell = this.cells[mod_index];
          if(mod_cell.remove_choice(remove_val)){
            mod = true;
          }
        }
      }
      return mod;
    }

    this.remove_dead_choices_1 = function(){
      var mod = false;
      for(var choice=1; choice<=9; choice++){
        if(this.remove_dead_choice_1(choice)){
          mod = true;
        } 
      }
    }

    this.remove_dead_choice_1 = function(choice){
      var lone_cell = null;
      for(var cell_index in this.cells){
        var cell = this.cells[cell_index];
        if(cell.has_choice(choice)){
          if(lone_cell == null){
            lone_cell = cell;
          }else{
            return false;
          }
        }
      }
      if(lone_cell == null){
        return false;
      }
      lone_cell.remove_all_choices();
      lone_cell.add_choice(choice);
      return true;
    }
  
    this.group_index = group_index;
    this.cells = [];
    this.board = board;

    return this;
  }

})(jQuery);
