'use client';

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SafeUser } from "../../types";

interface RegisterFormProps {
  currentUser: SafeUser | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

useEffect(() => {
 if (currentUser) {
   router.push("/cart");
   router.refresh();
 }
}, []);

  const onSubmit: SubmitHandler<FieldValues> = (fValues) => {
    setIsLoading(true);
    axios
      .post("/api/register", fValues)
      .then(() => {
        toast.success("Account created!");
        signIn("credentials", {
          email: fValues.email,
          password: fValues.password,
          redirect: false,
        }).then((callback) => {
          if (callback?.ok) {
            router.push("/cart");
            router.refresh();
            toast.success("Loggin in");
          }
          if (callback?.error) {
            toast.error(callback.error);
          }
        });
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };
if (currentUser) {
  return <p className="text-center">Logged in ....Redirecting</p>;
}
  return (
    <>
      <Heading title="Sign up for e-shop" />
      <Button outline label="Continue with Google" icon={AiOutlineGoogle} onClick={() => {signIn("google");}} />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="name"
        label="Name"
        disabled={false}
        register={register}
        errors={errors}
        required={true}
      />
      <Input
        id="email"
        label="Email"
        disabled={false}
        register={register}
        errors={errors}
        required={true}
      />
      <Input
        id="password"
        label="Password"
        disabled={false}
        register={register}
        errors={errors}
        type="password"
        required={true}
      />
      <Button
        label={isLoading ? "...Loading" : "Sign Up"}
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
      />
      <p className="text-sm">
        Already have an account ?
        <Link href="/login" className="underline">
          {" "}
          Log In
        </Link>
      </p>
    </>
  );
};

export default RegisterForm
