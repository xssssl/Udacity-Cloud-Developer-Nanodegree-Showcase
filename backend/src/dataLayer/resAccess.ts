import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ResolutionItem } from '../models/ResolutionItem'
import { ResolutionUpdate } from '../models/ResolutionUpdate'
import { Types } from 'aws-sdk/clients/s3'

// const XAWS = AWSXRay.captureAWS(AWS)
const AWSSDK = chooseAwsSdk()
const logger = createLogger('resAccess')

export class ResolutionAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3Client: Types = new AWSSDK.S3({ signatureVersion: 'v4' }),
    private readonly s3BucketName = process.env.RESOLUTIONS_S3_BUCKET,
    private readonly signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly resolutionsTable = process.env.RESOLUTIONS_TABLE) {
  }

  async getAllItems(userId: string): Promise<ResolutionItem[]> {
    logger.info(`Getting all items: User ID: ${userId}`)
    const result = await this.docClient.query({
      TableName: this.resolutionsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
    const items = result.Items
    return items as ResolutionItem[]
  }

  async createItem(resolutionItem: ResolutionItem): Promise<ResolutionItem> {
    logger.info(`Creating an item: ${resolutionItem.itemId}`)
    await this.docClient.put({
      TableName: this.resolutionsTable,
      Item: resolutionItem
    }).promise()
    return resolutionItem
  }

  async updateItem(
    resolutionUpdate: ResolutionUpdate,
    itemId: string,
    userId: string
  ): Promise<ResolutionUpdate> {
    logger.info(`Updating an item: ${itemId}`)

    const params = {
      TableName: this.resolutionsTable,
      Key: {
        userId: userId,
        itemId: itemId
      },
      UpdateExpression: 'set #a = :a, #b = :b, #c = :c',
      ExpressionAttributeNames: {
        '#a': 'title',
        '#b': 'desc',
        '#c': 'modifiedAt'
      },
      ExpressionAttributeValues: {
        ':a': resolutionUpdate['title'],
        ':b': resolutionUpdate['desc'],
        ':c': resolutionUpdate['modifiedAt']
      },
      ReturnValues: 'ALL_NEW'
    }

    const result = await this.docClient.update(params).promise()
    const attributes = result.Attributes
    return attributes as ResolutionUpdate
  }

  async deleteItem(itemId: string, userId: string): Promise<string> {
    logger.info(`Deleting an item: ${itemId}`)

    const params = {
      TableName: this.resolutionsTable,
      Key: {
        userId: userId,
        itemId: itemId
      }
    }

    const result = await this.docClient.delete(params).promise()
    console.log(result)
    return itemId as string
  }

  async generateUploadUrl(itemId: string, userId: string): Promise<string> {
    logger.info(`Generating Upload URL: ${itemId}`)
    const uploadUrl = `https://${this.s3BucketName}.s3.amazonaws.com/${itemId}`
  
    await this.docClient.update({
      TableName: this.resolutionsTable,
        Key: {
          "userId": userId,
          "itemId": itemId
        },
        UpdateExpression: "set attachmentUrl= :attachmentUrl",
        ExpressionAttributeValues:{
          ":attachmentUrl": uploadUrl
        }
    }).promise()

    const url = this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: itemId,
      Expires: this.signedUrlExpiration
    })
    return url as string
  }
}

function chooseAwsSdk() {
  if(process.env.AWS_X_RAY_ENABLE) {
    console.log('AWS X-Ray enabled')
    return AWSXRay.captureAWS(AWS)
  } else {
    console.log('AWS X-Ray disabled')
    return AWS
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    const localDynamodbPort = process.env.LOCAL_DYNAMODB_PORT
    console.log(`Creating a local DynamoDB instance: Port:${localDynamodbPort}`)
    return new AWSSDK.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: `http://localhost:${localDynamodbPort}`
    })
  }
  return new AWSSDK.DynamoDB.DocumentClient()
}