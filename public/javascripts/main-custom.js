$( document ).ready( function () {

	// $('textarea').tinymce();

	var arrayFields = [],
		categoryData,
		subcategoryData,
		subcatNames,
		currentDocjson,
		storeProductArray;


	initForm()
	// getAllDocuments('category', categoryDataLoaded)

	// if ( collectionName )
	// getAllDocuments('subcategory', subcategoryDataLoaded)

	// function categoryDataLoaded( allDocs ) {
	// 	categoryData = allDocs;
	// 	console.log(categoryData)
	// 	initForm();
	// 	// $('body').trigger('categoryDataLoaded');
	// }

	// function subcategoryDataLoaded( allDocs ) {
	// 	subcategoryData = allDocs;
	// 	// $('body').trigger('subcategoryDataLoaded');
	// 	if ( $( 'select[data-identifier=subcat-dropdown]' ).length ) {
	// 		fillSubcategoryInCategoryDoc( subcategoryData, subcatNames );
	// 	}
	// }

    var formHtml = '';


    function initForm() {
    	storeProductArray = [];
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

			currentDocjson = currentTemplate;

			if ( collectionName == 'subcategory' ) {
				renderSubcategory(currentTemplate, arrayFields);
			} else if ( collectionName == 'category' ) {

				renderCategory( currentTemplate, arrayFields );

				getAllDocuments('subcategory', function( allDocs ) {
					subcategoryData = allDocs;
					fillSubcategoryInCategoryDoc( subcategoryData, subcatNames );
				} );

			} else if ( collectionName == 'product' ) {

				getAllDocuments('category', function( allDocs ) {
					categoryData = allDocs;
					renderProduct( currentTemplate, arrayFields );
				} );

			} else if ( collectionName == 'store' ) {
				renderStore( currentTemplate );
			} else if ( collectionName == 'misc_data' ) {
				renderMisc( currentTemplate );
			} else {
				renderGeneral( currentTemplate );
			}
	    }
    }

    function renderStore ( currentTemplate ) {
    	console.log(currentTemplate)
    	storeProductArray = currentTemplate['products']
    	formHtml = '<form class="js-document-form" id="js-document-form" >';
    	for (key in currentTemplate) {
			if ( key == '_id' ) {
				formHtml += '<label>' + key + '</label>';
				formHtml += '<input type="text" readonly name="document_id" value="' + currentTemplate[key] + '" >';
			} else if ( key == 'location' ) {
				formHtml += '<label>' + key + '</label>';
				formHtml += '<div class="doc-array">'+
								'<div class="array-input-wrapper">'+
									'<label class="array-label" >Latitude</label>'+
									'<input class="array-input" type="text" data-key="'+ key +'" name="' + key + '[lat]" value="' + currentTemplate[key].lat + '" >'+
								'</div>'+
								'<div class="array-input-wrapper">'+
									'<label class="array-label" >Longitutde</label>'+
									'<input class="array-input" type="text" data-key="'+ key +'" name="' + key + '[lon]" value="' + currentTemplate[key].lon + '" >'+
								'</div>'+
							'</div>';
			} else if ( key == 'products' ) {
				// Do nothing


				// if ( currentTemplate[key].length == 0 ) {
				// 	formHtml += '<input type="hidden" name="'+ key +'[]" >'
				// } else {

				// }
			} else {
				formHtml += '<label>' + key + '</label>';
				formHtml += '<input type="text" data-key="'+ key +'" name="' + key + '" value="' + currentTemplate[key] + '" >';
			}
		}

		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );
    }

    function renderMisc( currentTemplate ) {
    	formHtml = '<form class="js-document-form" id="js-document-form" >';
    	for (key in currentTemplate) {
			formHtml += '<label>' + key + '</label>';
			if ( key == '_id' ) {
				formHtml += '<input type="text" readonly name="document_id" value="' + currentTemplate[key] + '" >';
			} else if ( key == 'default_filters' ) {
				for ( var i = 0; i < 3; i++ ) {
					formHtml += '<input type="text" name="'+key+'[]" value="' + currentTemplate[key][i] + '" ><br>';
				}
			} else {
				formHtml += '<input type="text" data-key="'+ key +'" name="' + key + '" value="' + currentTemplate[key] + '" >';
			}
		}

		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );
    }

    function renderGeneral( currentTemplate ) {
    	formHtml = '<form class="js-document-form" id="js-document-form" >';
    	for (key in currentTemplate) {
			formHtml += '<label>' + key + '</label>';

			if ( key == '_id' ) {
				formHtml += '<input type="text" readonly name="document_id" value="' + currentTemplate[key] + '" >';
			} else {
				formHtml += '<input type="text" data-key="'+ key +'" name="' + key + '" value="' + currentTemplate[key] + '" >';
			}
		}

		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );
    }

    function renderSubcategory(currentTemplate, arrayFields) {
    	// console.log(currentTemplate)
		formHtml = '<form class="js-document-form" id="js-document-form" >';
		var firstElement = '';

		for (key in currentTemplate) {

			if ( key == "specifications" ) {
				formHtml += '<br><label >' + key + '</label><br>';

				// iterate over primary, secondary and other
				for ( innerKey in currentTemplate[key] ) {
					formHtml += '<label >' + innerKey + '</label>';
					formHtml += '<div class="doc-array-container js-array-container">'+
									'<input type="hidden" data-identifier="array-fix" name="' + key + '['+innerKey+']">'+
									'<div class="doc-array-add js-array-add" ><i class="icon-plus-sign icon-white" ></i>Add another</div>';


					if ( currentTemplate[key][innerKey] == "" ) {
						currentTemplate[key][innerKey] = collectionTemplates['subcategory'].specifications.primary;
					}

					// iterate over each filter in primary, secondary and other
					for (index in currentTemplate[key][innerKey]) {
						var currentFilter = currentTemplate[key][innerKey][index]

						formHtml += '<div class="doc-array js-doc-array">'+
										'<div class="js-array-remove doc-array-remove"><i class="icon-remove icon-white"></i></div>';

						// iterate over sub fiels of a filter (such as name, display name, display priority)
						for ( filterField in currentFilter ) {
							console.log(currentFilter[filterField])
							formHtml +=	'<div class="array-input-wrapper">'+
											'<label class="array-label" >' + filterField + '</label>';
							if ( filterField == 'display_type' ) {
								formHtml += '<select class="array-input" data-key=' + filterField + ' name="' + key + '['+innerKey+'][]['+ filterField +']"</select>';

								// iterate over types of a filter (e.g dropdown, text etc)
								for ( filterType in subcategoryFilterTypes ) {
									var selected = '';
									if ( currentFilter[filterField] == subcategoryFilterTypes[filterType] ) {
										selected = 'selected';
									}
									formHtml += '<option '+selected+' value="'+ subcategoryFilterTypes[filterType] +'" >'+ subcategoryFilterTypes[filterType] +'</option>';
								}

								formHtml += '</select>';

							} else if ( filterField == 'icon' ) {
								formHtml += '<input type="hidden" data-identifier="filter-icon-hidden" name="' + key + '['+innerKey+'][]['+ filterField +']" value="'+ currentFilter[filterField] +'" > ';
								if ( currentFilter[filterField] != '' ) {
									formHtml += '<input data-identifier="filter-icon" type="file" class="array-input hide"></input>'+
												'<div class="image-thumb js-image-thumb image-thumb-array" data-identifier="filter-icon" >'+
													'<div class="image-remove image-remove-array js-img-remove" data-pid="filter-icon" ><i class="icon-remove icon-white"></i></div>'+
													'<img src="' + collectionImagePaths.filterIcon + currentFilter[filterField] + '">'+
												'</div>';
								} else {
									formHtml += '<input data-identifier="filter-icon" type="file" class="array-input"></input>';
								}
							} else {
								formHtml += '<input class="array-input" data-key=' + filterField + ' name="' + key + '['+innerKey+'][]['+ filterField +']" type="text" value="' + currentFilter[filterField] + '" ></input>';
							}
							formHtml += '</div>'
						}

						formHtml += '</div></div>'
					}

				}
			} else if ( key == '_id' ) {
				formHtml += '<label>' + key + '</label>'+
							'<input type="text" readonly name="document_id" value="' + currentTemplate[key] + '" >';
			} else if ( key == 'subcategory_default_image' ) {
				formHtml += '<label>' + key + '</label>'+
							'<input type="hidden" data-identifier="subcat-image-hidden" name="' + key + '" value="'+ currentTemplate[key] +'" > ';

				if ( currentTemplate[key] != '' ) {
					formHtml += '<input type="file" class="hide" data-identifier="subcat-image" >'+
								'<div class="image-thumb js-image-thumb" >'+
									'<div class="image-remove js-img-remove" data-pid="subcat-image" ><i class="icon-remove icon-white"></i></div>'+
									'<img src="' + collectionImagePaths.filterIcon + currentTemplate[key] + '">'+
								'</div>';
				} else {
					formHtml += '<input type="file" data-identifier="subcat-image" >'
				}

			} else {
				formHtml += '<label>' + key + '</label>'+
							'<input type="text" name="' + key + '" value="' + currentTemplate[key] + '" >';
			}
		}

		formHtml += '</form>';
		$( '.js-doc-form' ).append( formHtml );

		bindSubcatArrayEvents();
		bindIconRemoveButton();
    }

    function bindSubcatArrayEvents() {

    	bindRemoveButton()

    	var firstElems = []
    	$( '.js-array-container' ).each( function() {
    		firstElems.push($( this ).find( '.js-doc-array:first' ).clone())
    	} );

    	$( '.js-array-add' ).each( function( i ) {
    		$( this ).unbind( 'click' ).click( function() {
    			$( this ).after($(firstElems[i])[0].outerHTML);
    			$( this ).parent().find( '.js-doc-array:first input' ).val( '' );
    			$( this ).parent().find( '.js-doc-array:first input[type=file]' ).show();
    			$( this ).parent().find( '.js-doc-array:first .js-image-thumb' ).remove();
    			bindRemoveButton();
    		} )
    	} )

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

    	var localCategoryData = categoryData,
    		currentCategory;
		formHtml = '<form class="js-document-form">';
		// var firstElement = '';

		for (key in currentTemplate) {
			formHtml += '<label>' + key + '</label>';

			if (key == 'product_description') {
				formHtml += '<textarea name="' + key + '" type="text" data-identifier="product-description"  >'+ currentTemplate[key] +'</textarea>';
			} else if ( key == 'category' || key == 'subcategory' ) {
				if ( ! newDoc ) {
					if ( key == 'category' ) {

						formHtml += '<select data-key=' + key + ' name="' + key + '" >';
						for ( var i = 0; i < localCategoryData.length; i++ ) {
							if ( localCategoryData[i]._id == currentTemplate.category ) {
								childSubcategories = localCategoryData[i].child_subcategories;
							}
							formHtml += '<option value='+ localCategoryData[i]._id +' >'+ localCategoryData[i].name +'</option>'
						}
						formHtml += '</select>'

					} else if ( key == 'subcategory' ) {

						formHtml += '<select data-key=' + key + ' name="' + key + '" >';
						for ( var i = 0; i < childSubcategories.length; i++ ) {
							formHtml += '<option value='+ childSubcategories[i].subcategory +' >'+ childSubcategories[i].subcategory_name +'</option>'
						}
						formHtml += '</select>';

					}
				}
			} else if ( key == '_id' ) {
				formHtml += '<input type="text" readonly name="document_id" value="' + currentTemplate[key] + '" >';
			} else if ( key == "specifications" ) {

				for ( innerKey in currentTemplate[key] ) {
					formHtml += '<div class="doc-array js-doc-array">'+
									'<label >' + innerKey + '</label>';

					for ( index in currentTemplate[key][innerKey] ) {
						var currentFilter = currentTemplate[key][innerKey][index]

						var filterName = currentFilter.name
						formHtml += '<div class="array-input-wrapper">'+
										'<label class="array-label" >' + index + '</label>'+
										'<input class="array-input" name="specifications['+innerKey+']['+index+']" type="text" value="'+currentFilter+'">'+
									'</div>';
					}

					formHtml += '</div>';
				}
			} else {
				formHtml += '<input type="text" name="' + key + '" value="' + currentTemplate[key] + '" >';
			}
		}

		formHtml += '<div class="js-prod-spec" ></div></form>';
		$( '.js-doc-form' ).append( formHtml );

		// tinymce.init({selector:'textarea'});

		// $('textarea[data-identifier=product-description]').tinymce({});

		// getAllDocuments( 'category', fillCategoryInProductDoc )
		if ( newDoc ) {
			fillCategoryInProductDoc();
		}
		// bindFormEvents(firstElement)
    }

    function fillCategoryInProductDoc(allDocs) {
    	var localCategoryData = categoryData;
    	// var nameIdMap = getNameIdMap( localCategoryData )
    	var categoryHtml = '<option value="0">Choose category</option>';
    	for ( var i = 0; i < localCategoryData.length; i++ ) {
			categoryHtml += '<option value=' + localCategoryData[i]._id + ' >' + localCategoryData[i].name + '</option>'
		}
		$('select[data-key=category]').html(categoryHtml)

		$( 'select[data-key=category]' ).change( function () {
			// console.log($(this).val())
			fillSubcategoryInProductDoc( $(this).val() );
			// fetchDocument(  'category', $( this ).val(), fillSubcategoryInProductDoc );
		} );
    }

    function fillSubcategoryInProductDoc( categoryId ) {
		var currentCategory,
			localCategoryData = categoryData;

		for ( var i = 0; i < localCategoryData.length; i++ ) {
			if ( localCategoryData[i]._id == categoryId ) {
				currentCategory = localCategoryData[i]
			}
		}

		var childSubcategories = currentCategory.child_subcategories;
		var subcategoryHtml = '<option value="">Choose</option>';

        for ( var i = 0; i < childSubcategories.length; i++ ) {
			subcategoryHtml += '<option value=' + childSubcategories[i].subcategory + ' >' + childSubcategories[i].subcategory_name + '</option>'
		}
		$( 'select[name=subcategory]' ).html( subcategoryHtml );
		$( 'select[name=subcategory]' ).unbind( 'change' ).change( function () {
			fetchDocument( 'subcategory', $( this ).val(), fillSpecificFiltersInProductDoc );
		} );

	}

	function fillSpecificFiltersInProductDoc( subcatDoc ) {
		$( '.js-prod-spec' ).html('');
		var subcatSpec = subcatDoc[0].specifications,
			formHtml = '';

		formHtml += '<label>Specifications</label>';

		for ( key in subcatSpec ) {
			formHtml += '<div class="doc-array js-doc-array">'+
							'<label >' + key + '</label>';
			for ( index in subcatSpec[key] ) {
				var filterName = subcatSpec[key][index].name
				formHtml += '<div class="array-input-wrapper">'+
								'<label class="array-label" >' + filterName + '</label>'+
								'<input class="array-input" name="specifications['+key+']['+filterName+']" type="text" value="">'+
							'</div>';
			}

			formHtml += '</div>';
		}

		// console.log('here')
		// console.log(formHtml)

					// 	formHtml += '<label >' + innerKey + '</label>';
					// formHtml += '<div class="doc-array-container js-array-container">'+
					// formHtml += '<div class="doc-array js-doc-array">'+
					// formHtml +=	'<div class="array-input-wrapper">'+
					// 						'<label class="array-label" >' + filterField + '</label>';


		// console.log(subcatSpec)
		// var filters = allDocs[0].filters
		// for ( var i = 0; i < filters.length; i++ ) {
		// 	formHtml += '<label>' + filters[i] + '</label>' +
		// 				'<input name="" type="text" value="" ></input>';
		// }
		$( '.js-prod-spec' ).append( formHtml );
	}

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
    	// console.log(currentDocjson)
    	productsDataHtml += '<div class="js-prodid-list prodid-list" >';
    	for (var i=0; i<productsData.length; i++) {
    		if ( currentDocjson.name == productsData[i].name ) {
    			productsDataHtml += '<div data-pid='+productsData[i].productId+' class="js-prodid prodid-list-each" >' + productsData[i].productId +' - '+ productsData[i].name + ' - ' + productsData[i].barcode + '<span class="prodid-tag">Name</span></div>'
    		} else if ( currentDocjson.barcode_no == productsData[i].barcode ) {
    			productsDataHtml += '<div data-pid='+productsData[i].productId+' class="js-prodid prodid-list-each" >' + productsData[i].productId +' - '+ productsData[i].name + ' - ' + productsData[i].barcode + '<span class="prodid-tag">Barcode</span></div>'
    		} else if ( currentDocjson.barcode_no == productsData[i].barcode && currentDocjson.name == productsData[i].name ) {
    			productsDataHtml += '<div data-pid='+productsData[i].productId+' class="js-prodid prodid-list-each" >' + productsData[i].productId +' - '+ productsData[i].name + ' - ' + productsData[i].barcode + '<span class="prodid-tag">Name</span><span class="prodid-tag">Barcode</span></div>'
    		} else {
    		productsDataHtml += '<div data-pid='+productsData[i].productId+' class="js-prodid prodid-list-each" >' + productsData[i].productId +' - '+ productsData[i].name + ' - ' + productsData[i].barcode + '</div>'
    		}
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
		// console.log(json)
		return json
	}

	function getFinalDocumentString( docString ) {
		var latLonPattern = /("location"):\["([0-9]{2}.[0-9]{5})","([0-9]{2}.[0-9]{5})"]/;
		docString = docString.replace( latLonPattern, "$1:[$2,$3]" );

		docString = jsonToStrFix( docString );

		return docString;
	}

	function prepareFormSubmit() {

		if ( collectionName == 'subcategory' ) {
			fixSubcatIcon()
		}

		fixArrayContents()

		var documentJson = $( '.js-document-form' ).serializeObject();
		console.log(documentJson)

		documentJson = getFinalDocument( documentJson );

		if ( collectionName == 'store' ) {
			documentJson = fixProductArray( documentJson )
		}

		var documentJsonString = JSON.stringify( documentJson );

		documentJsonString = getFinalDocumentString( documentJsonString );
		$( '#document' ).text( documentJsonString );
		// return
		$( '.js-doc-form' ).submit();

	}

	function fixProductArray( documentJson ) {
		// fix list of poducts
		documentJson['products'] = storeProductArray;

		// also fix latitude longitude str to float
		documentJson['location'].lat = parseFloat( documentJson['location'].lat )
		documentJson['location'].lon = parseFloat( documentJson['location'].lon )
		return documentJson;
	}

	function fixSubcatIcon() {
		var iconFiles = [],
			iconTypes = [],
			ctr = 0;

		$( 'input[data-identifier=filter-icon]' ).each( function () {
			var file = $( this )[0].files[0];
			if ( file == undefined ) {
				return; //works as continue in jquery.each
			}

			var imageName = $( this )[0].files[0].name
			$( this ).parent().find( 'input[type=hidden]' ).val( imageName )

			iconFiles.push( $( this )[0].files[0] );
			iconTypes.push( 'filterIcon' );

		} );

		subcatImageFile = $( 'input[data-identifier=subcat-image]' )[0].files[0];
		if ( subcatImageFile != undefined ) {
			var subcatImageName = $( 'input[data-identifier=subcat-image]' ).val().split('\\').pop();
			$( 'input[data-identifier=subcat-image-hidden]' ).val( subcatImageName );
			iconFiles.push( subcatImageFile );
			iconTypes.push( 'subcatImage' );
		}

		console.log(iconTypes)

		if ( iconFiles.length > 0 ) {
			uploadImages( iconTypes, iconFiles )
		} else {
			 return;
		}
	}


	function uploadImages( type, fileArray ) {
		var data = new FormData();

		data.append( 'type', type )

		$.each(fileArray, function(key, value)
		{
			data.append(key, value);
		});

		$.ajax({
	        url: '/saveImage',
	        cache: false,
	        type: "POST",
	        data: data,
	        dataType: 'json',
	        processData: false, // Don't process the files
	        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
	        complete: function(response){
	        	if ( response.responseText == '1' ) {
	        		$( '.js-doc-form' ).submit()
	        	} else {
	        		res = jQuery.parseJSON( response.responseText );
	        		alert( res.error );
	        	}
	        }
	    });
	}


	function fixArrayContents() {

		if ( collectionName == 'category' ) {
			$( 'select[data-key=child_subcategories]' ).each( function() {
				if ( $( this ).val() == 0 || $( this ).val == "" ) {
					$(this).parent().remove()
				}
			} );
		}

		$( '.js-array-container' ).each( function() {
			if ( $( this ).find( '.js-doc-array' ).length ) {
				$( this ).find( 'input[data-identifier=array-fix]' ).remove()
			}
		} )
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

	// function populateDropdown( data, key ) {
	// 	var nameIdMap = getNameIdMap( data );
	// 	var dropdownHtml = '<option value="">Choose</option>';
	// 	for ( var i = 0; i < nameIdMap.length; i++ ) {
	// 		dropdownHtml += '<option value=' + nameIdMap[i].id + ' >' + nameIdMap[i].name + '</option>'
	// 	}
	// 	$( 'select[data-key='+ key +']' ).html( dropdownHtml );
	// 	$( 'select[name=category]' ).change( function () {
	// 		fetchDocument(  'category', $( this ).val(), fillSubcategory );
	// 	} );
	// 	$( 'select[name=subcategory]' ).unbind( 'change' ).change( function () {
	// 		fetchDocument( 'subcategory', $( this ).val(), fillSpecificFilters );
	// 	} );
	// }

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
			$( '.js-array-add' ).unbind( 'click' ).click( function () {
				// $( this ).parent().find( '.js-doc-array:first' ).clone().insertAfter( $( this ) );
				// $('.js-array-container').append($(firstElement)[0].outerHTML)
				// console.log($(firstElement)[0].outerHTML)
				$( this ).after($(firstElement)[0].outerHTML)

				if ( $( 'select[data-identifier=subcat-dropdown]' ).length ) {
					bindSubcatDropdownEvent()
				}

				// $( firstElement ).insertAfter( $( this ) );
				$( this ).parent().find( '.js-doc-array:first input' ).val( '' );
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

	function bindSubcatDropdownEvent() {

		$( 'select[data-identifier=subcat-dropdown]' ).unbind( 'change' ).change( function () {
			var optionText = $(this).find("option:selected").text()
			$(this).parent().find('input[type="hidden"]').val(optionText);
		} );
	}

	$( '.js-doc-save' ).click( function () {
		prepareFormSubmit();
		return false;
	} );

	function bindIconRemoveButton() {
		$( '.js-img-remove' ).unbind( 'click' ).click( function () {
			var identifier = $( this ).attr( 'data-pid' );
			// console.log(identifier)
			console.log($(this).parent())
			// $( '.js-image-thumb[data-identifier='+ identifier +']' ).remove();
			$( this ).parent().parent().find( 'input[data-identifier='+ identifier +']' ).show()
			$( this ).parent().parent().find( 'input[data-identifier='+ identifier +'-hidden]' ).val('');
			$( this ).parent().remove();
		} );
	}

} );