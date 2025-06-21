/*
  Warnings:

  - The primary key for the `Analysis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `bmr` on the `Analysis` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `tdee` on the `Analysis` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "bodyFat" DROP NOT NULL,
ALTER COLUMN "activityLevel" DROP NOT NULL,
ALTER COLUMN "goal" DROP NOT NULL,
ALTER COLUMN "bmi" DROP NOT NULL,
ALTER COLUMN "bmr" SET DATA TYPE INTEGER,
ALTER COLUMN "tdee" SET DATA TYPE INTEGER,
ALTER COLUMN "recommendedCalories" DROP NOT NULL,
ADD CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Analysis_id_seq";
