# DENO OAK REST API TO LAUNCH QUERIES ON A MONGO ATLAS DATA API

This is a simple REST API to launch queries on a Mongo Atlas Data API. It is built with Deno and Oak.

## How to run

```bash
deno task start
```

## How to use

Import the json file in Thunder Client (VSCode extension) and launch the queries.

## Aggregation pipeline example post request

This is a simple example of aggregation pipeline to get restaurants by regex on name and paginate the results.

```ts
pipeline: [
      {
        $match: {
          name: {
            $regex: pattern,
            $options: 'i',
          },
        },
      },
      {
        $facet: {
          result: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          count: [
            {
              $count: 'total',
            },
          ],
        },
      },
      {
        $project: {
          result: 1,
          count: {
            $arrayElemAt: ['$count.total', 0],
          },
        },
      },
    ]
```
