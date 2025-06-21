/*
  Warnings:

  - The primary key for the `Analysis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Analysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `bodyFat` on table `Analysis` required. This step will fail if there are existing NULL values in that column.
  - Made the column `activityLevel` on table `Analysis` required. This step will fail if there are existing NULL values in that column.
  - Made the column `goal` on table `Analysis` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bmi` on table `Analysis` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recommendedCalories` on table `Analysis` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "bodyFat" SET NOT NULL,
ALTER COLUMN "activityLevel" SET NOT NULL,
ALTER COLUMN "goal" SET NOT NULL,
ALTER COLUMN "bmi" SET NOT NULL,
ALTER COLUMN "bmr" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "tdee" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "recommendedCalories" SET NOT NULL,
ADD CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id");
