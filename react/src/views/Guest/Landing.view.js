import React, { useState } from "react";
import { Container, Image } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import "../../assets/styles/custom.css";
import logo from "../../assets/images/sior-logo.png";
import { Field, Form } from "react-final-form";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";

import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import countriesData from "../../assets/location.data/countries.json";
import statesData from "../../assets/location.data/states.json";
import citiesData from "../../assets/location.data/cities.json";

import { register, login } from "../../services/userService";
import { useNavigate } from "react-router-dom";

function Landing() {

  const navigate = useNavigate();

  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [registeredPassword, setRegisteredPassword] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  //login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.value);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.value);
    setSelectedCity(null);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.value);
  };

  const validate = (data) => {
    let errors = {};

    if (!data.name) {
      errors.name = "Name is required.";
    }

    if (!data.email) {
      errors.email = "Email is required.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
      errors.email = "Invalid email address. E.g. example@email.com";
    }

    if (!data.password) {
      errors.password = "Password is required.";
    }

    if (!data.date) {
      errors.date = "Date of birth is required";
    }

    if (!selectedCountry || !selectedState || !selectedCity) {
      errors.country = "Complete location is required";
    }

    if (!data.accept) {
      errors.accept = "You need to agree to the terms and conditions.";
    }

    return errors;
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  const onRegister = (data, form) => {
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
      contact: data.contact,
      birthdate: data.date ? data.date.toISOString().slice(0, 10) : null,
      country: selectedCountry.name,
      province: selectedState.name,
      city: selectedCity.name,
    };

    console.log(userData);

    register(userData);
    setRegisteredEmail(data.email);
    setRegisteredPassword(data.password);
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setShowMessage(true);

    form.restart(); //remove later?
  };

  const onRegisterLogin = async () => {
    try {
      const response = await login(registeredEmail, registeredPassword);
      localStorage.setItem('token', response.access_token)
      console.log('Login successful:', response);
      setRegisteredEmail(null);
      setRegisteredPassword(null);
      navigate('/user/dashboard') // temporary
      setShowMessage(false);
    } catch (error) {
      console.error('Login failed:', error);
      setShowMessage(false);
    }


  }

  const onLogin = async () => {
    if (!email || !password) {
      alert("Required Login Fields are missing.");
      return;
    }

    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.access_token)
      console.log('Login successful:', response);
      navigate('/user/dashboard') // temporary
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => { setShowMessage(false); onRegisterLogin(); }} // temporary
      />
    </div>
  );
  const passwordHeader = <h6>Pick a password</h6>;
  const passwordFooter = (
    <React.Fragment>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </React.Fragment>
  );

  return (
    <Container fluid className="flex-column vh-100 g-0 overflow-hidden">
      <Dialog
        visible={showModal}
        onHide={handleModalToggle}
        header="SIOR - Seabed Intelligent Object Recognition (Terms and Conditions of use)"
        modal
        style={{ width: "50vw" }}
      >
        {/* Add your terms and conditions content here */}
        <div className="p-5 text-justify">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan
          mi quis dolor interdum, vel congue libero suscipit. Integer vitae dui
          eu libero vehicula elementum. Nunc commodo libero non lectus pulvinar
          ultricies. Vivamus quis orci sit amet leo vehicula eleifend id et
          odio. Fusce sit amet efficitur nisi. Maecenas vel turpis nec nisl
          consequat efficitur. Duis malesuada faucibus justo, id consequat ante
          tincidunt ac. Aenean consequat leo nec diam auctor, vitae sodales
          lorem fermentum. Integer vestibulum, leo et dictum suscipit, dui est
          commodo erat, non fermentum purus metus vitae erat. Vestibulum non
          velit id nisi fringilla tempor. Proin sit amet velit in sem tincidunt
          molestie. Vivamus quis ante et ligula interdum tincidunt eget id odio.
          Quisque euismod tellus vel nisl bibendum, vel scelerisque ex rhoncus.
          Suspendisse potenti. Aliquam non lectus vitae enim finibus mollis.
          Phasellus dignissim eros eu magna lobortis vehicula. Donec rutrum nisl
          nec nibh volutpat, non rutrum lorem lobortis. In hac habitasse platea
          dictumst. Proin vel nisi nec tortor bibendum blandit. Donec eleifend
          lacus eget ex posuere, et sollicitudin tortor condimentum. Aliquam sit
          amet turpis urna. Pellentesque habitant morbi tristique senectus et
          netus et malesuada fames ac turpis egestas. In hac habitasse platea
          dictumst. Quisque pulvinar nec orci et ornare. Sed sollicitudin
          sodales est, eget vestibulum justo. Integer pulvinar lorem eget
          commodo rhoncus. Pellentesque id nisi sit amet libero ultricies
          ullamcorper. Fusce efficitur turpis id dapibus laoreet. Curabitur
          efficitur mauris in enim tempus, id fringilla leo ultricies. Maecenas
          faucibus sollicitudin eros, vel vehicula velit congue a. Morbi
          lobortis orci in enim fermentum, eget bibendum libero faucibus. Morbi
          quis imperdiet metus. Sed laoreet tincidunt nulla, eget vestibulum ex
          ultricies eget. <br /> <br /> Nullam dictum velit eu dapibus feugiat.
          Nam lacinia felis vitae luctus vulputate. Vivamus id urna nec sem
          bibendum volutpat. Quisque suscipit libero quis libero tincidunt, sed
          finibus ligula accumsan. Nullam gravida leo in malesuada mattis.
          Phasellus ut nisi tellus. Sed vulputate lobortis justo vel sagittis.
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Cras auctor ut sapien nec lacinia. Vivamus id
          pretium justo. Phasellus id luctus tortor. Vivamus tempor malesuada
          libero, vel luctus arcu consequat at. Vestibulum condimentum, est quis
          malesuada bibendum, nunc eros dignissim est, vel aliquam arcu leo id
          metus. Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Ut elementum, justo ut tristique
          fermentum, ligula enim hendrerit metus, nec fermentum ligula ex sit
          amet sem. Proin nec posuere urna. In nec felis ut lorem consequat
          rutrum a eu dui. Integer ac ipsum ut purus mollis dictum vel in leo.
          Fusce id scelerisque felis, nec bibendum elit. Aenean bibendum metus
          nec libero molestie ultrices. Curabitur elementum tortor vel turpis
          feugiat, at efficitur odio ullamcorper. Aliquam sed diam nisi.
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Integer sed tellus hendrerit, convallis magna
          sed, cursus dolor. Donec fringilla, dolor non malesuada elementum,
          lorem ipsum dictum turpis, vitae consequat arcu libero et purus.
          Vestibulum bibendum nisi nec enim suscipit, ut malesuada erat auctor.
          Donec non velit et ex luctus pulvinar id et purus. Ut ut efficitur
          turpis, eu tincidunt justo. Ut sed tellus at mi ultricies tempor.
          Nulla facilisi. Nam placerat venenatis lacus vel commodo. Maecenas
          lacinia vel ante vitae faucibus. Sed aliquet turpis id volutpat
          vestibulum. Suspendisse auctor sodales enim, nec varius quam efficitur
          eget. Nulla facilisi. Nam id malesuada ante. Quisque ut mi ac ipsum
          cursus interdum vel sed urna. Donec suscipit ligula in lorem eleifend,
          sit amet sagittis nulla fermentum. Integer varius erat sed sem
          suscipit, eget fermentum turpis consectetur. Duis vitae tortor et erat
          pharetra elementum. In congue turpis id ligula rutrum, et luctus est
          molestie. Integer auctor ex vel est luctus aliquet. Donec suscipit
          ligula ut semper faucibus. Ut at nulla nisi. Nullam feugiat nulla vel
          est consectetur, sit amet dignissim sapien vehicula. Nullam vulputate
          arcu sit amet ex suscipit, vel bibendum dolor dignissim. Nullam
          eleifend sed felis a hendrerit. Mauris mattis dolor non lacus
          bibendum, nec eleifend sem convallis. Duis id vestibulum purus.
          Vestibulum sed consequat felis, sed aliquam felis. Proin quis suscipit
          risus. Nullam a sapien tortor. Duis nec pharetra mauris. Vivamus
          placerat odio id erat maximus commodo. Nunc volutpat augue nec urna
          fringilla, vel euismod lectus malesuada. Ut at justo bibendum,
          volutpat eros a, aliquet lectus. Donec nec eros nec leo ullamcorper
          sodales. Integer lobortis scelerisque arcu, id lacinia lorem laoreet
          nec. Vestibulum varius arcu eget libero ultricies, id facilisis purus
          mattis. Vivamus vel erat at sem tincidunt hendrerit id sit amet neque.
          Suspendisse vitae sapien ut libero dignissim vehicula a in leo. Proin
          a vehicula nisi. Morbi et lacus risus. Vestibulum ante ipsum primis in
          faucibus orci luctus et ultrices posuere cubilia Curae; Quisque nec
          orci nec dolor venenatis finibus nec id ex. Fusce in fringilla magna,
          vitae gravida metus. Aenean auctor nisl ut ante varius vestibulum. Ut
          vestibulum massa a libero aliquam, vel ultricies ipsum dictum. Nullam
          eget est dui. Donec ultricies nisi id malesuada lobortis. Etiam non
          elit sed odio lacinia faucibus. Aenean sit amet sem urna. Etiam a odio
          eget nisi tincidunt mattis. Donec sit amet felis in metus eleifend
          euismod. Curabitur consequat felis in tempor fermentum. In vitae
          vestibulum libero, eget rhoncus elit. Proin in turpis magna. Proin
          ullamcorper, justo ac scelerisque aliquet, purus sapien bibendum sem,
          vel aliquet tortor lectus sit amet sapien. Pellentesque id risus a
          augue pulvinar tincidunt. <br /> <br /> Donec eleifend ex vel mauris
          placerat, eget scelerisque lorem ultricies. Pellentesque feugiat elit
          eget arcu luctus, eget posuere ante cursus. Aliquam id tortor nec
          tortor fringilla rhoncus at at orci. Sed lacinia elit at eros
          molestie, a fringilla libero posuere. Sed ullamcorper diam sit amet
          purus suscipit aliquet. Donec sit amet lorem vel velit efficitur
          dignissim. Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Sed nec lacus vel justo tincidunt
          tincidunt. Aenean finibus id ipsum et tincidunt. Etiam in augue
          auctor, suscipit sem at, fringilla risus. Nulla quis est at felis
          aliquam sagittis sit amet sed arcu. Nullam accumsan, libero et luctus
          ultrices, justo est fringilla quam, non commodo eros augue a est.
          Integer sed enim vitae ligula dapibus iaculis in a arcu. Vestibulum id
          nunc at orci aliquet congue. Etiam bibendum vestibulum justo, nec
          tincidunt ligula tristique nec. Aliquam at arcu nec sem ullamcorper
          fermentum. Donec euismod, mi ut vehicula volutpat, elit ante lobortis
          ligula, nec efficitur ligula dolor sit amet tellus. Morbi fringilla mi
          sed ligula rhoncus, eu fringilla sem faucibus. Integer vitae molestie
          nisl. Suspendisse consectetur nulla et diam suscipit, vel ultricies
          eros consectetur. Sed aliquam velit at libero faucibus, et malesuada
          est consequat. Sed rutrum diam odio, in egestas neque sodales vitae.
          Integer fringilla, enim et consectetur vehicula, orci velit lacinia
          augue, vel vestibulum sapien neque at ex. Aliquam eu est urna. Duis
          sit amet tincidunt libero. Proin ut vulputate mauris, vitae lobortis
          nulla. Etiam hendrerit mauris eu libero maximus dignissim. Duis sed
          libero libero. Proin eu nunc quis nulla tincidunt vulputate. Curabitur
          pulvinar, metus vel sodales aliquet, tortor lectus mattis justo, sed
          eleifend elit nulla in purus. Phasellus vitae libero sed lorem finibus
          fringilla. Proin rhoncus enim a velit egestas, vitae varius libero
          rhoncus. Phasellus efficitur, tortor quis gravida ultrices, purus
          ipsum rutrum erat, ut tempor arcu est quis purus. Duis vel bibendum
          ligula, vitae mattis metus. Curabitur non sapien id purus pretium
          iaculis. Nullam eu fermentum felis. Quisque sed ipsum mi. Cras feugiat
          malesuada ligula vel posuere. Etiam vel turpis quis ex egestas
          placerat vel id nisi. Donec ut vestibulum ante. Fusce maximus augue id
          justo ultricies, eget bibendum sapien laoreet. Maecenas et risus in mi
          vestibulum volutpat. Cras sit amet elit velit. Aenean ut pharetra
          risus, eget maximus nulla. In porttitor sapien et justo placerat
          eleifend.
          <br /> <br /> Donec vitae magna quis sapien lacinia tempus non at
          sapien. Maecenas consequat, arcu in condimentum dictum, orci ligula
          fermentum eros, nec pretium orci eros et nisi. Duis quis libero nec
          urna consectetur ornare. Nullam ut mauris eu risus ullamcorper
          efficitur eget vitae lacus. Nam pellentesque, nulla sit amet venenatis
          pulvinar, risus purus venenatis felis, ac eleifend felis purus et est.
          Nam non magna non quam egestas mollis nec id arcu. Proin pretium,
          libero a pellentesque pretium, tortor enim scelerisque est, a
          tincidunt lacus quam eget nisl. Pellentesque habitant morbi tristique
          senectus et netus et malesuada fames ac turpis egestas. Fusce eget
          ipsum vel lacus consequat dictum. Duis bibendum euismod libero nec
          eleifend. Sed accumsan, ligula nec fermentum consequat, sapien nisi
          vehicula lacus, vel sollicitudin odio enim ut ante. Nam tincidunt
          dolor id vehicula tempus. In hac habitasse platea dictumst. Ut luctus,
          mauris non bibendum tempor, justo ligula faucibus elit, quis
          condimentum neque justo eu risus. Pellentesque pretium lectus sit amet
          eros luctus fringilla. Duis placerat justo nec felis fermentum
          lobortis. In gravida, enim ut tristique tincidunt, elit lacus dapibus
          eros, id suscipit justo magna et justo. Pellentesque consequat risus
          vitae mauris cursus, in tincidunt lectus ultricies. Sed auctor libero
          vel vestibulum fermentum. Nam ut tortor a turpis aliquet egestas.
          Pellentesque nec enim sed ligula sodales condimentum. Nulla et urna
          tincidunt, volutpat risus eu, tempor libero. Sed id augue sit amet est
          tincidunt vehicula. Proin fermentum lorem sit amet enim fringilla, ut
          suscipit elit vestibulum. Integer eleifend vehicula justo, eget
          eleifend lacus tempus nec. Vestibulum auctor sapien sed purus posuere,
          id tincidunt nulla laoreet. Donec vel turpis sed justo maximus
          ullamcorper at nec leo. Nullam sagittis tincidunt vehicula. Nam vel ex
          mauris. Phasellus ultrices, turpis vel feugiat egestas, tortor lacus
          condimentum dolor, vel vehicula mi est non nulla. Duis sit amet quam
          nec enim elementum dapibus. Donec eget dolor eu urna varius finibus
          nec sit amet purus. Aliquam erat volutpat. Nulla ut magna a ante
          placerat consectetur a et urna. Vivamus at turpis sed nisi facilisis
          efficitur. Duis nec mi ipsum. Maecenas a felis rutrum, aliquet ipsum
          et, consequat odio. Nulla facilisi. Nam non magna ex. Maecenas
          ullamcorper, lorem a vehicula euismod, odio lacus rhoncus felis, non
          rutrum ligula justo non arcu. Cras at sodales ex. Suspendisse
          ultricies metus at mi tempus, eget sagittis leo bibendum. Aenean id
          urna sit amet turpis gravida tincidunt in vel ex. Quisque vehicula
          rutrum ex, sed ultrices libero bibendum id. Sed nec odio pretium,
          aliquam lectus a, mollis dolor. Duis viverra accumsan felis, a finibus
          erat consectetur at. Vestibulum vel efficitur nisi. Integer sodales
          aliquam purus, a aliquam elit vehicula nec. Cras eleifend lacus quis
          malesuada suscipit. <br /> <br /> Suspendisse vitae ipsum eget nisi
          consequat scelerisque. Proin eu condimentum odio, id sollicitudin
          nunc. Nulla facilisi. In nec ipsum vitae est fermentum dictum. Integer
          consequat magna in enim tristique, eu elementum lacus interdum.
          Integer scelerisque, lectus at vehicula vehicula, nisi velit tincidunt
          turpis, sit amet ultrices dolor metus eu nunc. Nullam quis tincidunt
          libero, vel rutrum nisi. Curabitur feugiat mi libero, non efficitur
          purus convallis nec. Duis quis est in orci dictum sollicitudin. Duis
          feugiat elit vel lacus malesuada, sit amet tempor odio consequat.
          Fusce feugiat consequat elit nec rutrum. Sed id ultricies odio. Nullam
          ultricies, orci eget pellentesque congue, magna ipsum eleifend mi, eu
          tincidunt erat lorem quis felis. Morbi eget nulla sit amet turpis
          malesuada efficitur. Integer eu ipsum augue. Donec eu tellus eu lectus
          vehicula malesuada. Donec condimentum tortor eget posuere commodo.
          Vivamus tempor enim nec eleifend tincidunt. Morbi rutrum lectus ut
          purus consectetur, a vestibulum justo mattis. Nam ultricies, justo
          quis condimentum sagittis, ex lorem bibendum dui, vitae hendrerit
          dolor elit eget nunc. Ut laoreet tortor quis diam rutrum varius. Sed
          tristique vestibulum eros nec egestas. Suspendisse potenti. Donec
          pretium odio non tortor faucibus rutrum. Ut posuere bibendum orci vel
          ultricies. Cras vitae urna vel enim tristique interdum non vel augue.
          Ut rutrum erat nec justo pretium, id pharetra enim tincidunt. Aliquam
          erat volutpat. Suspendisse potenti. Integer id elit id odio efficitur
          lobortis. Aenean vestibulum justo id nulla iaculis, ut malesuada neque
          pretium. Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Duis maximus tellus nec odio
          molestie, vel consequat urna aliquet. Morbi sit amet volutpat lectus.
          Proin rhoncus sem at dui molestie, non luctus odio efficitur. Aenean
          sit amet tellus in risus varius volutpat sit amet id ipsum. Aliquam
          non metus nec dui fringilla rhoncus. Aliquam commodo orci quis tellus
          bibendum, vel consectetur tortor efficitur. Morbi aliquet lacus et
          arcu tincidunt, eget ultricies ligula consectetur. Etiam hendrerit
          convallis nisl, nec consequat mi sodales sit amet. Pellentesque
          efficitur risus id lacus tristique efficitur. Proin molestie, urna nec
          finibus feugiat, elit velit bibendum eros, eu euismod libero nunc ac
          justo. Integer condimentum, elit vitae elementum vestibulum, velit
          nisl lobortis erat, quis efficitur leo elit vel magna. Integer
          vestibulum tortor sit amet velit accumsan bibendum. Proin vitae
          feugiat erat. Nam id lobortis mi. Aliquam nec eleifend purus. Nam
          rhoncus sapien at lacus tristique mollis. Nullam ultricies
          sollicitudin purus sit amet lacinia. Maecenas in diam quis nisl
          gravida tempor. Ut sollicitudin ante ac est malesuada, sit amet
          ultrices arcu fermentum. Donec sollicitudin libero sit amet metus
          iaculis tempus. Sed ultrices est sed cursus fringilla. Proin at ex nec
          eros lacinia dictum. Nullam tempor purus quis elit pretium, ut
          fermentum purus malesuada. Aliquam rhoncus auctor ipsum, a dictum urna
          condimentum non. Integer malesuada metus in nibh aliquet, quis
          pulvinar tortor pulvinar. Curabitur tempus libero vitae dui lacinia
          efficitur. Praesent ac purus risus. Quisque ut tincidunt sem. Fusce
          pretium ipsum in ligula commodo, a sollicitudin ante bibendum. Donec
          lacinia augue ac commodo tristique. Maecenas sodales lacus velit, sit
          amet elementum sem gravida eget. Cras ut neque urna. Vivamus lobortis
          hendrerit ante. Proin efficitur nisi ut mauris rutrum, quis pharetra
          nisi elementum. Ut fermentum, urna id consectetur condimentum, nulla
          ligula vehicula ligula, nec auctor lorem elit nec metus. In hac
          habitasse platea dictumst. Aliquam commodo felis vel quam commodo
          suscipit. Donec vel lacus feugiat, tempor odio a, dapibus arcu.
          Integer non dolor vitae nulla bibendum cursus. Integer vel ligula quis
          lacus cursus tristique.
        </div>
      </Dialog>
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position="top"
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "30vw" }}
      >
        <div className="d-flex align-items-center flex-column pt-5 px-3">
          <i
            className="pi pi-check-circle"
            style={{ fontSize: "5rem", color: "var(--green-500)" }}
          ></i>
          <h5>Registration Successful!</h5>
          <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
            Your account is registered; it'll be valid next 30 days without
            activation. Please check Email for activation instructions.
          </p>
        </div>
      </Dialog>
      <header className="d-flex justify-content-between shadow-xl w-100">
        <div className="clickable">
          <Image src={logo} roundedCircle style={{ width: "72px" }} />
        </div>
        <div className="d-flex">
          <div className="">
            <div className="d-flex">
              <InputText
                id="lemail"
                placeholder="Email"
                className="mx-1"
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Password
                name="lpassword"
                feedback={false}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                onClick={() => onLogin()}
                label="Login"
                rounded
                className="mx-1"
              />
            </div>
          </div>
        </div>
      </header>
      <main className="d-flex h-100 w-100 bg-ocean">
        <section className="d-flex flex-column justify-content-center align-items-center w-50">
          <div className="w-75 text-white">
            <h1>Lorem ipsum</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <Button label="Explore" />
          </div>
        </section>
        <section className="d-flex flex-column justify-content-center align-items-center w-50">
          <div className="d-flex flex-column pb-5 rounded-3 w-50 shadow-lg card">
            <div className="d-flex justify-content-center">
              <Form
                onSubmit={onRegister}
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  date: null,
                  country: null,
                  state: null,
                  city: null,
                  accept: false,
                }}
                validate={validate}
                render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} className="p-fluid w-75">
                    <h3>Sign up here</h3>
                    <Field
                      name="name"
                      render={({ input, meta }) => (
                        <div className="field">
                          <span className="p-input-icon-left">
                            <i className="pi pi-user ml-2" />
                            <InputText
                              autoComplete="on"
                              id="name"
                              {...input}
                              className="pl-5"
                              placeholder="Name"
                            />
                          </span>
                          {getFormErrorMessage(meta)}
                        </div>
                      )}
                    />
                    <Field
                      name="email"
                      render={({ input, meta }) => (
                        <div className="field">
                          <span className="p-input-icon-left">
                            <i className="pi pi-envelope ml-2" />
                            <InputText
                              autoComplete="off"
                              id="email"
                              {...input}
                              className="pl-5"
                              placeholder="Email"
                            />
                          </span>
                          {getFormErrorMessage(meta)}
                        </div>
                      )}
                    />
                    <Field
                      name="contact"
                      render={({ input, meta }) => (
                        <div className="field">
                          <span className="p-input-icon-left">
                            <i className="pi pi-phone ml-2" />
                            <InputText
                              autoComplete="on"
                              id="contact"
                              {...input}
                              className="pl-5"
                              placeholder="Contact"
                            />
                          </span>
                          {getFormErrorMessage(meta)}
                        </div>
                      )}
                    />
                    <Field
                      name="password"
                      render={({ input, meta }) => (
                        <div className="field">
                          <span className="p-input-icon-left">
                            <Password
                              id="password"
                              {...input}
                              toggleMask
                              header={passwordHeader}
                              footer={passwordFooter}
                              placeholder="Enter Password"
                              autoComplete="current-password" // Added autocomplete attribute
                            />
                          </span>
                          {getFormErrorMessage(meta)}
                        </div>
                      )}
                    />
                    <Field
                      name="date"
                      render={({ input, meta }) => (
                        <div className="field">
                          <span className="p-float-label">
                            <Calendar
                              id="dateOfBirth"
                              {...input}
                              dateFormat="dd/mm/yy"
                              mask="99/99/9999"
                              showIcon
                            />
                            <label htmlFor="dateOfBirth">Date of Birth</label>
                          </span>
                          {getFormErrorMessage(meta)}
                        </div>
                      )}
                    />
                    <Field
                      name="country"
                      autoComplete="on"
                      render={({ input, meta }) => (
                        <div className="field">
                          {getFormErrorMessage(meta)}
                          <Dropdown
                            id="country"
                            className="mb-3"
                            optionLabel="name"
                            {...input}
                            filter
                            value={selectedCountry}
                            options={countriesData}
                            onChange={handleCountryChange}
                            placeholder="Select a Country"
                          />
                        </div>
                      )}
                    />
                    <Field
                      name="state"
                      autoComplete="on"
                      render={({ input, meta }) => (
                        <div className="field">
                          <Dropdown
                            id="state"
                            className="mb-3"
                            optionLabel="name"
                            filter
                            {...input}
                            value={selectedState}
                            options={
                              selectedCountry
                                ? statesData[selectedCountry.id]
                                : []
                            }
                            onChange={handleStateChange}
                            placeholder="Select a State"
                          />
                        </div>
                      )}
                    />
                    <Field
                      name="city"
                      autoComplete="on"
                      render={({ input, meta }) => (
                        <div className="field">
                          <Dropdown
                            className="mb-3"
                            id="city"
                            optionLabel="name"
                            {...input}
                            filter
                            value={selectedCity}
                            options={
                              selectedState ? citiesData[selectedState.id] : []
                            }
                            onChange={handleCityChange}
                            placeholder="Select a City"
                          />
                        </div>
                      )}
                    />

                    <Field
                      name="accept"
                      type="checkbox"
                      render={({ input, meta }) => (
                        <div className="field-checkbox">
                          <Checkbox
                            inputId="accept"
                            {...input}
                            className={classNames({
                              "p-invalid": isFormFieldValid(meta),
                            })}
                          />
                          <label
                            htmlFor="accept"
                            className={classNames({
                              "p-error": isFormFieldValid(meta),
                            })}
                          >
                            I agree to the{" "}
                            <span
                              onClick={handleModalToggle}
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              terms and conditions
                            </span>{" "}
                            of use*
                          </label>
                        </div>
                      )}
                    />
                    <Button type="submit" label="Submit" className="mt-2" />
                  </form>
                )}
              />
            </div>
          </div>
        </section>
      </main>
    </Container>
  );
}

export default Landing;
