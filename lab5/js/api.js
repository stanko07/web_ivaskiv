const BASE_URL = "http://localhost:1337";
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

        return await fetch(`${RESOURSE_URL}${urlPath}`, reqParams);
    } catch (error) {   
        console.error("HTTP ERROR: ", error);
    }
};

export const getAllParks = async (search = "", sort = "") => {
    let query = "";

    if (search) {
        query = `?search=${search}`;
    }
    if (sort) {
        query += query ? `&sort=${sort}` : `?sort=${sort}`;
    }

    const rawResponse = await baseRequest({ urlPath: query, method: "GET" });
    return await rawResponse.json();
};


export const postPark = (body) => baseRequest({ method: "POST", body });

export const updatePark = (id, body) =>
    baseRequest({ urlPath: `/${id}`, method: "PATCH", body});

export const deletePark = (id) =>
    baseRequest({ urlPath: `/${id}`, method: "DELETE"});


