/*
  Warnings:

  - The primary key for the `Follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Follow` table. All the data in the column will be lost.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `public` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Follow_pkey" PRIMARY KEY ("followedId", "followerId");

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id", "authorId");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "public" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Reaction" (
    "authorId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "like" BOOLEAN,
    "retweet" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("authorId","postId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_key" ON "Post"("id");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
