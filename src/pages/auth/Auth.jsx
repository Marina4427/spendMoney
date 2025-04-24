import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { IMaskInput } from "react-imask";
import { authUser } from "../../redux/reducers/authSlice";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { clearAuthError } from "../../redux/reducers/authSlice";

const Auth = () => {
  const [status, setStatus] = useState("login");
  const [passwordView, setPasswordView] = useState(false);

  const error = useSelector((state) => state.auth.error);

  const navigate = useNavigate();
  const password = useRef({});

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  password.current = watch("password", "");

  const handleTabChange = (newStatus) => {
    setStatus(newStatus);
    dispatch(clearAuthError());
    reset({}, { keepErrors: false });
  };

  const submitForm = (data) => {
    let { confirmPwd, ...user } = data;

    dispatch(authUser({ user, params: status }))
      .unwrap()
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {});
  };

  return (
    <div className="auth">
      <div className="container" ref={password}>
        <form
          onSubmit={handleSubmit(submitForm)}
          noValidate
          className="auth__form"
        >
          <div className="auth__inputs">
            <ul className="auth__theme">
              <li
                style={{ color: status === "login" ? "red" : "black" }}
                onClick={() => handleTabChange("login")}
              >
                Sign In
              </li>
              <li
                style={{ color: status === "register" ? "red" : "black" }}
                onClick={() => handleTabChange("register")}
              >
                Sign Up
              </li>
            </ul>

            <label>
              <p>Enter your email</p>
              <input
                {...register("email", {
                  required: "Field is required",
                  minLength: {
                    message: "Minimum 7 characters",
                    value: 7,
                  },
                  pattern: {
                    message: "Enter correctly your email",
                    value: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
                  },
                })}
                type="email"
                placeholder="email"
                autoComplete="username"
              />
              <p className="error-message">{errors?.email?.message}</p>
            </label>

            {status === "register" && (
              <>
                <label>
                  <p>Enter your name</p>
                  <input
                    {...register("name", {
                      required: "Field is required",
                      minLength: {
                        message: "Minimum 2 characters",
                        value: 2,
                      },
                      pattern: {
                        message: "Enter correctly your name",
                        value: /^[a-zA-Zа-яА-ЯёЁ\s-]{2,}$/,
                      },
                    })}
                    type="text"
                    placeholder="Name"
                  />
                  <p className="error-message">{errors?.name?.message}</p>
                </label>

                <label>
                  <p>Enter your phone</p>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Field is required",
                      pattern: {
                        value: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
                        message: "Enter correctly your phone",
                      },
                    }}
                    render={({ field }) => (
                      <IMaskInput
                        {...field}
                        mask="+7 (000) 000-00-00"
                        unmask={false}
                        inputRef={field.ref}
                        lazy={false}
                        placeholder="+7 (___) ___-__-__"
                        type="tel"
                        onAccept={(value) => field.onChange(value)}
                      />
                    )}
                  />
                  <p className="error-message">{errors?.phone?.message}</p>
                </label>
              </>
            )}

            <label>
              <p>Enter your password</p>
              <div className="input-wrapper">
                <input
                  {...register("password", {
                    required: "Field is required",
                    pattern: {
                      message:
                        "Password must contain at least 8 characters, a capital letter and a number!",
                      value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}$/,
                    },
                  })}
                  type={passwordView ? "text" : "password"}
                  placeholder="password"
                  autoComplete="current-password"
                />
                <span
                  className="form__label-icon"
                  onClick={() => setPasswordView((prev) => !prev)}
                >
                  {passwordView ? <FaRegEye /> : <FaRegEyeSlash />}
                </span>
              </div>

              <p className="error-message">{errors?.password?.message}</p>
            </label>

            {status === "register" && (
              <label className="inpur-wrapper">
                <p>Confirm password</p>
                <div className="input-wrapper">
                  <input
                    {...register("confirmPwd", {
                      validate: (value) =>
                        value === password.current ||
                        "The password do not match!",
                    })}
                    type={passwordView ? "text" : "password"}
                    placeholder="password"
                  />
                  <span
                    className="form__label-icon"
                    onClick={() => setPasswordView((prev) => !prev)}
                  >
                    {passwordView ? <FaRegEye /> : <FaRegEyeSlash />}
                  </span>
                </div>
                <p className="error-message">{errors?.confirmPwd?.message}</p>
              </label>
            )}

            <button className="auth__btn" type="submit">
              {status === "register" ? "Sign Up" : "Sign In"}
            </button>
          </div>
          {error && (
            <p
              className="error-message"
              style={{ textAlign: "center", marginTop: "10px" }}
            >
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
