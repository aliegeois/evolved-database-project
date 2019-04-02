SELECT T.name, COUNT(P.id), P.created_at.year
FROM Tag as T, Post as P
WHERE T.id = P.associated_with
GROUP BY CUBE (P.created_at.year, T.name)