const allLister = array => 
{
    const list = []
    const len = array.length
    for(var i = 0; len >= i; i++){ list.push( array[i] ) }
    return list
}

const someLister = (array, cap) =>
{
    const list = []
    for(var i = 0; cap >= i; i++){ list.push( array[i] ) }
    return list
}

export default { allLister, someLister }