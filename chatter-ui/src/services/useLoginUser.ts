import { AUTH_API_URL } from '@/constants/env';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

const loginUser = async (data: { email: string; password: string }) => {
  return axios.post(`${AUTH_API_URL}/login`, data, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

const useLoginUser = (props: {
  onSuccess?: (data: AxiosResponse) => void;
  onError?: () => void;
}) => {
  const { data, error, mutate, isPending } = useMutation({
    mutationFn: (data: { email: string; password: string }) => loginUser(data),
    onSuccess: props.onSuccess,
    onError: props.onError,
  });
  return { data, error, mutate, isPending };
};

export default useLoginUser;
