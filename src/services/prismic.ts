import * as prismic from '@prismicio/client'

export function getPrismicClient(req?: unknown){
    const repoName = 'next-blog-lg'
    const endpoint = prismic.getEndpoint(repoName)
    const client = prismic.createClient(endpoint, req)

    return client;
}