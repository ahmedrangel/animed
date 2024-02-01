import { seasonal_tags } from "./seasonal_tags";

const CR_BASE = "https://www.crunchyroll.com";

export const getToken = async() => {
  const response = await fetch(`${CR_BASE}/auth/v1/token`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": "Basic " + btoa("cr_web:"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_id"
  });
  const data = await response.json();
  return data;
};

export const getPopular = async(token: Token) => {
  const response = await fetch(`${CR_BASE}/content/v2/discover/browse?n=18&sort_by=popularity&ratings=true&locale=en-US`, {
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    },
  });
  const data = await response.json();
  return data;
};

export const getNewlyAdded = async(token: Token) => {
  const response = await fetch(`${CR_BASE}/content/v2/discover/browse?n=18&sort_by=newly_added&ratings=true&locale=en-US`, {
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    },
  });
  const data = await response.json();
  return data;
};

export const getSimulcasts = async(token: Token) => {
  const id_simulcast = seasonal_tags.data[0].id;
  const title = seasonal_tags.data[0].localization.title;
  const response = await fetch(`${CR_BASE}/content/v2/discover/browse?seasonal_tag=${id_simulcast}&n=100&ratings=true&locale=en-US`, {
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    },
  });
  const data = await response.json();
  data.title = title;
  return data;
};