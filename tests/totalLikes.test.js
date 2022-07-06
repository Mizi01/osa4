const totalLikes = require('../utils/list_helper').totalLikes

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a4356234d17f8',
      title: 'What the f Richard',
      author: 'Richard himself',
      url: 'youtu.be',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa71b76676234d17f8',
      title: 'I dont know how',
      author: 'Bam Margera',
      url: 'http://i.dont.know/how',
      likes: 100,
      __v: 0
    }
  ]

  test('of empty list is zero', () => {
    const result = totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
  test('of a bigger list is calculated right', () => {
    const result = totalLikes(listWithManyBlogs)
    expect(result).toBe(115)
  })
})