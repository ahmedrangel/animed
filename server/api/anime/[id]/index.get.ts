import { Language } from "~/enums/anilist";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { data } = await getAnimeInfo({ id: Number(id), language: Language.JAPANESE }) ;
  return data.Media;
});