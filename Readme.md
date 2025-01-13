# Backend App

# npm install -D nodemon

# npm install -D prettier

# npm install mongoose express dotenv cookie-parser cors

# npm install mongoose-aggregate-paginate-v2

# npm install bcrypt

# npm install jsonwebtoken

# npm install cloudinary (We will use Multer to handle file uploads from the user, temporarily store the files locally, and then upload them directly to Cloudinary and after upload del the file from local)

# npm install multer

HTTP - Hyper Text Transfer Protocol

URL-uniform Resource locator
URI-uniform Resource Identifier
URN-uniform Resource Name

what are http headers?

- metadata----key-value pair sent along with req n res
- uses ---- caching / authentication / manage state

Request Headers -----> data from client
Response Headers -----> data from server
Representation Headers -----> encoding / compression
Payload Headers -----> data

# ----Most Common Headers

Accept : application / json
User-Agent (Req from which browser/engine or os)
Authorization (Bearer Token)
Content - Type (images/pdf what u r sending)
Cookie
Cache-control (data expire etc)

# ----CORS

Access-Control-Allow-Origin
Access-Control-Allow-Credentials
Access-Control-Allow-Method

# ----SECURITY

Cross-Origin-Embedder-Policy
Cross-Origin-Opener-Policy
Content-Security-Policy
X-XSS-Protection

# ---HTTP methods (to interact with server)

GET : retrieve a resource
HEAD : No message body (response headers only)
OPTIONS : what operations are available
TRACE : loopback test (get some data)
DELETE : remove a resource
PUT : replace a resource
POST : interact with resource (mostly add)
PATCH : change part of a resource

# ----http status code

100 continue
102 processing
200 ok
201 created
202 accepted
307 temporary redirect
308 permanent redirect
400 bad request
401 Unauthorized
402 payment required
404 Not found
500 Internal server error
504 gateway timeout
