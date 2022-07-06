const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const blogsLikes = blogs.map(blog => blog.likes)
  const reducer = (sum, item) => {
    return sum + item
  }
  return blogsLikes.lenght === 0
    ? 0
    : blogsLikes.reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes,
}