function sum(list)
{
  function add(prev, foll){return prev + foll;}
  return list.reduce(add);
}
function max(list)
{
  function compare(prev,foll)
  {
    if(prev == foll){return prev;}
    else if(prev > foll){return prev;}
    else{return foll}
  }
  return list.reduce(compare);
}
function range(start,stop,step)
{
  if(typeof step == 'undefined'){step=1}
  if(typeof stop == 'undefined'){stop=start;start=0}
  
  if(stop > start && step < 0){return undefined}
  if(step == 0){return undefined}
  
  
  var list = [];
  if(start < stop)
  {
    for(var i=start;i<stop;i+=step)
    {
      list.push(i);
    }
  }
  else if(stop < start)
  {
    for(var i=start;i>stop;i+=step)
    {
      list.push(i);
    }
  }
  else{return undefined}
  return list;
}

