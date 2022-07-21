const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })


  if(!blog.title || !body.url ) {
    console.log(`tämän pitäisi olla undefined: ${blog.title}`)
    return response.status(400).json({ error: 'title or url missing' }).end()
  }


  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch(exeption) {
    next(exeption)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {

  const user = request.user
  const id = request.params.id
  const blog = await Blog.findById(id)
  console.log(blog.user, user)

  if(!blog) {
    return response.status(400).end()
  }
  if(!user) {
    return response.status(401).json( { error: 'token invalid or missing' })
  }
  if (blog.user.toString() === user.id.toString()) {
    try {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } catch(exception) {
      next(exception)
    }
  } else {
    response.status(401).end()
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    user: body.user,
    likes: body.likes
  }

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(blog)
  } catch(exeption) {
    next(exeption)
  }
})

module.exports = blogsRouter