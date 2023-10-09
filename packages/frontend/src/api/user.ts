import { loginRevalidate } from "../hook/useLogin";
import { APIError } from "./error";

export async function emailCheck(email: string, signal: AbortSignal) {
  const url = new URL(
    "/api/v1/users/check-email",
    window.location.origin,
  );
  url.searchParams.append("email", email);

  const res = await fetch(url.href, { signal });
  return await res.json();
}

export async function nicknameCheck(nickname: string, signal: AbortSignal) {
  const url = new URL(
    "/api/v1/users/check-nickname",
    window.location.origin,
  );
  url.searchParams.append("nickname", nickname);

  const res = await fetch(url.href, { signal });
  return await res.json();
}

export async function signUp({
  Email,
  Password,
  NickName,
  Phone,
  Address,
  AddressDetail,
  Article,
  ProfileImage,
  token,
}: {
  Email: string;
  Password: string;
  NickName: string;
  Phone: string;
  Address: string;
  AddressDetail?: string;
  Article: string;
  ProfileImage?: File;
  token?: string;
}) {
  const formData = new FormData();
  formData.append("email", Email);
  formData.append("password", Password);
  formData.append("nickname", NickName);
  formData.append("phone", Phone);
  formData.append("address", Address);
  formData.append("introduction", Article);

  if (AddressDetail) formData.append("address_detail", AddressDetail);
  if (ProfileImage) formData.append("profile", ProfileImage);
  if (token) formData.append("token", token);

  const r = await fetch("/api/v1/users/signup", {
    method: "POST",
    body: formData,
  });
  const msg = await r.json();
  if (r.status === 201) {
    /// 회원가입 성공!
    return [true, msg.message];
  } else {
    /// 회원 가입 실패!
    return [false, msg.message];
  }
}

/**
 * Resets the password for a user.
 *
 * @param {string} password - The new password.
 * @param {string} [code] - The reset code (optional) to verify.
 * it used for non local users.
 * @return {Promise<void>} - A promise that resolves when the password reset is successful.
 * @throws {APIError} - If the token(`code`) has expired or is invalid
 */
export async function resetPassword(password: string, code?: string) {
  const res = await fetch("/api/v1/users/reset-password", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      code,
      password,
    }),
  });
  if (!res.ok) {
    throw new APIError("token expired or invalid");
  }
}
/**
 * Authenticates a user by sending a login request to the server.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @return {Promise<[boolean, object]>} - A promise that resolves to a boolean indicating whether the login was successful and an object containing the user's data.
 */
export async function login(
  email: string,
  password: string,
): Promise<[boolean, object]> {
  const res = await fetch("/api/v1/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  if (res.status !== 200) {
    const data = await res.json();
    return [false, data];
  }
  loginRevalidate();
  return [true, await res.json()];
}

/**
 * Sends a reset password email to the specified email address.
 *
 * @param {string} email - The email address to send the reset password email to.
 * @return {Promise<boolean>} - A promise that resolves to true if the reset password email was successfully sent, and false otherwise.
 */
export async function send_reset_password(email: string) {
  // it equals 'await axios.post("/api/v1/users/send-reset-password", {email});'
  const res = await fetch("/api/v1/users/send-reset-password", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });
  if (!res.ok) {
    return false;
  }
  return true;
}

export async function patchUserInfo(id: number, body: {
  nickname?: string;
  phone?: string;
  address?: string;
  address_detail?: string;
  introduction?: string;
  profile_image?: File;
}) {
  const formData = new FormData();
  if (body.nickname) formData.append("nickname", body.nickname);
  if (body.phone) formData.append("phone", body.phone);
  if (body.address) formData.append("address", body.address);
  if (body.address_detail) {
    formData.append("address_detail", body.address_detail);
  }
  if (body.introduction) formData.append("introduction", body.introduction);
  if (body.profile_image) formData.append("profile", body.profile_image);

  const res = await fetch(`/api/v1/users/${id}`, {
    method: "PATCH",
    body: formData,
  });
  if (!res.ok) {
    throw new APIError("token expired or invalid");
  }
  loginRevalidate();
  return await res.json();
}

/**
 * Logs the user out by making a POST request to the "/api/v1/users/logout" endpoint.
 *
 * @return {Promise<void>} Returns a promise that resolves when the logout request is complete.
 */
export async function logout(): Promise<void> {
  const res = await fetch("/api/v1/users/logout", {
    method: "POST",
  });
  loginRevalidate();
  if (res.status !== 200) {
    throw new APIError("token expired or invalid");
  }
  console.log("logout success");
}

export async function verifyUserEmail(code: string) {
  const res = await fetch("/api/v1/users/verify", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      code: code,
    }),
  });
  if (!res.ok) {
    throw new APIError("token expired or invalid");
  }
}

export async function googleLogin(code: string): Promise<{
  message: string;
  code:
    | "need_signup"
    | "success"
    | "invalid_request"
    | "token_error"
    | "payload_error";
  data?: {
    token: string;
    email: string;
    name: string;
  };
}> {
  const res = await fetch("/api/v1/users/google-login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  if (!res.ok) {
    return await res.json();
  }
  const resJson = await res.json();
  return resJson;
}
