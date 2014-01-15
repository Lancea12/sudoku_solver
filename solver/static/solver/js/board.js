(function($){
  $.fn.board_table = function(table_el){

    this.build_table = function (){
      for(var row_index=0; row_index < 9; row_index++){
        var row = $(document.body).board_row(this, row_index);
        this.rows.push(row);
        this.table_el.append(row.row_el);
      }
      for(var col_index=0; col_index < 9; col_index++){
        var col = $(document.body).board_col(this, col_index);
        this.cols.push(col);
      }
      for(var tic_index=0; tic_index < 9; tic_index++){
        var tic = $(document.body).board_tic(this, tic_index);
        this.tics.push(tic);
      }
      this.setup_keystroke_handler();
      this.solve_rules.push($.proxy(this.remove_redundant_choices, this));
      this.solve_rules.push($.proxy(this.remove_dead_choices_1, this));
    }

    this.add_choice = function(row, col, ch){
      this.rows[row].cells[col].add_choice(ch);
    }

    this.toggle_choice = function(row, col, ch){
      this.rows[row].cells[col].toggle_choice(ch);
    }

    this.setup_keystroke_handler = function(){
      $(document).keydown(this.key_handler);
    }
 
    this.key_handler = $.proxy(function(event){
        if(event.keyCode >= 49 && event.keyCode <= 57 && this.selected_cell != null){
          this.selected_cell.toggle_choice(event.keyCode - 48);
        }
        if(event.keyCode >= 37 && event.keyCode <= 40 && this.selected_cell != null){
          var row_index = this.selected_cell.row_index;
          var col_index = this.selected_cell.col_index;
          switch(event.keyCode){
            // left
            case 37:   
              if(col_index > 0) col_index--;
            break;
            // up
            case 38:   
              if(row_index > 0) row_index--;
            break;
            // rightt
            case 39:   
              if(col_index < 8) col_index++;
            break;
            // down
            case 40:   
              if(row_index < 8) row_index++;
            break;
          }
          this.rows[row_index].cells[col_index].select_cell();;
       }
       if(event.keyCode == 8 || event.keyCode == 46){
         this.selected_cell.remove_all_choices();
       }
    }, this);

    this.remove_keystroke_handler = function(){
      $(document).off("keydown", this.key_handler); 
    }


    this.fill_choices = function(){
      this.rows.forEach($.proxy(function(row){
        var row = row;
        row.fill_choices();
      }, this));
    }

    this.toggle_anchor_base = function(){
      this.base_anchored = !this.base_anchored;
      for(var row_index in this.rows){
        var row = this.rows[row_index];
        for(var cell_index in row.cells){
          var cell = row.cells[cell_index];
          if(cell.num_choices == 1){
            cell.set_anchor_cell(this.base_anchored);
          }
        }
      }
      return this.base_anchored;
    }

    this.clear = function(){
      this.rows.forEach(function(row){
        row.cells.forEach(function(cell){
          cell.remove_all_choices();
        }, this);
      }, this);
    }

    this.json_output = function(){
      var json_data = {};
      json_data.name = this.name;
      json_data.id = this.id;
      json_data.anchored = this.base_anchored;
      json_data.rows = [];
      this.rows.forEach($.proxy(function(row){
        this.push(row.save_data());
      }, json_data.rows));

      return JSON.stringify(json_data);
    }

    this.load_data = function(id, dialog){
      $.ajax('/board/'+id+'/', {
        success: $.proxy(this.load_success, this, dialog),
        dataType: 'json',
      });
    }

    this.load_success = function(dialog, data, textStatus, jqXHR){
      var board_data = data['board'];
      var rows = board_data['rows'];
      this.name = board_data['name'];
      this.id = board_data['id'];
      this.base_anchored = board_data['anchored'];
      for(var row_index=0; row_index<9; row_index++){
        var row_data = rows[row_index];
        var row = this.rows[row_index];
        if(row != null && row_data != null){
          row.load_data(row_data)
        }
      }
      dialog.dialog('close');
      this.setup_keystroke_handler();
    }

    this.save_data = function(dialog){
      var data = {};
      data['csrfmiddlewaretoken'] = $('#csrf_form input[name="csrfmiddlewaretoken"]')[0].value;
      data['board'] = this.json_output(); 
      var url = '/board/';
      if(this.id != undefined){
        url += this.id+'/';
      }
      $.ajax(url, {
        success: $.proxy(this.save_success, this, dialog),
        error: $.proxy(this.save_failure, this, dialog),
        type: 'POST', 
        dataType: 'json',
        data: data,
      }); 
    }

    this.save_success = function(dialog, data, textStatus, jqXHR){
      if(data['saved']){
        this.id = data['id'];
        dialog.dialog('close');
        this.setup_keystroke_handler();
      }else{
        this.save_failure(dialog, data, textStatus, jqXHR);
      }
    }

    this.save_failure = function(dialog, data, textStatus, jqXHR){
        dialog.append($('<p>Save Unsuccessful</p>'));
    }

//// solving functions

    this.remove_redundant_choices = function(){
      var mod = false;
      if(this.remove_redundant_from_group(this.rows)) mod = true;
      if(this.remove_redundant_from_group(this.cols)) mod = true;
      if(this.remove_redundant_from_group(this.tics)) mod = true;
      return mod;
    }

    
    this.remove_dead_choices_1 = function(){
      var mod = false;
      if(this.remove_dead_from_group(this.rows)) mod = true;
      if(this.remove_dead_from_group(this.cols)) mod = true;
      if(this.remove_dead_from_group(this.tics)) mod = true;
      return mod;
    }


    this.remove_redundant_from_group = function(group){
      var mod = false;
      group.forEach(function(member){
        if(member.remove_redundant_choices()){
          mod = true;
        }
      }, this);
      return mod;
    }

    this.remove_dead_from_group = function(group){
      var mod = false;
      group.forEach(function(member){
        if(member.remove_dead_choices_1()){
          mod = true;
        }
      }, this);
      return mod;
    }


    this.solve = function(){
      this.fill_choices();
      var mod = true;
      while(mod){
        mod = false;
        for(var index in this.solve_rules){
          var rule = this.solve_rules[index];
          if(rule()){
            mod = true;
          }
        }
      }
    }


    this.solve_rules = [];
    this.rows = [];
    this.cols = [];
    this.tics = [];
    this.table_el = table_el; 
    this.selected_cell = null;
    this.base_anchored = false;
    this.build_table();

    return this;
  }

})(jQuery);
