import { getBlogStripCards, getNavPosts } from './data/posts-server'
import HomePageClient from './HomePageClient'

export default function Home() {
  const posts = getBlogStripCards()
  const navPosts = getNavPosts()
  return <HomePageClient posts={posts} navPosts={navPosts} />
}
