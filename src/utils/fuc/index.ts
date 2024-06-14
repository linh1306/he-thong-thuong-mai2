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

export function createId(size: number = 5): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code
}

export function timeToString(time: Date): string {
  const date = new Date(time);

  const padToTwoDigits = (num: any) => num.toString().padStart(2, '0');

  const minutes = padToTwoDigits(date.getMinutes())
  const hours = padToTwoDigits(date.getHours())
  const day = padToTwoDigits(date.getDate())
  const month = padToTwoDigits(date.getMonth() + 1)
  const year = date.getFullYear()

  return `${hours}:${minutes} ${day}-${month}-${year}`;
}

export function newDate() {
  const date = new Date();
  // date.setMonth(date.getMonth() - 3);
  return date
}