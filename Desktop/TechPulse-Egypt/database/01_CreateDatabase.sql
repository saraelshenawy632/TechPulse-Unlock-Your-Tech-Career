USE master;
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'TechPulseDB')
BEGIN
    ALTER DATABASE TechPulseDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE TechPulseDB;
END
GO

CREATE DATABASE TechPulseDB;
GO

USE TechPulseDB;
GO




---------------------------------------------




