'use client';

import { useCallback, useEffect, useState } from "react";
import Heading from "../../components/Heading";
import Input from "../../components/inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import TextArea from "../../components/inputs/TextArea";
import { categories } from "../../../utils/Categories";
import CategoryInput from "../../components/inputs/CategoryInput";
import CustomCheckbox from "../../components/inputs/CustomCheckBox";
import { colors } from "../../../utils/colors";
import SelectColor from "../../components/inputs/SelectColor";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import firebaseApp from "../../../libs/firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import axios from "axios";
import { useRouter } from "next/navigation";

export type ImageType = {
  color: string,
  colorCode: string,
  image:File | null,
}
export type UploadedImageType = {
  color: string,
  colorCode: string,
  image:string,
}

const AddProductForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [isProductCreated, setIsProductCreated] = useState(false);
 
  const {register, handleSubmit, setValue, watch, reset, formState:{errors}} = useForm<FieldValues>({
    defaultValues: {
      name:'',
      description:'',
      price:'',
      brand:'',
      category:'',
      inStock:false,
      images:[],
    },
  });

  useEffect(() => {
    setCustomValue('images', images);
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
   }, [isProductCreated]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log('Product data', data);
    // save data to mongodb
    setIsLoading(true);
    let uploadedImgs:UploadedImageType[] = [];
    if (!data.category) {
      setIsLoading(false);
      return toast.error('Categor is not selected');
    }
    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error('No selected image');
    }

    const handleImgUploads = async () => {
      toast("Creating products, please wait ....");
      try {
        for (const item of data.images) {
          if (item.image) {
            const fileName = new Date().getTime() + '-' + item.image.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);
            
            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  switch (snapshot.state) {
                    case "paused":
                      console.log("Upload is paused");
                      break;
                    case "running":
                      console.log("Upload is running");
                      break;
                  }
                },
                (error) => {
                  console.log("Error Uploading", error);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    uploadedImgs.push({
                      ...item, 
                      image:downloadURL
                    });
                    console.log("File available at", downloadURL);
                    resolve();
                  }).catch(error => {
                    console.log('Error getting the downloadable url', error);
                    reject(error);
                  });
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log('error handling img uploads', error);
        return toast.error('Error hanlding img upload');
      }
    };
    await handleImgUploads();
    const productData = { ...data, images: uploadedImgs };
    console.log("productData", productData);
    axios.post('/api/product', productData).then(() => {
      toast.success("product created");
      setIsProductCreated(true);
      router.refresh();
    }).catch((error) => {
      toast.error("Somethign went wrong");
    }).finally(() => {
      setIsLoading(false);
    });
  }

  
  
  const category = watch('category');
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,  
    });
  }

  const addImageToState = useCallback((value:ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    })
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImgs = prev.filter(item => item.color !== value.color);
        return filteredImgs;
      }
      return prev;
    });
  }, []);

  return (
    <>
      <Heading title="Add a Product" center />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="Price"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="number"
        required
      />
      <Input
        id="brand"
        label="Brand"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckbox
        id="inStock"
        label="This product is in stock"
        disabled={isLoading}
        register={register}
      />
      <div className="w-full font-medium ">
        <div className="mb-2 font-semibold">Select Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 max-h[50vh] overflow-y-auto gap-3">
          {categories.map((item) => {
            if (item.label === 'All') {
              return null;
            }
            return <div key={item.label} className="col-span">
              <CategoryInput
                onClick={(category) => setCustomValue('category', category)}
                selected={category === item.label}
                label={item.label}
                icon={item.icon}
              />
            </div>
          })}
        </div>
      </div>
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">
             Select the available product colors and upload their images
          </div>
          <div className="text-sm">
            You must upload an image for each of the color selected otherwise your color selection will be ignored.
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
          {colors.map((item, index) => {
            return (
              <SelectColor
                key={index}
                item={item}
                addImageToState={addImageToState}
                removeImageFromState={removeImageFromState}
                isProducCreated={false}
              />
            );
          }) }
        </div>
      </div>
      <Button label={isLoading ? 'Loading...':'Add Product'} onClick={handleSubmit(onSubmit)}   />
    </>
  );
}

export default AddProductForm

