function getRandomColor() 
{
  var a1 = Math.floor((Math.random() * 250)+1);
  var a2 = Math.floor((Math.random() * 250)+1);
  var a3 = Math.floor((Math.random() * 250)+1);
  return [a1,a2,a3];
}

function sleep(milliseconds) 
{
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) 
  {
    if ((new Date().getTime() - start) > milliseconds)
    {
      break;
    }
  }
}
