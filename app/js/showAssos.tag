<showAssos>
    <h3>show assos</h3>
  <div>
	<p>{ count }</p>
  <button onclick='{ showAll }'>All</button>
  <button onclick='{ showMustCall }' if='{ modeEdit }'>To recall</button>
  <button onclick='{ showDoneCall }' if='{ modeEdit }'>Done</button>
  

  <table class="pure-table pure-table-horizontal">
    <thead>
      <tr>
        <th>Dept</th>
        <th>Nom</th>
        <th>Téléphone</th>
        <th if='{ modeEdit }'>Dernier appel</th>
        <th if='{ modeEdit }'>Statut</th>
        <th if='{ modeEdit }'>Action</th>
        <th if='{ modeEdit }'>Nb appel</th>
        <th>Mail</th>
        <th>Site web</th>
        <th>Adresse</th>
        <th>Observations</th>
        <th if='{ modeEdit }'>Edit</th>
      </tr>
    </thead>
      <tr>
        <td><input class='fill-input' type='text' onblur='{ filterDept }'></td>
        <td><input class='fill-input' type='text' onblur='{ filterName }'></td>
        <td><input class='fill-input' type='text' onblur='{ filterPhone }'></td>
        <td if='{ modeEdit }'></td>
        <td if='{ modeEdit }'></td>
        <td if='{ modeEdit }'></td>
        <td if='{ modeEdit }'></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td if='{ modeEdit }'></td>
      </tr>
      <tr each={ item in results }>
          <td>{ item.dept }</td>
          <td>{ item.name }</td>
          <td>{ item.phone }</td>
          <td if='{ modeEdit }'>{ item.lastCall }</td>
          <td if='{ modeEdit }'>{ item.status }</td>
          <td if='{ modeEdit }'> 
            <form lass="pure-form">
            <div class="pure-control-group">
              <button class='button-small pure-button' name='ok' objectId='{ item.objectId }' onclick='{ updateStatus }'><i class="fa fa-check-circle" aria-hidden="true" name='ok' objectId='{ item.objectId }'></i> Done !</button>

              <button class='button-small pure-button' name='recall' objectId='{ item.objectId }' onclick='{ updateStatus }'><i class="fa fa-times-circle" aria-hidden="true" name='recall' objectId='{ item.objectId }'></i> Recall</button>
              </div>
            </form>
          </td>
          <td if='{ modeEdit }'>{ item.nbCall }</td>
          <td>{ item.mail }</td>
          <td>{ item.webSite }</td>
          <td>{ item.adresse }</td>
          <td>{ item.obs }</td>
          <td if='{ modeEdit }'> <a href='#addAsso'><button class='button-small pure-button' name='edit' objectId='{ item.objectId }' onclick='{ editItem }'><i class="fa fa-pencil" aria-hidden="true" objectId='{ item.objectId }'></i></button></a>


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
  this.conditions = []
  this.conditions.status = ''
  this.conditions.dept = ''
  this.conditions.name = ''
  this.conditions.phone = ''
  this.conditions.active = 'active != false'
  this.modeEdit = false
  
  opts.eventBus.on('changeMode', function(mode) {
      self.modeEdit = mode
      self.update()
  })
  
  opts.eventBus.on('showAll', function(){
    self.showAll('')
  })

  function execQuery(){
    dataQuery.condition = ''
    for(var c in self.conditions){
      if (self.conditions[c] != '')
        dataQuery.condition += self.conditions[c]+' and '
    }
    dataQuery.condition = dataQuery.condition.replace(/(?:and )$/,'')
    Backendless.Persistence.of(Association).find(dataQuery).then(getAssociations,gotError);
  }

  showAll(e) {
    self.conditions.status = ""
    execQuery()
  }

  showMustCall(e){
    self.conditions.status = "lastCallTs <= "+dateFilter.getTime()+" and status = 'recall'"
    execQuery()
  }

  showDoneCall(e){
    self.conditions.status = "status = 'ok'"
    execQuery()
  }

  updateStatus(e){
  var item = findByObjectId(self.results, e.target.attributes.objectId.value)
  if ( item != -1){
      item.status = e.target.name
      item.lastCallTs = Date.now()
      item.lastCall = moment(Date.now()).format('YYYY-MM-DD')
      item.nbCall++

      opts.Backendless.Persistence.of(Association).save(item).then(assoUpdated)
    }
  }

  filterDept(e){
    if(e.target.value != '')
      this.conditions.dept = "dept like '"+e.target.value+"'"
    else
      this.conditions.dept = ""
    execQuery()
  }

  filterName(e){
    if(e.target.value != '')
      this.conditions.name = "name like '"+e.target.value+"'"
    else
    this.conditions.name = ""
    execQuery()
  }
  filterPhone(e){
    if(e.target.value != '')
      this.conditions.phone = "phone like '"+e.target.value+"'"
    else
      this.conditions.phone = ""
    execQuery()
  }

  editItem(e){
    var item = findByObjectId(self.results, e.target.attributes.objectId.value)
    if(item != -1){
      opts.eventBus.trigger('editAsso',item)
      window.scrollTo(0, document.getElementById('addAsso').offsetTop);
    }
  }

  removeItem(e){
    if (window.confirm('Etes vous sûr de supprimer cette association ?')){
      var item = findByObjectId(self.results, e.target.attributes.objectId.value)
      if(item != -1){
        item.active = false
        opts.Backendless.Persistence.of(Association).save(item).then(assoDeleted)
      }
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

  function gotError(err){
    if (err.code == 3064)
      opts.eventBus.trigger('unConnect')
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