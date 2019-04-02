SELECT COUNT(Post.id)
FROM Post
GROUP BY Post.created_at.year
