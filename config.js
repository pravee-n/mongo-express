module.exports = {
  mongodb: {
    server: 'localhost',
    port: 27017,

    //autoReconnect: automatically reconnect if connection is lost
    autoReconnect: true,
    //poolSize: size of connection pool (number of connections to use)
    poolSize: 4,
    //set admin to true if you want to turn on admin features
    //if admin is true, the auth list below will be ignored
    //if admin is true, you will need to enter an admin username/password below (if it is needed)
    // admin: true,


    // >>>>  If you are using regular accounts, fill out auth details in the section below
    // >>>>  If you have admin auth, leave this section empty and skip to the next section
    auth: [
      /*
       * Add the the name, the username, and the password of the databases you want to connect to
       * Add as many databases as you want!*/
      {
        database: 'eysapp',
        username: 'admin',
        password: 'admin'
      }
    ],


    //  >>>>  If you are using an admin mongodb account, or no admin account exists, fill out section below
    //  >>>>  Using an admin account allows you to view and edit all databases, and view stats

    //leave username and password empty if no admin account exists
    adminUsername: '',
    adminPassword: '',
    //whitelist: hide all databases except the ones in this list  (empty list for no whitelist)
    whitelist: [],
    //blacklist: hide databases listed in the blacklist (empty list for no blacklist)
    blacklist: []
  },
  site: {
    //baseUrl: the URL that mongo express will be located at
    //Remember to add the forward slash at the end!
    baseUrl: '/',
    port: 8081,
    cookieSecret: 'cookiesecret',
    sessionSecret: 'sessionsecret'
  },

  imageRoot: '/home/rookie/work/projects/eys-tools/mongo-express/public/images/',
  subcatImageDir: 'icons/subcategory/',
  filterIconDir: 'icons/filter/',
  productImageDir: 'products/',

  eysUsername: 'eysUser',
  eysPassword: 'eys@123',

  options: {
    //documentsPerPage: how many documents you want to see at once in collection view
    documentsPerPage: 10,
    //editorTheme: Name of the theme you want to use for displaying documents
    //See http://codemirror.net/demo/theme.html for all examples
    editorTheme: "rubyblue",

    //The options below aren't being used yet

    //cmdType: the type of command line you want mongo express to run
    //values: eval, subprocess
    //  eval - uses db.eval. commands block, so only use this if you have to
    //  subprocess - spawns a mongo command line as a subprocess and pipes output to mongo express
    cmdType: 'eval',
    //subprocessTimeout: number of seconds of non-interaction before a subprocess is shut down
    subprocessTimeout: 300
  },

  // Data required by the front-end to render
  // new document / edit document form in the
  // data entry tool application

  collectionData: {
    collectionTemplates: {

      // template for category collection
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

      // template for product collection
      product: {
          "_id": "ObjectID(5273f1eb1d41c80f55fcdde0)",
          "name": "",
          "product_id": "",
          "barcode_no": "",
          "picture_list": [
              ""
          ],
          "product_description": "",
          "tags": "",
          "category": "",
          "subcategory": "",
          "specifications": ""
      },

      // template for store collection
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

      // template for subcategory collection
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

      // template for misc_data collection
      misc_data: {
        "_id": "ObjectID(5273f1eb1d41c80f55fcdde0)",
        "default_filters": [ "", "", "" ],
        "update_interval_very_short": "",
        "update_interval_short": "",
        "update_interval_medium": "",
        "update_interval_long": "",
        "update_interval_very_long": ""
      }
    },

    // List of values that determin type of filter
    // in subcategory document
    subcategoryFilterTypes: [
      'text',
      'dropdown',
      'other'
    ],

    // Path where images are saved by data entry tool
    collectionImagePaths: {
      filterIcon: "/images/icons/filter/",
      productImages: "/images/products/",
    }

  }

};
