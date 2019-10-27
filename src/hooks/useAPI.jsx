import useAxios from 'axios-hooks';

function useAPI(options, config = {}) {
  const [{ data, error, loading }, refetch] = useAxios(
    {
      ...options,
      url: `http://localhost:8081${options.url || options}`
    },
    {
      ...config,
      manual: !!config.manual
    }
  );

  const refetchWrapper = props => {
    const newProps = {
      ...props,
      url: `http://localhost:8081${props.url}`
    };
    return refetch(newProps);
  };

  return [{ data, error, loading }, refetchWrapper];
}

export default useAPI;
