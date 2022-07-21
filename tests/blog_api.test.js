const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const User = require('../models/user')
const Blog = require('../models/blog')

let token = null

beforeEach(async () => {
  jest.setTimeout(10000)
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = new User({
    username: 'testi',
    name: 'Testi Testaaja',
    passwordHash
  })
  user.save()
  const response = await api
    .post('/api/login')
    .send({
      username: 'testi',
      password: 'salasana'
    })
  token = `bearer ${response.body.token}`
  await Blog.deleteMany({})
  await api
    .post('/api/blogs')
    .set({ Authorization: token })
    .send(helper.initialBlogs[0])
  await api
    .post('/api/blogs')
    .set({ Authorization: token })
    .send(helper.initialBlogs[1])
})

describe('addition of a new blog', () => {
  test('blogs are returned as json', async () => {
    jest.setTimeout(10000)
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs has returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(2)
  })

  test('blog have id instead of _id', async () => {
    const response = await api.get('/api/blogs')
    console.log(response.body[0])
    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).not.toBeDefined()
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(blog => blog.author)

    expect(contents[1]).toBe('Richard himself')
  })

  test('blog has been added', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(3)
  })

  test('new blog has zero likes', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', token )
      .send(helper.blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtDb = await helper.blogsInDb()
    const addedBlog = blogsAtDb.find(blog => blog.title === helper.blogWithoutLikes.title)
    console.log(blogsAtDb)
    expect(addedBlog.likes).toBe(0)
  })

  test('invalid blog is not added', async () => {

    await api
      .post('/api/blogs')
      .set('Authorization', token )
      .send(helper.blogWithoutTitle)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succees with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0].id

    await api
      .delete(`/api/blogs/${blogToDelete}`)
      .set('Authorization', token )
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(2 - 1)

    const author = blogsAtEnd.map(r => r.author)
    expect(author).not.toContain(blogToDelete.author)
  })

  test('fails with status code 401 if token is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0].id
    await User.deleteMany({})

    await api
      .delete(`/api/blogs/${blogToDelete}`)
      .set('Authorization', token )
      .expect(401)
  })
})

describe('blog can bee updated', () => {
  test('', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const blog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }
    console.log(blogToUpdate.likes, blog.likes)

    await api
      .put(`/api/blogs/${blog.id}`)
      .set('Authorization', token)
      .send(blog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.id === blog.id)
    expect(updatedBlog.likes).toBe(blogToUpdate.likes + 1)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short or username/password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Uper Suser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username is too short or username/password missing')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})


afterAll(() => {
  mongoose.connection.close()
})