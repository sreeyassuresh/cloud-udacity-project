import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getBlog } from '../../businessLogic/blog'
import { getUserId } from '../utils';
const logger = createLogger('getBlogs')
// TODO: Get all Blog items for a current user
export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
     
    const items = await getBlog(getUserId(event));
    logger.info(`fetched items ${JSON.stringify(items)}`)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
         items
      })
    }
  }

