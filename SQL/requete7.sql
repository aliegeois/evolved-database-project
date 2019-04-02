SELECT P.uploader
FROM Posts P
GROUP BY P.uploader
ORDER BY SUM(P.file_size)
LIMIT 10