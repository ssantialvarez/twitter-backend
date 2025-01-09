-- @param {String} $2:limit

SELECT "t1"."id", "t1"."authorId", "t1"."content", "t1"."images", "t1"."createdAt"
FROM ("public"."Post" AS "t1" JOIN "public"."Follow" AS "t2" ON "t1"."authorId" = "t2"."followedId" AND "t2"."followerId" = ($1) AND "t2"."deletedAt" is null)
ORDER BY "t1"."createdAt" DESC, "t1"."id" ASC 
LIMIT $2
OFFSET $3