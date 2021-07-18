export interface Post {
  by: string,
  descendants: number,
  id: number,
  kids: number[],
  score: number,
  time: number,
  title: string,
  type: 'story' | 'comment' | 'ask' | 'job' | 'poll' | 'pollopt',
  url: string,
  totalComments: number
}