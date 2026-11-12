# AI Usage Log

This log records AI assistance used while assembling the project. Review each entry and be prepared to explain or modify the resulting code.

## 1. Project structure

- **Goal:** Organize the CRM into the required five pages and shared JavaScript modules.
- **Prompt:** "Create a Vanilla JavaScript project structure for a 10X CRM with login, signup, dashboard, clients, profile, shared storage, auth guard, and API modules."
- **Tool:** ChatGPT.
- **Result:** Used. The project separates shared storage, authentication checks, and API functions from page-specific scripts.
- **What I learned:** Shared modules reduce duplicated logic and make page behavior easier to maintain.

## 2. Authentication and validation

- **Goal:** Implement sign-up and login rules from the project specification.
- **Prompt:** "Implement client-side signup validation for name, email uniqueness, password length, letter and number requirements, and password confirmation. Store users and session using the required localStorage keys."
- **Tool:** ChatGPT.
- **Result:** Used and reviewed. Validation errors are shown next to the relevant fields.
- **What I learned:** `preventDefault()` stops the browser's default form submission, while `some()` and `find()` help check stored users.

## 3. DummyJSON integration

- **Goal:** Load sample clients and demonstrate POST and DELETE requests.
- **Prompt:** "Write async/await functions that load DummyJSON users, map them to CRM client objects, and add or delete a user through the demo endpoints."
- **Tool:** ChatGPT.
- **Result:** Used. The local client array is saved after changes because DummyJSON simulates write operations.
- **What I learned:** A successful demo API response does not necessarily mean data is permanently stored on the remote server.

## 4. Client filtering and sorting

- **Goal:** Combine search, status filters, and sort options without mutating the original list.
- **Prompt:** "Create one get-visible-clients style function that copies the array, applies status filtering, text search, and sorting."
- **Tool:** ChatGPT.
- **Result:** Used. `visibleClients()` starts with a spread copy and then applies the selected controls.
- **What I learned:** Sorting a copied array prevents accidental changes to the source state.

## 5. Critical review and improvement

- **Goal:** Check the security and persistence assumptions of a frontend-only CRM.
- **Prompt:** "Review a localStorage-only CRM design and identify important limitations for a real production application."
- **Tool:** ChatGPT.
- **Result:** Used as a warning, not as production architecture. The README explicitly explains that plain-text localStorage passwords are unsafe and that a backend is required for production.
- **What I learned:** Browser storage is useful for a learning demo, but it cannot provide secure authentication or shared multi-user data storage.
