
const BASE_URL = "http://localhost:5000";
const RESOURSE_URL = `${BASE_URL}/parks`;

const baseRequest = async ({ urlPath = "", method = "GET", body = null }) => {
  try {
    const reqParams = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      reqParams.body = JSON.stringify(body);
    }

    const response = await fetch(`${RESOURSE_URL}${urlPath}`, reqParams);

    if (!response.ok) {
      throw new Error(`HTTP помилка! статус: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("HTTP ПОМИЛКА: ", error);
    return null;
  }
};

// CRUD functions

export const getAllParks = async () => {
  return await baseRequest({ method: "GET" });
};

export const postPark = async (body) => {
  return await baseRequest({ method: "POST", body });
};

export const updatePark = async (id, body) => {
  return await baseRequest({ urlPath: `/${id}`, method: "PATCH", body });
};

export const deletePark = async (id) => {
  return await baseRequest({ urlPath: `/${id}`, method: "DELETE" });
};