import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { generateUploadUrl } from '../../businessLogic/resolutions'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const resId = event.pathParameters.itemId
      const userId = getUserId(event)
      logger.info(`Generate the signed-URL: ${resId}`)
  
      const URL = await generateUploadUrl(resId, userId)
      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl: URL
        })
      }
    } catch(error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: error.message
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)