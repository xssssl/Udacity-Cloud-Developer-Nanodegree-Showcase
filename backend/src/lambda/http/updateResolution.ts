import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateResolutionRequest } from '../../requests/UpdateResolutionRequest'
import { updateResolution } from '../../businessLogic/resolutions'
import { getJwtToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updatetResolutions')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
      const jwtToken = getJwtToken(event)
      const itemId = event.pathParameters.itemId
      const updateResolutionRequest: UpdateResolutionRequest = JSON.parse(event.body)
      logger.info(`Update a resolution: ${itemId}`)

      const resolutionItem = await updateResolution(updateResolutionRequest, itemId, jwtToken)

      return {
        statusCode: 200,
        body: JSON.stringify({
          item: resolutionItem
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
