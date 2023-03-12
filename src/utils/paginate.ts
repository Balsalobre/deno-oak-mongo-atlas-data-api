export const getPageValues = ({
  page = 1,
  pageSize = 10,
}: {
  page: number;
  pageSize: number;
}) => {
  return { skip: (page - 1) * pageSize, limit: pageSize };
};
