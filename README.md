<img src="https://user-images.githubusercontent.com/8843669/53967095-d4ecd700-40f4-11e9-95f0-75e4d9a9656b.png" align="right"> [![npm version](https://badge.fury.io/js/funnelql.svg)](https://badge.fury.io/js/funnelql)

# FunnelQL: Funnel Query Language

## Solution

Online customers can abandon their shopping cart for many reasons. As a store owner with access to Google Analytics there is information available about some of the reasons.

FunnelQL provides a solution to help customers complete their order. Pro-active communication, smart tricks with the design etc. Everything is possible with FunnelQL.

There is much to do about 'cart abandonment'. Experts estimate that 2 to 4 trillion USD per year is lost by abandoned shopping carts.

www.annexcloud.com/blog/31-shopping-cart-abandonment-statistics-for-2018/

- It’s costing a lot of money: Abandonment costs e-marketers about 2 to 4 trillion USD per year. Given the large economic impact, shopping cart abandonment solutions are becoming a priority for e-commerce marketers.
- It will get worse: Experts agree that shopping cart abandonment is on the rise.

FunnelQL can be an ideal solution and can help webshops recover more than a trillion USD in lost revenue.

# FunnelQL Javascript Library

A javascript library for working with Funnel Query Language. The library enables to perform queries on the chronological context of activity of a website visitor for the purpose of **Conversion Funnel Optimization**.

The language and library are intended to be easy to use to unlock Conversion Funnel Optimization for users with in-depth insights into visitors/customers such as webshop owners and internet marketing specialists.

<h3><a href="https://docs.funnelql.com/" target="_blank">Documentation</a> | <a href="https://funnelql.com/" target="_blank">Prototype (online demo)</a></h3>

## Install

The package is available on NPM: `npm install funnelql`.

Include the library in the HTML document. The library requires a Web Worker that can be included as a inline blob or that will require a separate web worker file.

##### Option 1: library with separate web worker file

```html
<script src="/funnelql.js" async></script>
```

The script will automatically load `/funnelql-worker.js` on the basis of the path of the `funnelql.js` file. You can define a custom location via `window['funnelql-worker'] = 'path/to/funnelql-worker.js';`.

##### Option 2: library with inline web worker

```html
<script src="/funnelql+inline-worker.js" async></script>
```

To save additional bytes you can use the `.nodebug.js` version of each script that does not include debug and performance timing functionality.

## How to use

Working with Funnel Query Language consists of two parts:

1) writing the funnel by registering tags during the visit of a website visitor.
2) querying the funnel to perform actions based on a callback or promise (e.g. a Push Notification).

### Setup

Funnel Query Language is based on a IndexedDB database that can persist or expire with the browser session. Persistence enables to target returning visitors or visitors that visited on a specific day or time.


```javascript
$FQL.init({
  expire: 'session'
});
```

##### Init Options


| Option                         | Description     | Default |
|--------------------------------|-----------------|---------|
| `expire`                | Database expiration.  | `session` (could be `never` or a time in seconds) |


### Writing A Funnel

The Funnel data-set is based on tags that can be set with the following method:

```javascript
$FQL.tag('tag-name');
```

During navigation, URLs are automatically registered. The following method can be used to manually register a navigation:

```javascript
$FQL.nav('URL or path/');
```

### Querying A Funnel

The following method can be used to perform a query based on a Funnel Query string or JSON:

```javascript
$FQL.query( "funnel query" ).then(function(result) {
  // result = true/false (boolean)
});
```

The following method can be used to parse a Funnel Query string into JSON:

```javascript
$FQL.parse( "funnel query" ).then(function(json) {
  // json
});
```

The following method can be used to perform an action as soon as a Funnel Query string or JSON matches the path of the visitor:

```javascript
$FQL.on( "funnel query" ).then(function(result) {
  // result = true 
});
```

Alternatively, the `on` method accepts a callback instead of a promise and multiple queries as a Array.

```javascript
$FQL.on( [ "funnel query 1", "funnel query 2" ], function(result, fql) {
  // result = true 
  // fql = funnel query string
});
```

The library can provide detailed debug information including Performance API timings in the browser console. The following method can be used to enable debug mode or to retrieve it's status.

```javascript
$FQL.debug(true);
```

![FunnelQL Browser Console Debug Info](https://github.com/FunnelQL/funnelql/blob/master/docs/images/debug-console.png)

## Funnel Query Language

How to construct a Funnel Query?

Funnel Query Language provides several methods for querying the registered funnel data-set.

* Tag (JSON string)
* URL (`URL`)
* Path (`PATH`)
* Tag Count (`COUNT`)
* Date or time (`SINCE`)
* Custom function (`FN`)

#### Tag Query

A tag can be queried using a JSON string `"tag-name"` or using a Regular Expression method `REGEX(/tag-name/i)`.

```mysql
"tag-x" + REGEX(/tag-name-(\d+)?/i) + "tag-y"
```

#### URL Query

An URL can be queried using the method `URL("url")` or using a Regular Expression `URL( REGEX(/tag-name/i) )`.

```mysql
URL("url/to/match") + URL( REGEX(/url\.(html|js|css)/i) )
```

#### Path Query

The `PATH` query enables to add chronological context to a query. The path method starts a sub query that can contain a `tag`, `url`, `count` or `function` query.

The path query provides operators to define the chronological context. The path sequence can be based on URL navigation position or time.

##### Path Query Operators


| Option                         | Description     |
|--------------------------------|-----------------|
| `>`               | Matches in consecutive query should follow previous query's URL position. |
| `>=`               | Matches in consecutive query should match or follow previous query's URL position. |
| `\|>`               | Matches in consecutive query should be on same URL position as previous query's URL position. |
| `>10`                | Matches in consecutive query should be at least 10 URL positions from previous query's URL position. |
| `>10m`                | Matches in consecutive query should be at least 10 minutes from previous query's event position. |
| `<10m`                | Matches in consecutive query should be within 10 minutes from previous query's event position. |


```mysql
PATH( "tag-x" > "tag-y" )
```

The following example matches when `tag-y` follows within 1 minute after `tag-x`.

```mysql
PATH( "tag-x" <1m "tag-y" )
```

The following example matches when the visitor visits an URL containing `cart` or `other-page` within 5 navigations after having visited `product-1.html`.

```mysql
PATH( URL("product-1.html") <5 URL( REGEX(/(cart|other-page)/) ) )
```

#### Since Query

The `SINCE` query enables to add chronological context to a query. The since method starts a sub query that can contain a `tag`, `url`, `count` or `function` query.

The first parameter of the `SINCE` method can contain a time reference, e.g. `1s` (1 second) or `10m` (10 minutes) or a date in format `yyyy-MM-ddThh:mm`.

```mysql
SINCE( 1m, "tag-x" )
```

```mysql
SINCE( 2018-09-02T12:10, ( "tag-x" + "tag-y" ) )
```

#### Count Query

A `COUNT` query enables to query based on number of occurrences of a tag.

The first parameter of the `COUNT` method contains the tag as JSON string or as `REGEX` query. The query supports the operators `>`, `<`, `=`, `<=`, `>=` followed by a number.

```mysql
COUNT( "tag-x" > 1 )
```

#### Function Query

A `FN` query enables to perform a custom query using a javascript function. Optional conditions from a parent query are added as a extra argument.

```mysql
FN( "function-name", "argument-1", "argument-2" )
```
