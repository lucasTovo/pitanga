export const debounce = <CB extends (...args: any[]) => void>(
  cb: CB,
  delay = 1000
) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<CB>) => {
    clearTimeout(timer);
    timer = setTimeout(() => cb(...args), delay);
  };
};
