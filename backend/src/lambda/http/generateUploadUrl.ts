import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createAttachmentPresignedUrl } from '../../businessLogic/blog'
import { getUserId } from '../utils'
const logger = createLogger('generatUploadUrl')
export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const blogItemId = event.pathParameters.blogItemId
    // TODO: Return a presigned URL to upload a file for a Blog item with the provided id
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
    const uploadUrl = await createAttachmentPresignedUrl(blogItemId,getUserId(event));
    logger.info(`presigned url ${JSON.stringify(uploadUrl)}`)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl
      })
    }
  }



