# Backend

## API Info

* Documentation link = https://documenter.getpostman.com/view/10964430/SzfDy67Z?version=latest
* Deployed API = https://food-truck-trackr-bw.herokuapp.com/api

## DB info

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
* [✔] Test Database
* [✔] Error Handler Middleware
* [✔] Postgis 

### To Do 

* Test Operator Endpoints



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
* [✔] get Trucks within given distance - 10 miles by default
* [✔] get Trucks by Cuisine Type - diner's favorite cuisine by default

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

#### What can't any account do?

* --

#### What can't Diners do?

* --

#### What can't Operators do?

*  --

