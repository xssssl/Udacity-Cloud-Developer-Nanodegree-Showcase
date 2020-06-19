import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllResolutionItems } from '../../businessLogic/resolutions'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getJwtToken, getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getResolutions')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const jwtToken = getJwtToken(event)
    const userId = getUserId(event)
    logger.info(`Get all resolution: User ID: ${userId}`)

    const items = await getAllResolutionItems(jwtToken)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
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