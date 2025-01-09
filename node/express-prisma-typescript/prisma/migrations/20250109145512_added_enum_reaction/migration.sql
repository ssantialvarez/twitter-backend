/*
  Warnings:

  - The primary key for the `Reaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `retweet` on the `Reaction` table. All the data in the column will be lost.
  - Added the required column `reaction` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'RETWEET');

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_authorId_fkey";

-- AlterTable
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_pkey",
DROP COLUMN "authorId",
DROP COLUMN "like",
DROP COLUMN "retweet",
ADD COLUMN     "reaction" "ReactionType" NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY ("userId", "postId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
