$( document ).ready( function () {

    var formHtml = '';
    if ( $( '.js-doc-form' ).length ) {
		getFormFromJson( $( '#document' ).text() );
    }

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
	        		var element;
	        		if ( key.indexOf( 'description' ) > -1 || key.indexOf( 'address' ) > -1 ) {
	        			element = '<textarea name="' + key + '" type="text"  >'+json[key]+'</textarea>';
	        		} else {
	        			element = '<input name="' + key + '" type="text" value="' + json[key] + '" ></input>';
	        		}
	        		formHtml += '<label>' + key + '</label>' +
		        				 element +
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
		formHtml += '<div class="doc-array-container js-array-container">'+
						'<div class="doc-array-add js-array-add" ><i class="icon-plus-sign icon-white" ></i>Add another</div>';
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
		        				'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>'+
		        				'<input class="indent-left" name="' + prevKey + '[]' + '" type="text" value="' + array[index] + '" ></input>'+
		        			'</div>';
			}
		}
		formHtml += '</div>';
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
	}

	function bindFormEvents() {
		$( '.js-array-remove' ).unbind( 'click' ).click( function () {
			var currentArray = $( this ).parent( '.js-doc-array' );
			currentArray.slideUp(200, function () {
				currentArray.remove();
			} )
		} );

		$( '.js-array-add' ).unbind( 'click' ).click( function () {
			$( this ).parent().find( '.js-doc-array:first' ).clone().insertAfter( $( this ) );
			$( this ).parent().find( '.js-doc-array:first input' ).val( '' );
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

	function getFinalDocumentString( docString ) {
		var latLonPattern = /("location"):\["([0-9]{2}.[0-9]{5})","([0-9]{2}.[0-9]{5})"]/;
		docString = docString.replace( latLonPattern, "$1:[$2,$3]" );

		var ObjectIdPattern = /"(ObjectID)\((\w+)\)"/g
		docString = docString.replace( ObjectIdPattern, "$1(\"$2\")" );

		return docString;
	}

	$( '.js-doc-save' ).mouseover( function () {
		var documentJson = $( '.js-document-form' ).serializeObject();
		console.log(documentJson)

		documentJson = getFinalDocument( documentJson );
		var documentJsonString = JSON.stringify( documentJson );

		documentJsonString = getFinalDocumentString( documentJsonString );
console.log(documentJsonString)
		$( '#document' ).text( documentJsonString );
	} );

	getCollectionTemplate();

	function getCollectionTemplate() {
		var collection = $( '.db-data-div' ).attr( 'data-collection' );
		// console.log
		$.ajax({
	        url: "testing",
	        cache: false,
	        type: "GET",
	        // dataType: "json",
	        data: 'collection=' + collection + '&documentName=DUMMYDOC',
	        complete: function(response){
	            console.log(response.responseText);
	            var templateJson = jQuery.parseJSON( response.responseText );
	            console.log( templateJson );
	        }
	    });
	}

} );