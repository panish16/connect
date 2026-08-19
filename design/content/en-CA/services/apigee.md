---
title: "API Gateway (Apigee)"
description: "Enterprise API management, security policies, rate limiting, and separated product telemetry powering api.connect.gov.bc.ca."
---

> **Secure, monitor, and scale all platform APIs through a centralized, hardened Google Cloud Apigee gateway with decentralized telemetry for engineering teams.**

![Apigee API Gateway Architecture](/img/services/apigee-hero.svg)

---

## 🌐 What is Apigee?

**[Google Cloud Apigee](https://cloud.google.com/apigee/docs)** is an enterprise-grade API management and gateway platform. It acts as the front door for all HTTP/REST and microservice communications across the Connect Platform.

Instead of each backend microservice implementing its own rate limiting, TLS termination, API key validation, CORS handling, and telemetry pipelines, Apigee standardizes these concerns at the network edge.

## 🎯 Value Proposition

* **Security & Access Control:** Mandatory API key validation (`x-apikey`), OAuth2 / OIDC token mediation, and IP-based access rules.
* **B2B Key Translation & JWT Mediation:** When external partners and B2B systems call with an account `API_KEY`, Apigee translates the key and mints a standardized internal JWT with `login_source: "API_GW"`. Downstream microservices (such as BPC and Registries) process B2B requests identically to interactive sessions while automatically settling fees against the account's default payment method.
* **Traffic Protection:** Spike arrest policies, burst mitigation, and per-client quota enforcement to protect downstream databases and services from traffic surges.
* **Protocol & Edge Routing:** Unified SSL/TLS termination, automated CORS preflight responses, and path-based routing to backend Cloud Run microservices.
* **Standardized Errors:** Standardized RFC 7807 problem details error schemas across all platform endpoints.

```mermaid
flowchart TD
    Req["🌐 Incoming API Request (api.connect.gov.bc.ca)"] --> Apigee["🏛️ Apigee Gateway Ingress"]
    
    subgraph Policies ["⚡ Apigee Policy Pipeline"]
        P1["Verify API Key / B2B Translation"]
        P2["Spike Arrest & Rate Quotas"]
        P3["Cloud Logging Message Routing"]
    end

    subgraph Backends ["🚀 Cloud Run Microservices"]
        B1["Pay API"]
        B2["Auth API"]
        B3["Business Registry API"]
    end

    Apigee --> Policies
    Policies --> Backends
```

---

## 🏛️ How the Connect Platform Uses Apigee

All public and internal platform microservices are fronted by Apigee under the unified domain:

[api.connect.gov.bc.ca](https://api.connect.gov.bc.ca)

### Public API Products Catalog
The Connect Platform publishes a rich suite of APIs for ministry programs, business partners, and internal applications. Explore the full catalog of live API products on the **[Connect Developer Portal](https://developer.connect.gov.bc.ca/en-CA/products)**:

* **[Auth & Account API](/services/apigee#auth-api):** Manage user accounts, organization memberships, settings, and team authorizations (`/auth/api/v1`).
* **[Pay API](/services/apigee#pay-api):** Multi-channel payment requests, invoice generation, refunds, and daily EJV/CAS reconciliation (`/pay/api/v1`).
* **[Business Registry API:](https://developer.connect.gov.bc.ca/en-CA/products)** Query corporate registries, business filings, societies, and cooperatives (`/business/api/v2`).
* **[Document Generation API:](https://developer.connect.gov.bc.ca/en-CA/products)** Asynchronous PDF generation, official seal rendering, and document vault storage (`/doc/api/v1`).
* **[Registry Search API:](https://developer.connect.gov.bc.ca/en-CA/products)** High-speed indexing and fuzzy matching across provincial filings (`/search/api/v1`).

---

## 📡 Separated Telemetry & Cloud Logging Access

A major architectural advantage of our Apigee deployment is **decentralized, product-scoped observability**.

```mermaid
flowchart TD
    Req["Incoming API Request\n(api.connect.gov.bc.ca)"] --> Apigee["Apigee Gateway Ingress"]
    
    subgraph ApigeePolicies["Apigee Policy Pipeline"]
        P1["Verify API Key (x-apikey)"]
        P2["Spike Arrest & Quotas"]
        P3["Emit Structured Access Log"]
    end

    Apigee --> ApigeePolicies
    ApigeePolicies --> Backend["Cloud Run Microservice\n(e.g., Pay, Auth, Business)"]
    
    subgraph Sinks["Decentralized Cloud Logging Sinks"]
        L1["Pay Project Cloud Logging\n(gtksf3-dev: pay-logs)"]
        L2["Auth Project Cloud Logging\n(gtksf3-dev: auth-logs)"]
        L3["Business Project Cloud Logging\n(gtksf3-dev: business-logs)"]
    end

    P3 -.->|Filtered by Product Route| Sinks
    Backend -.-> Res["HTTP Response to Client"]
```

### Dedicated Product Log Sinks
Rather than dumping all gateway telemetry into a single monolithic, locked-down security bucket, Apigee utilizes **MessageLogging policies** combined with **Google Cloud Log Routers** to stream structured logs into dedicated GCP project log sinks:

1. **Autonomous Developer Access:** Engineering teams have direct, granular access to their service's live request/response logs in Google Cloud Logging (Logs Explorer) without requiring global Apigee administrative permissions.
2. **Zero Cross-Product Noise:** The Pay engineering team only sees traffic and latency logs for `/pay/**`; the Auth team only sees logs for `/auth/**`.
3. **Custom Alerting & SLOs:** Teams can build their own Cloud Monitoring alert policies, error budget trackers, and Log-based Metrics directly inside their respective product GCP projects.
4. **Structured Payload Telemetry:** Gateway log entries include standardized metadata:
   * Client IP (masked for PII compliance)
   * Target Route & Proxy Name
   * HTTP Status Code & Latency Breakdown (Gateway Latency vs Backend Latency)
   * API Key Identity & Client Account ID
   * Correlation ID (`x-correlation-id`) for end-to-end distributed tracing

---

## 🏁 Developer Integration Quick-Start

### Step 1: Discover API Products
Browse the available APIs, schemas, and endpoint specifications on the **[Connect Developer Products Catalog](https://developer.connect.gov.bc.ca/en-CA/products)**.

### Step 2: Obtain API Credentials
Submit an application onboarding request through [`hub.connect`](https://hub.connect) to receive:
* **API Key (`x-apikey`):** Required in the HTTP headers of all API calls.
* **OIDC Client ID & Secret:** Required if your service authenticates users via BCSC, BCeID, or IDIR.

### Step 3: Making an API Request
All requests sent to the platform must include your assigned `x-apikey` and (when calling user-scoped endpoints) a valid bearer JWT:

```http
GET /pay/api/v1/payment-requests/10982 HTTP/1.1
Host: api.connect.gov.bc.ca
x-apikey: YOUR_APIGEE_API_KEY
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIn...
Account-Id: 1999
Content-Type: application/json
```

### Step 4: Environment Matrix
Apigee endpoints are available across all delivery tiers:

| Environment | Hostname | Use Case |
| :--- | :--- | :--- |
| **Dev** | `https://dev.api.connect.gov.bc.ca` | Active feature development and mock integrations |
| **Test** | `https://test.api.connect.gov.bc.ca` | QA, end-to-end validation, and automated test pipelines |
| **Sandbox** | `https://sandbox.api.connect.gov.bc.ca` | Partner integration sandboxing and public testing |
| **Prod** | `https://api.connect.gov.bc.ca` | High-availability production runtime |

---

## 📚 Training Materials & Official Documentation

* **[Connect Developer Products Catalog](https://developer.connect.gov.bc.ca/en-CA/products):** Official directory of public APIs, data models, and interactive API documentation.
* **[Authentication & Team Account Management](/services/auth):** Learn how accounts create B2B API keys and configure default payment types.
* **[Google Cloud Apigee Documentation](https://cloud.google.com/apigee/docs):** Official guide to Apigee architecture, proxy development, policies, and analytics.
* **[Google Cloud Logging Overview](https://cloud.google.com/logging/docs):** Guide to querying logs with Logs Explorer, setting up Log Sinks, and creating log-based metrics.
* **[Connect SRE & Observability Standards](/sre):** Review our platform SLOs, uptime targets, and error budgeting frameworks.
* **[Technical Lead Overview](/technical):** Review base frontend and backend integration stack architectures.


---

## 🤝 Need Support?

* **Teams Channel:** Join `#connect-dev-help` for real-time gateway troubleshooting and API key inquiries.
* **Developer Portal:** Visit [developer.connect.gov.bc.ca](https://developer.connect.gov.bc.ca/en-CA/products) for OpenAPI specs and sandbox keys.
