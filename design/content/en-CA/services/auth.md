---
title: "Authentication & Team Account Management"
description: "The multi-tenant organizational cornerstone of Connect eCommerce—unifying BCSC, BCeID, and IDIR identities with multi-user team collaboration, B2B API keys, default payment methods, and durable service access."
---

> **The organizational foundation of the Connect Platform. Unify federated identity providers, B2B API keys, multi-user team hierarchies, and centralized billing accounts into durable access across all provincial eCommerce services.**

![Authentication and Team Account Management Architecture](/img/services/auth-accounts-hero.svg)

---

## 🏛️ The Cornerstone of Connect eCommerce

In traditional government portals, user authentication is tied to a single username and password. If an employee leaves a firm or a project changes hands, access is lost, billing accounts become fragmented, and historic filings are stranded.

## 🎯 Value Proposition

* **Multi-Identity Ingress:** Log in with verified citizen identities (BCSC), corporate credentials (BCeID), or internal staff credentials (IDIR).
* **B2B Machine-to-Machine API Keys:** Accounts can generate dedicated API keys to connect legal practice software, accounting engines, and automated filing pipelines directly to provincial registries.
* **Multi-Account Portability:** A single user can create and belong to multiple organizational accounts (e.g., a personal citizen account, a law firm team account, and a non-profit society account) and switch between them instantly.
* **Durable Organizational Ownership:** Assets, corporate entities, filings, and audit records belong to the *Account/Team*, ensuring business continuity regardless of staff turnover.
* **Shared Financial Payment Profiles:** Teams configure a centralized default payment method (such as Pre-Authorized Debit or corporate credit card) so authorized members and B2B pipelines can execute filings without sharing card numbers.

```mermaid
flowchart TD
    subgraph Identities ["🔑 Multi-Identity & B2B Ingress"]
        I1["BC Services Card (BCSC)"]
        I2["BCeID (Business / Basic)"]
        I3["IDIR (Gov Staff)"]
        I4["B2B Account API Key"]
    end

    subgraph AuthCore ["🏛️ Connect Auth Engine (sbc-auth)"]
        Token["OIDC & SAML Broker"]
        Account["Team & Account Context"]
        Profile["Centralized Payment Profile"]
    end

    subgraph Registries ["🚀 Ministry Registries & Portals"]
        R1["Business Registry"]
        R2["Personal Property (PPR)"]
        R3["Short-Term Rental (STRR)"]
    end

    Identities --> Token
    Token --> Account
    Account --> Profile
    Profile --> Registries
```

---

## 🔑 Authentication Sources & Login Types

Connect natively brokers authentication across interactive British Columbia Government Identity Providers (IdPs) as well as automated B2B API gateway keys:

| Authentication Source | Target Persona | Protocol & Login Source | Description & Typical Use |
| :--- | :--- | :--- | :--- |
| **BC Services Card (BCSC)** | Citizens & Residents | OIDC (`login_source: BCSC`) | **High Assurance:** Mobile app authentication for identity verification, director verification, and personal filings. |
| **BCeID (Business & Basic)** | Companies, Law Firms, Non-Profits | OIDC / SAML (`login_source: BCEID`) | **Business Assurance:** Organizational login for corporate teams, commercial enterprises, and partner portals. |
| **IDIR** | Provincial Public Service Staff | OIDC / SAML (`login_source: IDIR`) | **Internal Staff:** Government employees, system administrators, registry examiners, and Service BC desk agents. |
| **Account API Key (`API_KEY`)** | B2B Systems & Software Integrations | HTTP Header (`login_source: API_GW`) | **Automated B2B:** Gateway-mediated machine-to-machine integrations executing programmatic filings against default payment methods. |

---

## 🤖 B2B Machine Integrations & Account API Keys

Modern enterprises and high-volume organizations (such as law firms, property management groups, and financial institutions) rely on programmatic system-to-system integrations rather than manual portal entry.

Connect accounts can generate **Account-Level API Keys** to power these automated B2B workflows:

```mermaid
sequenceDiagram
    autonumber
    participant B2B as B2B Client / Practice Software<br/>(e.g., Clio, ERP, Conveyancing)
    participant GW as API Gateway (Apigee)
    participant BPC as Backend Service<br/>(e.g., BPC Business Registry)
    participant Pay as Connect Pay Service

    Note over B2B,GW: B2B Request with Account API Key
    B2B->>GW: POST /business/api/v2/businesses<br/>Headers: x-apikey, Account-Id: 1999

    Note over GW: 1. Validate API Key & Account Entitlement<br/>2. Translate Key -> Mint Internal JWT<br/>3. Inject Claim: login_source = "API_GW"
    GW->>BPC: Forward Request with Mediated JWT<br/>Authorization: Bearer <internal_jwt><br/>Account-Id: 1999

    Note over BPC: Process Business Filing identically<br/>to interactive user sessions
    BPC->>Pay: Create Invoice / Settle Transaction<br/>Account-Id: 1999

    Note over Pay: Auto-charge configured Default Payment Type<br/>(e.g., Pre-Authorized Debit / Trust Account)
    Pay-->>BPC: Payment Settled (PAD Succeeded)
    BPC-->>GW: Filing Created & Approved
    GW-->>B2B: 201 Created (Transaction Complete)
```

### 1. Automated Default Payment Settlement
When a B2B integration submits a filing or executes a search, the transaction automatically draws down or charges against the account's configured **default payment method** (such as Pre-Authorized Debit [PAD] or a stored corporate card). There is zero human intervention or interactive checkout required.

### 2. Gateway Translation & JWT Mediation
To keep backend microservices (e.g., BPC / Business Registry, Pay, Personal Property Registry) lightweight and uniform:
* **The Gateway Translates the Key:** The API Gateway (Apigee) inspects the `x-apikey`, verifies its validity and account ownership, and translates the request into a standard signed **JWT**.
* **Standard `login_source: "API_GW"` Claim:** The generated JWT contains the account identity and sets `login_source` (or `login-source`) to `"API_GW"`.
* **Zero Backend Code Duplication:** Backend services do not need custom API key verification logic. They consume the standard bearer JWT exactly like interactive user sessions, ensuring identical authorization checks, schema validations, and audit logs.

---

## 👥 Multi-User Teams & Hierarchical Roles

Teams allow organizations to collaborate seamlessly with distinct permission tiers:

```mermaid
flowchart TD
    Account["Team Account: Pacific Legal LLP\n(Account ID: 1999)"]
    
    subgraph Roles["Team Permission Tiers"]
        Admin["👑 Account Admin\n• Manage Billing & Default Payment\n• Generate & Revoke B2B API Keys\n• Add / Remove Team Members\n• Subscribe to Services & Products"]
        Coord["⚙️ Coordinator\n• Invite Team Members\n• Submit Day-to-day Filings\n• View Operational Logs"]
        Member["👤 Team Member (User)\n• Perform Searches & Filings\n• Use Team Default Payment\n• Access Authorized Records"]
        B2BKey["🤖 B2B API Key (System Connector)\n• Programmatic System Filings\n• Mediated with login_source: API_GW\n• Auto-settles via Default Payment"]
    end

    Account --> Admin
    Account --> Coord
    Account --> Member
    Account --> B2BKey

    Admin --> Filings["Authorized Provincial Registries\n(Business, PPR, Wills, STRR, Site Registry)"]
    Coord --> Filings
    Member --> Filings
    B2BKey --> Filings
```

### Team Role Hierarchy

1. **Account Admin (Owner):** Full administrative control over the account profile, financial settings, billing statements, product subscriptions, API key provisioning, and user membership approvals.
2. **Coordinator:** Operational management permissions. Can invite new members, oversee active workflows, and execute statutory transactions.
3. **Team Member (User):** Execution rights. Can conduct searches, submit new filings, and utilize the account's default payment method without access to sensitive bank or billing configurations.
4. **B2B System Connector (API Key):** Programmatic execution rights for automated software pipelines, executing under the account's identity and default payment profile.

---

## 💳 Shared Payment Profiles & Consolidated Billing

A key benefit of the Team Account model is centralized payment management:

* **Default Payment Type:** The account administrator configures the team's default payment mechanism:
  * **Pre-Authorized Debit (PAD):** Automated bank withdrawals, preferred by high-volume law firms and enterprise teams.
  * **Credit Card:** Stored tokenized corporate credit card.
  * **Direct Pay / Online Banking:** Real-time transactional payments.
  * **BC Online (BCOL) Drawdown:** Legacy account drawdown bridge.
  * **Electronic Funds Transfer (EFT) / Electronic Journal Voucher (EJV):** Automated general ledger transfer for public sector partners and ministries.
* **Frictionless Checkout for Users & B2B APIs:** When Marcus (a junior paralegal) submits a filing via the web portal or Clio submits a filing via B2B API key, the transaction automatically bills to Pacific Legal LLP's PAD account.
* **Unified Statements & Audit Trail:** Monthly statements aggregate all transactions across all team members and B2B API connectors, categorized by filing type, date, user/source, and authorization key.

---

## 🏢 Common Team Personas & Real-World Use Cases

The Account/Team framework powers diverse multi-user sectors across British Columbia:

### ⚖️ Law Groups & Legal Practices
* **Scenario:** Law firms managing dozens of solicitors, articling students, paralegals, and automated legal practice software.
* **Value:** Centralized PAD trust account billing, automated B2B conveyance filings, corporate registry updates, Personal Property Registry (PPR) lien registrations, and Court Registry submissions.

### 📐 Engineering Firms & Land Surveyors
* **Scenario:** Geotechnical and civil engineering consultancies with rotating field teams and automated GIS search tools.
* **Value:** Team-wide access to contaminated Site Registry searches, Crown land applications, and automated environmental data lookups.

### 🏢 Property Management Companies & Developers
* **Scenario:** Real estate firms managing multiple commercial strata and residential rental portfolios.
* **Value:** Managing Short-Term Rental Registry (STRR) compliance, Rural Property Tax declarations, and automated annual corporate reports via B2B batch APIs.

### 🌲 Archaeology Organizations & Environmental Consultancies
* **Scenario:** Field researchers and cultural resource management firms.
* **Value:** Durable permission management for Heritage Conservation Act (HCA) permit applications and archaeological site database queries.

---

## 🛠️ Technical Integration & Header Verification

When building frontend or backend applications on the Connect Platform, identity, account, and gateway contexts are passed seamlessly via standard HTTP headers:

### 1. Interactive User Request (BCSC / BCeID / IDIR)
```http
GET /business/api/v2/businesses/BC1234567 HTTP/1.1
Host: api.connect.gov.bc.ca
x-apikey: YOUR_APIGEE_API_KEY
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIn...
Account-Id: 1999
Content-Type: application/json
```

### 2. B2B Machine Request (Account API Key)
```http
POST /business/api/v2/businesses/BC1234567/filings HTTP/1.1
Host: api.connect.gov.bc.ca
x-apikey: YOUR_ACCOUNT_API_KEY
Account-Id: 1999
Content-Type: application/json
```

### Upstream Verification Process
1. **Gateway Mediation:** Apigee validates the `x-apikey`. For B2B requests, it mints an internal JWT with `login_source: "API_GW"` and injects the verified `Account-Id`.
2. **Backend Validation:** Downstream microservices validate the bearer JWT signature against Keycloak JWKS and inspect claims:
   * Interactive users: `sub`, `login_source: "BCSC" | "BCEID" | "IDIR"`, verified via `/users/settings`.
   * B2B machine calls: `login_source: "API_GW"`, verified against account entitlements.
3. **Partitioned Data Isolation & Billing:** Mutations and searches are strictly scoped to the verified `Account-Id`, and fees are settled via the account's default payment method.

---

## 📚 Training Materials & Official Documentation

* **[`sbc-auth` Architecture & Systems Wiki](https://codewiki.google/github.com/bcgov/sbc-auth):** Deep-dive on database schemas, membership state machines, invitation tokens, and authorization endpoints.
* **[Connect Account Management Portal](https://account.bcregistry.gov.bc.ca):** Live web portal for managing organization accounts, teams, API keys, and payment profiles.
* **[Connect Developer Products Catalog](https://developer.connect.gov.bc.ca/en-CA/products):** API specifications for Auth, Pay, and Registries (`/auth/api/v1`).
* **[API Gateway (Apigee)](/services/apigee):** Review how API keys are translated into internal JWT tokens with `login_source: "API_GW"`.
* **[Fine-Grained Authorization (OpenFGA)](/services/openfga):** Learn how the platform combines account-level tenancy with fine-grained ReBAC authorization.

---

## 🤝 Need Support?

* **Teams Channel:** Join `#connect-dev-help` for team account integration guidance, B2B API key provisioning, and test user setup.
* **Account Onboarding:** Create test accounts in the development environment via [`dev.account.bcregistry.gov.bc.ca`](https://dev.account.bcregistry.gov.bc.ca).
