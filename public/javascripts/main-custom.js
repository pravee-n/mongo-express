$( document ).ready( function () {

	var referenceFields = [ 'category', 'child_subcategories', 'subcategory' ];
    var formHtml = '';
    if ( $( '.js-doc-form' ).length ) {
		getFormFromJson( $( '#document' ).text() );
    }

	function jsonIterate( json, prevKey ) {
		for ( key in json ) {
			if ( key == 'details' ) {
				continue;
			}
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
	        						'<label data-key=' + key + ' >' + key + '</label>' +
		        					'<input data-key=' + key + ' name="' + prevKey + '[' + key + ']' + '" type="text" value="' + json[key] + '" ></input>' +
		        				'</div>';
	        	} else {
	        		var element;
	        		if ( key.indexOf( 'description' ) > -1 || key.indexOf( 'address' ) > -1 ) {
	        			element = '<textarea name="' + key + '" type="text"  >'+json[key]+'</textarea>';
	        		}
	        		else if ( newDoc && referenceFields.indexOf( key ) >= 0 ) {
	        			if ( key == 'category' ) {
	        				getAllDocuments(key, populateDropdown, key);
	        			}
	        			element = '<select data-key=' + key + ' name="' + key + '" ></select>';
	        		}
	        		else {
	        			element = '<input data-key=' + key + ' name="' + key + '" type="text" value="' + json[key] + '" ></input>';
	        		}
	        		formHtml += '<label data-key=' + key + ' >' + key + '</label>' +
		        				 element +
		        				'<div class="row-separator"></div>';
	        	}
	        }
		}
	}

	function iterateArray( array, prevKey ) {
		// formHtml += '<div class="indent-block">';
		if ( prevKey == 'child_subcategories' && newDoc ) {
			formHtml += '<select data-key=' + prevKey + ' name="' + prevKey + '" ></select>';
			getAllDocuments( 'subcategory', populateDropdown, prevKey );
		} else if ( array.length == 0 ) {
		    formHtml +=	'<input name="' + prevKey + '[]' + '" type="text" value="" ></input>';
		}
		formHtml += '<div class="doc-array-container js-array-container">'+
						'<div class="doc-array-add js-array-add" ><i class="icon-plus-sign icon-white" ></i>Add another</div>';
		for( index in array ) {
			if ( array[index] instanceof Object ) {
				var json = array[index]
				formHtml += '<div class="doc-array js-doc-array">'+
								'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>';
				for ( key in json ) {
	        		formHtml += '<label data-key=' + key + ' >' + key + '</label>' +
								'<input name="' + prevKey + '[][' + key  + ']" type="text" value="' + json[key] + '" ></input>';
				}
				formHtml += '</div>';
			} else {
		        formHtml += '<div class="doc-array js-doc-array">'+
		        				'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>'+
		        				'<input name="' + prevKey + '[]' + '" type="text" value="' + array[index] + '" ></input>'+
		        			'</div>';
			}
		}
		formHtml += '</div>';
	}

	function getFormFromJson( jsonString ) {
		jsonString = strToJsonFix( jsonString );
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

		docString = jsonToStrFix( docString );

		return docString;
	}

	$( '.js-doc-save' ).mouseover( function () {
		var documentJson = $( '.js-document-form' ).serializeObject();
		documentJson = getFinalDocument( documentJson );
		var documentJsonString = JSON.stringify( documentJson );

		documentJsonString = getFinalDocumentString( documentJsonString );

		$( '#document' ).text( documentJsonString );
	} );

	function getAllDocuments( collection, nextFunction, key ) {
		$.ajax({
	        url: "/db/"+ dbName + '/' + collection + '/all',
	        cache: false,
	        type: "GET",
	        complete: function(response){
	        	var responseString = response.responseText;
	        	if ( responseString[responseString.length-1] != ']' ) {
	        		responseString += ']';
	        	}
	        	// console.log(responseString)
	            var allDocs = jQuery.parseJSON( strToJsonFix( responseString ) );
	            nextFunction( allDocs, key );
	        }
	    });
	}

	function getIdFromObjectId( ObjectId ) {
		return ObjectId.replace( /ObjectID\((\w+)\)/, "$1" )
	}

	function fetchDocument( collection, id, nextFunction ) {
		var catId = getIdFromObjectId( id );
		$.ajax({
	        url: "/db/"+ dbName + '/' + collection + '/'+ catId +'/fetchDocument',
	        cache: false,
	        type: "GET",
	        // dataType: "json",
	        // data: 'category=' + category,
	        complete: function(response){
	        	var responseString = response.responseText;
	        	if ( responseString[responseString.length-1] != ']' ) {
	        		responseString += ']';
	        	}
	            var allDocs = jQuery.parseJSON( strToJsonFix( responseString ) );
	            console.log(allDocs)
	            nextFunction( allDocs );
	        }
	    });
	}

	function getNameIdMap( allDocs ) {
		var nameIdMap = [];

        for ( var i = 0; i < allDocs.length; i++ ) {
        	var docMap = {
        		'id': allDocs[i]._id,
        		'name': allDocs[i].name
        	}
        	nameIdMap.push( docMap );
        }

        return nameIdMap;
	}

	function fillSubcategory( allDocs ) {
		var nameIdMap = [];
		var allDocs = allDocs[0].child_subcategories;
		var subcategoryHtml = '<option value="">Choose</option>';

        for ( var i = 0; i < allDocs.length; i++ ) {
        	var docMap = {
        		'id': allDocs[i].subcategory,
        		'name': allDocs[i].subcategory_name
        	}
        	nameIdMap.push( docMap );
        }
        for ( var i = 0; i < nameIdMap.length; i++ ) {
			subcategoryHtml += '<option value=' + nameIdMap[i].id + ' >' + nameIdMap[i].name + '</option>'
		}
		$( 'select[name=subcategory]' ).html( subcategoryHtml );
		$( 'select[name=subcategory]' ).change( function () {
			fetchDocument( 'subcategory', $( this ).val(), fillSpecificFilters );
		} );

	}

	function fillSpecificFilters( allDocs ) {
		var filters = allDocs[0].filters
		var formHtml = '<label>Details</label>';
		for ( var i = 0; i < filters.length; i++ ) {
			formHtml += '<div class="indent-block">' +
							'<label>' + filters[i] + '</label>' +
							'<input name="details[' + filters[i]  + ']" type="text" value="" ></input>' +
						'</div>'
		}
		$( '.js-doc-form' ).append( formHtml );
	}

	function populateDropdown( data, key ) {
		// console.log(key)
		var nameIdMap = getNameIdMap( data );
		var dropdownHtml = '<option value="">Choose</option>';
		for ( var i = 0; i < nameIdMap.length; i++ ) {
			dropdownHtml += '<option value=' + nameIdMap[i].id + ' >' + nameIdMap[i].name + '</option>'
		}
		$( 'select[name='+ key +']' ).html( dropdownHtml );
		$( 'select[name=category]' ).change( function () {
			fetchDocument(  'category', $( this ).val(), fillSubcategory );
		} );
		$( 'select[name=subcategory]' ).change( function () {
			fetchDocument( 'subcategory', $( this ).val(), fillSpecificFilters );
		} );
	}

	function strToJsonFix( str ) {
		var ObjectIdPattern = /(ObjectID)\("(\w+)"\)/g;
		return str.replace( ObjectIdPattern, "\"$1($2)\"" );
	}

	function jsonToStrFix( str ) {
		var ObjectIdPattern = /"(ObjectID)\((\w+)\)"/g;
		return str.replace( ObjectIdPattern, "$1(\"$2\")" );
	}

} );