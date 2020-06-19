import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteResolution } from '../../businessLogic/resolutions'
import { getJwtToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteResolutions')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    try {
      const jwtToken = getJwtToken(event)
      const resId = event.pathParameters.itemId
      logger.info(`Delete a resolution: ${resId}`)

      const deleteData = await deleteResolution(resId, jwtToken)
      return {
        statusCode: 200,
        body: deleteData
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
