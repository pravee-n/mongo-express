$( document ).ready( function () {

	var arrayFields = []

	// if ( newDoc ) {
	// 	var currentTemplate = collectionTemplates[collectionName];
	// 	arrayFields = collectionArrayFields[collectionName]
	// 	var currentTemplateString = ( JSON.stringify( currentTemplate ) );
	// 	currentTemplateString = currentTemplateString.replace( /"(ObjectID)\((\w+)\)"/, '$1\("'+ newId +'"\)' );

	// 	$( '#document' ).text( currentTemplateString )

	// }

	var referenceFields = [ 'category', 'child_subcategories', 'subcategory' ];
    var formHtml = '';

    if( $( '.js-doc-form' ).length ) {
    	var currentTemplateString = '';
    	var currentTemplate;
    	if ( newDoc ) {
			currentTemplate = collectionTemplates[collectionName];
			currentTemplateString = ( JSON.stringify( currentTemplate ) );
			currentTemplateString = currentTemplateString.replace( /"(ObjectID)\((\w+)\)"/, '$1\("'+ newId +'"\)' );
		} else {
			currentTemplateString = $( '#document' ).val()
		}
		currentTemplateString = strToJsonFix( currentTemplateString )
		currentTemplate = jQuery.parseJSON ( currentTemplateString )
		arrayFields = collectionArrayFields[collectionName]

		if ( collectionName == 'subcategory' ) {
			renderSubcategory(currentTemplate, arrayFields)
		} else if ( collectionName == 'category' ) {
			renderCategory( currentTemplate, arrayFields )
		} else if ( collectionName == 'product' ) {
			renderProduct( currentTemplate, arrayFields )
		}
    }

    function renderSubcategory(currentTemplate, arrayFields) {

		formHtml = '<form class="js-document-form">';
		var firstElement = '';

		for (key in currentTemplate) {
			if ( $.inArray(key, arrayFields) > -1 ) {
				formHtml += '<label data-key=' + key + ' >' + key + '</label>';
				formHtml += '<div class="doc-array-container js-array-container">'+
								'<div class="doc-array-add js-array-add" ><i class="icon-plus-sign icon-white" ></i>Add another</div>';
				for (index in currentTemplate[key]) {
					firstElement = '<div class="doc-array js-doc-array">' +
										'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>' +
			        					'<input data-key=' + key + ' name="' + key + '[]" type="text" value="' + currentTemplate[key][index] + '" ></input>' +
			        				'</div>';
					formHtml += firstElement;
				}
				formHtml += '</div>'
			} else {
				formHtml += '<label>' + key + '</label>'+
							'<input type="text" name="' + key + '" value="' + currentTemplate[key] + '" >';
			}
		}

		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );
		bindFormEvents(firstElement)
    }

    function renderCategory(currentTemplate, arrayFields) {

		formHtml = '<form class="js-document-form">';
		var firstElement = '';

		for (key in currentTemplate) {
			if ( $.inArray(key, arrayFields) > -1 ) {
				formHtml += '<label data-key=' + key + ' >' + key + '</label>';
				formHtml += '<div class="doc-array-container js-array-container">'+
								'<div class="doc-array-add js-array-add" ><i class="icon-plus-sign icon-white" ></i>Add another</div>';
				for (index in currentTemplate[key]) {
					firstElement = '<div class="doc-array js-doc-array">' +
										'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>' +
										'<input type="hidden" data-key=' + key + ' name="' + key + '[][subcategory_name]" ></input>' +
										'<select data-key=' + key + ' name="' + key + '[][subcategory]" ></select>' +
			        				'</div>';
					formHtml += firstElement;
				}
				formHtml += '</div>'
			} else {
				formHtml += '<label>' + key + '</label>'+
							'<input type="text" name="' + key + '" value="' + currentTemplate[key] + '" >';
			}
		}

		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );

		getAllDocuments('subcategory', fillSubcategoryInCategoryDoc, 'category');
		// firstElement = 
		// bindFormEvents(firstElement)
    }

    function renderProduct(currentTemplate, arrayFields) {

		formHtml = '<form class="js-document-form">';
		var firstElement = '';

		for (key in currentTemplate) {
			formHtml += '<label>' + key + '</label>';

			if (key == 'product description') {
				formHtml += '<textarea name="' + key + '" type="text"  >'+ currentTemplate[key] +'</textarea>';
			} else if ( key == 'category' || key == 'subcategory' ) {
				formHtml += '<select data-key=' + key + ' name="' + key + '" ></select>'
			}
			else {
				formHtml += '<input type="text" name="' + key + '" value="' + currentTemplate[key] + '" >';
			}
		}

		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );

		getAllDocuments( 'category', fillCategoryInProductDoc )
		bindFormEvents(firstElement)
    }

    function fillCategoryInProductDoc(allDocs) {
    	console.log(allDocs)
    	var nameIdMap = getNameIdMap( allDocs )
    	console.log(nameIdMap)
    	var categoryHtml = '<option value="0">Choose category</option>';
    	for ( var i = 0; i < nameIdMap.length; i++ ) {
			categoryHtml += '<option value=' + nameIdMap[i].id + ' >' + nameIdMap[i].name + '</option>'
		}
		$('select[data-key=category]').html(categoryHtml)
    }

  //   if ( $( '.js-doc-form' ).length ) {
  //   	$( '.js-doc-form' ).attr( 'data-collection', collectionName );
		// getFormFromJson( $( '#document' ).text() );
  //   }

    if( collectionName == 'unmapped_product' && documentPage ){
    	$('input[data-key=product_id]').addClass('product-id-list-toggler')
    	getProductIds()
    }

    function getProductIds() {
    	console.log('sending')
    	$.ajax({
	        url: '/db/'+ dbName + '/product/getProductIds',
	        cache: false,
	        type: "GET",
	        complete: function(response){
	        	console.log(response.responseText)
	        	productsData = jQuery.parseJSON( response.responseText )
	        	fillProductsData(productsData)
	        }
	    });
    }

    $('body').click(function(){
    	$('.prodid-list').hide()
    });


    function fillProductsData(productsData) {
    	var productsDataHtml = '';
    	productsDataHtml += '<div class="js-prodid-list prodid-list" >';
    	for (var i=0; i<productsData.length; i++) {
    		productsDataHtml += '<div data-pid='+productsData[i].productId+' class="js-prodid prodid-list-each" >' + productsData[i].productId +' - '+ productsData[i].name + '</div>'
    	}
    	productsDataHtml += '</div>';
    	$('.product-id-list-toggler').after(productsDataHtml)
    	$('.product-id-list-toggler').click(function(e){
    		$('.prodid-list').show()
    		findProductId($(this).val())
    		e.stopPropagation()
    	})
    	$('.product-id-list-toggler').keyup(function(){
    		findProductId($(this).val())
    	});
    	$('.js-prodid').click(function(){
    		console.log($(this).attr('data-pid'))
    		$('.product-id-list-toggler').val($(this).attr('data-pid'))
    	})
    }

    function findProductId(text) {
    	text = text.toLowerCase()
    	$('.prodid-list-each').each(function() {
    		var thisText = $(this).html().toLowerCase();
    		if (thisText.indexOf(text) != -1) {
    			$(this).show()
    		}
    		else {
    			$(this).hide()
    		}
    	});
    }

	function getFormFromJson( jsonString ) {
		jsonString = strToJsonFix( jsonString );
		var json = jQuery.parseJSON( jsonString );

		var documentId = json['_id'];
		delete json['_id'];
		json['document_id'] = documentId;
		formHtml = '<form class="js-document-form">';
		jsonIterate( json );

		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );
		bindFormEvents();
	}

	function bindFormEvents(firstElement) {

		console.log(firstElement)
		bindRemoveButton()

		if (firstElement != '') {
			$( '.js-array-add' ).unbind( 'click' ).click( function () {
				// $( this ).parent().find( '.js-doc-array:first' ).clone().insertAfter( $( this ) );
				// $('.js-array-container').append($(firstElement))
				$( firstElement ).insertAfter( $( this ) );
				// $( this ).parent().find( '.js-doc-array:first input' ).val( '' );
				bindRemoveButton()
			} );
		}
	}

	function bindRemoveButton() {
		$( '.js-array-remove' ).unbind( 'click' ).click( function () {
			var currentArray = $( this ).parent( '.js-doc-array' );
			currentArray.slideUp(200, function () {
				currentArray.remove();
			} )
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
		// console.log(documentJsonString)
		$( '#document' ).text( documentJsonString );
	} );

	function getAllDocuments( collection, nextFunction, key ) {
		$.ajax({
	        url: "/db/"+ dbName + '/' + collection + '/all',
	        cache: false,
	        type: "GET",
	        complete: function(response){
	        	var responseString = response.responseText;
	        	// console.log(responseString)
	        	if ( responseString[responseString.length-1] != ']' ) {
	        		responseString += ']';
	        	}
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
	            // console.log(allDocs)
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

	function fillSubcategoryInCategoryDoc( allDocs ) {
		var nameIdMap = [];
		var subcategoryHtml = '<option value="">Choose subcategory</option>';

        for ( var i = 0; i < allDocs.length; i++ ) {
        	var docMap = {
        		'id': allDocs[i]._id,
        		'name': allDocs[i].name
        	}
        	nameIdMap.push( docMap );
        }
        // console.log(nameIdMap)
        for ( var i = 0; i < nameIdMap.length; i++ ) {
			subcategoryHtml += '<option value=' + nameIdMap[i].id + ' >' + nameIdMap[i].name + '</option>'
		}
		$( 'select[data-key=child_subcategories]' ).html( subcategoryHtml );
		$( 'select[data-key=child_subcategories]' ).unbind( 'change' ).change( function () {
			var optionText = $( 'select[data-key=child_subcategories] option:selected' ).text();
			$(this).parent().find('input[type="hidden"]').val(optionText);
		} );

		// console.log($( '.js-doc-array' ).next())
		// console.log($('.js-array-add'))
		var firstElement = $( '.js-array-add' ).parent().find( '.js-doc-array:first' ).clone()
		// console.log('binding')
		bindFormEvents(firstElement)
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
		$( 'select[name=subcategory]' ).unbind( 'change' ).change( function () {
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
		var nameIdMap = getNameIdMap( data );
		var dropdownHtml = '<option value="">Choose</option>';
		for ( var i = 0; i < nameIdMap.length; i++ ) {
			dropdownHtml += '<option value=' + nameIdMap[i].id + ' >' + nameIdMap[i].name + '</option>'
		}
		$( 'select[data-key='+ key +']' ).html( dropdownHtml );
		$( 'select[name=category]' ).change( function () {
			fetchDocument(  'category', $( this ).val(), fillSubcategory );
		} );
		$( 'select[name=subcategory]' ).unbind( 'change' ).change( function () {
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

	// function jsonIterate( json, prevKey ) {
	// 	for ( key in json ) {
	// 		if ( key == 'details' ) {
	// 			continue;
	// 		}
	// 		if ( json[key] instanceof Object) {
	// 			formHtml += '<label>' + key + '</label>';
	// 			if ( json[key] instanceof Array ) {
	// 				iterateArray( json[key], key );
	// 			} else {
	//             	jsonIterate( json[key], key )
	// 			}
	//         } else {
	//         	if ( prevKey ) {
	//         		formHtml += '<div class="indent-block">' +
	//         						'<label data-key=' + key + ' >' + key + '</label>' +
	// 	        					'<input data-key=' + key + ' name="' + prevKey + '[' + key + ']' + '" type="text" value="' + json[key] + '" ></input>' +
	// 	        				'</div>';
	//         	} else {
	//         		var element;
	//         		if ( key.indexOf( 'description' ) > -1 || key.indexOf( 'address' ) > -1 ) {
	//         			element = '<textarea name="' + key + '" type="text"  >'+json[key]+'</textarea>';
	//         		}
	//         		else if ( newDoc && referenceFields.indexOf( key ) >= 0 ) {
	//         			if ( key == 'category' ) {
	//         				getAllDocuments(key, populateDropdown, key);
	//         			}
	//         			element = '<select data-key=' + key + ' name="' + key + '" ></select>';
	//         		}
	//         		else {
	//         			element = '<input data-key=' + key + ' name="' + key + '" type="text" value="' + json[key] + '" ></input>';
	//         		}
	//         		formHtml += '<label data-key=' + key + ' >' + key + '</label>' +
	// 	        				 element +
	// 	        				'<div class="row-separator"></div>';
	//         	}
	//         }
	// 	}
	// }

	// function iterateArray( array, prevKey ) {

	// 	formHtml += '<div class="doc-array-container js-array-container">'+
	// 					'<div class="doc-array-add js-array-add" ><i class="icon-plus-sign icon-white" ></i>Add another</div>';
	// 	for( index in array ) {
	// 		if ( array[index] instanceof Object ) {
	// 			var json = array[index]
	// 			formHtml += '<div class="doc-array js-doc-array">'+
	// 							'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>';
	// 			for ( key in json ) {
	// 				if ( key == "subcategory_name" && newDoc ) {
	// 	        		formHtml += '';
	// 				} else {
	// 	        		formHtml += '<label data-key=' + key + ' >' + key + '</label>';
	// 				}

	//         		if ( key == 'subcategory' && newDoc ) {
	// 					formHtml += '<select data-key=' + key + ' name="' + prevKey + '[][' + key  + ']" ></select>';
	// 					getAllDocuments( 'subcategory', populateDropdown, key );
	// 				} else if ( key == 'subcategory_name' && newDoc ) {
	// 					formHtml += '<input type="hidden" name="' + prevKey + '[][' + key  + ']" value="' + json[key] + '" ></input>';
	// 				}  else {
	// 					formHtml += '<input name="' + prevKey + '[][' + key  + ']" type="text" value="' + json[key] + '" ></input>';
	// 				}

	// 			}
	// 			formHtml += '</div>';
	// 		} else {
	// 	        formHtml += '<div class="doc-array js-doc-array">'+
	// 	        				'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>'+
	// 	        				'<input name="' + prevKey + '[]' + '" type="text" value="' + array[index] + '" ></input>'+
	// 	        			'</div>';
	// 		}
	// 	}
	// 	formHtml += '</div>';
	// }

} );