const favoriteBlog = require('../utils/list_helper').favoriteBlog
const blogList = require('./test_helper').initialBlogs


describe('favorite blog', () => {
  const oneBlog = blogList[1]
  console.log(oneBlog)
  test('of empty list is zero', () => {
    const result = favoriteBlog([])
    expect(result).toEqual([])
  })

  test('when list has only one blog equals that', () => {
    const result = favoriteBlog([blogList[0]])
    expect(result).toEqual(blogList[0])
  })
  test('of a bigger list returns right blog', () => {
    const result = favoriteBlog(blogList)
    console.log(blogList[0], oneBlog)
    expect(result).toEqual(oneBlog)
  })
})