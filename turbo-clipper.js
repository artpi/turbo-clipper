//javascript:(function(){try{var%20x=document.createElement('SCRIPT');x.type='text/javascript';x.src='https://raw.github.com/artpi/turbo-clipper/master/turbo-clipper.js';document.getElementsByTagName('head')[0].appendChild(x);}catch(e){}})();

javascript:void(function(){
	
	// Main Object
	var turboClipper=
	{
		proto:
		{
			regex: "",
			id:"turboClipper",
			getForm:function()
			{
				jQuery('body').append('<form id="'+this.id+'" style="display:none" action="https://www.evernote.com/clip.action" method="POST"><input type="text" name="url" value="'+this.getLocation()+'"><input type="text" name="title" value="'+this.getTitle()+'"><textarea name="body">'+this.getBody()+'</textarea></form>');
				return jQuery("#"+this.id)
			},
			send: function()
			{
				var form=this.getForm();
				form.submit();
			},
			getTitle: function()
			{
				return document.title;
			},
			getLocation: function()
			{
				return document.location.href;
			},
			getBody: function()
			{
				return "turboClipper Default Body";
			}
		},
		services:[],
		register: function (new_service)
		{
			this.services.push(new_service);
		},
		run: function(url)
		{
			var service=null;
			for(var i=0;i<this.services.length;i++)
			{
				if(url.match(this.services[i].regex)!=null)
				{
					service=jQuery.extend({},this.proto,this.services[i])
					break;
				}
			}
			
			if(service==null)
			{
				//If service is not registered, we are running default bookmarklet
				alert('Service not defined. Loading default bookmarklet.');
				EN_CLIP_HOST='http://www.evernote.com';
				var x=document.createElement('SCRIPT');
				x.type='text/javascript';
				x.src=EN_CLIP_HOST+'/public/bookmarkClipper.js?'+(new Date().getTime()/100000);
				document.getElementsByTagName('head')[0].appendChild(x);
			}
			else
			{
				//Odpalamy.
				service.send();
			}	 
		}
	}
	// Here we can add new providers for various webpages.

	// Unusual hostels of the world, location for easy pasting to location window
	turboClipper.register({regex:'//www.unusualhotelsoftheworld.com',
	getBody: function() {
		// Location - important for me.
		initializeGoogleMap();
		var out= "[" + String(marker.position.hb)+ ", " + String(marker.position.ib) + "] <br><br>";
		// Pretty pretty photos
		var length=jQuery(".galleria-image img").length;
		if(length>4)
		{
			length=4;
		}
		for(var i=1;i<length;i++)
		{
			out = out + "<img src='" + String(jQuery(".galleria-image img")[i].src) + "'><br>";
		}
		//Remove stuff
		$("#divSocialIcons").remove();
		$("#imgoverviewnext").remove();
		$("#divContributedBy").remove();
		$("#dlFacilities").remove();
		
		out = out + "<br>" + String($("#divLblFeatures").html()) + "<br><br>";
		out = out + "<br>" + String($("#divCntFacilities").html()) + "<br>";
		
		return out;
	}});


	
	
	//Facebook photos
	turboClipper.register({regex:'//www.facebook.com/photo.php',
	getBody: function() {
		var out = String($(".hasCaption").html()) + "<br>";
		out = out + "<img src='" + String(jQuery("#fbPhotoImage")[0].src) + "'>";
		return out;
	}});
	
	
	//OpenCaching.pl
	turboClipper.register({regex:'opencaching.pl/viewcache.php?',
	getTitle: function() {
		return jQuery(".content-title-noshade-size5").text();
	},
	getBody: function() {
		$("#viewcache-map").remove();
		var out = String($(".content2-container").html()) + "<br>";
		out = out + String($("#viewcache-description").html()) + "<br>";
		return out;
	}});
	
	
	
	
	

	//Starting stuff.
	if(typeof(jQuery) == "undefined")
	{
		// Loading jquery if needed - some pages already have jq.
		var jQscript=document.createElement('script');
		jQscript.src='//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
		document.documentElement.appendChild(jQscript);
		jQscript.addEventListener('load', function (e) { 
			turboClipper.run(document.location.href);
		}, false);
	}
	else
	{
		turboClipper.run(document.location.href);
	}
	
}());





