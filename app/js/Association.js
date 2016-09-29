module.exports = function Association(args) {
			      args = args || {};
			      this.name = args.name || "";
			      this.dept = args.dept || "";
			      this.phone = args.phone || "";
			      this.mail = args.mail || "";
			      this.lastCall = args.lastCall || "";
			      this.lastCallTs = args.lastCallTs || "";
			      this.nbCall = args.nbCall || 0;
			      this.adresse = args.adresse || "";
			      this.obs = args.obs || "";
			      this.status = args.status || "";
			      if (args.objectId)
				      this.objectId = args.objectId;
			    }