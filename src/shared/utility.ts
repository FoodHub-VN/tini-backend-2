const ratio = [32,22,19,16,11]

export const getRatingScore = (scores: number[]) : number => {
  return (scores[0]*ratio[0] + scores[1]*ratio[1] + scores[2]*ratio[2] + scores[3]*ratio[3] + scores[4]*ratio[4])/100 ;
}