$( document ).ready( function () {

	var arrayFields = [],
		categoryData,
		subcategoryData,
		subcatNames;

	getAllDocuments('category', categoryDataLoaded)
	getAllDocuments('subcategory', subcategoryDataLoaded)

	function categoryDataLoaded( allDocs ) {
		categoryData = allDocs;
		$('body').trigger('categoryDataLoaded');
	}

	function subcategoryDataLoaded( allDocs ) {
		subcategoryData = allDocs;
		$('body').trigger('subcategoryDataLoaded');
		if ( $( 'select[data-identifier=subcat-dropdown]' ).length ) {
			fillSubcategoryInCategoryDoc( subcategoryData, subcatNames );
		}
	}

	$('body').on('categoryDataLoaded', function() {
		console.log('categoryloaded')
	})

	$('body').on('subcategoryDataLoaded', function() {
		console.log('subcategoryloaded')
	})

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

		formHtml = '<form class="js-document-form" id="js-document-form" >';
		var firstElement = '';

		for (key in currentTemplate) {
			if ( $.inArray(key, arrayFields) > -1 ) {
				formHtml += '<label data-key=' + key + ' >' + key + '</label>';
				formHtml += '<div class="doc-array-container js-array-container">'+
								// '<input type="hidden" data-identifier="array-fix" name="' + key + '[]" value="">'+
								'<div class="doc-array-add js-array-add" ><i class="icon-plus-sign icon-white" ></i>Add another</div>';

				formHtml += '<div class="doc-array js-doc-array">'+
									'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>';

				for (index in currentTemplate[key]) {

					if ( typeof currentTemplate[key][index] == 'object' ) {
						console.log('object detected');
						return
					}

					formHtml +=	'<div class="array-input-wrapper">'+
									'<label class="array-label" >' + currentTemplate[key][index] + '</label>';
					if ( currentTemplate[key][index] == 'display_type' ) {
						formHtml += '<select class="array-input" data-key=' + currentTemplate[key][index] + ' name="' + key + '[other][]['+ currentTemplate[key][index] +']"</select>'+
										'<option value="dropdown" >Dropdown</option>'+
										'<option value="text">Text</option>'+
									'</select>';
					} else if( currentTemplate[key][index] == 'specification_type' ) {
						formHtml += '<div data-val="other" class="form-btn form-btn-first form-btn-selected js-spec-btn">Other</div>'+
									'<div data-val="secondary" class="form-btn js-spec-btn">Secondary</div>'+
									'<div data-val="primary" class="form-btn js-spec-btn">Primary</div>';
					}
					else {
						formHtml += '<input class="array-input" data-key=' + currentTemplate[key][index] + ' name="' + key + '[other][]['+ currentTemplate[key][index] +']" type="text" value="' + currentTemplate[key][index] + '" ></input>';
					}
					formHtml += '</div>'
				}

				formHtml += '</div>'
			} else if ( key == '_id' ) {
				formHtml += '<label>' + key + '</label>'+
							'<input type="text" readonly name="document_id" value="' + currentTemplate[key] + '" >';
			} else {
				formHtml += '<label>' + key + '</label>'+
							'<input type="text" name="' + key + '" value="' + currentTemplate[key] + '" >';
			}
		}

		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );

		bindSubcatSpecButtons()

		firstElement = $( '.js-array-container' ).find( '.js-doc-array:first' ).clone()
		bindFormEvents( firstElement )
    }

    function renderCategory(currentTemplate, arrayFields) {
		formHtml = '<form class="js-document-form">';
		var firstElement = '',
			argsList = [];

		subcatNames = [];

		for (key in currentTemplate) {
			if ( $.inArray(key, arrayFields) > -1 ) {
				formHtml += '<label data-key=' + key + ' >' + key + '</label>';
				formHtml += '<div class="doc-array-container js-array-container">'+
								'<input type="hidden" data-identifier="array-fix" name="' + key + '[]" value="">'+
								'<div class="doc-array-add js-array-add" ><i class="icon-plus-sign icon-white" ></i>Add another</div>';

				if ( currentTemplate[key].length == 0 ) {
					firstElement = '<div class="doc-array js-doc-array">' +
										'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>' +
										'<input type="hidden" data-key=' + key + ' name="' + key + '[][subcategory_name]" ></input>' +
										'<select data-identifier="subcat-dropdown" data-key=' + key + ' name="' + key + '[][subcategory]" ></select>' +
			        				'</div>';
					formHtml += firstElement;
				}

				for (index in currentTemplate[key]) {
					firstElement = '<div class="doc-array js-doc-array">' +
										'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>' +
										'<input type="hidden" data-key=' + key + ' name="' + key + '[][subcategory_name]" ></input>' +
										'<select data-identifier="subcat-dropdown" data-key=' + key + ' name="' + key + '[][subcategory]" ></select>' +
			        				'</div>';
					formHtml += firstElement;
					subcatNames.push(currentTemplate[key][index].subcategory)
				}
				formHtml += '</div>'
			} else if ( key == '_id' ) {
				formHtml += '<label>' + key + '</label>'+
							'<input type="text" readonly name="' + key + '" value="' + currentTemplate[key] + '" >';
			} else {
				formHtml += '<label>' + key + '</label>'+
							'<input type="text" name="' + key + '" value="' + currentTemplate[key] + '" >';
			}
		}
		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );

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
    	var nameIdMap = getNameIdMap( allDocs )
    	var categoryHtml = '<option value="0">Choose category</option>';
    	for ( var i = 0; i < nameIdMap.length; i++ ) {
			categoryHtml += '<option value=' + nameIdMap[i].id + ' >' + nameIdMap[i].name + '</option>'
		}
		$('select[data-key=category]').html(categoryHtml)

		$( 'select[name=category]' ).change( function () {
			fetchDocument(  'category', $( this ).val(), fillSubcategoryInProductDoc );
		} );
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
    	$.ajax({
	        url: '/db/'+ dbName + '/product/getProductIds',
	        cache: false,
	        type: "GET",
	        complete: function(response){
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

	function getFinalDocument( json ) {
		var documentId = json['document_id'];
		delete json['document_id'];
		json['_id'] = documentId;

		// for ( var key in json ) {
		// 	if ( json[key] instanceof Array ) {
		// 		if ( json[key].length == 1 && json[key][0] == "" ) {
		// 			json[key].splice( 0, 1 );
		// 			break;
		// 		}
		// 	} else {
		// 		continue;
		// 	}
		// }
		console.log(json)
		return json
	}

	function getFinalDocumentString( docString ) {
		var latLonPattern = /("location"):\["([0-9]{2}.[0-9]{5})","([0-9]{2}.[0-9]{5})"]/;
		docString = docString.replace( latLonPattern, "$1:[$2,$3]" );

		docString = jsonToStrFix( docString );

		return docString;
	}

	$( '.js-doc-save' ).mouseover( function () {
		fixArrayContents()
		var documentJson = $( '.js-document-form' ).serializeObject();
		// var documentJson = $('.js-document-form').toObject();
		console.log(documentJson)
		// return;
		documentJson = getFinalDocument( documentJson );
		var documentJsonString = JSON.stringify( documentJson );

		documentJsonString = getFinalDocumentString( documentJsonString );
		$( '#document' ).text( documentJsonString );
	} );

	function fixArrayContents() {

		if ( collectionName == 'category' ) {
			$( 'select[data-key=child_subcategories]' ).each( function() {
				if ( $( this ).val() == 0 || $( this ).val == "" ) {
					$(this).parent().remove()
				}
			} );
		}

		if ( $('.js-doc-array').length ) {
			$( 'input[data-identifier=array-fix]' ).remove();
		}
	}

	function getAllDocuments( collection, nextFunction, argsList ) {
		$.ajax({
	        url: "/db/"+ dbName + '/' + collection + '/all',
	        cache: false,
	        type: "GET",
	        complete: function(response){
	        	var responseString = response.responseText;
	        	if ( responseString[responseString.length-1] != ']' ) {
	        		responseString += ']';
	        	}
	            var allDocs = jQuery.parseJSON( strToJsonFix( responseString ) );
	            nextFunction( allDocs, argsList );
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

	function fillSubcategoryInCategoryDoc( subcategoryData, subcatNames ) {
		var nameIdMap = [];
		var subcategoryHtml = '<option value="">Choose subcategory</option>';


        for ( var i = 0; i < subcategoryData.length; i++ ) {
        	var docMap = {
        		'id': subcategoryData[i]._id,
        		'name': subcategoryData[i].name
        	}
        	nameIdMap.push( docMap );
        }

        for ( var i = 0; i < nameIdMap.length; i++ ) {
			subcategoryHtml += '<option value=' + nameIdMap[i].id + ' >' + nameIdMap[i].name + '</option>'
		}

		$( 'select[data-key=child_subcategories]' ).html( subcategoryHtml );

		var ctr = 0;
		$( 'select[data-key=child_subcategories]' ).each( function() {
			$(this).val(subcatNames[ctr])
			ctr++;
			var optionText = $(this).find("option:selected").text()
			$(this).parent().find('input[type="hidden"]').val(optionText);
		} );

		bindSubcatDropdownEvent()
		var firstElement = $( '.js-array-add' ).parent().find( '.js-doc-array:first' ).clone()
		bindFormEvents(firstElement)
	}

	function fillSubcategoryInProductDoc( allDocs ) {
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
			fetchDocument( 'subcategory', $( this ).val(), fillSpecificFiltersInProductDoc );
		} );

	}

	function fillSpecificFiltersInProductDoc( allDocs ) {
		var filters = allDocs[0].filters
		for ( var i = 0; i < filters.length; i++ ) {
			formHtml += '<label>' + filters[i] + '</label>' +
						'<input name="" type="text" value="" ></input>';
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

	function bindFormEvents(firstElement) {

		bindRemoveButton()

		if (firstElement != '') {
			console.log('here1')
			$( '.js-array-add' ).unbind( 'click' ).click( function () {
				// $( this ).parent().find( '.js-doc-array:first' ).clone().insertAfter( $( this ) );
				// $('.js-array-container').append($(firstElement)[0].outerHTML)
				// console.log($(firstElement)[0].outerHTML)
				$( this ).after($(firstElement)[0].outerHTML)

				if ( $( 'select[data-identifier=subcat-dropdown]' ).length ) {
					bindSubcatDropdownEvent()
				}

				if ( $( '.js-spec-btn' ).length ) {
					console.log('here')
					bindSubcatSpecButtons()
				}

				// $( firstElement ).insertAfter( $( this ) );
				$( this ).parent().find( '.js-doc-array:first input' ).val( '' );
				bindRemoveButton()
			} );
		}
	}

	function bindSubcatSpecButtons() {
		$( '.js-spec-btn' ).unbind('click').click( function() {
			$( this ).parent().find( '.js-spec-btn' ).removeClass( 'form-btn-selected' )
			$( this ).addClass( 'form-btn-selected' )
			var filterType = $( this ).attr('data-val')
			$( this ).parent().parent().find('input, select').each(function() {
				var thisKey = $(this).attr('data-key')
				$(this).attr('name', 'specifications['+ filterType +'][]['+ thisKey +']')
			})
		} );
	}

	function bindRemoveButton() {
		$( '.js-array-remove' ).unbind( 'click' ).click( function () {
			var currentArray = $( this ).parent( '.js-doc-array' );
			currentArray.slideUp(200, function () {
				currentArray.remove();
			} )
		} );
	}

	function bindSubcatDropdownEvent() {

		$( 'select[data-identifier=subcat-dropdown]' ).unbind( 'change' ).change( function () {
			var optionText = $(this).find("option:selected").text()
			$(this).parent().find('input[type="hidden"]').val(optionText);
		} );
	}

} );