# API Landscape Building Blocks

### Environment

Runtime

* Local
* CI/CD
* Platform
  * Serveless Lambdas
  * ZEIT Now Docker
  * Kong
  * Kuberrnetes 
  * EC2
  * Lambda
  * Tonicdev etc...

### Environment Discovery Hub

* Exports a list of HTTP API Entrypoints from an Environment

### Service

* Provides a Design - implements the Server
* Consumes a Design - imlements the Client
* If provides it's an API Server listening on a host
* If consumes it's an API Client connecting to a URL of an API Endpoint

### Service Release

* Available for deployment in a set of environments

### Service Deployment

* A controlled deployment in a known e

### API Design

Interface Design

* Exports a compiled API Specification document to be Provided or Consumed by a Service

### Design Versions

* SemVer
* Dist tags

SemVer

### Catalog / Search Engine

Catalog

### Design

### Design Library

* backed by package registries or VCS systems

### Interaction Design

* scenario 
* workflow
* tutorial

* Even real world events and steps not achievable through the non-machine friendly interfaces

### Traffic

### Traffic Validation

---

Perspective, user rights, persona, role, visibility

