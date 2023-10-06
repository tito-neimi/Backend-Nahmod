class errorGenerator{
  notFound(id){
    return(
      `Element not found id provided: ${id}
      `
    )
  }
}

module.exports = new errorGenerator()