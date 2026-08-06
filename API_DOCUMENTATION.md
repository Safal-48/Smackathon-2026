# 📖 REST API Reference & Documentation

This document provides a comprehensive list of all backend endpoints available in **KrishiSeva AI**.

All API routes are prefixed with `/api/v1`.

---

## 🔒 Authentication Headers

Protected routes require a JSON Web Token (JWT) sent in the HTTP `Authorization` header:

```http
Authorization: Bearer <your_jwt_token_here>
```

---

## 🔐 Authentication Module

### 1. Register User
* **Endpoint**: `POST /auth/register`
* **Access**: Public
* **Request Body**:
```json
{
  "fullName": "Safal Sharma",
  "phone": "9876543210",
  "password": "farmerpassword123",
  "state": "Maharashtra",
  "district": "Nagpur",
  "preferredLanguage": "hi",
  "farmSizeAcres": 3.5
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64d2b270fd329c0012ab1234",
    "fullName": "Safal Sharma",
    "phone": "9876543210",
    "role": "farmer",
    "state": "Maharashtra",
    "district": "Nagpur",
    "preferredLanguage": "hi",
    "farmSizeAcres": 3.5,
    "createdAt": "2026-08-06T14:10:00.000Z"
  }
}
```

### 2. Login User
* **Endpoint**: `POST /auth/login`
* **Access**: Public
* **Request Body**:
```json
{
  "phone": "9876543210",
  "password": "farmerpassword123"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64d2b270fd329c0012ab1234",
    "fullName": "Safal Sharma",
    "phone": "9876543210",
    "role": "farmer",
    "state": "Maharashtra",
    "district": "Nagpur",
    "preferredLanguage": "hi",
    "farmSizeAcres": 3.5
  }
}
```

### 3. Get User Profile
* **Endpoint**: `GET /auth/profile`
* **Access**: Protected (JWT required)
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "_id": "64d2b270fd329c0012ab1234",
    "fullName": "Safal Sharma",
    "phone": "9876543210",
    "role": "farmer",
    "state": "Maharashtra",
    "district": "Nagpur",
    "preferredLanguage": "hi",
    "farmSizeAcres": 3.5
  }
}
```

---

## 🧪 Soil Analysis Module

### 1. Analyze Soil Quality
* **Endpoint**: `POST /soil/analyze`
* **Access**: Optional JWT (If JWT is provided, the report is saved to the user's database history)
* **Request Body**:
```json
{
  "nitrogen": 65,
  "phosphorus": 32,
  "potassium": 45,
  "pH": 6.8,
  "moisture": 48,
  "organicCarbon": 0.72,
  "soilType": "Black Cotton",
  "locationName": "North Field Plot #1",
  "soilImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "report": {
    "_id": "64d2b2c1fd329c0012ab4567",
    "farmerId": "64d2b270fd329c0012ab1234",
    "nitrogen": 65,
    "phosphorus": 32,
    "potassium": 45,
    "pH": 6.8,
    "moisture": 48,
    "organicCarbon": 0.72,
    "soilHealthScore": 88,
    "healthStatus": "Optimal",
    "fertilityReport": {
      "nitrogenLevel": "Sufficient",
      "phosphorusLevel": "Moderate",
      "potassiumLevel": "Sufficient",
      "organicCarbonLevel": "High",
      "pHStatus": "Optimal Neutral",
      "summary": "Your soil exhibits an excellent balance of primary macronutrients and optimal pH."
    },
    "recommendedCrops": [
      {
        "name": "Cotton",
        "suitabilityScore": 92,
        "expectedYield": "12-15 Quintals/Acre",
        "season": "Kharif",
        "reason": "Highly suitable for deep black soils with rich organic matter."
      }
    ],
    "recommendedFertilizers": [
      {
        "name": "Urea",
        "dosage": "45 kg/Acre",
        "timing": "Basal application at sowing, followed by top dressing at 30 days."
      }
    ],
    "irrigationAdvice": {
      "frequency": "Every 10-12 days depending on rainfall",
      "method": "Drip Irrigation recommended",
      "waterVolumePerAcre": "12,000 Litres per cycle",
      "moistureManagement": "Maintain moisture levels above 40% during flowering stage."
    },
    "soilImprovementTips": [
      "Incorporate green manure like dhaincha during pre-monsoon.",
      "Apply well-decomposed FYM (Farmyard Manure) to maintain structure."
    ],
    "createdAt": "2026-08-06T14:12:00.000Z"
  }
}
```

### 2. Get Soil Report History
* **Endpoint**: `GET /soil/history`
* **Access**: Protected (JWT required)
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "reports": [
    {
      "_id": "64d2b2c1fd329c0012ab4567",
      "nitrogen": 65,
      "phosphorus": 32,
      "potassium": 45,
      "pH": 6.8,
      "soilHealthScore": 88,
      "healthStatus": "Optimal",
      "locationName": "North Field Plot #1",
      "createdAt": "2026-08-06T14:12:00.000Z"
    }
  ]
}
```

---

## 🏛️ Government Schemes Module

### 1. Get Schemes List
* **Endpoint**: `GET /schemes`
* **Access**: Public
* **Query Parameters**:
  - `state` (Optional)
  - `district` (Optional)
  - `crop` (Optional)
  - `landSize` (Optional)
  - `category` (Optional)
  - `search` (Optional, queries scheme titles and descriptions)
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "schemes": [
    {
      "_id": "64d2b380fd329c0012ab7890",
      "code": "PM-KISAN",
      "title": {
        "en": "Pradhan Mantri Kisan Samman Nidhi",
        "hi": "प्रधानमंत्री किसान सम्मान निधि",
        "mr": "पंतप्रधान किसान सन्मान निधी"
      },
      "benefits": {
        "en": "₹6,000 per year in three equal installments",
        "hi": "₹6,000 प्रति वर्ष, तीन समान किस्तों में",
        "mr": "दरवर्षी ₹६,०००, तीन समान हप्त्यांमध्ये"
      },
      "eligibility": {
        "maxLandSizeAcres": 5,
        "farmerCategories": ["small", "marginal"]
      },
      "deadline": "2026-12-31T23:59:59.000Z"
    }
  ]
}
```

### 2. Apply for a Scheme
* **Endpoint**: `POST /schemes/apply`
* **Access**: Protected (JWT required)
* **Request Body**:
```json
{
  "schemeId": "64d2b380fd329c0012ab7890",
  "farmerNotes": "Applying for the seed subsidy support for Rabi wheat sowing."
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "application": {
    "_id": "64d2b3c0fd329c0012ab9999",
    "farmerId": "64d2b270fd329c0012ab1234",
    "schemeId": "64d2b380fd329c0012ab7890",
    "farmerNotes": "Applying for the seed subsidy support for Rabi wheat sowing.",
    "status": "submitted",
    "createdAt": "2026-08-06T14:15:00.000Z"
  }
}
```

### 3. AI Chat Assistant Response
* **Endpoint**: `POST /schemes/chat`
* **Access**: Public
* **Request Body**:
```json
{
  "prompt": "How do I correct acidic soil with pH 5.5?",
  "language": "en",
  "imageBase64": "data:image/jpeg;base64,..."
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "response": "To correct an acidic soil with a pH of 5.5, apply agricultural lime (calcium carbonate). Lime raises soil pH and supplies vital calcium. It is recommended to perform a soil buffer test to calculate precise application rates per acre."
}
```

---

## 🔔 Notifications Module

### 1. Get My Notifications
* **Endpoint**: `GET /notifications`
* **Access**: Protected (JWT required)
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 2,
  "unreadCount": 1,
  "notifications": [
    {
      "_id": "64d2b4f1fd329c0012abaaaa",
      "userId": "64d2b270fd329c0012ab1234",
      "type": "weather",
      "title": "Severe Rain Alert",
      "message": "Heavy rainfall expected in Nagpur district tomorrow. Postpone sprayings.",
      "isRead": false,
      "actionUrl": "/",
      "createdAt": "2026-08-06T13:00:00.000Z"
    }
  ]
}
```

---

## 👑 Admin Control Panel

### 1. Get Dashboard Analytics
* **Endpoint**: `GET /admin/analytics`
* **Access**: Admin (JWT + Admin Role required)
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "stats": {
    "totalFarmers": 142,
    "totalSoilTests": 94,
    "totalActiveSchemes": 8,
    "totalApplications": 32,
    "avgSoilHealth": 81.4
  }
}
```

### 2. Broadcast System Notification
* **Endpoint**: `POST /admin/broadcast`
* **Access**: Admin (JWT + Admin Role required)
* **Request Body**:
```json
{
  "title": "KCC Card Verification Notice",
  "message": "Verify your KCC card at the nearest Krishi Kendra before August 31st.",
  "type": "scheme",
  "actionUrl": "/schemes"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Broadcast sent to 142 users",
  "recipientCount": 142
}
```
