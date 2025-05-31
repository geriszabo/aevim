export const signupRequest = (
  email = "test@test.com",
  password = "password123"
) => {
  return new Request("http://localhost:3000/api/v1/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const loginrequest = (
  email = "test@test.com",
  password = "password123"
) => {
  return new Request("http://localhost:3000/api/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const logoutRequest = () => {
  return new Request("http://localhost:3000/api/v1/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
}