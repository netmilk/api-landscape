# API Landscape Conventions

### Rule \#1: The only source of truth about API design is the API itslef

API Specifcation is always deployed to the server with the code and MUST be exposed in the conventional endpoinds:

```
/openapi.json
/discover/spec/openapi.json
```

### Rule \#2: Never, ever hardcode URLs, hosts and ports in server or client



* Clients resolve API Endpoints from Environment Variables or from the Environment Discovery Hub
  * Why? If you hardcode, you can't mock dependencies locally, or in the CI Builds.
* Servers host are configured from Environment Variables
  * Why? If you hardcode you can't reuse, do immutable deployments where the host isn't known until deployed. 

Set them in the build or deployment

### Rule \#3: Provide lifecycle name and metadata in the API Specification

### Rule \#4: API Discovery Hub is a list of URLs linking to API entrypoints

Discovery

Environment Variables

API Specification Lifecycle Metadata

User Agent header format

Semver 2.0

package.json extension

Key concepts

Environment virtualization

