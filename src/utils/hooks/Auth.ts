export interface ISignInParams {
  email: string;
  password: string;
}
const useSignIn = async (stateParams?: ISignInParams) => {
  try {
    const response = await fetch('/api/auth/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stateParams)
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data from API');
    }
    const res = await response.json();
    return res
  } catch (error) {
    console.error(error);
  }
}

export interface ISignUpParams {
  name: string,
  email: string,
  password: string,
  address: string[],
  phone: string,
}
const useSignUp = async (stateParams?: ISignUpParams) => {
  try {
    const response = await fetch('/api/auth/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stateParams)
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data from API');
    }
    const res = await response.json();
    return res
  } catch (error) {
    console.error(error);
  }
}

export { useSignIn, useSignUp };