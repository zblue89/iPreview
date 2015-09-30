var initCount = 0;
$.fn.ipreviewClone = function(){
	initCount++;
	$(this).attr('id', 'ip-image-'+initCount).attr('data-manual-remove', 1).removeAttr('src');
	$(this).parent('.ipreview-wrapper').attr('id','ip-wrap-'+initCount).attr('data-element', '#ip-image-'+initCount);
};
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
    $(this).each(function(){
        initCount++;
        if(!$(this).attr('id')){
            $(this).attr('id', 'ip-image-'+initCount);
        }
        $(this).addClass('ipreview-img').wrap('<div class="ipreview-wrapper" title="'+settings.title+'"></div>');
        $(this).before('<span class="ipreview-remove"><i class="glyphicon glyphicon-remove"></i></span>');
        $(this).before('<span style="display:none;" class="ipreview-text">'+settings.text+'</span>');

        if(!$(this).attr('src')){
            $(this).hide();
            $(this).siblings('.ipreview-remove').hide();
            $(this).siblings('.ipreview-text').show();
        }

        $(this).error(function(){
            $(this).hide();
            $(this).siblings('.ipreview-remove').hide();
            $(this).siblings('.ipreview-text').show();
            if($(this).prop('data-manual-remove')){
                $(this).prop('data-manual-remove', false);
            } else {
                settings.imageError();
            }
        }).load(function(){
            $(this).show();
            $(this).siblings('.ipreview-remove').show();
            $(this).siblings('.ipreview-text').hide();
        });

        $(this).on('preview click',function() {
        	if(!$(this).parent().hasClass('ipreview-loading')){
                $('#ip-file').attr('data-parent', '#'+$(this).attr('id')).trigger('click');
            }
        });

        $(this).on('removeImg',function() {
        	$(this).prop('data-manual-remove',true).removeAttr('src').hide();
        	$(this).siblings('.ipreview-remove').hide();
        	$(this).siblings('.ipreview-text').show();
        });
    });
    
    if($('body').find('#ip-file').length == 0){
    	$('body').append('<input type="file" id="ip-file" value="" name="image" style="display:none;" accept="'+settings.accept+'"/>');
    }
    $('.ipreview-text').click(function(e){
        e.preventDefault();
        $(this).siblings('img').trigger('preview');
    });
    $('.ipreview-remove').click(function(e){
        e.preventDefault();
        $(this).siblings('img').prop('data-manual-remove',true).trigger('removeImg');
    });
    var canvas = document.createElement("canvas");
    $('#ip-file').change(function(){
    	if(typeof $(this)[0].files[0] !== 'undefined'){
	        var ele = $($(this).attr('data-parent'));
	        ele.hide();
	        ele.siblings('#ipreview-text').html('Loading...').show();
	        ele.parent().addClass('ipreview-loading');

	        var reader = new FileReader();
	        reader.onload = function(e){
	        	var isGif = (e.target.result.indexOf('image/gif') >= 0);
	        	if(settings.resize && !isGif){
	        		var img = new Image()
	                $(img).one('load', function () {
	                    var MAX_WIDTH = ele.attr('data-max-width') ? parseInt(ele.attr('data-max-width')) : settings.maxwidth;
	                    var MAX_HEIGHT = ele.attr('data-max-height') ? parseInt(ele.attr('data-max-height')) : settings.maxheight;
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

	                    ele.siblings('#ipreview-text').html(settings.text);
	                	ele.parent().removeClass('ipreview-loading');
	                	settings.success(ele, canvas.toDataURL());
	                });
	                img.src = e.target.result;
	        	} else {
	        		ele.siblings('#ipreview-text').html(settings.text);
	        		ele.parent().removeClass('ipreview-loading');
	             	settings.success(ele, e.target.result);
	        	}
	        };
	        reader.onerror = function(){
	        	ele.siblings('#ipreview-text').html(settings.text);
	        	ele.parent().removeClass('ipreview-loading');
	            settings.error(ele);
	        };

	        reader.readAsDataURL($(this)[0].files[0]);
    	}
		$(this).val("");
    });
};
