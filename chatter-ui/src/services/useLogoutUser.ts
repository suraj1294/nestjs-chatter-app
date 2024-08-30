import { AUTH_API_URL } from '@/constants/env';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const logoutUser = async () => {
  return axios.post(`${AUTH_API_URL}/logout`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

const useLogoutUser = (props: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const { data, error, mutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: props.onSuccess,
    onError: props.onError,
  });
  return { data, error, mutate, isPending };
};

export default useLogoutUser;
