import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateResolutionRequest } from '../../requests/CreateResolutionRequest'
import { createResolutionItem } from '../../businessLogic/resolutions'
import { getJwtToken, getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createResolution')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newRes: CreateResolutionRequest = JSON.parse(event.body)
  try {
    const jwtToken = getJwtToken(event)
    const userId = getUserId(event)
    logger.info(`Create a resolution: User ID: ${userId}`)

    const item = await createResolutionItem(newRes, jwtToken)
    return {
      statusCode: 200,
      body: JSON.stringify({
        item
      })
    }
  } catch(error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        item: newRes,
        error: error.message
      })
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
)
