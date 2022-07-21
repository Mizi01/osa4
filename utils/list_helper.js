const dummy = (blogs) => {
  const something = blogs.length
  return something === 0
    ? 1
    : 1
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

const favoriteBlog = (blogs) => {
  const favorite = blogs.lenght === 1
    ? blogs
    : blogs.sort((a, b) => b.likes - a.likes)[0]
  return blogs.length === 0
    ? []
    : favorite
}

const mostBlogs = (blogs) => {
  if(blogs.lenght === 0) return []
  if(blogs.lenght === 1) return [blogs.author, 1]
  const authors = []
  let blogsS = []
  blogs.map(blog => blog.author).forEach(author => authors.includes(author)? blogsS[authors.findIndex(aut => aut === author)] += 1 : (
    authors.push(author),
    blogsS = blogsS.concat(1)
  ))
  const max = Math.max(...blogsS)
  const findId = blogsS.findIndex(n => n === max)
  return [authors[findId], blogsS[findId]]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}