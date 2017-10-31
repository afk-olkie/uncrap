# uncrap
The idea behind this project is to provide tools to `uncrap` your c code (may expand to other languages in the future).

# Status
This is super duper alpha! The API and project structure will definitely change.

# Goals
* We want this to be as easy to use as possible.
* Users should not need to setup lengthy project configs.
* Quick and dirty tools for users is our focus.
* We want to be as close to the code text as possible to make our tools more useful/versatile. This prevents using any parser that loses any code text position information.
* Most tools should be web friendly as it allows anyone to use very quickly. We may provide more advanced tools in the future that do not need to be web friendly.

## Plans
There will be an `UncrapCore` which will include things like parsers, and other utilities that operate purely on code/text with no GUI or assumption of target (node/web). Then there will be various front ends developed for web and node.

# TODO
- [ ] lots of cleanup / organization.
- [ ] replace super hack regex parsing with basic recursive descent parser (doesn't attempt to parse everything).


# Tips for new contributors

## git
* Fork this repo and checkout the branch you want to work on.
* Main development will take place in `develop` branch.
* Note that the `master` branch will be used for latest stable releases. No pull requests against master will be accepted.
* Then **start a new branch** for your change.
* The branch should start with `feature/` for new features, `bugfix/` for bug fixes.
* Once your feature or fix is ready, you should **1)** merge `develop` into your branch to resolve any merge conflicts in your branch (this is important as it allows others to continue developing!), and then 2) open a pull request into the `develop` branch.

If you are going to be doing a good chunk of development, we can also add you as a contributor to make branching and merging easier. All merges into `develop` require a pull request anyway as it is a github protected branch.

Additional useful guides:

* We use gitflow for branching model: see https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow
* We use forking workflow: https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow

## code style
We should try and follow current best practices (60k stars!): https://github.com/airbnb/javascript

The below are of primary interest:

* https://github.com/airbnb/javascript#whitespace
* https://github.com/airbnb/javascript#blocks


# Design Decisions

## Why not use a heavy weight parser?
We might one day, but for right now, it seems like over kill and doesn't align well with project goals.

Tried ANTLRv4, but didn't like it for a few reasons: 
* the input code needs to be run through a preprocessor to remove preprocessor directives first. This is a pain
because we first need a proper preprocessor and then we also lose the original text location of code.
* it also doesn't produce an AST which is really what you want.
* needs additional work to keep comments.
* it does however have a C11 grammar https://github.com/antlr/grammars-v4/blob/master/c/C.g4.

Looked at `pycparser` for python, but it needs to be able to resolve EVERYTHING! 
* Way too much work/fuss for users of quick and dirty tools like `uncrap`.


# Useful reads for developers

## webpack
https://webpack.js.org/guides/author-libraries/

