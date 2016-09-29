<showAssos>
  <div>
	<p>{ count }</p>
  <button onclick='{ showAll }'>All</button>
  <button onclick='{ showMustCall }'>To recall</button>
  <button onclick='{ showDoneCall }'>Done</button>
  

  <table class="pure-table pure-table-horizontal">
    <thead>
      <tr>
        <th>Dept</th>
        <th>Nom</th>
        <th>Téléphone</th>
        <th>Dernier appel</th>
        <th>Statut</th>
        <th>Action</th>
        <th>Nb appel</th>
        <th>Mail</th>
        <th>Adresse</th>
        <th>Observations</th>
        <th>Edit</th>
      </tr>
    </thead>
      <tr each={ item in results }>
          <td>{ item.dept }</td>
          <td>{ item.name }</td>
          <td>{ item.phone }</td>
          <td>{ item.lastCall }</td>
          <td>{ item.status }</td>
          <td> 
            <form lass="pure-form">
            <div class="pure-control-group">
              <button class='button-small pure-button' name='ok' objectId='{ item.objectId }' onclick='{ updateStatus }'><i class="fa fa-check-circle" aria-hidden="true" name='ok' objectId='{ item.objectId }'></i> Done !</button>

              <button class='button-small pure-button' name='recall' objectId='{ item.objectId }' onclick='{ updateStatus }'><i class="fa fa-times-circle" aria-hidden="true" name='recall' objectId='{ item.objectId }'></i> Recall</button>
              </div>
            </form>
          </td>
          <td>{ item.nbCall }</td>
          <td>{ item.mail }</td>
          <td>{ item.adresse }</td>
          <td>{ item.obs }</td>
          <td> <button class='button-small pure-button' name='edit' objectId='{ item.objectId }' onclick='{ editItem }'><i class="fa fa-pencil" aria-hidden="true" objectId='{ item.objectId }'></i></button>


          <button class='button-small pure-button' name='remove' objectId='{ item.objectId }' onclick='{ removeItem }'><i class="fa fa-trash" aria-hidden="true" name='remove' objectId='{ item.objectId }'></i></button> </td>
      </tr>
  </table>
</div>
  <script>

  var Association = require('./Association.js')
  var moment = require('moment')

  var self = this

  var dateFilter = new Date();
  dateFilter.setDate(dateFilter.getDate() - 2)
  var dataQuery = new Backendless.DataQuery();
  dataQuery.options = {}
  dataQuery.options.pageSize = 100;
  
  
  opts.eventBus.on('showAll', function(){
    self.showAll('')
  })

  showAll(e) {
    dataQuery.condition = ""
    Backendless.Persistence.of(Association).find(dataQuery).then(getAssociations);
  }

  showMustCall(e){
    dataQuery.condition = "lastCallTs <= "+dateFilter.getTime()+" and status = 'recall'";
    Backendless.Persistence.of(Association).find(dataQuery).then(getAssociations)
  }

  showDoneCall(e){
    dataQuery.condition = "status = 'ok'";
    Backendless.Persistence.of(Association).find(dataQuery).then(getAssociations)
  }

  updateStatus(e){
  var item = findByObjectId(self.results, e.target.attributes.objectId.value)
  if ( item != -1){
      item.status = e.target.name
      item.lastCallTs = Date.now()
      item.lastCall = moment(Date.now()).format('YYYY-MM-DD')
      item.nbCall++

      opts.Backendless.Persistence.of(Association).save(item).then(assoUpdated);
    }
  }

  editItem(e){
    var item = findByObjectId(self.results, e.target.attributes.objectId.value)
    if(item != -1)
      opts.eventBus.trigger('editAsso',item)
  }

  removeItem(e){
    if (window.confirm('Etes vous sûr de supprimer cette association ?')){
      var item = findByObjectId(self.results, e.target.attributes.objectId.value)
      if(item != -1)
        opts.Backendless.Persistence.of(Association).remove(item).then(assoDeleted);
    }
  }

  function assoUpdated(){
    console.log("asso updated")
  }

  function assoDeleted(){
    console.log("asso deleted")
    opts.eventBus.trigger('showAll')
  }

  function getAssociations(data){
    self.results = data.data
    console.log(self.results)
    self.update()
  }

  function findByObjectId(data,id){
    var i = 0
    for (;id != data[i].objectId;i++){}
    if(i!=data.length)
      return data[i]
    return -1
  }

  </script>
</showAssos>