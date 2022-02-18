import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { UpdateBlogRequest } from '../../requests/UpdateBlogRequest'
import { getUserId } from '../utils';
import { updateBlog } from '../../businessLogic/blog'
const logger = createLogger('updateBlog')
export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const blogItemId = event.pathParameters.blogItemId
    const updateBlogReq: UpdateBlogRequest = JSON.parse(event.body)
    if(!blogItemId) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
           error: 'Blog Id is required'
        })
      }
    }
    // TODO: Implement updating a new Blog item
    logger.info(`recieved item ${JSON.stringify(updateBlog)}`)
    const item = await updateBlog(updateBlogReq, blogItemId, getUserId(event));
    logger.info(`updated items ${JSON.stringify(item)}`)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        name : updateBlogReq.name,
        content: updateBlogReq.content
      })
    }
  }


