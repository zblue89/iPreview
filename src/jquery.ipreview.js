(function($){
	var initCount = 0;
	$.fn.ipreview = function(options){
	    var settings = {
	        accept: 'image/*',
	        resize: false,
	        maxwidth: 1024,
	        maxheight: 1024,
	        text: 'Click here to upload',
	        title: 'Click here to upload',
	        success:function(ele, data){
	        	ele.attr('src', data);
	        },
	        error: function(ele){
	        	alert('Failed to preview the image');
	        },
	        imageError: function(){
	        	alert('Failed to render the image');
	        }
	    };
	    if(options){
	        $.extend(settings, options);
	    }
	    
	    if($('body').find('#ip-file').length == 0){
	    	$('body').append('<input type="file" id="ip-file" value="" style="display:none;" accept="'+settings.accept+'"/>');
	    	var canvas = document.createElement("canvas");
	        $('#ip-file').change(function(){
	        	if(typeof $(this)[0].files[0] !== 'undefined'){
	    	        var ele = $($(this).attr('data-parent'));
	    	        ele.hide();
	    	        $(ele.attr('data-text')).html('Loading...').show();
	    	        ele.parent().addClass('ipreview-loading');
	
	    	        var reader = new FileReader();
	    	        reader.onload = function(e){
	    	        	var isGif = (e.target.result.indexOf('image/gif') >= 0);
	    	        	if(ele.prop('data-resize') && !isGif){
	    	        		var img = new Image()
	    	                $(img).one('load', function () {
	    	                    var MAX_WIDTH = ele.attr('data-max-width');
	    	                    var MAX_HEIGHT = ele.attr('data-max-height');
	    	                    var width = img.width;
	    	                    var height = img.height;
	
	    	                    if (width > height) {
	    	                        if (width > MAX_WIDTH) {
	    	                            height *= MAX_WIDTH / width;
	    	                            width = MAX_WIDTH;
	    	                        }
	    	                    } else {
	    	                        if (height > MAX_HEIGHT) {
	    	                            width *= MAX_HEIGHT / height;
	    	                            height = MAX_HEIGHT;
	    	                        }
	    	                    }
	
	    	                    canvas.width = width;
	    	                    canvas.height = height;
	    	                    canvas.getContext("2d").drawImage(this, 0, 0, width, height);
	    	                    this.src = canvas.toDataURL();
	
	    	                    $(ele.attr('data-text')).html($(ele.attr('data-text')).attr('data-text'));
	    	                	ele.parent().removeClass('ipreview-loading');
	    	                	settings.success(ele, canvas.toDataURL());
	    	                });
	    	                img.src = e.target.result;
	    	        	} else {
	    	        		$(ele.attr('data-text')).html($(ele.attr('data-text')).attr('data-text'));
	    	        		ele.parent().removeClass('ipreview-loading');
	    	             	settings.success(ele, e.target.result);
	    	        	}
	    	        };
	    	        reader.onerror = function(){
	    	        	$(ele.attr('data-text')).html($(ele.attr('data-text')).attr('data-text'));
	    	        	ele.parent().removeClass('ipreview-loading');
	    	            settings.error(ele);
	    	        };
	
	    	        reader.readAsDataURL($(this)[0].files[0]);
	        	}
	    		$(this).val("");
	        });
	    }
	    
	    return $(this).each(function(){
	        initCount++;
	        if(!$(this).attr('id')){
	            $(this).attr('id', 'ipreview-image-'+initCount);
	        }
	        $(this).attr('data-remove', '#ipreview-remove-'+initCount);
	        $(this).attr('data-text', '#ipreview-text-'+initCount);
	        $(this).prop('data-resize', settings.resize);
	        if(!$(this).attr('data-max-width')){
	        	$(this).attr('data-max-width', settings.maxwidth);
	        }
	        if(!$(this).attr('data-max-height')){
	        	$(this).attr('data-max-height', settings.maxheight);
	        }
	        $(this).addClass('ipreview-img').wrap('<div class="ipreview-wrapper" title="'+settings.title+'"></div>');
	        $(this).before('<div class="ipreview-remove" id="ipreview-remove-'+initCount+'"><i class="glyphicon glyphicon-remove"></i></div>');
	        $(this).before('<div class="ipreview-text" id="ipreview-text-'+initCount+'" data-text="'+settings.text+'">'+settings.text+'</div>');
	
	        if(!$(this).attr('src')){
	            $(this).hide();
	            $($(this).attr('data-remove')).hide();
	            $($(this).attr('data-text')).show();
	        }
	
	        $(this).error(function(){
	            $(this).hide();
	            $($(this).attr('data-remove')).hide();
	            $($(this).attr('data-text')).show();
	            if($(this).prop('data-manual-remove')){
	                $(this).prop('data-manual-remove', false);
	            } else {
	                settings.imageError();
	            }
	        }).load(function(){
	            $(this).show();
	            $($(this).attr('data-remove')).show();
	            $($(this).attr('data-text')).hide();
	        });
	        
	        $('#ipreview-text-'+initCount).click(function(e){
	            e.preventDefault();
	            $(this).siblings('img').trigger('preview');
	        });
	        $('#ipreview-remove-'+initCount).click(function(e){
	            e.preventDefault();
	            $(this).siblings('img').trigger('removeImg');
	        });
	
	        $(this).on('preview click',function() {
	        	if(!$(this).parent().hasClass('ipreview-loading')){
	                $('#ip-file').attr('data-parent', '#'+$(this).attr('id')).trigger('click');
	            }
	        });
	
	        $(this).on('removeImg',function() {
	        	$(this).prop('data-manual-remove',true).removeAttr('src').hide();
	        	$($(this).attr('data-remove')).hide();
	            $($(this).attr('data-text')).show();
	        });
	    });
	};
})(jQuery);