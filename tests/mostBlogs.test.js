const mostBlogs = require('../utils/list_helper').mostBlogs
const blogList = require('./test_helper').initialBlogs

describe('most blogs', () => {
  test('of empty list is zero', () => {
    const result = mostBlogs([])
    expect(result).toEqual([])
  })

  test('when list has only one blog equals that', () => {
    const result = mostBlogs([blogList[0]])
    expect(result).toEqual([blogList[0].author, 1])
  })
  test('of a bigger list returns right author and count', () => {
    const result = mostBlogs(blogList)
    expect(result).toEqual(['Richard himself', 5])
  })
})