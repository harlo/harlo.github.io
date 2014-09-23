---
layout: post
title: "La Nacion hackday"
date: 2014-09-23 12:09:05
---
 
Earlier in September, we did a great hackathon day at La Nacion, courteosy of fellow OpenNews fellow Gabriella Rodriguez (aka [at_gaba][@gaba]).  Gaba's the lead on a project called [crowdata][CrowData] (which was originated by fellow OpenNews fellow Manuel Aristaran (aka [at_manuel][@manuelaristaran])) which facilitates source management at the paper by inviting readers to submit PDFs to be automatically processed.  I really like the tool, and decided to help out by creating a Dockerfile for automating server creation.

I felt I contributed a lot to the project because, as I set up my environment to use the CrowData platform, I debugged a lot of issues particular to a virgin linux machine.  Since the purpose of the Dockerfile is to generate a successful build of the platform on a virgin machine, my environment was perfect as a sandbox.  For instance, CrowData currently requires python, Django, and Postgres; along with their dependencies.  Other than python (natch), I don't have any of those requirements on my machine.  So my Dockerfile reflects how a machine might do a headless install when each requirement is initiated.

[at_gaba]: https://twitter.com/gaba
[crowdata]: https://github.com/crowdata/crowdata
[at_manuel]: https://twitter.com/manuelaristaran