import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link,useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { SigninValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import {  useSignInAccount } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const {checkAuthUser,isLoading: isUserLoading} =useUserContext();
  const navigate =useNavigate();
  


  const {mutateAsync : signInAccount} = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
      
    },
  });
      
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount(
      {email: values.email,
      password: values.password,}
    )
    if(!session){
      return toast({title:"Login Failed"})
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate("/");
    } else {
     return toast({ title: "Login failed. Please try again."});
      
    }

  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img
          src="/assets/images/Untitled.png"
          alt="logo"
          style={{ width: "120px", height: "auto" }}
        />

        <h2 className="h3-bold md:h4-bold pt-5 sm:pt-2">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col gap-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary ">
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-3">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-2"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
