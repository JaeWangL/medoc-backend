BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIMEOFFSET NOT NULL CONSTRAINT [DF__Users__CreatedAt] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIMEOFFSET NOT NULL,
    [Email] NVARCHAR(255) NOT NULL,
    [Password] NVARCHAR(255) NOT NULL,
    [UserName] NVARCHAR(255) NOT NULL,
    [Role] TINYINT NOT NULL,
    [IsSignedIn] BIT NOT NULL,
    CONSTRAINT [Users_Email_unique] UNIQUE ([Email])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN 
    ROLLBACK TRAN;
END;
THROW

END CATCH
