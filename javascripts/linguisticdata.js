/* Data-Browser for the handling of the Linguistic Goldmine Data App
 *
 * author   : Johann-Mattis List
 * email    : mattis.list@lingulist.de
 * created  : 2015-06-12 12:43
 * modified : 2015-06-12 12:43
 *
 */

var STORE = '';
var CFG = {};
var DATA = {};
var TAGS = {};
var COOCS = {};

function showTags() {
  tags = Object.keys(TAGS);
  tags.sort();
  txt = '<table id="tags"><thead><tr><th>TAG</th><th>FREQUENCY</th><th>COOCCURRENCES</th><th>BROWSE</th></tr></thead><tbody>';
  for (var i=0,tag; tag=tags[i]; i++) {
    txt += '<tr><td>'+tag+'</td><td>'+TAGS[tag]+'</td>';
    txt += '<td>';
    if (tag in COOCS) {
      var tmp = [];
      for (key in COOCS[tag]) {
	tmp.push([COOCS[tag][key], key]);
      }
      tmp.sort(function (x,y) { return y - x;});
      
      for (var k=0; k < tmp.length; k++) {
	txt += '<a style="cursor:pointer;" onclick="browseData(\''+tag+';'+tmp[k][1]+'\')">'+tmp[k][1] + '</a> ('+tmp[k][0]+')';
	if (k != tmp.length-1) {
	  txt += ', ';
	}
      }
    }
	

    txt += '<td><button onclick="browseData(\''+tag+'\')">SHOW</button></td></tr>';
  }
  txt += '</tbody></table>';
  document.getElementById('goldmine').innerHTML = txt;
  $('#tags').dataTable();

  autoComplete('tags_filter');
}

function browseData(keyword) {

  /* empty coocs and tags */
  COOCS = {};
  TAGS = {};

  if (typeof keyword == 'undefined') {
    keyword = false;
  }
  else if (keyword.indexOf(';') != -1) {
    keyword = keyword.split(';');
  }
  else {
    keyword = [keyword];
  }

  console.log('starting to browse');
  
  /* get the goldmine */
  var gm = document.getElementById('goldmine');

  /* load the file with ajax */
  $.ajax({
      async: false,
      type: "GET",
      contentType: "application/text; charset=utf-8",
      url: 'databases.tsv',
      dataType: "text",
      success: function(data) {
        CFG['data'] = data;
      },
      error: function() {
        CFG['storable'] = false;
      }    
  });

  /* break tsv up into pieces */
  var rows = CFG['data'].split('\n');
  var table = [];
  var _header = rows[0].split('\t');
  var header = [];
  var all_tags = [];
  for (var i=0;i<_header.length; i++) {
    header.push(_header[i].slice(1,_header[i].length-1));
  }
  for (var i=1;i<rows.length-1; i++) {
    var _cells = rows[i].split('\t');
    var cells = [];
    for (var j=0,_cell; _cell= _cells[j]; j++) {
      cells.push(_cell.slice(1,_cell.length-1));
    }
    var url = cells[0];
    var res = '<a href="'+url+'" target="_blank">'+cells[1]+'</a>';
    var desc = cells[2];
    var tags = cells[3];
    var langs = cells[4];
    var pubs = cells[5];

    tags = tags.split(/, */);
    tags.sort();
    for (var t=0,tag; tag=tags[t]; t++) {
      if (all_tags.indexOf(t) == -1) {
	all_tags.push(t);
      }
    }
    for (var k=0,tag; tag=tags[k]; k++) {
      if (tag in TAGS) {
	TAGS[tag] += 1;
      }
      else {
	TAGS[tag] = 1;
      }
      for (var l=0,tag2; tag2=tags[l]; l++) {
	if (tag != tag2) {
	  if (!(tag in COOCS)) {
	    COOCS[tag] = {};
	  }
	  if (tag2 in COOCS[tag]) {
	    COOCS[tag][tag2] += 1;
	  }
	  else {
	    COOCS[tag][tag2] = 1;
	  }
	}
      }
    }

    tags = tags.join(', ');


    DATA[i] = {};
    DATA[i]['description'] = desc;
    DATA[i]['publication'] = pubs;
    
    /* check for keyword stuff */
    var use_this_row=true;
    if (keyword) {
      for (var k=0; k < keyword.length; k++) {
	if (tags.toLowerCase().split(', ').indexOf(keyword[k].toLowerCase()) == -1) {
	  use_this_row = false;
	  break;
	}
      }
    }
    
    table.push([i,res,desc,tags,langs]);
  }
  
  gm.innerHTML = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>';
  
  document.getElementById('dsource-number').innerHTML = table.length;
  
  var table = $('#example').dataTable( {
    "data" : table,
    "columns" : [
      {"title" : "", "class" : "number-table", "searchable" : false},
      {"title" : "TITLE", "class" : "title-table"},
      {"title" : "DESCRIPTION", "class" : "description-table"},
      {"title" : "TAGS", "class": "tags-table"},
      {"title" : "LANGUAGES", "class" : "languages-table"},
      ]
  });
  
  if (keyword) {
    keyword.sort();
    var keywords = keyword.join(', ');
    table.fnFilter(keywords, 3);
  }

  autoComplete('example_filter');


}

/* hide the data-table */
function hideData() {
  document.getElementById('goldmine').innerHTML = '';
}

/* funciton expands a given cell content */
function showItem(idx,what) {
  var txt = DATA[idx][what];
  var txt = '<span id="'+what+'_'+idx+'">'
    + txt 
    + '<span id="'+what+'_'+idx+'" style="color:Crimson;cursor:pointer" onclick="hideItem('+idx+',\''+what+'\');"> ...LESS</span></span>';
  document.getElementById(what+'_'+idx).innerHTML = txt;
}
/* funciton contracts a given cell content */
function hideItem(idx,what) {
  var txt = DATA[idx][what].slice(0,40);
  var txt = '<span id="'+what+'_'+idx+'">'
    + txt 
    + '<span id="'+what+'_'+idx+'" style="color:Crimson;cursor:pointer" onclick="showItem('+idx+',\''+what+'\');"> ...MORE</span></span>';
  document.getElementById(what+'_'+idx).innerHTML = txt;
}

function autoComplete(idx) {
    function split( val ) {
      return val.split( /,\s*/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }
 
    $( "#" + idx + ' > label > input')
      // don't navigate away from the field on tab when selecting an item
      .bind( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
          event.preventDefault();
        }
      })
      .autocomplete({
        minLength: 0,
        source: function( request, response ) {
          // delegate back to autocomplete, but extract the last term
          response( $.ui.autocomplete.filter(
            Object.keys(TAGS), extractLast( request.term ) ) );
        },
        focus: function() {
          // prevent value inserted on focus
          return false;
        },
        select: function( event, ui ) {
          var terms = split( this.value );
          // remove the current input
          terms.pop();
          // add the selected item
          terms.push( ui.item.value );
          // add placeholder to get the comma-and-space at the end
          terms.push( "" );
          this.value = terms.join( ", " );
          return false;
        }
      });
}
