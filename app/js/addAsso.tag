<addAsso if='{ modeEdit }'>
    <h3 id='addAsso'>add asso</h3>
<form class="pure-form pure-form-aligned" onsubmit='{ addAsso }'>
<fieldset>
	<div class="pure-control-group">
		<label for='name'>Nom: </label>
	    <input type='text' name='name' value='{ name }' onkeyup='{ edit }' placeholder='Utopia' required>
    </div">
    <div class="pure-control-group">
		<label for='dept'>Département: </label>
	    <input type='text' name='dept' value='{ dept }' onkeyup='{ edit }' placeholder='75'>
    </div>
    <div class="pure-control-group">
	    <label for='phone'>Téléphone: </label>
	    <input type='tel' name='phone' value='{ phone }' onkeyup='{ edit }' required>
    </div>
    <div class="pure-control-group">
	    <label for='mail'>Mail: </label>
	    <input type='email' name='mail' value='{ mail }' onkeyup='{ edit }'>
    </div>
    <div class="pure-control-group">
	    <label for='adresse'>adresse: </label>
	    <input type='text' name='adresse' value='{ adresse }' onkeyup='{ edit }'>
    </div>
    <div class="pure-control-group">
	    <label for='lastCall'>Dernier Appel: </label>
	    <input type='date' name='lastCall' value='{ lastCall }' onchange='{ edit }'>
    </div>
    <div class="pure-control-group">
	    <label for='status'>Statut: </label>
	    <select name='status' value='{ status }' onchange='{ edit }'>
		    <option value='ok'>Ok</option>
		    <option value='recall'>To recall</option>
	  	</select>
    </div>
    <div class="pure-control-group">
	    <label for='obs'>Observations: </label>
	    <textarea rows="5" cols="50" name='obs' onkeyup='{ edit }'>{ obs }</textarea>
    </div>
    <div class="pure-controls">
		<button onclick='{ cancel }' class="pure-button">Annuler</button>
		<button if='{ !objectId }' type="submit" class="pure-button pure-button-primary">Ajouter</button>
		<button if='{ objectId }' type="submit" class="pure-button pure-button-primary button-warning">Modifier</button>
	</div>
</fieldset>
</form>
  <script>
  	var Association = require('./Association.js')
  	var moment = require('moment')
  	var self = this
  	this.modeEdit = false

  	this.on('mount', function() {
	  	initFields()
	})

	opts.eventBus.on('changeMode', function(mode) {
	  	self.modeEdit = mode
	  	self.update()
	})

	

  	opts.eventBus.on('editAsso', function(item){
  		self.name = item.name
	  	self.dept = item.dept
	  	self.phone = item.phone
	  	self.mail = item.mail
	  	self.status = item.status
	  	self.adresse = item.adresse
	  	self.obs = item.obs
	  	self.lastCall = item.lastCall
	  	self.lastCallTs = item.lastCallTs
		self.nbCall = item.nbCall
		self.objectId = item.objectId

		self.update()

  	})

	function initFields(){
	  	self.name = ''
	  	self.dept = ''
	  	self.phone = ''
	  	self.mail = ''
	  	self.status = ''
	  	self.adresse = ''
	  	self.obs = ''
	  	self.lastCall = ''
	  	self.lastCallTs = ''
		self.nbCall = 0
		self.update()
	}

	cancel(e){
		initFields()
		this.objectId = ''
	}
	
	edit(e) {
      this[e.target.name] = e.target.value
    }

	addAsso(e) {
		if (this.lastCall == '' || this.lastCall == 'Invalid date'){
			this.lastCallTs = new Date(0)
		}
		else{
			this.lastCallTs = new Date(this.lastCall).getTime()
			if (this.objectId == '')
				this.nbCall = 1
		}
        var associationObject = new Association({
	    name: this.name,
	    phone: this.phone,
	    mail: this.mail,
	    dept: this.dept,
	    lastCall: moment(this.lastCall).format('YYYY-MM-DD'),
	    lastCallTs: this.lastCallTs,
	    adresse: this.adresse,
	    obs: this.obs,
	    status: this.status,
	    nbCall: this.nbCall,
	    active: true
	});
        if (this.objectId != '')
		    associationObject.objectId = this.objectId

	    var savedData = opts.Backendless.Persistence.of(Association).save(associationObject).then(assoRegistered);
	}

	function assoRegistered() {
	self.name = ''
  	self.phone = ''
  	self.mail = ''
  	self.adresse = ''
  	self.obs = ''
  	self.status = ''
  	self.lastCallTs = ''
  	self.objectId = ''
  	self.update()
    console.log("asso has registered")
    opts.eventBus.trigger('showAll')
}
  </script>
</addAsso>