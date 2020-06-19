import * as uuid from 'uuid'

import { ResolutionItem } from '../models/ResolutionItem'
import { ResolutionUpdate } from '../models/ResolutionUpdate'
import { ResolutionAccess } from '../dataLayer/resAccess'
import { CreateResolutionRequest } from '../requests/CreateResolutionRequest'
import { UpdateResolutionRequest } from '../requests/UpdateResolutionRequest'
import { parseUserId } from '../auth/utils'

const resolutionAccess = new ResolutionAccess()

export async function getAllResolutionItems(jwtToken: string): Promise<ResolutionItem[]> {
  const userId = parseUserId(jwtToken)
  return resolutionAccess.getAllItems(userId)
}

export async function createResolutionItem(
  createResolutionRequest: CreateResolutionRequest,
  jwtToken: string
): Promise<ResolutionItem> {

  const resId = uuid.v4()
  const userId = parseUserId(jwtToken)
  const date = new Date().toISOString()

  return await resolutionAccess.createItem({
    userId: userId,
    resId: resId,
    title: createResolutionRequest.title,
    desc: createResolutionRequest.desc,    
    createdAt: date,
    modifiedAt: date
  })
}

export async function updateResolution(
  updateResolutionRequest: UpdateResolutionRequest,
  resId: string,
  jwtToken: string
): Promise<ResolutionUpdate> {
  const userId = parseUserId(jwtToken)
  const date = new Date().toISOString()
  const resolutionUpdate: ResolutionUpdate = {
                                              'title': updateResolutionRequest.title,
                                              'desc': updateResolutionRequest.desc,
                                              'modifiedAt': date
                                            }
  return await resolutionAccess.updateItem(resolutionUpdate, resId, userId)
}

export async function deleteResolution(resId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken)
  return await resolutionAccess.deleteItem(resId, userId)
}

export function generateUploadUrl(resId: string, userId:string): Promise<string> {
  return resolutionAccess.generateUploadUrl(resId, userId)
}