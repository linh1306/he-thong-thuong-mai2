export function removeEmptyFields<T>(obj: T): T {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  }
  return obj;
}

export function createSearchParams(path: string, obj: Record<string, number | string | boolean>) {
  const searchParams = new URLSearchParams();
  for (const key in obj) {
    if (obj[key] && obj[key] !== '') {
      searchParams.set(key, obj[key].toString());
    }
  }
  return path + '?' + searchParams;
};

export function objectParamSearch(searchParams: URLSearchParams) {
  const params: { [key: string]: any } = {}
  searchParams.forEach((value: string, key: string) => {
    params[key] = value
  })

  params.currentPage = parseInt(params.currentPage ?? 1)
  params.pageSize = parseInt(params.pageSize ?? 10)

  return params
};