import { Context } from 'https://deno.land/x/oak@v12.1.0/context.ts';

import { DATABASE_URI, DATA_API_KEY } from '../config/index.ts';
import { getPageValues } from '../utils/paginate.ts';

const DB = {
  collection: 'restaurants',
  database: 'sample_restaurants',
  dataSource: 'eu-ireland',
};

const optionPostMethod = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/ejson',
    'api-key': DATA_API_KEY,
  },
};

export const getRestaurantByName = async ({
  request: { url },
  response,
}: Context) => {
  const name = url.searchParams.get('name');
  const URI = `${DATABASE_URI}/findOne`;
  const query = {
    ...DB,
    filter: { name },
  };
  const options = { ...optionPostMethod, body: JSON.stringify(query) };
  const dataResponse = await fetch(URI, options);
  const restaurant = await dataResponse.json();
  response.status = 200;
  response.body = restaurant;
};

export const getRestaurants = async ({ response }: Context) => {
  const page = 1;
  const pageSize = 10;
  const { skip, limit } = getPageValues({ page, pageSize });
  const URI = `${DATABASE_URI}/aggregate`;
  const pattern = 'deli';
  const query = {
    ...DB,
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
    ],
  };
  const options = { ...optionPostMethod, body: JSON.stringify(query) };
  const dataResponse = await fetch(URI, options);
  const restaurants = await dataResponse.json();
  const { result, count } = restaurants.documents[0];
  response.status = 200;
  response.body = {
    documents: result,
    pagination: {
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      totalDocuments: count,
    },
  };
};
