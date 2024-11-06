'use client';

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { SafeUser } from "../../types";

interface LoginFormProps {
  currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
 console.log("currentUser", currentUser);
 useEffect(() => {
   if (currentUser) {
     router.push('/cart');
     router.refresh();
  }
 }, []);

  const onSubmit: SubmitHandler<FieldValues> = (fValues) => {
    setIsLoading(true);
    signIn("credentials", {
      email: fValues.email,
      password: fValues.password,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.ok) {
          router.push("/cart");
          router.refresh();
          toast.success("Loggin in");
        }
        if (callback?.error) {
          toast.error(callback.error);
        }
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };
  if (currentUser) {
  return(<p className="text-center">Logged in ....Redirecting</p>)
}
  return (
    <>
      <Heading title="Sign in to e-shop" />
      <Button outline label="Continue with Google" icon={AiOutlineGoogle} onClick={() => { signIn('google'); }} />
      <hr className="bg-slate-300 w-full h-px" />
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
        label={isLoading ? "Loading.." : "Login"}
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
      />
      <p className="text-sm">
        Do not have an account ?
        <Link href="/register" className="underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm
