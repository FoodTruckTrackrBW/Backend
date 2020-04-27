# Backend

## DB info

* Deployed postgres server = https://food-truck-trackr-bw.herokuapp.com/

* link = ec2-52-202-146-43.compute-1.amazonaws.com
* port = 5432
* database = da09ke5i3mabc9
* username = spiajimxwrkgmr
* password = 43d8fc0fb27a1275595b9bdec707fd5ac997ecfd860ff48cc332400d8ff15832

* DB_URL = postgres://spiajimxwrkgmr:43d8fc0fb27a1275595b9bdec707fd5ac997ecfd860ff48cc332400d8ff15832@ec2-52-202-146-43.compute-1.amazonaws.com:5432/da09ke5i3mabc9


## Goals

### What's done 

* [✔] Postgres Database
* [✔] Package installation
* [✔] Server Setup
* [✔] Design Schema (https://app.dbdesigner.net/designer/schema/324127)
* [✔] Middleware for Authentication, User Routing, and Token Generation 
* [✔] Routes
* [✔] Migrations
* [✔] Data Seeding
* [✔] Code Comments
* [✔] Auth Endpoints
* [✔] Diner Endpoints
* [✔] Operator EndPoints
* [✔] Deployment
* [✔] Endpoint Testing
* [✔] Documentation

### To Do 

*  Test Database
*  Error Handler Middleware
*  Postgis 


## Endpoints 

### Endpoint Functionality added so far

#### What can any account do?  ✔=== Tested on Deployment

* [✔] Register Account
* [✔] Login to Account
* [✔] View their Account info
* [✔] Update Their Account info (Account type cannot be changed, nor can username be changed)
* [✔] Delete Their Account

#### What can Diners do?

* [✔] View a list of Trucks
* [✔] View the Menu of a truck
* [✔] Check into a truck they are visiting, and save it to a list of visited trucks
* [✔] View list of visited trucks(front end should be able to filter favorite trucks)
* [✔] Rate visited trucks
* [✔] favorite visited trucks
* [✔] rate menu items

##### What can Operators do?

* [✔] Add a truck
* [✔] Create a Menu
* [✔] View Their trucks
* [✔] View a specific truck
* [✔] View a specific item
* [✔] Update Truck location
* [✔] Update a truck's info
* [✔] Update Menu items
* [✔] View Truck Ratings
* [✔] View Item Ratings
* [✔] Delete their Trucks
* [✔] Delete items from their trucks

### Endpoint Functionality to be add

#### What can any account do?

* reset password if forgotten(maybe)

#### What can Diners do?

*  Query for trucks within a designated radius

#### What can Opterators do?

*  --

### Schema

#### Auth

POST to
/auth/register
```javascript
{
	"username":"<username>",
	"password": "<password>",
	"email": "<email>",
	"user_type": "<operator||diner>",
	(only if diner)
	"favorite_cuisine_type": "<cuisine_type>"
}
```

POST to
/auth/login
```javascript
{
	"username":	"testAccount2",
	"password": "password"
}
```
Above endpoint returns a token used to access all other routes

All routes after login require the following header
```javascript
{
	"Authorization": "<token>"
}
```

GET to
/auth/account/
```javascript
{
    "user": {
        "id": <user_id>,
        "username": "<username>",
        "email": "<email>",
        "password": "<hashed password>",
        "user_type": "<operator||diner>",
        "favorite_cuisine_type": "<cuisine_type||null>""
    }
}
```


#### Operator


GET to
/operator/
```javascript
{
    "trucks": [
        {
            "id": <truck_id>,
            "owner_id": <user_id>,
            "truck_name": "<truck_name>",
            "truck_img_url": "<img_url>",
            "cuisine_type": "<trucks_cuisine_type>",
            "departure_time": "<time>"
        },
        ...
    ]
}
```

POST to
/operator/
takes
```javascript
{
	"truck_name": "<truck_name>",
	"truck_img_url": "<img_url>", // Optional
	"cuisine_type": "<cuisine_type>",
	"departure_time": "<time in hh:mm:ss format>"
}
```

GET to
/operator/:truckId/
returns
```javascript
{
    "truck": {
        "id": <truck_id>,
        "owner_id": <user_id>,
        "truck_name": "<truck_name>",
        "truck_img_url": "<img_url>",
        "cuisine_type": "<trucks_cuisine_type>",
        "departure_time": "<time>"
    }
}
```

PUT to
/operator/:truckId/
takes any of the following
```javascript
{
		"truck_name": "<truck_name>",
        "truck_img_url": "<img_url>",
        "cuisine_type": "<trucks_cuisine_type>",
        "departure_time": "<time>"
}
```
returns
```javascript
{
    "message": "truck has been updated"
}
```

Delete to
/operator/:truckId/
returns
```javascript

{
    "message": "truck successfully deleted"
}
```
needs condition for if truck doesnt exist

GET to
/operator/:truckId/items/
returns
```javascript
{
    "items": [
        {
            "id": <item_id>,
            "truck_id": <truck_id>,
            "item_name": "<item_name>",
            "item_description": "<item_description>",
            "item_photo_url": "<img_url>",
            "item_price": <price>
        },
        ...
    ]
}
```


POST to 
/operator/:truckId/items/
takes
```javascript
{
	"item_name": "<item_name>",
	"item_description": "<item_description>",
	"item_photo_url": "<img_url>",
	"item_price": <price>
}
```
returns
```javascript
{
    "message": "item created"
}
```

GET to
/operator/:truckId/items/:itemId
```javascript
{
    "items": [
        {
            "id": <item_id>,
            "truck_id": <truck_id>,
            "item_name": "<item_name>",
            "item_description": "<item_description>",
            "item_photo_url": "<img_url>",
            "item_price": <price>
        }
    ]
}
```

PUT to
/operator/:truckId/items/:itemId
takes any of the following
```javascript
{
            "item_name": "<item_name>",
            "item_description": "<item_description>",
            "item_photo_url": "<img_url>",
            "item_price": <price>
}
```
returns
```javascript
{
	"item_name": "update test"
}
```

DELETE to
/operator/:truckId/items/:itemId
returns
```javascript
{
    "message": "item successfully deleted"
}
```
needs condition for if item doesnt exist


GET to
/operator/:truckId/ratings
returns
```javascript
{
    "ratings": []
}
```

GET to
/operator/:truckId/items/:itemId/ratings
```javascript
{
    "ratings": []
}
```

#### Diner

GET to
/diner/
returns
```javascript
{
    "trucks": [
        {
            "truck_name": "joes truck",
            "truck_img_url": " https://images.unsplash.com/photo-1574280363402-2f672940b871?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80",
            "cuisine_type": "food",
            "departure_time": "09:30:00"
        },
        {
            "truck_name": "jims truck",
            "truck_img_url": " https://images.unsplash.com/photo-1574280363402-2f672940b871?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80",
            "cuisine_type": "food",
            "departure_time": "09:30:00"
        },
        ...
    ]
}
```

POST to
/diner/:truckid/checkin
returns
```javascript
{
    "message": "user successfully checked in"
}
```

GET to
/diner/visited
returns
```javascript
{
    "visited": [
        {
            "truck_name": "joes truck",
            "truck_img_url": " https://images.unsplash.com/photo-1574280363402-2f672940b871?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80",
            "cuisine_type": "food",
            "rating": "No Diner Rating",
            "truck_id": 1,
            "favorite": false
        }
    ]
}
```

GET to
/diner/:truckId/menu
returns
```javascript
{
    "menu": [
        {
            "id": 1,
            "truck_id": 1,
            "item_name": "spaghetti",
            "item_description": "its spaghetti",
            "item_photo_url": "https://images.unsplash.com/photo-1572441713132-c542fc4fe282?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
            "item_price": 1.99
        },
        {
            "id": 2,
            "truck_id": 1,
            "item_name": " more spaghetti",
            "item_description": "its still spaghetti",
            "item_photo_url": "https://images.unsplash.com/photo-1572441713132-c542fc4fe282?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
            "item_price": 1.99
        }
    ]
}
```

POST to
/diner/:truckId/updateVist
takes
```javascript
{
	"rating": <integer between 0-5>
	or 
	"favorite": <true||false>
}
```
