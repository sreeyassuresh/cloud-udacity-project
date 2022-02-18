import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('BlogAccess')
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

// TODO: Implement the fileStogare logic

export class AttachmentUtils {

  constructor(
      private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
      private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
  ) { }

  async createAttachmentPresignedUrl(blogItemId: string): Promise<string> {
    logger.info(`fetching presigned url for blog in atttachmentutils $${JSON.stringify(blogItemId)}`)
      return await s3.getSignedUrl('putObject', {
          Bucket: this.bucketName,
          Key: blogItemId,
          Expires: parseInt(this.urlExpiration)
      })
  }


}


