var collectionTemplates = {
	category: {
		"_id": "ObjectID(5273f1e31d41c80f55fcdcfd)",
	    "category_id": "",
	    "name": "",
	    "child_subcategories": [
	        {
	            "subcategory_name": "",
	            "subcategory": ""
	        }
	    ]
	},

	product: {
	    "_id": "ObjectID(5273f1eb1d41c80f55fcdde0)",
	    "name": "",
	    "product_id": "",
	    "barcode_no": "",
	    "brand": "",
	    "mrp": "",
	    "picture_list": [
	        ""
	    ],
	    "product_description": "",
	    "category": "",
	    "subcategory": "",
	    "specifications": ""
	},

	store : {
	    "_id": "ObjectID(5273f1e41d41c80f55fcdda0)",
	    "name": "",
	    "store_id": "",
	    "mobile": "",
	    "phone_num": "",
	    "address": "",
	    "location": {
	    	"lat": "",
	    	"lon": ""
	    },
	    "store_type": "",
	    "timings": "",
	    "closing_days": "",
	    "credit_card": "",
	    "home_delivery": "",
	    "in_mall": "",
	    "products": []
	},

	subcategory : {
	    "_id": "ObjectID(5273f1e41d41c80f55fcdd00)",
	    "subcategory_id": "",
	    "name": "",
	    "subcategory_default_image": "",
	    "specifications": {
	    	"primary": [
	    		{
		    		"name": "",
			        "display_name": "",
			        "display_priority": "",
			        "display_type": "",
			        "icon": ""
			    }
	    	],
	    	"secondary": [
	    		{
		    		"name": "",
			        "display_name": "",
			        "display_priority": "",
			        "display_type": "",
			        "icon": ""
			    }
	    	],
	    	"other": [
	    		{
		    		"name": "",
			        "display_name": "",
			        "display_priority": "",
			        "display_type": "",
			        "icon": ""
			    }
	    	]
	    }
	},

	"misc_data": {
		"_id": "ObjectID(5273f1eb1d41c80f55fcdde0)",
		"default_filters": [ "", "", "" ],
		"update_interval_very_short": "",
		"update_interval_short": "",
		"update_interval_medium": "",
		"update_interval_long": "",
		"update_interval_very_long": ""
	}
}

var collectionArrayFields = {
	subcategory : [
		"primary",
		"secondary",
		"other"
	],
	category : [
		'child_subcategories'
	]
}

var subcategoryFilterTypes = [
	'text',
	'dropdown',
	'other'
]

var collectionImagePaths = {
	filterIcon: "/images/icons/filter/",
	productImages: "/images/products/",
}