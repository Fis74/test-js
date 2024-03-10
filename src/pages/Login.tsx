import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getClasses } from "../utils/getClasses";
import styles from "../styles/modules/forms.module.scss";
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/Api";
import { useAppSelector } from "../hooks/hooks";

interface MyFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const { user } = useAppSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginUser, { isLoading, isError, isSuccess }] = useLoginMutation();
  const initialValues: MyFormValues = { email: "", password: "" };
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/[a-z0-9]+@[a-z]+\.[a-z]/, "Неверный email")
      .required("Введите email"),
    password: Yup.string()
      .min(2, "Минимум 2 буквы")
      .max(50, "Максимум 50 букв")
      .required("Введите пароль"),
  });

  const handle = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/");
    }
  }, [isSuccess, user]);

  const onSubmit = ({ password, email }: MyFormValues) => {
    loginUser({ password, email });
  };

  return (
    <div className={getClasses([styles.inner])}>
      <div className={getClasses([styles.login])}>
        <h1 className={getClasses([styles.title])}>Войти</h1>
        {isError && (
          <span className={getClasses([styles.formerror])}>Неверный логин или пароль</span>
        )}
        <Formik initialValues={initialValues} validationSchema={SignupSchema} onSubmit={onSubmit}>
          {({ errors, touched }) => (
            <Form className={getClasses([styles.form])}>
              <label htmlFor="email">Email*</label>
              <Field
                id="email"
                type="email"
                name="email"
                className={getClasses([
                  styles.input,
                  touched.email && errors.email && styles.novalid,
                ])}
              />
              <ErrorMessage component="div" name="email" className={getClasses([styles.error])} />
              <label htmlFor="password">Password*</label>
              <div className={getClasses([styles.password])}>
                <Field
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={getClasses([
                    styles.input,
                    touched.password && errors.password && styles.novalid,
                  ])}
                />
                {showPassword ? (
                  <MdOutlineVisibility className={getClasses([styles.icon])} onClick={handle} />
                ) : (
                  <MdOutlineVisibilityOff className={getClasses([styles.icon])} onClick={handle} />
                )}
              </div>
              <ErrorMessage
                component="div"
                name="password"
                className={getClasses([styles.error])}
              />
              <button disabled={isLoading} className={getClasses([styles.button])} type="submit">
                {isLoading ? <span className={getClasses([styles.loader])}></span> : "Войти"}
              </button>
            </Form>
          )}
        </Formik>

        <span>
          Нету аккаунта?{" "}
          <Link to="/register" relative="path">
            Зарегистрироваться
          </Link>
        </span>
      </div>
    </div>
  );
};
export default Login;
