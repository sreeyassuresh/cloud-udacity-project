# Serverless BLOG


# Functionality of the application

This application will allow creating/removing/updating/fetching BLOG items. Each BLOG item can optionally have an attachment image. Each user only has access to BLOG items that he/she has created. A user can modify the name of the blog.

# BLOG items

The application should store BLOG items, and each BLOG item contains the following fields:

* `blogItemId` (string) - a unique id for an item
* `userId` (string) - id of a user who created a blog item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a blog item (e.g. "Change a light bulb")
* `content` (string) - content for the blog
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a blog item


## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   
# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetBlogItems` - should return the blog posts for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
   "items": [
        {
            "content": "Every great dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion to reach for the stars to change the world. – Harriet Tubman",
            "attachmentUrl": "",
            "userId": "auth0|620e6976e08c3d006a485b27",
            "blogItemId": "c8d181ad-6891-41af-b6b4-aae867ea3172",
            "createdAt": "2022-02-17T16:13:06.989Z",
            "name": "Change the world"
        },
        {
            "content": "ABC",
            "attachmentUrl": "http://example.com/image.png",
            "userId": "auth0|620e6976e08c3d006a485b27",
            "blogItemId": "d2ba0731-1887-4d87-b2f9-be05593c7005",
            "createdAt": "2022-02-18T08:06:54.778Z",
            "name": "AAAA"
        }
    ]
}
```

* `GetBlog` - should return the blog details for a current user. A user id can be extracted from a JWT token that is sent by the frontend . Should include the blog name

It should return data that looks like this:

```json
{
    "items": [
        {
            "blogId": "6cc44935-25d9-4458-8ae7-f05d65b436eb",
            "createdAt": "2022-02-18T08:41:14.147Z",
            "name": "Yuki's blog",
            "userId": "auth0|620e6976e08c3d006a485b27"
        }
    ]
}
```

* `CreateBlogItem` - should create a new blog post for a current user. A shape of data send by a client application to this function can be found in the `CreateBlogRequest.ts` file

It receives a new blog item to be created in JSON format that looks like this:

```json
{
	"name": "Change the world",
	"content": "Every great dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion to reach for the stars to change the world. – Harriet Tubman"
}
```

It should return a new blog post that looks like this:

```json
{
  "item": {
        "userId": "auth0|620e6976e08c3d006a485b27",
        "blogItemId": "c8d181ad-6891-41af-b6b4-aae867ea3172",
        "createdAt": "2022-02-17T16:13:06.989Z",
        "name": "Change the world",
        "content": "Every great dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion to reach for the stars to change the world. – Harriet Tubman",
        "attachmentUrl": ""
    }
}
```

* `CreateBlogName` - should update/create  blog name for current user. 
It receives an object that contains a field :

```json
{
	 "name" : "Yuki's blog"
}
```

It should return the confirmation with the result
```json

    "item": {
        "userId": "auth0|620e6976e08c3d006a485b27",
        "blogId": "6cc44935-25d9-4458-8ae7-f05d65b436eb",
        "createdAt": "2022-02-18T08:41:14.147Z",
        "name": "Yuki's blog"
    }
```

* `UpdateBlogPost` - should update a blog item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateBlogRequest.ts` file

It receives an object that contains two fields that can be updated in a blog post:

```json
{
	"name": "Quotes",
	"content": "Dreams are lovely. But they are just dreams. Fleeting, ephemeral, pretty. But dreams do not come true just because you dream them. It’s hard work that makes things happen. It’s hard work that creates change. - Shonda Rhimes"
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return the confirmation with the result
```json

{
    "name": "Quotes",
    "content": "Dreams are lovely. But they are just dreams. Fleeting, ephemeral, pretty. But dreams do not come true just because you dream them. It’s hard work that makes things happen. It’s hard work that creates change. - Shonda Rhimes"
}.
```
* `DeleteBlogItem` - should delete a blog post created by a current user. Expects an id of a blog item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a blog post item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.



## Authentication

A sample token has been added in postmancollection file for testing. 


```



