export const getRatingScore = (scores: number[]) : number => {
  return (scores[0] + scores[1] + scores[2] + scores[3] + scores[4])/5 ;
}