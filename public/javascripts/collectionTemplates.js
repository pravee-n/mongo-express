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
	    "tags": "",
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
	    "opening_time": "",
	    "closing_time": "",
	    "closing_day": "",
	    "credit_card_acceptability": "",
	    "home_delivery": "",
	    "available_on_request": "",
	    "in_mall": "",
	    "delete_flag": "",
	    "city": "",
	    "store_category": "",
	    "tags": "",
	    "initial_status": "",
	    "updated_status": "",
	    "last_updated_time": "",
	    "update_interval_bracket": "",
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
			        "icon": "",
			        "A": "",
			        "B": "",
			        "C": "",
			        "D": "",
			        "E": ""
			    }
	    	],
	    	"secondary": [
	    		{
		    		"name": "",
			        "display_name": "",
			        "display_priority": "",
			        "display_type": "",
			        "icon": "",
			        "A": "",
			        "B": "",
			        "C": "",
			        "D": "",
			        "E": ""
			    }
	    	],
	    	"other": [
	    		{
		    		"name": "",
			        "display_name": "",
			        "display_priority": "",
			        "display_type": "",
			        "icon": "",
			        "A": "",
			        "B": "",
			        "C": "",
			        "D": "",
			        "E": ""
			    }
	    	]
	    }
	},

	misc_data: {
		"_id": "ObjectID(5273f1eb1d41c80f55fcdde0)",
		"default_filters": [ "", "", "" ],
		"update_interval_very_short": "",
		"update_interval_short": "",
		"update_interval_medium": "",
		"update_interval_long": "",
		"update_interval_very_long": ""
	}
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