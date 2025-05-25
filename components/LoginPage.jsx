import styles from "../styles/LoginPage.module.css";
import logo from "../public/Union.png";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../features/validationOnSchema";
import { useLogin } from "../features/auth/useLogin";
import { jwtDecode } from "jwt-decode";

import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const { mutate, isLoading } = useLogin();
  const router = useRouter();

  const onSubmit = (data) => {
    const payload = {
      username: data.username,
      password: data.password,
    };

    mutate(payload, {
      onSuccess: (res) => {
        console.log(res);

        toast.success("ورود موفق ✅");
        localStorage.setItem("token", res.token);
        // decode token to get username
        const decoded = jwtDecode(res.token);
        const username = decoded.username;
        localStorage.setItem("username", username);
        router.push("/dashboard");
      },
      onError: (err) => {
        const serverMessage = err.response?.data?.message;

        let message = "خطا در ورود";

        if (serverMessage === "Invalid credentials") {
          message = "نام کاربری یا رمز اشتباه است ❌";
        }

        toast.error(message);
      },
    });
  };

  return (
    <>
      <p className={styles.title}>بوت کمپ بوتواستارت</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.LoginForm}>
        <div className={styles.formTitle}>
          <Image src={logo} alt="logo.png" />
          <p>فرم ورود</p>
        </div>
        <input
          type="text"
          {...register("username")}
          className={`${styles.inputs} ${
            errors.username ? styles.inputError : ""
          }`}
          placeholder="نام کاربری"
        />
        <p className={styles.error}>{errors.username?.message}</p>
        <input
          type="password"
          {...register("password")}
          className={`${styles.inputs} ${
            errors.password ? styles.inputError : ""
          }`}
          placeholder="رمز عبور"
        />
        <p className={styles.error}>{errors.password?.message}</p>
        <button className={styles.submit} disabled={isLoading}>
          {isLoading ? "در حال ورود..." : "ورود"}
        </button>
        <Link className={styles.toRegister} href="/">
          ایجاد حساب کاربری!
        </Link>
      </form>
    </>
  );
}

export default LoginPage;
