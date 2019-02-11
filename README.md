# Continuous API Landscaping - Research Project

The deliverable of this project is a generic, implementation agnostic, reusable template for the opinionated API development and lifecycle stack to support contract testing and validation of a single service in Continuous Integration and the Continuous Delivery pipeline into a cloud platform deployment target with a preference of serverless platforms. This document doesn't articulate the disadvantages of this approach and assumes the reader understands those. For the purpose of the research project, authentication and authorization a well as production security issues were omitted.

The research is delivered as:
* Remote live coding demo (recording available)
* Convenience [Yarn workspace Github repository linking](https://github.com/netmilk/walking-skeleton-workspace):
  * [autonomous Building Blocks of the automated Example API Landscape](https://github.com/netmilk/api-landscape/#components)
  * [the experimental implementation of the API Landscaping Tools Stack](https://github.com/netmilk/api-landscape)
* This document explaining the used architectural patterns, concepts, and workflows

## Introduction to API Landscaping

API Landscaping is a sustainable, decentralized, vendor-neutral and fully automated way of building, organizing and changing a massive amount of APIs and client-server integrations across multiple different teams and organizations in very distributed environments. 

Understanding and visibility of the big picture of the API Landscape help you to **know the exact price and risk of making changes** in the API Environments. API Landscape is the safe and solid ground for Autonomous APIs and self-driving API Clients. API Landscape framework is a set of simple [building blocks](https://github.com/netmilk/api-landscape#the-topology-of-api-landscapes), [conventions](https://github.com/netmilk/api-landscape#api-landscaping-conventions), [workflows](https://github.com/netmilk/api-landscape#workflows-for-independent-api-design-lifecycle), and a stack of integrated tools that enable:

* Vendor and programming language independence of the entire API Landscape
* Cross-organizational contract-driven collaboration on API Design
* Contract-driven API server and client development and validation
* API Design First - ideation, release management, change management and upfront API Design advertisement
* API Server, API Client, API Design Lifecycle orchestration
* Service Environment Virtualization and advanced API Simulations
* API Dependency tracking and management - a safety net for advanced architectural styles
* Design-time and Runtime API Discovery for both humans and machines
* DevOps &  Full Infrastructure Automation
* Decentralized API Landscape governance
* Continuous Integration and Delivery for every Building Block of the API Landscape

Understanding of the API Landscape Patterns and diligent following the API Landscape Conventions is the shield against **the risk of building a distributed monolith**.

## The Topology of API Landscapes

### Essential building-blocks of the API Landscape:

#### API Design

API Design component is **the contract** between API Providers and Consumers used for the contract-driven development and validation of API Services. It has an **independent lifecycle** on the API Service implementation and it is both human and machine readable. The API Design can be created collaboratively across the boundaries of organizations. In Automated API Landscapes API Service components subscribe to the API Design component programmaticaly and it is used for automated contract testing in the CI/CD pipeline of the API Service components.

API Design component can contain:
* API Documentation 
* API Specification 
* API Interaction Design
* API Traffic Fixtures

API Design is agnostic to:
* API Service (API Design provider or consumer implementation, language, vendor)
* API Environment (no specific hosts, schemes, servers whatsoever)

#### API Service

API Service Component is the component implementing the _API Server_ **providing** API Design and/or the _API Client_ **consuming** API Design deployed and running in an [API Environment](#api-environment-component) sending and receiving [API Traffic](#api-traffic). API Service in the API Landscape context can be an agent Released for unorchestrated Deployment to unpredictable hosts in API Environments outside of the boundaries of the observable API Landscape. Even an SDK or a Client integration can be an API Landscape Service Component – even though it isn't providing an API.

Examples fo API Client Consuming API Design: SDKs, Web Frontends, Mobile Apps, API Gateways, API Integrations, API Aggregators, Mashups and Transformations

Examples of API Servers Providing API Design: HTTP servers, Web applications

#### API Environment

The API Environment Component knows the [URL hosts](https://nodejs.org/api/url.html#url_url_host) of the [API Service Component](#api-service-component) Instances Providing API Designs and makes their API Entrypoints discoverable for the API Service Components configuration.

**Examples of exportable API Environments:**

* Local Development Environments: Dotenv, IDEs \(e.g. Visual Studio Code\)
* CI/CD: Jenkins / Hudson. Circle CI, Travis CI
* PaaS And FaaS: Serveless Lambdas, ZEIT Now, Platform.sh, Kuberrnetes, AWS EC2, OpenShift, AWS Lambda, Tonicdev, Heroku
* API Management Systems: Kong, AWS API Gateway, Mashery, Apigiee, Oracle API Platform
* DevOps Environment Management Systems: Hashicorp Consul, Foreman, Puppet, Chef
* Massively Distributed: Web Browsers, Applications on Mobile Devices, Desktop Applications, IoT devices

#### API Traffic

The API Traffic is a set of sent, received, logged, intercepted, modeled or simulated messages exchanged between two and more [API Service](#api-service) Instances in or between [API Environments](#api-environment). The API Traffic can be serialized and stored locally or sent to the log storage systems, e.g. Logstash.

Examples: VCR, HAR, SAZ, Elastic Beats Packetbeat format, API Elements Transaction, API Blueprint Request and Response Examples, Postman Collection, Swagger and OpenAPI Response examples, Insomnia Requests

### Derived API Landscape components

#### API Environment Discovery Hub

API Service component implementing an API endpoint returning a list of URLs linking to:

* the API Entrypoints in the API Environment following API Landscape conventions
* another API Environment Discovery Hub

#### API Design Catalog

A searchable catalog of API Design Components available in the API Landscape agnostic to the API Environment.

Examples: SwaggerHub, Stoplight, Apiary, NPM.js, Libraries.io, Github

#### API Landscape Discovery Points

API Landscape Service exposing or having access to the API Landscape always from a perspective of a persona (identity) – presenting or uncovering the  API Landscape components observable for the persona in one place:

* The available API Designs, their versions and lifecycle metadata
* The available API Services, and their versions and lifecycle metadata
* The available API Environments running the deployed API Service instances
* The API Traffic between Service components

Examples: Developer Portals, Postman, Paw, Insomnia, API Management Administration Interfaces, Apigee Console, Apiary Console, Wireshark, Chrome Developer Tools, Elastic Beats Packetbeat, Programmable Web

## API Landscaping Conventions

### Single Source of Truth

Put API metadata into the runtime. The only source of truth for the API Design of an API should be the running API itself. The API should advertise its own design. Use conventional API Discovery Endpoint and expose the API Design in-API.

API Design is always deployed to the API Environment as a part of the API Service with the provider and MUST be exposed in the conventional endpoinds of the API. Example:

```
/openapi.json
/discover/spec/openapi.json
```

Use the Service's advertised API Design metadata to **test its own interface**.

### Isolation

Never, ever hardcode URL hosts and ports in servers or clients (in the API Service implementation). Always inject the dependencies of the API Service components on the surrounding environment via Environment Variables. **Don't build a distributed monolith**, mock API Design of API Services you depend on locally, in CI/CD and in all other Deployment Environments.

Use conventional Environment Variables Names in all API Environments across the entire API Landscape.  
Example:

```
[CONSTANT_CASE_API_DESIGN_NAME]_API_HOST
PUBLIC_API_DESIGN_API_HOST=localhost:3000
BACKEND_API_DESIGN_API_HOST=api.acme.com
```

### Subscription to the API Design Lifecycle

The API Service Component MUST subscribe to the API Design Lifecycle. Make a specific **immutable** version of the API Design a develpment dependency of the API Service component. Humans subscribe to the API Documentation, robots subscribe to the machine-readable API Specification in the API Design Component.

Use **bots** to listen to the API lifecycle events and let them open pull-requests with new versions of the API Designs.

Track dependencies on the 3rd party APIs, reverse engineer their API Design Components for them and monitor them for change. Build relations with the 3rd party APIs owners and make them claim the API Design Component you're maintaining for them.

### Lifecycle Metadata in Runtime

The API Service **providing** API Design SHOULD contain metadata about its own lifecycle

* API Design Name - MUST be unique in the API Landscape, consider name-spacing
* API Design Version
* Link to the VCS Repository for collaboration and contributions
* Link to the API Design Catalog
* Link to Changelog

Example:

```
{
  "swagger": "2.0",
  "info": {
    "version": "0.0.1",
    "title": "Public Persons and Companies API",
    "description": "A simple API to demonstrate API Landscape lifecycle",
    "x-lifecycle": {
      "name": "public-api-design",
      "vcs": "git+ssh://git@github.com:netmilk/public-api-design.git",
      "catalog": "https://www.npmjs.com/package/public-api-design",
      "changelog": "https://github.com/netmilk/public-api-design/releases"
    }
  },
...
```

In massively distributed API landscapes, the API Service **consuming** API Design SHOULD send the API Design version it's subscribed to in request headers. This mechanism isn't supposed to replace content negotiation or runtime configuration. It's for statistical, monitoring or lifecycle planning purposes only.

### API Environments Discoverability

Make API Environments Web-like Discoverable through API Environment Discovery Hubs - publish and maintain a list of URLs (hyperlinks) linking to API entrypoints of the APIs in every API Environment.

## API Landscape Operational Tasks

**API Design Component Tasks**

* _Validate_- 
  * Validate the syntax of the API Specification
  * Validate API Traffic fixtures and/or Interaction design against the API Specification
  * Validate the API Specifcatioon against API Styleguide
* _Build_ - compile the files structure of the API Specification into one file, inject the lifecycle metadata
* _Doc_- Generate the API Documentation from the API Specification
* _Prototype_- Generate and run the mock of the API from the API Specification
* _Interactive Development_- on every filesystem change in the working directory it runs the tasks above
* Publish
  * _Release_ - optionally according to the Lifecycle Type
  * _Deploy_ \(to the API Design Catalog\) - optionally

**API Service Component Tasks**

* _Subscribe_ - to the API Design Component
  * to provide API Design
  * to consume API design
* _Virtualize_ - assign virtual URL hosts for the API Designs the Service is subscribed to
* _Mock_- run mock servers for API Designs the Service is subscribed and listen on the assigned ports 
* _Test_ - fetch the API Design from the Service's Discovery Endpoint and Test the Service Interface against the design
* Publish
  * _Release_ - optional based on the Lifecycle Type
  * _Deploy_ - optional based on the Lifecycle Type

**API Environment**

* _Discover_ - resolve API Design to the entrypoint URL
* _Export_ - run the API Environment Discovery Hub and expose the list of API Service Entrypoint URLs in an API Environment

### Workflows for independent API Design Lifecycle

The API Design first pattern in a collaborative environment is sustainable only by maintaining a great engineering culture (Contract driven developmentm, testing and validation, TDD) or by a process (QA, Governance). This tutorial describes the former.

#### Creation and delivery

All the components MUST be _Published_ and/or_ Deployed_ to the API Landscape ONLY through the Git Pull Request workflow and CI/CD pipeline.

##### API Design (first)

* Create the remote VCS repository
* Setup the CI/CD system to subscribe to the VCS repository to trigger CI build on every new commit and Pull Request
* In the **Local Development Environment**
  * Initiate the Lifecycle manifest file and VCS repository
  * Create the API Specification
  * Lint, Validate and Build the API Specification
  * Prototype - iteratively get early feedback on the API Design
    * generate Documentation
    * generate Mock
    * edit the specification and iterate
  * Create the CI/CD configuration file to _Lint_, _Validate_ and _Build_ the API Specification automatically
  * Create the Initial Commit
  * Push the API Design Component codebase to the remote VCS repository
* In the **Continuous Integration Environment**
  * The VCS notifies the CI/CD system
  * The new CI Build gets triggered for the new commit
  * The CI Build fetches the codebase from VCS
  * If the build passes 
    * a new API Design version is (automatically) assigned and _Published_

##### API Service Component _providing and/or consuming_ API Design

* Assign a unique name to the API Service Lifecyle in the API Landscape
* Create the remote VCS repository
* Setup the CI/CD system to subscribe to the VCS repository to trigger CI build on every new commit and Pull Request
* Setup the Lifecycle Orchestration Bot to automatically open a Pull Request with bumped dependencies when a new version of the subscribed API Design components is _Published_ (this is THE programmatic subscription to the API Design Lifecycle and listening to the advertisement of future versions of the API Design)
* In the **Local Development Environment**
  * Initiate the Lifecycle manifest file
  * _Subscribe_ to a specific version of API Design
  * Use the contract from the API Design Component
    * **provided** API Design
      * to _test_ the service interface
      * implement the server to make the tests pass
    * **consumed** API Designs
      * to _virtualize_ the API Environment and _mock_ the consumed service
      * implement the client against the mock and record the traffic
      * _validate_ the traffic sent to the mock until its valid
  * Create the CI/CD configuration file to _test_  and/or _mock and validate_ the API specification (automatically)
  * Create the initial commit
  * Push the API Service component to the remote VCS Repository
* In the **Continuous Integration Environment**
  * The VCS notifies the CI/CD system
  * The new CI Build gets triggered by the new commit
  * The CI Build etches the codebase from VCS
  * If the build passes
    * a new version of the API Service is assigned
    * the API Service Component is Released
    * the API Service Component is Deployed

#### Change Management

##### API Design (first)

* In the **Local Development Environment**
  * Checkout the latest version of the API Design Component you want to change
  * Start a VCS branch in the local repository
  * Make the change to the API Design
  * Prototype
    * Mock
    * Documentation
  * Commit the changes
  * Push the local VCS branch to the remote VCS Repository
* In the remote VCS repository, Open a Pull Request to merge the new branch into the master branch
* In the **Continuous Integration Environment**
  * a build for the Pull Request is triggered
  * the build fetches the master branch code and runs the validation
* API Design Collaborators review the changes
* If the CI Build passes and the collaborators have approved the Pull Request the branch is merged to master
* In the **Continuous Integration Environment**
  * a build for the Pull Request is triggered
  * the build fetches the master branch code and runs the validation
  * if the build passes
    * a new version of the API Design component is assigned
    * the new API Design Component version is Published and advertised

Now the API Design is _ahead_ of the implementation.

##### API Service _providing and/or consuming_ API Design Implementation

* The Lifecycle Orchestration Bot for the API Service Component dependencies has noticed the new API Design Component version and opened a new branch and a Pull Request in the API Service Component VSC repository
* In the** Continuous Integration Environment**
  * A new build for the new branch is triggered
  * The build fetches the new branch code and runs the contract _test_ and/or _mock and validation_
  * The build fails, because the API Specification has changed but the implementation hasn't 
* In the **Local Development Environment**
  * Checkout the new branch with the bumped version of the API Design dependency
  * Implement the change based on the API Design Contract change until the *test* and/or *mock* and *validation* passes
  * Commit the changes and push the code to the remote branch for the open Pull Request
* In the **Continuous Integration Environment**
  * a build for the Pull Request is triggered
  * the build fetches the new branch code and runs the contract validation
* API Design Collaborators review the changes
* If the CI Build passes and the collaborators have approved the Pull Request the branch is merged to master
* In the **Continuous Integration Environment**
  * a build for the master branch is triggered
  * the build fetches the new branch code and runs the contract validation
  * if the build passes 
    * the API Service Component is _Released_
    * the API Service Component is _Deployed_
    * if taking advantage of immutable deployment the service can be E2E tested before allowing prooduction traffic to the new deployment

## Example API Landscape

Example implementation of **fully automated** API Landscape demonstrating the cross-organizational collaborative API Design First approach and end-to-end contract testing and validation.

### ![](/assets/diagram.png)

### Components

All the components of the API Landscape have independent, but orchestrated lifecycle. If the dependencies of any component have a new version, the component lifecycle gets notified.

* [Backend API Design](https://github.com/netmilk/backend-api-design) - The simple example backend API Design exposing two endpoints
* [Public API Design](https://github.com/netmilk/public-api-design) - Rate-limited facade for the Backend API Design
* [Backend Service](https://github.com/netmilk/backend-service) - Service providing the Backend API Design
* [Public Service](https://github.com/netmilk/public-service) - To demonstrate the **API Gateway pattern** the Public Service is implementing Rate Limiting proxying the requests downstream to the Backend Sergvice

### The API Landscaping Infrastructure

* VCS - Git hosted on [Github](https://github.com/) - required account
* CI/CD System - [Travis CI](https://travis-ci.org/) - required account
* Runtime Deployment Platform - [Zeit NOW](https://zeit.co/now) - required account
* Package Management - [NPM.js](http://npmjs.org) - required account
* Local Development Environment Variable Management - required Node.js and API Landscape Toolchain installed
* Component Lifecycle Orchestration Bot - [Greenkeeper.io](https://greenkeeper.io/) - requried account

## Experimental API Landscaping Toolchain

This Example API Landscape is using [experimental implementation](https://github.com/netmilk/api-landscape) of the stack for automation of the [API Landscape Operational Tasks](#api-landscape-operational-tasks).

##### References and Resources

* [Yarn](https://yarnpkg.com/en/)
* [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)
* [Yarn workspaces with git submodules](https://blog.nrwl.io/dev-workflow-using-git-submodules-and-yarn-workspaces-14fd06c07964)
* [Dependencies in package.json ](https://docs.npmjs.com/files/package.json#dependencies)
* [grunt](https://gruntjs.com/)
* [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch#optionslivereload)
* [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect)
* [Express.js](https://expressjs.com/)
* [express-http-proxy ](https://www.npmjs.com/package/express-http-proxy)
* [grunt-exec](https://github.com/jharding/grunt-exec)
* [livereload](https://github.com/gruntjs/grunt-contrib-watch/blob/master/docs/watch-examples.md#enabling-live-reload-in-your-html)
* [change case library](https://github.com/blakeembrey/change-casec)
* [dotenv ](https://www.npmjs.com/package/dotenv)
* [dotenv edit](https://github.com/stevenvachon/edit-dotenv)
* [portastic](https://www.npmjs.com/package/portastic)
* [openapi 2.0 ](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)
* [ReDoc](https://github.com/Rebilly/ReDoc)
* [Stoplight Prism ](https://github.com/stoplightio/prism)
* [restful json ](https://restfuljson.org/)
* [Dredd ](http://github.com/apiaryio/dredd)
* [Dredd Hooks ](http://dredd.org/en/latest/hooks-nodejs.html)
* [Swagger CLI ](https://github.com/APIDevTools/swagger-cli)
* [Swagger Praser ](https://github.com/APIDevTools/swagger-parser)
* [Semantic Release ](https://github.com/semantic-release/semantic-release)
* [Github Protected Branches, Required reviiews and stats checks ](https://help.github.com/articles/about-protected-branches/)
* [Github CLI for Comments ](https://github.com/stephencelis/ghi)
* [Travis CI CLI ](https://github.com/travis-ci/travis.rb)
* [Travis CI Build Environment Variables ](https://docs.travis-ci.com/user/environment-variables/)
* [Travis CI Conditions ](https://docs.travis-ci.com/user/conditions-v1)
* [ZEIT Now CLI ](https://zeit.co/now)
* [ZEIT Now Build Environment Variables ](https://zeit.co/docs/features/build-env-and-secrets)
* [ZEIT Now Runtime Environment Variables](https://zeit.co/docs/features/env-and-secrets)
* [NOW Pipeline](https://github.com/bahmutov/now-pipeline)
* [openapi-diff](https://github.com/Azure/openapi-diff)
* [Docker](https://docs.docker.com/get-started/)



