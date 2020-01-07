# EPC 2.0 Hello World Application

1. [Introduction](#introduction)
2. [Getting in Touch](#getting-in-touch)
3. [Technologies Used](#technologies-used)
4. [Setting up your Development Environment](#setting-up-your-development-environment)
5. [Running the Sample Application](#running-the-sample-application)
6. [Deploying the Sample Application](#deploying-the-sample-application)

---

## Introduction

The EPC 2.0 Hello World Application is an introductory web application that illustrates how to consume the EPC 2.0 JavaScript and REST API to build a service integration on the EPC platform

The sample integration performs a series of simple tasks:

1. Validating the subject property's ZIP code - utilizing the public United States Postal Service API
2. Updating the loans subject property information with the validated ZIP code
3. Uploading a ZIP code validation report to the subject loans eFolder

---

**First**, before a user is able to initiate the ZIP code validation transaction, it will display some relevant loan information on its user-interface:

1. Borrower and Co-borrower name
2. Loan and Subject Property information

![](https://files.readme.io/1dfa4d7-zipright-origin.gif)

**Second**, once a user initiates a new transaction, it will retrieve 4 fields that locate the subject property from the loan file:

1. Subject Property Street Address
2. Subject Property City
3. Subject Property State
4. Subject Property ZIP code

![](https://files.readme.io/817ce4c-zipright-order.gif)

**Finally**, it will utilize the [USPS public API](https://www.usps.com/business/web-tools-apis/) to validate the subject property's ZIP code. If the ZIP code is incorrect, it will update it with the correct one. After doing so, it will update the loan file with the verified ZIP code, along with placing a generated PDF report in the subject loan's eFolder.

![](https://files.readme.io/8bb3f9d-zipright-view-details.png)
![](https://files.readme.io/bc0f278-efolder-attachment.png)

---

## Getting in Touch:

1. If you need any help building, running and testing the sample application - you can reach out to the EPC team at `DL_EPC_Support@elliemae.com`

2. If you have identified any issues with the sample application and/or would like to make contributions/improvements - you can create a GitHub issue which the team will triage, or you can reach out to the EPC team directly as described above

---

## Technologies Used

### User-Interface:

1. React: https://reactjs.org/
2. Material-UI: https://material-ui.com/

### Back-End:

1. Python 3: https://www.python.org/downloads/
2. Flask/Connexion: https://github.com/zalando/connexion

---

## Setting up your Development Environment

The sample integration has 2 components:

1. A **user-interface** application - which will be embedded in the host Encompass web application and will interact with the EPC JavaScript API

2) A **back-end** application - which will act as a middleware between the user-interface, the USPS API, and the EPC REST API

### User-Interface:

#### I. Install `Node` version 12 and Node Package Manager (`npm`) version 6:

You can download and install the latest iteration of Node version 12 from [nodejs.org](https://nodejs.org/en/download/). This installation includes Node Package Manager version 6, which is a popular JavaScript dependency manager utilized by the sample integration. Once installed, you can check the specific version of Node and NPM you installed by typing the following commands in your shell:

```
$ node --version
v12.11.0
$ npm --version
6.11.3
```

### Back-end:

#### I. Install `Python 3` and the Python Package Installer (`pip`):

You can download and install the latest version of Python 3 from [python.org](https://www.python.org/downloads/). Starting with Python 3.4 - the Python Package Installer (`pip`) is included by default with the Python binary installers. The Python Package Installer, as its name suggests, is the installer program for our external Python dependencies.

Please note, your OS might be preinstalled with an older version of Python. For example, macOS is preinstalled with Python 2. To check your both your version of `python` and `pip`, after installation, enter the following commands in your shell:

```
$ python --version
Python 3.7.4
$ pip --version
pip 19.1.1 from /usr/local/lib/python3.7/site-packages/pip (python 3.7)
```

#### II. Sign up for an `ngrok` account and install its client application:

`ngrok` is a tool that allows you to expose a web server running on your local machine to the internet. All you have to tell `ngrok` is which port your web server is listening on, and it will generate publicly accessible URL's whose traffic is tunneled to the specified port on your machine. For our sample application, we will be using `ngrok` in two ways:

1. To access the integration's user-interface (which will be served locally at `localhost:3000`) from the public internet, as it will be embedded within an Encompass application

2. To publicly expose the integration's back-end (which will be served locally at `localhost:8080`) so it can serve requests from the user-interface as well as receive transactional webhooks (HTTP callbacks) triggered by the EPC platform

You can download and install ngrok from [this location](https://ngrok.com/download). Follow the instructions to unzip the executable in a folder. Next, sign up for an account on the [ngrok website](https://dashboard.ngrok.com/signup), and connect your instance of the `ngrok` client to your online account by copying your **ngrok auth token** from [your account](https://dashboard.ngrok.com/auth) and running this command in your shell:

```
$ ngrok authtoken <YOUR_AUTHTOKEN>
```

After connecting to your `ngrok` account, save the following YAML configuration file at the specified default locations depending on your operating system:

`ngrok.yml`

```yaml
tunnels:
  user-interface:
    proto: http
    addr: 8080
  back-end:
    proto: http
    addr: 3000
```

**OS X/Linux**: `/Users/{{user_id}}/.ngrok2/ngrok.yml`

**Windows**: `C:\Users\{{user_id}}\.ngrok2\ngrok.yml`

---

## Running the Sample Application

### **Step 1**: Clone the sample integration source

```
git clone https://github.com/rishabhprakash/epc-hello-world.git
```

<br>

### **Step 2**: Install the necessary application dependencies

#### I. User-interface

```
$ cd user-interface
$ yarn install
```

#### II. Back-end

```
$ cd back-end
$ sudo pip3 install virtualenv
```

The command above installs a very useful dependency for Python development - `virtualenv`. `virtualenv` helps us create isolated Python application environments. Think of it as a cleanroom, isolated from other versions of Python and dependency libraries. Lets create the root directory for our virtual environment:

```
$ virtualenv venv
```

Now we need to activate this virtual environment so we can begin operating within its scope. The command is slightly different based on your operating system:

**OS X/Linux**:

```
$ source venv/bin/activate
```

**Windows**:

```
$ \PATH\TO\venv\Scripts\activate
```

Once we do this - we should see `(venv)` appear at the beginning of our shells prompt - this means we have activated and are operating within our Python virtual environment. It is in this virtual environment that we want to install our applications dependencies in isolation, and run our application. Lets install our dependencies:

```
(venv) $ pip3 install -r requirements.txt
```

<br>

### **Step 3**: Run each component

#### I. User-interface:

```
$ yarn start
```

> #### Temporary Dependency Issue Work-around
>
> The current supported version of one of the user-interface dependencies - [react-scripts](https://www.npmjs.com/package/react-scripts) - has an issue with supporting WebSocket WSS connections (which are needed for the React local development server's hot reloading functionality) when tunneling your local development server over an HTTPs connection. To temporarily fix this issue, navigate to
>
> ```
> ./epc-hello-world/user-interface/node_modules/react-dev-utils/webpackHotDevClient.js
> ```
>
> and replace line 62 of that file with the following before you run the application:
>
> ```javascript
> protocol: window.location.protocol === 'https:' ? 'wss' : 'ws',
> ```
>
> This issue is slated to be fixed with the next release of `react-scripts` - you can track this issue here: https://github.com/facebook/create-react-app/issues/8075

Once the user-interface application is up and running - you should see a similar output in your shell:

```
Compiled successfully!

You can now view user-interface in the browser.

  Local:            http://localhost:3000/
  On Your Network:  http://192.168.87.38:3000/

Note that the development build is not optimized.
To create a production build, use yarn build.
```

#### II. Back-end:

```
(venv) $ python3 server.py
```

Once the back-end application is up and running - you should see the following output in your shell:

```
 * Serving Flask app "factory" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://0.0.0.0:8080/ (Press CTRL+C to quit)
```

<br>

### **Step 4**: Start an instance of the `ngrok` client

With tunnels as configured for `localhost:3000` and `localhost:8080` in the `ngrok.yml` configuration file

```
`$ ngrok start --all`
```

You should see the following output in your shell:

```
ngrok by @inconshreveable                                       (Ctrl+C to quit)

Session Status                online
Account                       EPC (Plan: Free)
Version                       2.3.35
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://3d5e2d38.ngrok.io -> http://localhost:8080
Forwarding                    https://3d5e2d38.ngrok.io -> http://localhost:8080
Forwarding                    http://db0a1b1c.ngrok.io -> http://localhost:3000
Forwarding                    https://db0a1b1c.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

<br>

### **Step 5**: Update the User-interface Environment File

Navigate to:

```
./epc-hello-world/user-interface/src/environment.js
```

And replace the `API_URL` constant with the public URL for `localhost:8080` generated by `ngrok`:

```javascript
// Environment variables

export const API_URL = '{{NGROK_HTTPS_URL_FOR_PORT_8080}}';
export const ORIGIN_PATH = '/v1/origins/';
export const STATUS_PATH = '/v1/status/';
```

<br>

### **Step 6**: Update the EPC Product Interface and Webhook URL's via the EPC REST API

> This is assuming you have:
>
> 1. [Registered an instance of your application](https://docs.partnerconnect.elliemae.com/partnerconnect/docs/registering-the-sample-application) with the EPC platform
>
> 2. Worked with the [EPC Support team](https://docs.partnerconnect.elliemae.com/partnerconnect/docs/how-do-i-ask-for-help) to configure the sample applications minimum necessary [data entitlements](https://docs.partnerconnect.elliemae.com/partnerconnect/docs/adding-entitlements)

```json
PATCH https://api.elliemae.com/partner/v2/products/:id

Authorization: Bearer <PARTNER_OAUTH_TOKEN>
Content-Type: application/merge-patch+json

{
    "interfaceUrl": "{{NGROK_HTTPS_URL_FOR_PORT_3000}}",
    "webhooks": [
      {
        "resource": "urn:elli:epc:transaction",
        "events": [
          "created",
          "updated"
        ],
        "signingkey": "{{SIGNING_KEY}}",
        "url": "{{NGROK_HTTPS_URL_FOR_PORT_8080}}/v1/webhooks"
      },
      {
        "resource": "urn:elli:epc:transaction:event",
        "events": [
          "created"
        ],
        "signingkey": "{{SIGNING_KEY}}",
        "url": "{{NGROK_HTTPS_URL_FOR_PORT_8080}}/v1/webhooks"
      }
    ]
}
```

<br>

### **Step 7**: Entitle your test Encompass user to access your integration

1. Navigate to `https://www.encompassloconnect.com` - and log in with your sandbox Encompass instances **admin credentials**:

![](https://files.readme.io/b82d41b-encw-admin-login.gif)

2. Navigate to **Services Management** - and select the service category you have listed your `product` under:

![](https://files.readme.io/db65acb-encw-admin-select-category.gif)

3. Click on the **Add** button on the top-right of the **Manual Ordering** section - then select your product as listed in the dropdown and click **Create**:

![](https://files.readme.io/56b774c-encw-admin-create-manual-setup.gif)

4. Give the manual **Service Setup** a name, add your regular/non-admin Encompass test user to the authorized users list, and click on **Save**:

![](https://files.readme.io/831f04c-encw-admin-save-manual-setup.gif)

5. You will now see the new **Service Setup** you've created on the **Services Management** page - make sure it is marked **Active**:

![](https://files.readme.io/94da129-active-setup.png)

<br>

### **Step 8**: Launch your integration within Encompass Loan Officer Connect!

1. Log out - and log back in as your regular/non-admin Encompass test user. Select an existing (or create a new) loan from the pipeline, and navigate to the **Services** tab from the loans side-nav:

![](https://files.readme.io/2f7fa89-encw-slp.gif)

2. Click on the **Order** button on the service category card you have listed your `product` under - and your integrations user-interface will launch! If you have created (and have activated **Service Setups** for) more than one product under the given category - you will see a dropdown list of products to choose from, as below:

![](https://files.readme.io/19e0435-encw-launch-integration.gif)

Great! Your integrations user-interface - which is being served (via `ngrok`) from `localhost:3000` is accessible within Encompass Loan Officer Connect. You can now begin testing your integration as an Encompass user.

---

## Deploying the Sample Application

### User-interface:

### Back-end:
