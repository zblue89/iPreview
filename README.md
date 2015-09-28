# iPreview
Preview the selected image file in base64, without uploading to server, by using jQuery

### Install
This is a jQuery plugin, therefore the jQuery library is required. Please include the jQuery library before including iPreview plugin.

Example of including iPreview plugin (both CSS and Javascript files):

	<link rel="stylesheet" href="../csc/jquery.ipreview.css">
	<script src="../js/jquery.ipreview.js"></script>

### Usage
In your HTML, declare an image element:

    <img id="example-img"/>

In your javascript part, initialize iPreview after the DOM elements are ready with the following code:

    $('#example-img').ipreview();

To remove the loaded image, use the following code:

	$('#example-img').trigger('removeImg');

### Option 

The default options are:

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

In which

`accept` The acceptable file type.

`resize` Auto resize the image to the maximum width or maximum height proportinally

`maxwidth` Maximum width of preview image allowed. If the image is wider than the defined value and auto resize function is enabled, the image will be resized to the maximum width proportianally. If `data-max-width` attribute is defined in the element, the value of `data-max-width` will be used.

`maxheight` Maximum height of preview image allowed. If the image is higher than the defined value and auto resize function is enabled, the image will be resized to the maximum height proportianally. If `data-max-height` attribute is defined in the element, the value of `data-max-height` will be used.

`text` The display text when there is no preview image. HTML is allowed.

`title` The text that will be displayed when the mouse over the image.

`success` The callback function when the image is read and ready for preview. 

`error` The callback function when the selected image file is failed to be read.

`imageError` The callback function when the image is failed to be rendered.