# Amazon EC2 Launch Wizard

## IMPORTANT TOOLS

This project is based on React [React](https://reactjs.org), and makes use of [styled-components](https://styled-components.com/docs/api) for defining CSS in the same place as the components. [Next.js](https://nextjs.org/docs) is used for server-side rendering and directory-based routing structure, and linting is done with [ESLint](https://eslint.org/), using the Airbnb styleguide.

## SETTING-UP LOCALLY

1.  Clone this repository

    git clone git@github.com:djbotha/amazon-ec2-launcher.git

2.  Get started

    cd amazon-ec2-launcher
    npm install
    npm run dev

You should see the landing page running at http://localhost:8080

## CODE STYLE

Your code needs to be linted before pushing it to our repository. To do that
automatically:

    cp $PWD/git-pre-push-hook.sh .git/hooks/pre-push

Your code will now be linted each time you do a `git push` and if the linting fails,
you'll get a chance to correct that before continuing.

## HOW TO CONTRIBUTE

1.  Start from the `dev` branch, and ensure your code is up to date

    git checkout dev
    git pull origin dev

2.  Create a new feature branch, e.g.

    git checkout -b feature/landing-page-seo

3.  Implement your changes to the code.

4.  Push your feature branch to the shared repository

    git push --set-upstream origin feature/landing-page-seo

5.  Create a pull request, from your feature branch to the `dev` branch

6.  Assign another member on the team as a reviewer on the pull request.

The pull request can then be reviewed and merged by another member of the team.
