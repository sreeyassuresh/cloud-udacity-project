import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteBlog } from '../../businessLogic/blog'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateBlog')
export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const blogItemId = event.pathParameters.blogItemId
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
    // TODO: Implement updating a new blog item
    await deleteBlog( blogItemId ,getUserId(event));
    logger.info(`deleted items ${blogItemId}`)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
         item : {}
      })
    }
  }



