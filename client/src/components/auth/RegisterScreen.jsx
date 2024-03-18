import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import validator from "validator";
import { startRegister } from "../../actions/auth";
import { removeError, setError } from "../../actions/ui";
import useForm from "../../forms/useForm";
import Alert from "../ui/Alert";

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const { msgError } = useSelector((state) => state.ui);
  const [formValues, handleInputChange] = useForm({
    name: "",
    email: "",
    password: "",
    password2: "",
    color: "",
  });
  const { name, email, password, password2, color } = formValues;

  const handleRegister = (e) => {
    e.preventDefault();
    if (isFormValid()) dispatch(startRegister(name, email, password, color));
  };

  const isFormValid = () => {
    if (name.trim().length === 0) {
      dispatch(setError("Name is required"));
      return false;
    } else if (name.trim().length > 32) {
      dispatch(setError("Name length must be max 32 characters"));
      return false;
    } else if (!validator.isEmail(email)) {
      dispatch(setError("Email is not valid"));
      return false;
    } else if (
        !validator.isStrongPassword(password.toString()) ||
        password.length > 32
    ) {
      dispatch(
          setError(
              "Password should be between 8-32 characters and should include 1 number, 1 symbol, 1 lowercase and 1 uppercase"
          )
      );
      return false;
    } else if (password !== password2) {
      dispatch(setError("Passwords should match"));
      return false;
    } else if (!color) { // Check if color is selected
      dispatch(setError("Color is required"));
      return false;
    }
    dispatch(removeError());
    return true;
  };

  // Predefined color options
  const colorOptions = [
    { name: "Red", value: "#ff0000" },
    { name: "Green", value: "#00ff00" },
    { name: "Blue", value: "#0000ff" },
    { name: "Yellow", value: "#ffff00" },
    { name: "Orange", value: "#ffa500" },
  ];

  return (
      <section className="card card--inverse">
        <div className="card__row card__row--left">
          <div className="card__body">
            <h1 className="card__title">Create account</h1>
            <form className="form" onSubmit={handleRegister}>
              {msgError && <Alert type="error" description={msgError} />}
              <div className="form__field">
                <label htmlFor="name" className="form__label">
                  Name
                </label>
                <input
                    className="form__input"
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={handleInputChange}
                />
              </div>
              <div className="form__field">
                <label htmlFor="email" className="form__label">
                  Email
                </label>
                <input
                    className="form__input"
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleInputChange}
                />
              </div>
              <div className="form__field">
                <label htmlFor="password" className="form__label">
                  Password
                </label>
                <input
                    className="form__input"
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={handleInputChange}
                />
              </div>
              <div className="form__field">
                <label htmlFor="password2" className="form__label">
                  Password confirmation
                </label>
                <input
                    className="form__input"
                    type="password"
                    name="password2"
                    id="password2"
                    value={password2}
                    onChange={handleInputChange}
                />
              </div>
              <div className="form__field">
                <label htmlFor="color" className="form__label">
                  Choose Color
                </label>
                <select
                    className="form__input"
                    name="color"
                    id="color"
                    value={color}
                    onChange={handleInputChange}
                >
                  <option value="">Select a color</option>
                  {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary" type="submit">
                Register
              </button>
            </form>
          </div>
        </div>
        <div className="card__row card__row--colored card__row--right">
          <div className="card__body">
            <Link
                className="btn btn-primary btn-primary--outline"
                to="/auth/login"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
  );
};

export default RegisterScreen;
