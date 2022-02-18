import * as uuid from 'uuid'
import { Blog } from '../models/Blog'
import { BlogItem } from '../models/BlogItem'
import { BlogAccess } from '../dataLayer/blogAccess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils'
import { createLogger } from '../utils/logger'
import { CreateBlogRequest } from '../requests/CreateBlogRequest'
import { UpdateBlogRequest } from '../requests/UpdateBlogRequest'
//import { stream } from 'winston'

const blogAccess = new BlogAccess()
const attachDetails = new AttachmentUtils()
const logger = createLogger('getBlogs')

export async function getBlogsForUser(userId: string): Promise<BlogItem[]> {
    
    logger.info(`fetching items for blogs in blogItems`) 
    return await blogAccess.getAllBlogs(userId);
}

export async function getBlog(userId: string): Promise<Blog[]> {
    
    logger.info(`fetching items for blog in blogs`) 
    return await blogAccess.getBlog(userId);
}

export async function createBlog(newBlog: CreateBlogRequest,userId: string): Promise<BlogItem> {
    
    logger.info(`creating items for blog in blogItems ${JSON.stringify(newBlog)}`)
    const itemId = uuid.v4()

    return await blogAccess.createBlog({
        userId: userId,
        blogItemId: itemId,
        createdAt: new Date().toISOString(),
        name: newBlog.name,
        content: newBlog.content,             
        attachmentUrl: ''       
    })
}

export async function createBlogName(str: string,userId: string): Promise<Blog> {
    
    logger.info(`creating name for blog in blogs ${str}`)
    const itemId = uuid.v4()

    return await blogAccess.createBlogName({
        userId: userId,
        blogId: itemId,
        createdAt: new Date().toISOString(),
        name: str,      
    })
}

export async function updateBlog(updateBlog: UpdateBlogRequest,blogItemId: string, userId: string) {
    
    logger.info(`updating items for blogs in blogItems ${JSON.stringify(updateBlog)}`)
    return await blogAccess.updateBlog({
        name: updateBlog.name,
        content: updateBlog.content 
    }, blogItemId, userId)
}

export async function deleteBlog(blogItemId: string, userId: string) {
    logger.info(`deleting items for blog in blogItems ${blogItemId}`)
    return await blogAccess.deleteBlog(blogItemId, userId)
}

export async function createAttachmentPresignedUrl(blogItemId: string, userId: string) : Promise<string> {
    logger.info(`creating signed url for blog in blogs ${blogItemId}`)
		const imageId = uuid.v4()
    const url = await attachDetails.createAttachmentPresignedUrl(imageId);
		await blogAccess.updateBlogImageURL(imageId,blogItemId,userId);
		return url;

}


