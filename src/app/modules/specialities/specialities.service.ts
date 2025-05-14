import QueryBuilder from '../../builder/queryBuilder';
import { specialitieModel } from './specialities.model';

const specialitieGetBD = async (query: Record<string, unknown>) => {
  const patientQuery = new QueryBuilder(specialitieModel.find(), query)
    .search(["title"])
    .filter()
    .paginate()
    .sort();
  const result = await patientQuery.modelQuery;
  const meta = await patientQuery.countTotal();
  return {
    result,
    meta,
  };
};

export const specialitieService = {
  specialitieGetBD
};
