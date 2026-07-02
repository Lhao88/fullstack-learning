-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'super_admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('enabled', 'disabled');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'user',
ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'enabled',
ADD COLUMN "avatarUrl" TEXT;
