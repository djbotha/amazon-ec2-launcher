# Amazon EC2 Launch Wizard

## IMPORTANT TOOLS

This project is based on [React](https://reactjs.org), and makes use of [styled-components](https://styled-components.com/docs/api) for defining CSS in the same place as the components. [Next.js](https://nextjs.org/docs) is used for server-side rendering and directory-based routing structure, and linting is done with [ESLint](https://eslint.org/), using the Airbnb styleguide.

Make sure you have Docker and [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.

## SETTING-UP IAM USER

An IAM user with appropriate roles is required to use the AWS APIs for the Launch Wizard. We will use the user's access key and secret when making API requests.

1. Head over to the [IAM section](https://console.aws.amazon.com/iam/home) in the EC2 Console.
2. Navigate to the _Users_ option and select _Add User_.
3. Enter an appropriate username and allow _Programmatic access_.
4. Under _Set Permissions_, select the _Attach existing policies directly_ option and choose the following policy names:
    * `AmazonEC2ReadOnlyAccess`
    * `AWSPriceListServiceFullAccess`
5. Skip the next few steps and finish creating the user.
6. Note the generated `Access key ID` and `Secret access key`, which will be required in the `.env` file as explained below.

## SETTING-UP LOCALLY

1.  Clone this repository

```
git clone git@github.com:djbotha/amazon-ec2-launcher.git
```

2.  Get started

Create a file called `.env` in the project root and add the below two lines, replacing the
placeholders with your IAM user's `Access key ID` and `Secret access key` as obtained above.
*Be sure to keep this file outside of version control!*

```
ACCESS_KEY_ID=<Your access key ID>
SECRET_ACCESS_KEY=<Your secret access key>
```

Next, launch it:

```
cd amazon-ec2-launcher
docker-compose up
```

You should see the landing page running at http://localhost:8080. Any changes you make to your local code should also be updated inside the Docker container, and the page will be hot-reloaded thanks to NextJS.

## CODE STYLE

Your code needs to be linted before pushing it to our repository. To do that
automatically:

```
cp $PWD/git-pre-push-hook.sh .git/hooks/pre-push
```

Your code will now be linted each time you do a `git push` and if the linting fails,
you'll get a chance to correct that before continuing.

## HOW TO CONTRIBUTE

1.  Start from the `dev` branch, and ensure your code is up to date

```
git checkout dev
git pull origin dev
```

2.  Create a new feature branch, e.g.

```
git checkout -b feature/landing-page-seo
```

3.  Implement your changes to the code.

4.  Push your feature branch to the shared repository

```
git push --set-upstream origin feature/landing-page-seo
```

5.  Create a pull request, from your feature branch to the `dev` branch

6.  Assign another member on the team as a reviewer on the pull request.

The pull request can then be reviewed and merged by another member of the team.
