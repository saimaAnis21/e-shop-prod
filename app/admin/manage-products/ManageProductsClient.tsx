'use client';

import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Product } from "@prisma/client";
import { formatPrice } from "../../../utils/formatPrice";
import Heading from "../../components/Heading";
import { MdCached, MdClose, MdDelete, MdDone, MdRemoveRedEye } from "react-icons/md";
import Status from "../../components/Status";
import ActionBtn from "../../components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "../../../libs/firebase";

interface ManageProductsClientProps {
  products: Product[]; 
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({ products }) => {
  const router = useRouter();
  const storage = getStorage(firebaseApp);
  let rows:any = [];

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        images: product.images,
      }
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "price",
      headerName: "Price(USD)",
      width: 100,
      renderCell: (params) => {
        return <div className="font-bold text-slate-800">{params.row.price}</div>;
      },
    },
    { field: "category", headerName: "Category", width: 100 },
    { field: "brand", headerName: "Brand", width: 100 },
    {
      field: "inStock",
      headerName: "InStock",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            {params.row.inStock === true ? (
              <Status text="in Stock" icon={MdDone} bg="bg-teal-200" color="text-teal-700" />
            ) : (
              <Status text="out of Stock" icon={MdClose} bg="bg-rose-200" color="text-rose-700" />
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return <div className="flex justify-between gap-4 w-full ">
          <ActionBtn icon={MdCached} onClick={() => {
            handleToggleStock(params.row.id,params.row.inStock);
          }} />
          <ActionBtn icon={MdDelete} onClick={() => {
            handleDelete(params.row.id, params.row.images);
          }} />
          <ActionBtn icon={MdRemoveRedEye} onClick={() => {
            router.push(`product/${params.row.id}`);
          }} />
        </div>;
      },
    },
  ];  
  
  const handleToggleStock = useCallback(
    (id: string, inStock: boolean) => {
      axios
        .put("/api/product", {
          id,
          inStock: !inStock,
        })
        .then((res) => {
          toast.success("Product status changed");
          router.refresh();
        })
        .catch((error) => {
          toast.error("Something went wrong");
        });
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string, images: any[]) => {
      toast("Deleting product, pls wait");
      const handleImgDelete = async () => {
        try {
          for (const item of images) {
            if (item.image) {
              const imageRef = ref(storage, item.image);
              await deleteObject(imageRef);
            }
          }
        } catch (error) {
          return console.log("Deleting images error", error);
        }
      };

      await handleImgDelete();

      axios
        .delete(`/api/product/${id}`)
        .then((res) => {
          toast.success("product deleted");
          router.refresh();
        })
        .catch((error) => {
          toast.error("Failed to delete product");
          console.log("error deleting prod", error);
        });
    },
    [router, storage]
  );

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Products" center />
      </div>
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
          disableRowSelectionOnClick
        />
      </Paper>
    </div>
  );
}

export default ManageProductsClient
