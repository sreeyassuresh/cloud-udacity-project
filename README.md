# Serverless BLOG


# Functionality of the application

This application will allow creating/removing/updating/fetching BLOG items. Each BLOG item can optionally have an attachment image. Each user only has access to BLOG items that he/she has created. A user can modify the name of the blog.

# BLOG items

The application stores BLOG items, and each BLOG item contains the following fields:

* `blogItemId` (string) - a unique id for an item
* `userId` (string) - id of a user who created a blog item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a blog item (e.g. "Change a light bulb")
* `content` (string) - content for the blog
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a blog item


   
# Functionality implemented


* `Auth` - this function implements a custom authorizer for API Gateway that should be added to all other functions.

* `GetBlogItems` -  returns the blog posts for a current user. A user id can be extracted from a JWT token that is sent by the frontend

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

* `GetBlog` -  returns the blog details for a current user. A user id can be extracted from a JWT token that is sent by the frontend . Should include the blog name

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

* `CreateBlogItem` -  creates a new blog post for a current user. A shape of data send by a client application to this function can be found in the `CreateBlogRequest.ts` file

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

* `CreateBlogName` -  updates/creates  blog name for current user. 
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

* `UpdateBlogPost` -  updates a blog item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateBlogRequest.ts` file

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
* `DeleteBlogItem` -  deletes a blog post created by a current user. Expects an id of a blog item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a blog post item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.


## Authentication

A sample token has been added in postmancollection file for testing. 


```



