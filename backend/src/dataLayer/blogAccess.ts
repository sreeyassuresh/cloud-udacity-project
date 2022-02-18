import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Blog } from '../models/Blog'
import { BlogItem } from '../models/BlogItem'
import { BlogItemUpdate } from '../models/BlogItemUpdate'

const logger = createLogger('BlogAccess')
const XAWS = AWSXRay.captureAWS(AWS)

export class BlogAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly blogItemsTable = process.env.BLOG_ITEMS_TABLE,
        private readonly blogsTable = process.env.BLOGS_TABLE,
        private readonly blogTableIndex = process.env.BLOGS_USERID_INDEX,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    ) { }

    async getAllBlogs(userId: string): Promise<BlogItem[]> {

        const result = await this.docClient.query({
            TableName: this.blogItemsTable,
            IndexName: this.blogTableIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        logger.info(`fetched items ${JSON.stringify(items)}`)
        return items as BlogItem[]
    }

		async getBlog(userId: string): Promise<Blog[]> {

			const result = await this.docClient.query({
					TableName: this.blogsTable,
					IndexName: this.blogTableIndex,
					KeyConditionExpression: 'userId = :userId',
					ExpressionAttributeValues: {
							':userId': userId
					}
			}).promise()

			const items = result.Items
			logger.info(`fetched items ${JSON.stringify(items)}`)
			return items as Blog[]
	}

    async updateBlog(item: BlogItemUpdate, blogItemId: string, userId: string) {
        let rec = await this.docClient.update({
            TableName: this.blogItemsTable,
            Key: {
                'blogItemId': blogItemId,
                'userId': userId
            },
            UpdateExpression: "set #name = :r, content = :p",
            ExpressionAttributeValues: {
                ":r": item.name,
                ":p": item.content
            },
            ExpressionAttributeNames: {
                '#name': 'name',
            },
        }).promise()
				
        logger.info(`updated items for blogs in updateBlog ${JSON.stringify(rec)}`)
    }

    async updateBlogName(name: string, blogId: string, userId: string) {
        let rec = await this.docClient.update({
            TableName: this.blogsTable,
            Key: {
                'blogId': blogId,
                'userId': userId
            },
            UpdateExpression: "set #name = :r",
            ExpressionAttributeValues: {
                ":r": name
            },
            ExpressionAttributeNames: {
                '#name': 'name',
            },
        }).promise()

        logger.info(`updated items for blogs in updateBlog $${JSON.stringify(rec)}`)
    }

    async deleteBlog(blogItemId: string, userId: string) {
        await this.docClient.delete({
            TableName: this.blogItemsTable,
            Key: {
                blogItemId,
                userId
            }
        }).promise()
        logger.info(`deleted item ${blogItemId}`)
    }

    async createBlog(item: BlogItem): Promise<BlogItem> {
        await this.docClient.put({
            TableName: this.blogItemsTable,
            Item: item
        }).promise()
        return item
    }

    async createBlogName(item: Blog): Promise<Blog> {
				let items = await this.getBlog(item.userId);
				if(items.length > 0) {
						await this.updateBlogName(item.name,items[0].blogId,item.userId);
				}
				else {
					await this.docClient.put({
							TableName: this.blogsTable,
							Item: item
					}).promise()
				}
        return item
    }

    async updateBlogImageURL(imageId: string, blogItemId: string, userId: string) {
			logger.info(`imageId to be updated in the blog table  $${JSON.stringify(imageId)}`)
        let rec = await this.docClient.update({
            TableName: this.blogItemsTable,
            Key: {
                'blogItemId': blogItemId,
                'userId': userId
            },
            UpdateExpression: "set  attachmentUrl = :a",
            ExpressionAttributeValues: {
                ":a": `https://${this.bucketName}.s3.amazonaws.com/${imageId}`
            },
        }).promise()
        logger.info(`updated items for blogs in updateBlog $${JSON.stringify(rec)}`)
    }

}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient()
}
