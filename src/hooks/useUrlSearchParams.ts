const useUrlSearchParams = (target: string) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(target);
};

export default useUrlSearchParams;
