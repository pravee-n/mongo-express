$( document ).ready( function () {

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
		// formHtml += '<div class="indent-block">';
		if ( array.length == 0 ) {
		    formHtml +=	'<input class="indent-left" name="' + prevKey + '[]' + '" type="text" value="" ></input>';
		}
		for( index in array ) {
			if ( array[index] instanceof Object ) {
				var json = array[index]
				formHtml += '<div class="doc-array js-doc-array">'+
								'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>';
				for ( key in json ) {
	        		formHtml += '<label>' + key + '</label>' +
								'<input class="indent-left" name="' + prevKey + '[][' + key  + ']" type="text" value="' + json[key] + '" ></input>';
				}
				formHtml += '</div>';
			} else {
		        formHtml += '<div class="doc-array js-doc-array">'+
		        				'<input class="indent-left" name="' + prevKey + '[]' + '" type="text" value="' + array[index] + '" ></input>'+
		        			'</div>';
			}
			// formHtml += '<div class="row-separator"></div>'
		}
		// formHtml += '</div>';
	}

	function getFormFromJson( jsonString ) {
		jsonString = jsonString.split( 'ObjectID("' ).join( '"ObjectID(' ).split( '")' ).join( ')"' );
		var json = jQuery.parseJSON( jsonString );
		console.log(json)
		var documentId = json['_id'];
		delete json['_id'];
		json['document_id'] = documentId;
		formHtml = '<form class="js-document-form">';
		jsonIterate( json );

		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );
		bindFormEvents();
		// console.log($('.js-document-form').serializeObject());
	}

	function bindFormEvents() {
		$( '.js-array-remove' ).unbind( 'click' ).click( function () {
			$( this ).parent( '.js-doc-array' ).remove();
		} );
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
		console.log(documentJson)

		documentJson = getFinalDocument( documentJson );
		var documentJsonString = JSON.stringify( documentJson );
		// documentJsonString = documentJsonString.split( '"ObjectID(' ).join( 'ObjectID("' ).split( ')"' ).join( '")' );
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