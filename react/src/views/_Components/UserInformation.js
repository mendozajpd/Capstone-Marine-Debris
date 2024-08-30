// UserInformation.js

import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";

import countriesData from "../../assets/location.data/countries.json";
import statesData from "../../assets/location.data/states.json";
import citiesData from "../../assets/location.data/cities.json";
import { Calendar } from "primereact/calendar";

import { deleteUser, updateUserInfo } from "../../services/userService";

const UserInformation = ({ userInfo }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState(userInfo.name);
  const [updatedContact, setUpdatedContact] = useState(userInfo.contact);
  const [updatedCountry, setUpdatedCountry] = useState(userInfo.country);
  const [updatedState, setUpdatedState] = useState(userInfo.province);
  const [updatedCity, setUpdatedCity] = useState(userInfo.city);
  const [updatedBirthday, setUpdatedBirthday] = useState(userInfo.birthday);

  const handleUpdate = () => {
    const updatedUserData = {
      name: updatedName,
      contact: updatedContact,
      country: updatedCountry,
      province: updatedState,
      city: updatedCity,
      birthday: updatedBirthday,
    };

    updateUserInfo(userInfo.id, updatedUserData);
    
    setIsEditMode(false);
  };

  const handleDelete = (userId) => {
    deleteUser(userId);
  };

  const handleCountryChange = (e) => {
    setUpdatedCountry(e.value);
    setUpdatedState(null);
    setUpdatedCity(null);
  };

  const handleStateChange = (e) => {
    setUpdatedState(e.value);
    setUpdatedCity(null);
  };

  const handleCityChange = (e) => {
    setUpdatedCity(e.value);
  };

  return (
    <div className="p-3">
      <Card title="User Information">
        <ul className="list-none">
          <li>
            <strong>Name:</strong>{" "}
            {isEditMode ? (
              <InputText
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            ) : (
              userInfo.name
            )}
          </li>
          <li>
            <strong>Contact:</strong>{" "}
            {isEditMode ? (
              <InputMask
                mask="(999) 999-9999"
                value={updatedContact}
                onChange={(e) => setUpdatedContact(e.value)}
                placeholder="(999) 999-9999"
              />
            ) : (
              userInfo.contact
            )}
          </li>
          <li>
            <strong>Country:</strong>{" "}
            {isEditMode ? (
              <Dropdown
                className="mb-1"
                optionLabel="name"
                value={updatedCountry}
                options={countriesData}
                onChange={handleCountryChange}
                placeholder={updatedCountry}
              />
            ) : (
              userInfo.country
            )}
          </li>
          <li>
            <strong>Province:</strong>{" "}
            {isEditMode ? (
              <Dropdown
                className="mb-1"
                optionLabel="name"
                value={updatedState}
                options={updatedCountry ? statesData[updatedCountry.id] : []}
                onChange={handleStateChange}
                placeholder={updatedState}
                disabled={!updatedCountry} // Disable the state dropdown if no country is selected
              />
            ) : (
              userInfo.province
            )}
          </li>
          <li>
            <strong>City:</strong>{" "}
            {isEditMode ? (
              <Dropdown
                className="mb-1"
                optionLabel="name"
                value={updatedCity}
                options={updatedState ? citiesData[updatedState.id] : []}
                onChange={handleCityChange}
                placeholder={updatedCity}
                disabled={!updatedState} // Disable the city dropdown if no state is selected
              />
            ) : (
              userInfo.city
            )}
          </li>
          <li>
            <strong>Birthday:</strong>{" "}
            {isEditMode ? (
              <Calendar
                id="birthdate"
                className="mb-1"
                value={updatedBirthday}
                onChange={(e) => setUpdatedBirthday(e.value)}
                placeholder={updatedBirthday}
                dateFormat="dd/mm/yy"
                mask="99/99/9999"
                showIcon
              />
            ) : (
              userInfo.birthdate
            )}
          </li>
        </ul>
        <div className="d-flex gap-2">
          {isEditMode ? (
            <div>
              <Button
                label="Update"
                className="p-button-primary"
                onClick={() => handleUpdate()}
              />
              ,
              <Button
                label="Cancel"
                className="p-button-secondary"
                onClick={() => setIsEditMode(false)}
              />{" "}
            </div>
          ) : (
            <div>
              <Button
                label="Edit"
                className="p-button-secondary"
                onClick={() => setIsEditMode(true)}
              />
              ,
              <Button
                label="Delete User"
                className="p-button-danger"
                onClick={() => handleDelete(userInfo.id)}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserInformation;
