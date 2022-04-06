import axios, { AxiosResponse } from 'axios';
import { REPOSITORY_INFO } from '../setting';

/**
 * docs: https://docs.gitlab.com/ee/api/branches.html
 */

export const getAllTemplates = (): Promise<AxiosResponse<any>> => {
  const { origin, prefix, id } = REPOSITORY_INFO;
  return axios.get(`${origin}${prefix}/projects/${id}/repository/branches`);
};
