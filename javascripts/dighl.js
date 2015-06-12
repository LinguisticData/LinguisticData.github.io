function loadModule(module,path)
{
  if(typeof path == 'undefined')
  {
    path = "javascripts/";
  }
  else
  {
    path = path +'/';
  }

  var script = document.createElement('script');
  script.src = path+module;
  script.async = false;
  script.type="text/javascript";
  document.head.appendChild(script)
}

loadModule('dighl/vendor/jquery.js');
loadModule('dighl/utils.js');
loadModule('dighl/sampa2ipa.js');
loadModule('dighl/edit.js');

