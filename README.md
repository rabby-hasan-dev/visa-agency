# Visa Application Management Portal (Professional Suite)

A high-performance, secure, and data-driven visa management system designed for administrative efficiency. This platform enables Administrators to manage Agents, and Agents to manage Clients while handling complex 12-step visa applications with integrated payments.

## 🏗 Project Architecture

- **[visa-app-server](file:///e:/Programming/RapidGrowIt/ClientWrokSpace/visa_application/visa-app-server)**: Robust Backend (Node.js, Express, Mongoose, TypeScript)
- **[visa-app-client](file:///e:/Programming/RapidGrowIt/ClientWrokSpace/visa_application/visa-app-client)**: Premium Frontend (Next.js 15, Redux Toolkit, Vanilla CSS / Tailwind)

## 🚀 Key Modules & Features

### 💳 Dynamic Payment & Fee Management
- **Multi-Gateway Support**: Securely switch between **Stripe** and **SSLCommerz** via the Super Admin panel.
- **Encrypted Credentials**: All payment gateway keys are stored with AES-256-CBC encryption.
- **Intelligent Fee Calculation**: Dynamic fee aggregation based on:
    - Visa Type base fees.
    - Country-specific surcharges.
    - Global administrative fees (Document processing, Agency fees, Express delivery).
- **Currency Identification**: Automatic currency detection and exchange rate application based on applicant country.

### 📊 Accounting & Business Intelligence
- **Real-time Analytics**: Admin dashboard with daily revenue trends, visa type distribution, and payment method popularity.
- **Audit-Ready Logs**: Comprehensive transaction logging for every payment initiation and webhook verification.

### 📄 Document & Application Processing
- **12-Step Smart Form**: Multi-step application with auto-save drafts and validation.
- **Automated Workflows**:
    - **PDF Generation**: Immediate application summary and receipt generation upon payment.
    - **Email Service**: Automated confirmation and document delivery to Agents and Clients.
- **Status Tracking**: Visual lifecycle management from `draft` to `issued`.

## 🛠 Tech Stack

- **Backend**: Express.js, TypeScript, Mongoose, Zod (Validation), JWT (Security), Puppeteer (PDFs), Nodemailer, AES-256 Encryption.
- **Frontend**: Next.js 15 App Router, Redux Toolkit (RTK Query), Tailwind CSS, Lucide Icons.
- **Infrastructure**: MongoDB, Cloudinary (for dynamic assets), Mailgun/Host SMTP.

## 🚀 Getting Started

### 1️⃣ Prerequisites

- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- Redis (Optional, for caching if enabled)

### 2️⃣ Quick Start

```bash
# Clone the repository
git clone <repo-url>

# Setup Backend
cd visa-app-server
npm install
cp .env.example .env
npm run dev

# Setup Frontend
cd ../visa-app-client
npm install
npm run dev
```

### 🔐 Admin Access
On the first run, a Super Admin user is automatically seeded.
- **Default Email**: `admin@example.com`
- **Default Password**: `admin123` (Configurable in `.env`)

## 📘 Documentation
- [Payment & Fee Flow](file:///e:/Programming/RapidGrowIt/ClientWrokSpace/visa_application/payment_process_flow.md)
- [API Documentation](file:///api-docs) (Swagger/Redoc if enabled)

---
*Built with precision for professional visa processing agencies.*
