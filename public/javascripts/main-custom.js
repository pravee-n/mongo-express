$( document ).ready( function () {

	var referenceFields = [ 'category', 'child_subcategories', 'subcategory' ];
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
	        						'<label data-key=' + key + ' >' + key + '</label>' +
		        					'<input data-key=' + key + ' name="' + prevKey + '[' + key + ']' + '" type="text" value="' + json[key] + '" ></input>' +
		        				'</div>';
	        	} else {
	        		var element;
	        		if ( key.indexOf( 'description' ) > -1 || key.indexOf( 'address' ) > -1 ) {
	        			element = '<textarea name="' + key + '" type="text"  >'+json[key]+'</textarea>';
	        		} 
	        		else if ( referenceFields.indexOf( key ) >= 0 ) {
	        			if ( key == 'category' ) {
	        				getAllDocuments(key, fillCategory);
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
		if ( array.length == 0 ) {
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
console.log(documentJson)
		documentJson = getFinalDocument( documentJson );
		var documentJsonString = JSON.stringify( documentJson );

		documentJsonString = getFinalDocumentString( documentJsonString );
console.log(documentJsonString)
		$( '#document' ).text( documentJsonString );
	} );

	function getAllDocuments( collection, nextFunction ) {
		$.ajax({
	        url: "/db/"+ dbName + '/' + collection + '/all',
	        cache: false,
	        type: "GET",
	        // dataType: "json",
	        // data: 'collection=' + collection + '&documentName=DUMMYDOC',
	        complete: function(response){

	            var allDocs = jQuery.parseJSON( strToJsonFix( response.responseText ) );
	            nextFunction( allDocs );
	        }
	    });
	}

	function getSubcategory( category ) {
		$.ajax({
	        url: "/db/"+ dbName + '/category/subcat',
	        cache: false,
	        type: "GET",
	        // dataType: "json",
	        data: 'category=' + category,
	        complete: function(response){

	            var allDocs = jQuery.parseJSON( strToJsonFix( response.responseText ) );
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

	function fillCategory( allDocs ) {
		var nameIdMap = getNameIdMap( allDocs );
		var categoryHtml = '<option value="">Choose</option>';
		for ( var i = 0; i < nameIdMap.length; i++ ) {
			categoryHtml += '<option value=' + nameIdMap[i].id + ' >' + nameIdMap[i].name + '</option>'
		}
		console.log(categoryHtml)
		$( 'select[name=category]' ).html( categoryHtml );
		$( 'select[name=subcategory]' ).html( '<option value="">Choose</option>' );
		$( 'select[name=category]' ).change( function () {
			getSubcategory( $( this ).val() );
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

	// getCollectionTemplate();

	function getCollectionTemplate() {
		$.ajax({
	        url: "/db/"+ dbName + '/' + collectionName + '/first',
	        cache: false,
	        type: "GET",
	        // dataType: "json",
	        // data: 'collection=' + collection + '&documentName=DUMMYDOC',
	        complete: function(response){
	            console.log(response);
	            var templateJson = jQuery.parseJSON( response.responseText );
	            console.log( templateJson );
	        }
	    });
	}

} );