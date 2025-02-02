"use server"
import axios from "axios";

// This function fetches blog posts and their associated images
export const onGetBlogPosts = async () => {
    try {
        // Array to store the processed blog posts
        const postArray: {
            id: string
            title: string
            image: string
            content: string
            createdAt: Date
        }[] = []

        // Fetch the URL for the posts from environment variables
        const postsUrl = process.env.CLOUDWAYS_POSTS_URL;
        if (!postsUrl) return

        // Get the blog posts data
        const posts = await axios.get(postsUrl)

        // Fetch the URL for the images from environment variables
        const featuredImages = process.env.CLOUDWAYS_FEATURED_IMAGES_URL
        if (!featuredImages) return

        // Loop through each post to fetch associated image and process the post data
        let i = 0;
        while (i < posts.data.length) {
            // Fetch the image associated with the post
            const image = await axios.get(`${featuredImages}/${posts.data[i].featured_media}`)
            if (image) {
                // Create a post object with the relevant details
                console.log(image.data.media_details)
                const post: {
                    id: string
                    title: string
                    image: string
                    content: string
                    createdAt: Date
                } = {
                    id: posts.data[i].id,
                    title: posts.data[i].title.rendered,
                    image: image.data.media_details.file,
                    content: posts.data[i].content.rendered,
                    createdAt: new Date(posts.data[i].date),
                }
                // Add the post object to the array
                postArray.push(post)
            }
            i++
        }
        // Return the array of posts if data exists
        if (posts.data) {
            return postArray
        }
    } catch (error) {
        // Log any errors that occur during the process
        console.log(error)
    }
}
