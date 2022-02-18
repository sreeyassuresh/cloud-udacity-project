import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { CreateBlogRequest } from '../../requests/CreateBlogRequest'
import { getUserId } from '../utils';
import { createBlog } from '../../businessLogic/blog'
const logger = createLogger('createBlog')
export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newBlog: CreateBlogRequest = JSON.parse(event.body)
    if(!newBlog.name) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
           error: 'Name is required'
        })
      }
    }
    // TODO: Implement creating a new Blog item
    logger.info(`recieved item ${JSON.stringify(newBlog)}`)
    const item = await createBlog(newBlog,getUserId(event));
    logger.info(`stored items ${JSON.stringify(item)}`)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
         item
      })
    }
  }

