Introduction
============

ROTOGAMEx2 is a two player variant of [ROTOGAMEsq][2].


How to start development environment
====================================

 1. Bring dependencies up to date:

        npm update
        bower update

 2. Set environment variables:
      + `NODE_ENV`: `development`

 3. Run directly:

        node app.js

    Or with [nodemon][4]:

        nodemon --watch .


Releasing a new version
=======================

  * Version number schema: [major.minor.patch][3]

  * Update `version` in: `package.json`

  * Add tag in GIT.


Legal
=====

Except where noted otherwise, files are licensed under the WTFPL.

Copyright © 2012–2017 [Felix E. Klee][1]

This work is free. You can redistribute it and/or modify it under the terms of
the Do What The Fuck You Want To Public License, Version 2, as published by Sam
Hocevar. See the COPYING file for more details.


[1]: mailto:felix.klee@inka.de
[2]: https://github.com/feklee/rotogamesq
[3]: http://semver.org/
[4]: https://github.com/remy/nodemon
