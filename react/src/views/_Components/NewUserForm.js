import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import countriesData from "../../assets/location.data/countries.json";
import statesData from "../../assets/location.data/states.json";
import citiesData from "../../assets/location.data/cities.json";
import { Button } from "primereact/button";

import { register } from "../../services/userService";

const NewUserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

   // Handle form submission
   const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
      contact,
      birthdate: birthday ? birthday.toISOString().slice(0, 10) : null,
      country: country.name,
      provice: state.name,
      city: city.name,
    };

    register(userData);

    // Process the form data (e.g., send to server)
    console.log(userData);

    // Reset form fields after submission (if needed)
    setName("");
    setEmail("");
    setContact("");
    setPassword("");
    setBirthday("");
    setCountry("");
    setState("");
    setCity("");
  };

  const handleCountryChange = (e) => {
    setCountry(e.value);
    setState(null);
    setCity(null);
  };

  const handleStateChange = (e) => {
    setState(e.value);
    setCity(null);
  };

  const handleCityChange = (e) => {
    setCity(e.value);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column">
      <label htmlFor="name">Name:</label>
      <InputText
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="email">Email:</label>
      <InputText
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="contact">Contact:</label>
      <InputMask
        id="contact"
        mask="(999) 999-9999"
        value={contact}
        onChange={(e) => setContact(e.value)}
        placeholder="(999) 999-9999"
      />
      <label htmlFor="password">Password:</label>
      <Password
        id="password"
        value={password}
        autoComplete="off"
        onChange={(e) => setPassword(e.target.value)}
        toggleMask
      />
      <label htmlFor="birthday">Birthday:</label>
      <Calendar
        id="birthday"
        className="mb-1"
        value={birthday}
        onChange={(e) => setBirthday(e.value)}
        placeholder="Select a Date"
        dateFormat="dd/mm/yy"
        mask="99/99/9999"
        showIcon
      />
      <label htmlFor="country">Country:</label>
      <Dropdown
        id="country"
        className="mb-1"
        optionLabel="name"
        value={country}
        options={countriesData}
        onChange={handleCountryChange}
        placeholder="Select a Country"
      />
      <label htmlFor="state">State:</label>{" "}
      <Dropdown
        id="state"
        className="mb-1"
        optionLabel="name"
        value={state}
        options={country ? statesData[country.id] : []}
        onChange={handleStateChange}
        placeholder="Select a State"
        disabled={!country} // Disable the state dropdown if no country is selected
      />
      <label htmlFor="city">City:</label>
      <Dropdown
        id="city"
        className="mb-1"
        optionLabel="name"
        value={city}
        options={state ? citiesData[state.id] : []}
        onChange={handleCityChange}
        placeholder="Select a City"
        disabled={!state} // Disable the city dropdown if no state is selected
      />
      <Button className="mt-2" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default NewUserForm;
