# RCMC Project — Task List

## Epic 1: Authentication
- [ ] **Login Page UI** — Build login form with username & password fields, validation, and RTL layout
- [ ] **Login API Integration** — Connect login form to real authentication API and handle token storage
- [ ] **Auth Guard** — Protect all routes behind authentication guard
- [ ] **Logout** — Clear token and redirect to login
- [ ] **Change Password Page** — Build change password form with validation

---

## Epic 2: Layout & Shell
- [ ] **App Shell / Main Layout** — Header + router outlet wrapper for authenticated pages
- [ ] **Header Component** — Logo, account dropdown (change password, logout), notification bell, separator
- [ ] **Theme Variables** — Centralize all colors, fonts, and spacing in `_variables.scss`
- [ ] **App Config** — Centralize logo paths, app name, and browser title in `app-config.ts`
- [ ] **RTL Support** — Ensure full right-to-left direction across all pages using `<html dir="rtl">`
- [ ] **Responsive Header** — Adapt header for mobile screens

---

## Epic 3: Customer Management
- [ ] **Dashboard / Search Box** — Search card with ID type dropdown, search input, بحث & اضافه عميل buttons
- [ ] **Search Results Page** — Table displaying filtered customers with view/edit actions
- [ ] **Add Customer Form** — Full form: ID type, ID number, birth date, names (×4), nationality, gender, phone (×2), preferred language, preferred contact channel, email, region, city
- [ ] **ID Verification** — تحقق button enabled only when ID type + ID number + birth date are filled; auto-fills remaining fields from API response
- [ ] **Add Customer API Integration** — Submit form data to backend API on اضافه button
- [ ] **Search API Integration** — Connect search to backend and pass query params to results page
- [ ] **Edit Customer** — Edit existing customer data (view pre-filled form)
- [ ] **View Customer** — Read-only customer profile page

---

## Epic 4: Core Infrastructure
- [ ] **Environment Files** — Separate `environment.ts` (dev) and `environment.prod.ts` (prod) with API URLs
- [ ] **HTTP Interceptor** — Attach Bearer token to all outgoing API requests
- [ ] **Error Handling** — Global HTTP error interceptor for 401/403/500 responses
- [ ] **Loading Indicator** — Show spinner during API calls
- [ ] **Auth Service** — `login()`, `logout()`, `getToken()`, `isLoggedIn()` methods

---

## Epic 5: Quality & Deployment
- [ ] **Unit Tests** — Cover services and guards with Jest/Karma
- [ ] **E2E Tests** — Cover login flow and customer add flow
- [ ] **Build for Production** — Verify `ng build --configuration=production` succeeds
- [ ] **Azure Pipeline** — Set up CI/CD pipeline for build and deploy
- [ ] **Environment Variables in Azure** — Configure API URLs via Azure App Settings
