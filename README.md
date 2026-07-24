# TechPulse Egypt 🇪🇬

TechPulse Egypt is a Technology Job Market Intelligence Platform that collects, cleans, analyzes, and visualizes technology job opportunities in Egypt and across different locations.

The platform combines data engineering, business intelligence, automation, and web development to provide useful insights into technology jobs, companies, skills, locations, and job trends.

## 🎯 Project Goal

The main goal of TechPulse Egypt is to collect technology job market data from different sources, process and organize the data, and provide interactive insights that help users understand the technology job market.

## 🏗️ System Architecture

The project includes the following components:

### 1. Data Collection
- Python
- Web Scraping
- APIs
- Requests
- BeautifulSoup
- Selenium

### 2. Data Cleaning & Processing
- Python
- Pandas
- Data Cleaning
- Data Validation
- Deduplication
- Data Standardization

### 3. Data Storage
- Microsoft SQL Server
- Raw Data
- Cleaned Data
- Staging Data

### 4. Data Warehouse
The project uses a dimensional data warehouse containing:

- FactJobs
- FactJobSkills
- DimCompany
- DimLocation
- DimPlatform
- DimSkills
- DimDate

### 5. ETL
- SQL Server Integration Services (SSIS)
- Lookup Transformation
- Incremental Load
- Duplicate Prevention

SSIS was used to experiment with incremental loading by checking existing records before inserting new data.

### 6. Business Intelligence
- Power BI
- DAX
- Interactive Dashboards
- KPIs
- Data Quality Analysis
- Job Market Analysis

The dashboards provide insights into:

- Total Jobs
- Companies
- Platforms
- Locations
- Job Trends
- Skills
- Experience Levels
- Work Types
- Data Quality

### 7. Backend
- Node.js
- Express.js
- SQL Server
- REST APIs
- JWT Authentication

The backend provides APIs for:

- Jobs
- Companies
- Skills
- Salaries
- Locations
- Authentication
- User Management

### 8. Frontend
- React.js
- Tailwind CSS
- Responsive Web Design

The web application provides features such as:

- Job Listings
- Companies
- Skills
- Salaries
- Trends
- Dashboard
- User Authentication
- Admin Panel

### 9. Automation
Power Automate was used to automate the user registration welcome email process.

The implemented workflow is:

Microsoft Forms Registration  
→ Get Response Details  
→ Send Welcome Email

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Data Collection | Python, Requests, BeautifulSoup, Selenium |
| Data Processing | Python, Pandas |
| Database | Microsoft SQL Server |
| Data Warehouse | SQL Server |
| ETL | SSIS |
| Visualization | Power BI, DAX |
| Backend | Node.js, Express.js |
| Frontend | React.js, Tailwind CSS |
| Authentication | JWT |
| Automation | Power Automate |
| Tools | Git, GitHub, Postman, VS Code |

## 📊 Data Pipeline

Python Data Collection  
↓  
Data Cleaning & Transformation  
↓  
SQL Server  
↓  
Data Warehouse  
↓  
SSIS Incremental Load  
↓  
Power BI Dashboards

## ⚡ User Registration Automation

Microsoft Forms  
↓  
Power Automate  
↓  
Get Response Details  
↓  
Welcome Email

## 📈 Key Features

- Technology job data collection
- Data cleaning and transformation
- SQL Server data storage
- Dimensional Data Warehouse
- SSIS incremental loading
- Power BI interactive dashboards
- DAX-based KPIs
- Job market analytics
- RESTful Backend APIs
- JWT Authentication
- React Web Application
- Admin Panel
- Automated Welcome Emails

## 👩‍💻 Author

**Sara Elshenawy**

Business Information Systems (BIS) Graduate  
Data Analyst | Business Intelligence | Power BI | SQL | Python

## 📌 Project Status

The project is currently under development and includes data engineering, business intelligence, web application, and automation components.
