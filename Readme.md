**predictionio-driver** is a PredictionIO 0.8+ driver supporting both callback syntax and promise based syntax.

## Installation

    $ npm install predictionio-driver
    
## Collecting Data

```js
var predictionio = require('predictionio-driver');

// accessKey is required for PredictionIO 0.8.2+
var client = new predictionio.Events({appId: 1, accessKey: 'your-access-key'});

// Returns the server status
client.status().
	then(function(status) {
		console.log(status); // Prints "{status: 'alive'}"
	});

// Register a new user
client.createUser({uid: 'user-id'}).
	then(function(result) {
		console.log(result); // Prints "{eventId: 'something'}"
	}).
	catch(function(err) {
		console.error(err); // Something went wrong
	});
	
// Register a new item
client.createItem({
	iid: 'item-id',
	properties: {
		itypes: ['type1']
	}, 
	eventTime: new Date().toISOString()
}).
	then(function(result) {
		console.log(result); // Prints "{eventId: 'something'}"
	}).
	catch(function(err) {
		console.error(err); // Something went wrong
	});
	
// Register a new user-to-item action
client.createAction({
	event: 'view',
	uid: 'user-id',
	iid: 'item-id',
	eventTime: new Date().toISOString()
}).
	then(function(result) {
			console.log(result); // Prints "{eventId: 'something'}"
	}).
	catch(function(err) {
		console.error(err); // Something went wrong
	});
```

## Retrieving recommendations

```js
var predictionio = require('predictionio-driver');
var engine = new predictionio.Engine({url: 'http://localhost:8000'});

engine.sendQuery({
	uid: 'user-id',
	n: 1
}).
	then(function (result) {
		console.log(result);
	});
```

## License 

The MIT License (MIT)

Copyright (c) 2014 Asaf Yishai

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
