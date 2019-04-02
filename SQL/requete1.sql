SELECT COUNT(post1.id) / COUNT(post2.id)
FROM Post as post1, Post as post2
WHERE post1.rating = "safe"
