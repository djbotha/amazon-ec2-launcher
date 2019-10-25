import useAxios from 'axios-hooks';

function useAPI(endpoint) {
  const res = useAxios(`http://localhost:8081${endpoint}`);
  return res;
}

export default useAPI;
