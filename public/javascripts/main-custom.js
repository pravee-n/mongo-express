$( document ).ready( function () {

	// $.fn.serializeObject = function(){

 //        var self = this,
 //            json = {},
 //            push_counters = {},
 //            patterns = {
 //                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
 //                "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
 //                "push":     /^$/,
 //                "fixed":    /^\d+$/,
 //                "named":    /^[a-zA-Z0-9_]+$/
 //            };


 //        this.build = function(base, key, value){
 //            base[key] = value;
 //            return base;
 //        };

 //        this.push_counter = function(key){
 //            if(push_counters[key] === undefined){
 //                push_counters[key] = 0;
 //            }
 //            return push_counters[key]++;
 //        };

 //        $.each($(this).serializeArray(), function(){

 //            // skip invalid keys
 //            if(!patterns.validate.test(this.name)){
 //                return;
 //            }

 //            var k,
 //                keys = this.name.match(patterns.key),
 //                merge = this.value,
 //                reverse_key = this.name;

 //            while((k = keys.pop()) !== undefined){

 //                // adjust reverse_key
 //                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

 //                // push
 //                if(k.match(patterns.push)){
 //                    merge = self.build([], self.push_counter(reverse_key), merge);
 //                }

 //                // fixed
 //                else if(k.match(patterns.fixed)){
 //                    merge = self.build([], k, merge);
 //                }

 //                // named
 //                else if(k.match(patterns.named)){
 //                    merge = self.build({}, k, merge);
 //                }
 //            }

 //            json = $.extend(true, json, merge);
 //        });

 //        return json;
 //    };

    var formHtml = '';
	getFormFromJson( $( '#document' ).text() );

	function jsonIterate( json, prevKey ) {
		for ( key in json ) {
			if ( json[key] instanceof Object) {
				formHtml += '<label>' + key + '</label>';
				if ( json[key] instanceof Array ) {
					iterateArray( json[key], key );
				} else {
	            	jsonIterate( json[key], key )
				}
	        } else {
	        	if ( prevKey ) {
	        		formHtml += '<div class="indent-block">' +
	        						'<label class="indent-left">' + key + '</label>' +
		        					'<input class="indent-left" name="' + prevKey + '[' + key + ']' + '" type="text" value="' + json[key] + '" ></input>' +
		        				'</div>';
	        	} else {
	        		formHtml += '<label>' + key + '</label>' +
		        				'<input name="' + key + '" type="text" value="' + json[key] + '" ></input>' +
		        				'<div class="row-separator"></div>';
	        	}
	        }
		}
	}

	function iterateArray( array, prevKey ) {
		// console.log(array.length)
		formHtml += '<div class="indent-block">';
		if ( array.length == 0 ) {
		    // formHtml += '<div class="indent-block">' +
		    	formHtml +=	'<input class="indent-left" name="' + prevKey + '[]' + '" type="text" value="" ></input>';
		    			// '<div>';
		}
		for( index in array ) {
			if ( array[index] instanceof Object ) {
				var json = array[index]
				for ( key in json ) {
					// console.log(prevKey + '[' + index + '][][' + key  + ']');
	        		formHtml += '<label>' + key + '</label>' +
								'<input class="indent-left" name="' + prevKey + '[' + index + '][' + key  + ']" type="text" value="' + json[key] + '" ></input>';
								// '<div class="row-separator"></div>';
				}
			} else {
		        formHtml += '<input class="indent-left" name="' + prevKey + '[]' + '" type="text" value="' + array[index] + '" ></input>';
			}
			formHtml += '<div class="row-separator"></div>'
		}
		formHtml += '</div>';
	}

	function getFormFromJson( jsonString ) {
		// console.log( jsonString );
		jsonString = jsonString.split( 'ObjectID("' ).join( '"ObjectID(' ).split( '")' ).join( ')"' );
		// console.log(jsonString)
		var json = jQuery.parseJSON( jsonString );
		console.log(json)
		var documentId = json['_id'];
		delete json['_id'];
		json['document_id'] = documentId;
		// delete json['picture_list'];
		// delete json['stores'];
		// console.log(json)
		// console.log(json['details'][0])
		formHtml = '<form class="js-document-form">';
		jsonIterate( json );

		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );
		// console.log($('input[name=_id]').val())
		console.log($('.js-document-form').serializeObject());
	}

	function getFinalDocument( json ) {
		var documentId = json['document_id'];
		delete json['document_id'];
		json['_id'] = documentId;

		for ( var key in json ) {
			if ( json[key] instanceof Array ) {
				if ( json[key].length == 1 && json[key][0] == "" ) {
					json[key].splice( 0, 1 );
					break;
				}
			} else {
				continue;
			}
		}
		return json
	}

	$( '.js-doc-save' ).mouseover( function () {
		var documentJson = $( '.js-document-form' ).serializeObject();
		documentJson = getFinalDocument( documentJson );
		console.log(documentJson)
		var documentJsonString = JSON.stringify( documentJson );
		documentJsonString = documentJsonString.split( '"ObjectID(' ).join( 'ObjectID("' ).split( ')"' ).join( '")' );
		console.log(documentJsonString);
		$( '#document' ).text( documentJsonString );
	} );

	// getCollectionTemplate();

	// function getCollectionTemplate() {
	// 	$.ajax({
	//         url: "/test",
	//         cache: false,
	//         type: "GET",
	//         // dataType: "json",
	//         data: 'collId=526a30321d41c8118d3e544c',
	//         complete: function(response){
	//             console.log(response);
	//         }
	//     });
	// }

} );