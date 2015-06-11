# Spec for Koop cache modules
In order to function as a cache for Koop, a module must support the following API

## Functions

### insert
Insert a new table into the cache
```javascript
function (table, data, layer, function (err, success)
 ```
* Table (string): the name of the table to be inserted. Usually of the form: type:key
* Data (object): geojson to be inserted after creation
* Layer (integer): the id of the layer. Usually defaults to 0
* Callback (function): returns err on failure or true on success

### insertPartial
Insert a set of rows into an existing table
```javascript
function (table, data, layerId, function (err, success)
```
* Table (string): the name of the table to be inserted. Usually of the form: type:key
* Data (object): geojson to be inserted after creation
* Layer (integer): the id of the layer. Usually defaults to 0
* Callback (function): returns err on failure or true on success

### remove
```javascript
function (table, function(err, success))
```
* Table: the name of the table to be deleted. Includes the layer id 
 * e.g. Socrata:ejk5-56ko:0
* Callback: returns err on failure or true on success

### select
```javascript
function (table, options, function(err, data))
```
* Table (string): The table to select data from, does not include the layerId.
* Options (object): used to select the proper table and pass where clauses
 * layerId (integer): the id of the layer to select. usually defaults to 0
 * where (string): Sql where clause
 * geometry (object): Bounding box to restrict select e.g. {xmin: -104, ymin: 35.6, xmax: -94.32, ymax: 41} 
 * idFilter (?) : ?
 * fields (array): Fields to include in the data response, * returns all fields. Akin to `select field1, field2` or `select *`
* Callback (function): Returns error if select failed, or returns GeoJSON from the cache

### updateInfo
Update an info doc that contains metadata about a resource
```javascript
function (table, info, function(err, success)
```
* Table (string): The resource about which to update info. Includes the layer id
 * e.g. Socrata:ejk5-56ko:0
* Info (object): Info to store along with the resource. Status must be set at processing while data is being added to the cache
 * e.g. {status: 'processing', updated_at: 1433882094, checked_at: 1433882094, count: 1025355, extent: {xmin: -104, ymin: 35.6, xmax: -94.32, ymax: 41}}
* Callback: Returns error, false on failure, and null, true on success

#### Example info parameter
```javascript
{
  'status': 'processing', 
  'updated_at': 1433882094, 
  'checked_at': 1433882094, 
  'count': 1025355, 
  'extent': {'xmin': -104, 'ymin': 35.6, 'xmax': -94.32, 'ymax': 41}
}
```

### getInfo
Get an info doc with metadata about a resource
```javascript
function (table, function(err, info))
```
* Table (string): The resource about which to update info. Includes the layer id
* Callback (function): Returns error, null failure and null, info (object) on success.

#### Example response
```javascript
(null, {
  'status': 'processing', 
  'updated_at': 1433882094, 
  'checked_at': 1433882094, 
  'count': 1025355, 
  'extent': {'xmin': -104, 'ymin': 35.6, 'xmax': -94.32, 'ymax': 41}
})
```
 
### getCount
Get the count of features in the database for a given resource
```javascript
function (table, options, function (err, count))
```
* Table (string): The resource about which to update info. Includes the layer id
* Table (string): The table to select data from, does not include the layerId.
* Options (object): used to select the proper table and pass where clauses
 * where (string): Sql where clause
 * geometry (object): Bounding box to restrict select }
* Callback (function): Returns error, null on failure and null, count on success

### Example Options param
```javascript
{
  'where': 'Field1 > 2014 OR Field2 > 9000'
  'geometry': {'xmin': -104, 'ymin': 35.6, 'xmax': -94.32, 'ymax': 41}
}
````
#### Example response
```javascript
(null, 105005)
````

### timerGet
Fetch a timer that tells the provider whether to check for cache expiration
```javascript
function (table, expires, function (err, timer)
```
* Table (string): The resource about which to update info. Includes the layer id
* Callback (function): Returns with error, null on failure and null, timer on success

### Example response
```javascript
(null, 1433883928)
```

### timerSet
Set a timer that will tell the provider to check for cache expiration when it's up
```javascript
function (table, expires, function (err, success)
```
* Table (string): The resource about which to update info. Includes the layer id
* Expires (date object): The next date at which to check for cache expiration
* Callback (function): Returns err, null or null, true