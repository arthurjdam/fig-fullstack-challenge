## Setup

Run the server:

```bash
npm ci && npm run start
```

Run the dev server:
```bash
npm i && npm run dev
```

Run tests: `npm run test`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## The Parser

Described in `src/data/fig.ts`

## Front-end

`ExplainCommand` is designed to be a drop-in component for any page.
It breaks down the input command into separate pieces, via the parser in fig.ts.

Separate components are overlayed onto the inputField as `CommandPart` components.
The components take an analyzed part of a command and display the description
which was provided by the Fig Specification.

## Challenges

I started before the task changes to focus on either FE or the parser - either
part can use some more attention. Particularly E2E tests for the front-end are 
missing, and the parser needs actual sequencing logic. It is currently more 
generous than actual commandline parser would be.

Designing the build while at the same time designing visually results in some
internal conflict. In the future, first focus only on design, then only on 
development. The design is based on the graphics here: 
https://fig.io/docs/concepts/cli-skeleton . The horizontal layout ended up not
working out particularly well with chained arguments since they're so close
to eachother. I tried having the descriptions alternating between top and bottom
but it was still too close.