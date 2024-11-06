import { prisma, Prisma } from "@/libs/prismadb";

interface IParams {
  productId?: string;
}

export default async function getProductById(params:IParams) {
  console.log("prodid", params.productId);
try {
  const { productId } = params;
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt:'desc'
        }
      },
    },
  });
  if (!product) {
    return null;
  }
  return product;
} catch (error: any) {
  throw new Error(error);
}
}
