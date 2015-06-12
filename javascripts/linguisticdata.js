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


function browseData() {

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

    DATA[i] = {};
    DATA[i]['description'] = desc;
    DATA[i]['publication'] = pubs;
  
    if (desc != '') {
      desc = '<span id="description_'+i+'">'+desc.slice(0,40)+'<span style="color:Crimson;cursor:pointer" onclick="showItem('+i+',\'description\')"> ...MORE</span></span>';
    }
    if (pubs != '') {
      pubs = '<span id="publication_'+i+'">'+pubs.slice(0,40)+'<span style="color:Crimson;cursor:pointer" onclick="showItem('+i+',\'publication\')"> ...MORE</span></span>';
    }
    
    table.push([i,res,desc,tags,langs,pubs]);
  }
  console.log(_header);
  console.log('header',header);
  
  gm.innerHTML = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>';
  
  $('#example').dataTable( {
    "data" : table,
    "columns" : [
      {"title" : "NUMBER", "class" : "small-table"},
      {"title" : "TITLE", "class" : "large-table"},
      {"title" : "DESCRIPTION"},
      {"title" : "TAGS"},
      {"title" : "LANGUAGES"},
      {"title" : "PUBLICATION", "class": "small-table"},
      ]
  });


  console.log(table);

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


