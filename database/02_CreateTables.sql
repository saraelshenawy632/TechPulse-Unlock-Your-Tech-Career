/*===============================
    Lookup Tables
================================*/

CREATE TABLE Categories
(
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE ExperienceLevels
(
    ExperienceLevelID INT IDENTITY(1,1) PRIMARY KEY,
    LevelName NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE EmploymentTypes
(
    EmploymentTypeID INT IDENTITY(1,1) PRIMARY KEY,
    TypeName NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE WorkModes
(
    WorkModeID INT IDENTITY(1,1) PRIMARY KEY,
    ModeName NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Sources
(
    SourceID INT IDENTITY(1,1) PRIMARY KEY,
    SourceName NVARCHAR(100) NOT NULL UNIQUE,
    Website NVARCHAR(255)
);

/*===============================
        Main Tables
================================*/

CREATE TABLE Companies
(
    CompanyID INT IDENTITY(1,1) PRIMARY KEY,

    CompanyName NVARCHAR(150) NOT NULL,

    Website NVARCHAR(255),

    Industry NVARCHAR(100),

    LogoURL NVARCHAR(255),

    Description NVARCHAR(MAX),

    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Locations
(
    LocationID INT IDENTITY(1,1) PRIMARY KEY,

    Governorate NVARCHAR(100) NOT NULL,

    City NVARCHAR(100)
);

CREATE TABLE Skills
(
    SkillID INT IDENTITY(1,1) PRIMARY KEY,

    SkillName NVARCHAR(100) NOT NULL UNIQUE,

    SkillCategory NVARCHAR(100)
);

CREATE TABLE Jobs
(
    JobID INT IDENTITY(1,1) PRIMARY KEY,

    Title NVARCHAR(200) NOT NULL,

    CompanyID INT NOT NULL,

    CategoryID INT NOT NULL,

    LocationID INT NOT NULL,

    ExperienceLevelID INT,

    EmploymentTypeID INT,

    WorkModeID INT,

    SourceID INT,

    MinSalary DECIMAL(10,2),

    MaxSalary DECIMAL(10,2),

    Currency NVARCHAR(10),

    JobDescription NVARCHAR(MAX),

    JobURL NVARCHAR(500),

    PostedDate DATE,

    CollectedDate DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Jobs_Companies
        FOREIGN KEY (CompanyID)
        REFERENCES Companies(CompanyID),

    CONSTRAINT FK_Jobs_Categories
        FOREIGN KEY (CategoryID)
        REFERENCES Categories(CategoryID),

    CONSTRAINT FK_Jobs_Locations
        FOREIGN KEY (LocationID)
        REFERENCES Locations(LocationID),

    CONSTRAINT FK_Jobs_ExperienceLevels
        FOREIGN KEY (ExperienceLevelID)
        REFERENCES ExperienceLevels(ExperienceLevelID),

    CONSTRAINT FK_Jobs_EmploymentTypes
        FOREIGN KEY (EmploymentTypeID)
        REFERENCES EmploymentTypes(EmploymentTypeID),

    CONSTRAINT FK_Jobs_WorkModes
        FOREIGN KEY (WorkModeID)
        REFERENCES WorkModes(WorkModeID),

    CONSTRAINT FK_Jobs_Sources
        FOREIGN KEY (SourceID)
        REFERENCES Sources(SourceID)
);

CREATE TABLE JobSkills
(
    JobID INT NOT NULL,

    SkillID INT NOT NULL,

    PRIMARY KEY(JobID, SkillID),

    CONSTRAINT FK_JobSkills_Jobs
        FOREIGN KEY(JobID)
        REFERENCES Jobs(JobID)
        ON DELETE CASCADE,

    CONSTRAINT FK_JobSkills_Skills
        FOREIGN KEY(SkillID)
        REFERENCES Skills(SkillID)
);

CREATE TABLE Users
(
    UserID INT IDENTITY(1,1) PRIMARY KEY,

    FullName NVARCHAR(150),

    Email NVARCHAR(255) UNIQUE,

    PasswordHash NVARCHAR(255),

    Role NVARCHAR(30) DEFAULT 'User',

    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE SavedJobs
(
    UserID INT,

    JobID INT,

    SavedAt DATETIME DEFAULT GETDATE(),

    PRIMARY KEY(UserID,JobID),

    FOREIGN KEY(UserID)
        REFERENCES Users(UserID),

    FOREIGN KEY(JobID)
        REFERENCES Jobs(JobID)
);

CREATE TABLE Newsletter
(
    SubscriberID INT IDENTITY(1,1) PRIMARY KEY,

    Email NVARCHAR(255) UNIQUE,

    SubscribedAt DATETIME DEFAULT GETDATE()
);