/*
  Warnings:

  - You are about to alter the column `Id` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Users] ALTER COLUMN [Id] INT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN 
    ROLLBACK TRAN;
END;
THROW

END CATCH
