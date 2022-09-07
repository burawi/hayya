![hayya](https://user-images.githubusercontent.com/10698248/188729999-c4ee0fab-d9e1-4263-8980-4b2ecf355e72.png)

# Hayya 
[![NPM Version](https://img.shields.io/npm/v/hayya)](https://www.npmjs.com/package/hayya) [![Language](https://img.shields.io/github/languages/top/burawi/hayya)]() [![contribution guide](https://img.shields.io/badge/contribution-guide-brightgreen.svg?style=flat)](CONTRIBUTING.md) [![Downloads](https://img.shields.io/npm/dm/hayya?color=pink)](https://www.npmjs.com/package/hayya) [![Code size](https://img.shields.io/github/languages/code-size/burawi/hayya?color=brightgreen)]() [![License](https://img.shields.io/github/license/burawi/hayya?color=blue)](CONTRIBUTING.md) [![Last commit](https://img.shields.io/github/last-commit/burawi/hayya)]() [![Coverage](coverage/badge-lines.svg)]()

A fast config HTTP requests testing tool for busy people 


## For the really busy ones (⏱️30 sec running example)
**Installation**
```
npm i -g hayya
```
Create a **hayyarc** file with the following content:
```
$ :3000
/dog
< ok
```
**Run**

If you don't have time to run a server listening on `localhost:3000`, run this command in a separate terminal to simulate the server and don't close it:
```
node -e "require('http').createServer((req, res) => { res.end('ok') }).listen(3000)"
```

Now run:
```
hayya
```
And you should see this:

![image](https://user-images.githubusercontent.com/10698248/188680609-5309e482-2e28-4c51-a557-2e98de2ea382.png)

So you loved it? 💙❓ You can continue reading the documentation below, I promise I will try to make it as brief as possible.

* [Docs](#docs)
    * [Prefix](#prefix)
    * [Route](#route)
    * [Request body](#request-body)
    * [Request headers](#request-headers)
    * [Response headers](#response-headers)
    * [Response body](#response-body)
    * [Example](#a-file-example)
* [How to contribute?](CONTRIBUTING.md)

## Docs
### Prefix
```
$ http://localhost:3000/api
  ------|---------|----
  |      |         |-> Port: Required for localhost and 127.0.0.1
  |      |
  |      |-> Origin: If ommited, will be set to localhost
  |
  |-> Protocol: If ommited, will be http for localhost and 127.0.0.1 and https for others
```

**Examples:**
```
$ :8080
====> http://localhost:8080
```
```
$ localhost
====> Will throw error: Port required for localhost
```
```
$ google.com
====> https://google.com
```
### Route
```
GET /something 404
--- ---------- ---
|   |          |-> Expected Status code: If ommited, will be set to 200
|   |
|   |-> The route to be fetched (Will be added to the prefix)
|
|-> Method: If ommited, will be set to GET
|           If set to -- will take the same method as the previous route
```
**Examples**
```
/secret 401
====> Will fetch a GET request to /secret and expects 401
```
```
/ 
====> Will fetch a GET request to / and expects 200
```
```
POST /create 401
====> Will fetch a POST request to /create and expects 401
```
```
POST /create 401
... (other config of the route)

-- /edit 200
====> Method will be POST (Same as previous one route)
```
### Request body
```
> { name: 'User', age: 20 }
- -------------------------
| |-> Can be a JSON object or a string
| |   In case of a string, don't put quotes (Because, you know, you don't have time to)
| |   The object is parsed using JSON5 library, so again, you don't have to put quotes for the keys and you can put single quotes for strings
|
|-> Sign of request body
```
**Examples:**
```
> A message to the server
====> The request content-type header will have text/plain and the body this message
```
### Request headers
```
>h ct json
-- -- ----
|  |  |-> The value of the header
|  |  |   json here is a shorthand for application/json
|  |  |   html is a shorthand for text/html
|  |  |   text is for for text/plain
|  |  |   any other value will be kept as it is
|  |  |   Note: Values are interpreted as regex, so a ^application/ would be a valid value
|  |
|  |-> The header key
|  |   ct is a shorthand for content-type, other shorthands:
|  |     auth -> authorization
|  |     lang -> accept-language
|  |     cc   -> cache-control
|  |     ce   -> content-encoding
|  |     ah   -> access-control-allow-headers
|  |     am   -> access-control-allow-methods
|  |     ao   -> access-control-allow-origin
|  |   Any other key will be kept as it is
|  
|-> Sign of request header
```
**Examples:**
```
>h x-custom-header awesome header value
>h ct html
====> headers will looke like { "x-custom-header": "awesome header value", "content-type": "application/json" }
```
### Response headers
Same as above but with `<h` instead of `>h`
**Examples:**
```
<h x-custom-header awesome header value
<h ct html
====> Will expect response headers to be { "x-custom-header": "awesome header value", "content-type": "application/json" }
```
### Response body
```
< { id: #, name: *, activated: !, role: user, comments: [{ id: #, text: * }], images: [*] }
- -----------------------------------------------------------------------------------------
|-> Response body sign  |
                        |
                        |-> Will set response content-type header to application/json, unless it was already set
                            It will expect an object with:
                              id: number
                              name: string
                              activated: boolean
                              role: "user" (Exactly this value)
                              comment: array of objects having the following schema
                                id: number
                                text: string
                              images: array of strings
```
**Examples:**
```
/secret 403
< You are not allowed to access this
====> response content-type header expected to be "text/plain"
====> body expected to be "You are not allowed to access this"
```
```
/users
< [{ id: #, name: * }]
====> response content-type header expected to be "application/json"
====> body expected to be an array of objects with id as number and name as string
```

Here is the complete list of the supported types:

| Symbol | Type | Details |
|--------|------|---------|
| `#`    | Number | Can specify a number by adding it after `#`, Eg: `#20` expects 20 |
| `*`    | String | |
| `!`    | Boolean | Can specify whether true or false by setting `!+` for `true` and `!-` for `false` |
| `[]`   | Array | Can specify the expected array length by adding a the length after the closing bracket, Eg: `[*]5` expects an array of 5 strings |
| `{}`   | Object | |
| Any other value | Exact string | Any other value will be interpreted as a string with the exact given value |

### A file example
Given all what we saw above here is what a rest api test `Hayya` config file would look like:
```
$ :3000

/users 200
< [{ id: #, name: * }]

/user/500 404

POST /user 201
> { name: 'Ali' }
< Success

-- /comment
> { txt: 'This is a comment' }
< Success

-- /login 200
> { username: 'meme', password: '1234' }
<h auth Bearer myawesometoken
```
