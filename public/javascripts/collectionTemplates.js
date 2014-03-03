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
	    "mrp": "",
	    "picture_list": [
	        ""
	    ],
	    "product_description": "",
	    "category": "",
	    "subcategory": ""
	},

	store : {
	    "_id": "ObjectID(5273f1e41d41c80f55fcdda0)",
	    "name": "",
	    "store_id": "",
	    "mobile": "",
	    "phone_num": "",
	    "address": "",
	    "location": [
	        "",
	        ""
	    ],
	    "store_type": "",
	    "timings": "",
	    "closing_days": "",
	    "credit_card": "",
	    "home_delivery": "",
	    "in_mall": ""
	},

	subcategory : {
	    "_id": "ObjectID(5273f1e41d41c80f55fcdd00)",
	    "subcategory_id": "",
	    "name": "",
	    "filters": [
	        "filter_name"
	    ]
	}
}

var collectionArrayFields = {
	subcategory : [
		"filters"
	],
	category : [
		'child_subcategories'
	]
}