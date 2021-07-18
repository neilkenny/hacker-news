import { environment } from 'src/environments/environment'

export const API = {
  GetMaxItem: () => makeUrl(`/v0/maxitem.json`),
  GetItem: (itemId: number) => makeUrl(`/v0/item/${itemId}.json`),
  GetNewStories: () => makeUrl(`/v0/newstories.json`),
  GetTopStories: () => makeUrl(`/v0/topstories.json`)
}

function makeUrl(path: string){
  return `${environment.baseUrl}${path}`
}