import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { SearchBlogRequest } from '../../requests/SearchBlogRequest'
import { getUserId } from '../utils';
import { searchBlog } from '../../businessLogic/blog'
const logger = createLogger('createBlog')
export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing event: ", event)
  
  const {text}: SearchBlogRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const items = await searchBlog(userId, text)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(items)
    }
  }

