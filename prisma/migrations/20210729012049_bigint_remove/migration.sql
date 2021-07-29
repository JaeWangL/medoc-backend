/*
  Warnings:

  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `Id` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [PK__Users__Id];
ALTER TABLE [dbo].[Users] ALTER COLUMN [Id] INT NOT NULL;
ALTER TABLE [dbo].[Users] ADD CONSTRAINT PK__Users__Id PRIMARY KEY ([Id]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN 
    ROLLBACK TRAN;
END;
THROW

END CATCH
