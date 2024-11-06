export const productRating = (reviews: Array<Object>) => {
   return reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / reviews.length;
  
}