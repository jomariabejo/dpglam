# Test Cases - Secure Web App with Authentication and File Storage

## Overview
This document outlines the required test cases for verifying the core functionalities of the web application. Testing will include file storage and retrieval, user authentication, middleware validation, role-based access control (RBAC), error handling, and security enhancements.

## Test Cases

### 1. File Storage and Retrieval
#### FS-01: Upload user profile image
- **Description:** Ensure that user can change their profile image
- **Test Steps:**
  1. Log in as a user.
  2. Navigate to the myprofile.
  3. Upload a valid file that is JPG, JPEG and PNG. 
- **Expected Result:** File should upload successfully.
- **Status:** ✅

#### FS-02: Upload invalid file type for user profile image
- **Description:** Ensure unsupported file types are rejected.
- **Test Steps:**
  1. Log in as a user.
  2. Navigate to the myprofile.
  3. Upload an unsupported file type.
- **Expected Result:** System should reject the file and show an error message.
- **Status:** ✅

#### FS-03: Retrieve your new profile image
- **Description:** Ensure uploaded file can be retrieved securely.
- **Test Steps:**
  1. Log in user using google oauth.
  2. Navigate to the login page.
  3. Click "LOGIN USING GOOGLE"
  4. Select email account
  5. Go to your myprofile
- **Expected Result:** User can view his/her profile image.
- **Status:** ✅

### 2. User Authentication
#### UA-01: Login with valid credentials
- **Description:** Ensure valid users can log in successfully.
- **Test Steps:**
  1. Navigate to the login page.
  2. Enter valid credentials.
  3. Click Login.
- **Expected Result:** User should be authenticated and redirected to the dashboard if the user role is admin, else to the my-order for the regular user(customer).
- **Status:** ✅

#### UA-02: Login with invalid credentials
- **Description:** Ensure incorrect credentials are rejected.
- **Test Steps:**
  1. Navigate to the login page.
  2. Enter incorrect credentials.
  3. Click Login.
- **Expected Result:** System should reject login and show an error message.
- **Status:** ✅

#### UA-03: Token expiration check
- **Description:** Ensure expired tokens prompt re-authentication.
- **Test Steps:**
  1. Log in as a user.
  2. Wait for token to expire.
  3. Attempt an API request.
- **Expected Result:** System should reject the request and prompt for re-authentication.
- **Status:** ✅

### 3. Middleware Validation and RBAC
#### RBAC-01: Access admin-only route as user
- **Description:** Ensure unauthorized users cannot access admin routes.
- **Test Steps:**
  1. Log in as a normal user.
  2. Attempt to access an admin-protected route.
- **Expected Result:** Request should be rejected with a 403 Forbidden response.
- **Status:** ✅

#### RBAC-02: Access user route with valid token
- **Description:** Ensure authorized users can access their routes.
- **Test Steps:**
  1. Log in as a user.
  2. Access a user-protected route.
- **Expected Result:** Request should be allowed.
- **Status:** ✅

### 4. Error Handling
#### EH-01: Invalid file upload
- **Description:** Ensure oversized or corrupted files are rejected.
- **Test Steps:**
  1. Upload a file exceeding the allowed size.
  2. Submit the request.
- **Expected Result:** System should return an error message and reject the upload.
- **Status:** ✅

#### EH-02: Access API without authentication
- **Description:** Ensure unauthorized API requests are rejected.
- **Test Steps:**
  1. Send a request to a protected API without a token.
- **Expected Result:** Request should be rejected with a 401 Unauthorized response.
- **Status:** ✅

### 5. Security Features
#### SEC-01: Helmet.js security headers
- **Description:** Ensure security headers are applied correctly.
- **Test Steps:**
  1. Inspect HTTP headers after an API request.
- **Expected Result:** Security headers (e.g., Content-Security-Policy, X-XSS-Protection) should be present.
- **Status:** ✅


## Test Results
Attached video recording of the test executions to document the results.

[https://drive.google.com/file/d/1Qya3XSG_XAfdVxPXSZ_jcy5_Lj5ACQve/view?usp=drive_link](https://drive.google.com/drive/folders/1YflMXZZMMMJDIa8G7xsURqnXib4VEHy1?usp=sharing)

## TODO's 03-10-2025 to 03-16-2025
- (Not required) Integrate ecommerce to a basic inventory management system
- (Need validation) Register new user

## Submission Checklist
- [x] GitHub Repository Link
- [x] Finalized Integration Plan
- [x] Testing Results (Video)
