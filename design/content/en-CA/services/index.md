---
title: "Platform Services"
description: "Enterprise-grade, cloud-native common capabilities and APIs built for rapid adoption across BC Government teams."
---

# Common Platform Services

> **Accelerate delivery with vetted, scalable, and decoupled shared capabilities.**

The Connect Platform provides a growing catalog of centrally managed, cloud-native shared services. Rather than spending months re-architecting boilerplate security, permissions, payments, and messaging layers for each ministry application, teams can integrate with our hardened infrastructure out of the box.

---

## 🚀 Available Services

Explore the shared capabilities available for immediate self-serve onboarding and integration:

### 🔐 [Fine-Grained Authorization (OpenFGA)](/services/openfga)
High-performance, relationship-based access control (ReBAC) built directly into the common platform. Offload complex permissions modeling, nested team hierarchies, and dynamic resource sharing to an ultra-low-latency authorization engine with zero account service coupling.

- **Status:** Available
- **Provisioning:** Self-serve via [hub.connect](https://hub.connect)
- **Documentation:** [View Service Guide & Specification](/services/openfga)

### 🌐 [API Gateway & Traffic Management (Apigee)](/services/apigee)
Enterprise API management and reverse proxy fronting all public and internal platform microservices (`api.connect.gov.bc.ca`). Inherit standard security policies, spike arrest, rate limiting, and decentralized product Cloud Logging sinks.

- **Status:** Available
- **Catalog:** [Explore Public Products](https://developer.connect.gov.bc.ca/en-CA/products)
- **Documentation:** [View Service Guide & Specification](/services/apigee)

### 👥 [Authentication & Team Account Management](/services/auth)
Multi-tenant organization and team account engine unifying BCSC, BCeID, and IDIR identities with multi-user team collaboration, default payment methods, and durable service ownership.

- **Status:** Available
- **Portal:** [Manage Accounts](https://account.bcregistry.gov.bc.ca)
- **Documentation:** [View Service Guide & Specification](/services/auth)

### 🧩 [Connect-Nuxt Framework & Layers](/services/connect-nuxt)
Shared frontend layer ecosystem unifying BC Government branding, 125+ accessible Nuxt UI components, Connect Pay fee widgets, and Canada Post address autocomplete.

- **Status:** Available
- **Repository:** [connect-nuxt on GitHub](https://codewiki.google/github.com/bcgov/connect-nuxt)
- **Documentation:** [View Service Guide & Specification](/services/connect-nuxt)

### 📊 [Data Warehouse & Financial Reconciliation](/services/data-warehouse)
Consolidates platform transactions and CAS general ledger feeds for Level 1 financial reconciliation, automated Apache Airflow pipelines, and `postgresql_anonymizer` PII screening.

- **Status:** Available
- **Orchestration:** Apache Airflow & PostgreSQL Anonymizer
- **Documentation:** [View Service Guide & Specification](/services/data-warehouse)

### 📄 [Developer OAS Registry](/services/developer-oas-registry)
GitOps OpenAPI contract registry powering `developer.connect.gov.bc.ca`—rendered with `@scalar/nuxt` with interactive testing and multi-language SDK snippets.

- **Status:** Available
- **Portal:** [Explore Developer Products](https://developer.connect.gov.bc.ca/en-CA/products)
- **Documentation:** [View Service Guide & Specification](/services/developer-oas-registry)

### 🚀 [DevOps CD (Common Continuous Deployment)](/services/devops-cd)
Reusable Continuous Deployment pipelines leveraging Google Cloud Build and shared GitHub Actions workflows to deploy frontends to Firebase and containerized microservices to Google Cloud Run.

- **Status:** Available
- **Workflows Repository:** [bcgov/bcros-common on GitHub](https://github.com/bcgov/bcros-common/tree/main/.github/workflows)
- **Documentation:** [View Service Guide & Specification](/services/devops-cd)

### 🧪 [DevOps CI (Continuous Integration & PR Previews)](/services/devops-ci)
Standardized CI quality pipelines chaining comprehensive linting, automated testing, buildability verification, and live interactive PR-based Firebase preview deployments.

- **Status:** Available
- **Workflows Repository:** [bcgov/bcros-common on GitHub](https://github.com/bcgov/bcros-common/tree/main/.github/workflows)
- **Documentation:** [View Service Guide & Specification](/services/devops-ci)

### 🛡️ [DevOps Image & Library Security Scanning](/services/devops-image-library-scanning)
Continuous, automated vulnerability scanning for Docker container images in Google Artifact Registry and open-source software libraries across Python, JavaScript, TypeScript, Go, and Rust.

- **Status:** Available
- **Workflows Repository:** [bcgov/bcros-common on GitHub](https://github.com/bcgov/bcros-common/tree/main/.github/workflows)
- **Documentation:** [View Service Guide & Specification](/services/devops-image-library-scanning)

### 📊 [DevOps Observability (Security Command Center, Logging & Tracing)](/services/devops-observability)
Unified operational telemetry and threat intelligence connecting Security Command Center, Cloud Logging, and Cloud Trace to empower SRE and product teams with proactive support and rapid root-cause diagnosis.

- **Status:** Available
- **SRE Operations:** 24/7 Platform Monitoring & Incident Response
- **Documentation:** [View Service Guide & Specification](/services/devops-observability)

### 📑 [Document Creation (Managed Gotenberg Service)](/services/document-creation)
High-performance managed PDF rendering and document conversion service powered by Gotenberg with pre-installed BC Government fonts (BC Sans) for converting HTML, Markdown, and Office documents into certified PDF/A records.

- **Status:** Available
- **Engine:** Managed Gotenberg on Google Cloud Run
- **Documentation:** [View Service Guide & Specification](/services/document-creation)

### 🧼 [Document Sanitization (Sandboxed Safe PDF Service)](/services/document-sanitization)
Zero-trust document disinfection engine inspired by Dangerzone. Converts untrusted Word, Excel, PowerPoint, and PDF files into guaranteed clean, exploit-free PDFs inside ephemeral sandboxes.

- **Status:** Available
- **Security Model:** Dangerzone Pixel-Isolation Sandboxing on Google Cloud Run
- **Documentation:** [View Service Guide & Specification](/services/document-sanitization)

### 🗄️ [Document Storage (Cloud Storage Virtual Filesystem & DigitalDocument API)](/services/document-storage)
Enterprise document management engine wrapping Google Cloud Storage into a hierarchical virtual filesystem organized by partner product namespaces and conforming to Schema.org/DigitalDocument metadata standards.

- **Status:** Available
- **Backend:** Google Cloud Storage & PostgreSQL Metadata Index
- **Repository:** [bcgov/bcros-common/document-service/doc-api](https://github.com/bcgov/bcros-common/tree/main/document-service/doc-api)
- **Documentation:** [View Service Guide & Specification](/services/document-storage)

### 📬 [Notify (Managed Email & Event-Driven Notification Service)](/services/notify)
Resilient multi-provider notification engine wrapping GC Notify and corporate SMTP with asynchronous Google Cloud Pub/Sub delivery and integrated Mailhog developer sandboxes.

- **Status:** Available
- **Providers:** GC Notify, Corporate SMTP, Mailhog (Dev/Test Sandbox)
- **Repository:** [bcgov/bcros-common/notify-service/notify-api](https://github.com/bcgov/bcros-common/tree/main/notify-service/notify-api)
- **Documentation:** [View Service Guide & Specification](/services/notify)

### 👥 [Organizational Change Management (OCM & Service Delivery Network)](/services/organizational-change-management)
Comprehensive change enablement practice connecting digital product squads with the Service BC Contact Centre and a province-wide network of 65+ physical service delivery offices.

- **Status:** Available
- **Reach:** Service BC Contact Centre & 65+ In-Person Service BC Centres
- **Documentation:** [View Service Guide & Specification](/services/organizational-change-management)

### 💳 [Pay (Full-Spectrum Provincial eCommerce & Revenue Engine)](/services/pay)
Enterprise eCommerce platform managing multi-segment SKU fee catalogs, line-item invoices, all Provincial Treasury payment rails (Direct Pay, PAD, BCOL, EFT, Online Banking, JV), automated CAS GL reconciliation, and revenue disbursements.

- **Status:** Available
- **Rails:** Direct Pay (Credit Card), PAD, BCOL, Online Banking, EFT, Journal Voucher (JV)
- **Repository:** [bcgov/sbc-pay](https://github.com/bcgov/sbc-pay)
- **Documentation:** [View Service Guide & Specification](/services/pay)

---






## 🛠️ Onboarding & Governance Principles

Every service in the Connect catalog adheres to core architectural principles:

1. **Common by Default:** Built to serve multi-tenant ministry and public sector applications without bespoke snowflake code.
2. **Decoupled Architecture:** Bring your own user identities, service accounts, or domain entities without rigid platform lock-in.
3. **Self-Serve Provisioning:** Manage your service instances, API keys, and environment-specific configs (`dev`, `test`, `prod`) through [`hub.connect`](https://hub.connect).
4. **Enterprise SRE & Security:** Centrally monitored 24/7 with continuous health checks, SLO tracking, and automated audit trails.

---

## 🧭 Next Steps

- Explore the [Fine-Grained Authorization (OpenFGA) Guide](/services/openfga) to learn how to model ReBAC permissions.
- Visit the [Technical Lead Overview](/technical) to review our base frontend and backend integration stack.
- Check the [Product Owner Hub](/product-owners) for onboarding roadmaps and delivery milestones.
