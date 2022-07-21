const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger kuka',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    id: '5a422aa71b54a4356234d17f8',
    title: 'What the f Richard',
    author: 'Richard himself',
    url: 'youtu.be',
    likes: 10,
    __v: 0
  },
  {
    id: '5a422aa71b5fa4356234d17f8',
    title: 'All the time same',
    author: 'Richard himself',
    url: 'youtu.be',
    likes: 101,
    __v: 0
  },
  {
    id: '5a422aa71b5fa4356234dd17f8',
    title: 'You tube',
    author: 'Richard himself',
    url: 'youtu.be',
    likes: 15,
    __v: 0
  },
  {
    id: '5a422aa71rfa4356234d17f8',
    title: 'Ae',
    author: 'Richard himself',
    url: 'youtu.be',
    likes: 435,
    __v: 0
  },
  {
    id: '5a422aa71b5hg4356234d17f8',
    title: 'dsfgdfs',
    author: 'Richard himself',
    url: 'youtu.be',
    likes: 134,
    __v: 0
  },
  {
    id: '5a422aa7134a676234d17f8',
    title: 'Go To Sarmful',
    author: 'Edsger kuka',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 10,
    __v: 0
  }
]

const newBlog = {
  title: 'Tämä on uusi blogi',
  author: 'Uusi Blokkaaja',
  url: 'uusi.blokkaaja.fi',
  likes: 1,
}

const blogWithoutLikes = {
  title: 'Blogi jossa ei ole likejä',
  author: 'Liketön Blokkaaja',
  url: 'ei.likejä.fi',
}

const blogWithoutTitle = {
  author: 'Liketön Blokkaaja',
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, newBlog, blogsInDb, usersInDb, blogWithoutLikes, blogWithoutTitle
}