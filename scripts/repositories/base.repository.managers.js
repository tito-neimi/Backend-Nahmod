class BaseMananger {

  constructor(model){
    this.model = model
  }

  async getAll(){
    return await this.model.find().lean()
  }

  async add(etities) {
    const result = await this.model.create(etities)
    return result;
}

async delete (id) {
  if ( await !this.getElementById(id)) {
    console.error("elemeto no encontrado")
    return false
  }
  else {
    await this.model.deleteOne({_id : id})
    return true
  }}

  async getElementById(id) {
    const entitie = await this.model.findOne({_id : id}).lean()
    return entitie
  }


  async modifyElement (id, item) {
    try {
      const result = await this.model.updateOne({_id : id}, item)
      console.log("resultado: ", result)
      if (result.matchedCount >= 1) return item
    }
    catch(e){
      console.error(e)
      return false;
    }
  }

  async modifyProperty(id, prop, data) {
    try {
      const updateObject = { $set: {} };
      updateObject.$set[prop] = data;
      const result = await this.model.updateOne({ _id: id }, updateObject);
  
      console.log("resultado: ", result);
  
      // Verificar si se realizó al menos una actualización
      if (result.matchedCount >= 1) return result;

    } catch (e) {
      console.error(e);
      return false;
    }
  }
  

  async getAllByPage (page, limit, sort, query) {
    const paginateOptions = {page: page, limit:limit}
    let myAggregate
    if (query == "null" || query == null){
      myAggregate = this.model.aggregate([{$sort:{price: +sort}}])
    }
    else {
      myAggregate = this.model.aggregate([
        {
          $match:{category: query}
        },
        {$sort:{price: +sort}}
    ]) 
    }
  
    
    const entities = await this.model.aggregatePaginate(myAggregate, paginateOptions)
    return entities
    
  }

}

module.exports = BaseMananger