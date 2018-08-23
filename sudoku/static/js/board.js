(function($){
  $.fn.board_table = function(table_el, user_id, id){

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
      this.solve_rules.push($.proxy(this.remove_cross_redundant_cells, this));
    }

    this.add_choice = function(row, col, ch){
      this.rows[row].cells[col].add_choice(ch);
      if(this.is_solved()){
        this.congratulate();
      }
    }

    this.toggle_choice = function(row, col, ch){
      this.rows[row].cells[col].toggle_choice(ch);
      if(this.is_solved()){
        this.congratulate();
      }
    }

    this.setup_keystroke_handler = function(){
      $(document).keydown(this.key_handler);
    }
 
    this.key_handler = $.proxy(function(event){
      if(event.keyCode >= 49 && event.keyCode <= 57 && this.selected_cell != null){
        this.toggle_choice(this.selected_cell.row_index, 
          this.selected_cell.col_index, event.keyCode - 48);
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
      this.set_anchor_base(!this.base_anchored);
    }

    this.set_anchor_base = function(base_anchored){
      this.base_anchored = base_anchored;
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
          cell.remove_all_choices(false);
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
      json_data.history = this.history;
      json_data.history_loc = this.history_loc;
      json_data.most_recent = this.most_recent;

      return JSON.stringify(json_data);
    }

    this.load_data = function(){
      $.ajax('/board.json/'+this.id+'/', {
        success: $.proxy(this.load_success, this),
        dataType: 'json',
      });
    }

    this.load_success = function(data, textStatus, jqXHR){
      var board_data = data['board'];
      var rows = board_data['rows'];
      this.name = board_data['name'];
      this.is_writable = data['writable'];
      var qualifier = '';
      if(!this.is_writable){
        qualifier = ' (read only)';
      }
      $('#board_name').html(this.name + qualifier);
      this.id = board_data['id'];
      this.base_anchored = board_data['anchored'];
      for(var row_index=0; row_index<9; row_index++){
        var row_data = rows[row_index];
        var row = this.rows[row_index];
        if(row != null && row_data != null){
          row.load_data(row_data)
        }
      }
      this.history = board_data['history'];
      this.history_loc = board_data['history_loc'];
      this.most_recent = this.history_loc;
      this.controls.redo_link.addClass('ui-state-disabled');
      if(!this.can_undo()){
        this.controls.undo_link.addClass('ui-state-disabled');
      }
      if(this.is_writable){
        this.controls.save_link.removeClass('ui-state-disabled');
      }
    }

    this.save_data = function(dialog, name, id){
      if(dialog==undefined){
        dialog = null;
      }
      var url = '/board/';
      if(id != undefined && this.id == null){
        this.id = id;
      }
      if(name == undefined || this.name == name){
        url += this.id+'/';
      }else{
        this.name = name;
        url += 'create/';
      }
      var data = {};
      data['csrfmiddlewaretoken'] = $('#csrf_form input[name="csrfmiddlewaretoken"]')[0].value;
      data['board'] = this.json_output(); 
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
        if(this.id == null){
          this.id = data['board_id'];
        }
        if(dialog != null){
          dialog.dialog('close');
          $(document.body).save_dialog(this.controls.board, {dialog_type: 'success'});
        }
        this.setup_keystroke_handler();
      }else{
        this.save_failure(dialog, data, textStatus, jqXHR);
      }
    }

    this.save_failure = function(dialog, data, textStatus, jqXHR){
      var reason = 'Error';
      if(data.status == 403){
        reason = 'Permission Denied';
      }
      $(document.body).save_dialog(this.controls.board, 
        {dialog_type:'failure_dialog',
         reason:reason});
    }

    this.add_to_history = function(row_index, col_index, ch, action){
      var entry = {
        'row_index': row_index,
        'col_index': col_index,
        'choice'   : ch,
        'action'   : action
      };
      this.history_loc++;
      this.history[this.history_loc]=entry;
      this.most_recent = this.history_loc;
      this.controls.redo_link.addClass('ui-state-disabled');
    }

    this.clear_history = function(){
      this.history_loc = 0;
      this.history = [];
      this.controls.redo_link.addClass('ui-state-disabled');
      this.controls.undo_link.addClass('ui-state-disabled');
    }

    this.undo = function(){
      if(this.can_undo()){
        var entry = this.history[this.history_loc];
        var cell = this.rows[entry.row_index].cells[entry.col_index];
        cell.undo(entry.choice, entry.action);
        this.history_loc--;
      }
    }

    this.can_undo = function(){
      return (this.history_loc >= 0);
    }

    this.redo = function(){
      if(this.can_redo()){
        this.history_loc++;
        var entry = this.history[this.history_loc];
        var cell = this.rows[entry.row_index].cells[entry.col_index];
        cell.redo(entry.choice, entry.action);
      }
    }

    this.can_redo = function(){
      return (this.history_loc < this.most_recent);
    }

//// solving functions

    // this rule removes all redundant choices from each group type
    this.remove_redundant_choices = function(){
      var mod = false;
      if(this.remove_redundant_from_group(this.rows)) mod = true;
      if(this.remove_redundant_from_group(this.cols)) mod = true;
      if(this.remove_redundant_from_group(this.tics)) mod = true;
      return mod;
    }

    // this rule removes all choices but one from a cell if that choice only
    // appears in one cell of a group
    this.remove_dead_choices_1 = function(){
      var mod = false;
      if(this.remove_dead_from_group(this.rows)) mod = true;
      if(this.remove_dead_from_group(this.cols)) mod = true;
      if(this.remove_dead_from_group(this.tics)) mod = true;
      return mod;
    }

    // this rulle removes choices that are redundant in the alignment of two 
    // group types
    this.remove_cross_redundant_cells = function(){
      var mod = false;
      if(this.remove_cross_redundant_from_group(this.tics, 'row')) mod = true;
      if(this.remove_cross_redundant_from_group(this.tics, 'col')) mod = true;
      if(this.remove_cross_redundant_from_group(this.rows, 'tic')) mod = true;
      if(this.remove_cross_redundant_from_group(this.cols, 'tic')) mod = true;
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

    this.remove_cross_redundant_from_group = function(group, cross_group_name){
      var mod = false;
      group.forEach(function(member){
        if(member.remove_cross_redundant_cells(cross_group_name)){
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

    this.is_solved = function(){
      var solved = true;
      if(!this.groups_are_solved(this.rows)) solved = false;
      if(!this.groups_are_solved(this.cols)) solved = false;
      if(!this.groups_are_solved(this.tics)) solved = false;
      return solved;
    }

    this.groups_are_solved = function(groups){
      var solved = true;
      groups.forEach(function(member){
        if(!member.is_solved()){
          solved = false; 
        }
      });
      return solved;
    }

    this.generate = function(pre_num){
      this.clear_history();
      this.set_anchor_base(false);
      this.clear();
      this.solve();
      var init_cells_list = [];
      var open_cells_list = [];
      for(var row_index in this.rows){
        var row = this.rows[row_index];
        for(var cell_index in row.cells){
          var cell = this.rows[row_index].cells[cell_index];
          if(cell.num_choices != undefined){
            open_cells_list.push(cell);
          }
        }
      }
      while(!this.is_solved() || init_cells_list.length < pre_num){
        var cell_ind = Math.floor(Math.random() * open_cells_list.length);
        var cell = open_cells_list[cell_ind];
        cell.make_random_selection();
        open_cells_list.remove(cell_ind);
        init_cells_list.push(cell);
        this.set_anchor_base(true);
        this.solve();
      }
      this.set_anchor_base(false);
      init_cells_list.forEach(function(init_cell){
        init_cell.set_anchor_cell(true);
      });
      this.base_anchored = true;
      var init_cell_count = init_cells_list.length;
      this.clear();
      while(init_cell_count > pre_num && init_cells_list.length > 0){
        var cell_ind = Math.floor(Math.random() * init_cells_list.length);
        var cell = init_cells_list[cell_ind];
        var ch = cell.get_single_choice();
        init_cells_list.remove(cell_ind);
        init_cell_count--;
        cell.set_anchor_cell(false);
        cell.remove_all_choices();
        this.solve();
        var replace = !this.is_solved();
        this.clear();
        if(replace){
          cell.add_choice(ch);
          cell.set_anchor_cell(true);
          init_cell_count++;
        }
      }
      this.clear_history();
      
    }

    // pop a dialog box to congratulate user for solving puzzle
    this.congratulate = function(){
      alert('congratulations: solved');
    }


    this.user_id = user_id;
    this.solve_rules = [];
    this.rows = [];
    this.cols = [];
    this.tics = [];
    this.history = {};
    this.history_loc = -1;
    this.most_recent = -1;
    this.name = null;
    this.id = id;
    this.table_el = table_el; 
    this.selected_cell = null;
    this.base_anchored = false;
    this.build_table();


    return this;
  }

  

//// static functions


  $.fn.board_table.delete_data = function(id){
    $.ajax('/board/delete/'+id+'/', {
      success: $.fn.board_table.delete_success,
      dataType: 'json',
    });
  }

  $.fn.board_table.delete_success = function(data, textStatus, jqXHR){
    $('#board_' + data.id).detach();
  }




})(jQuery);
