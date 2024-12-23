<template>
  <router-view />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Merienda&display=swap");
*,
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Gotham Narrow", sans-serif;
}
:root {
  --color-0: #ffffff;  /* White */
  --color-1: #1a5f57;  /* Dark teal */
  --color-1_1: #ade1d9; /* Light mint */
  --color-2: #2c3e50;  /* Navy gray */
  --color-3: #6d6f75;  /* Neutral gray */
  --color-3_3: #94979b; /* Light gray */
  --color-4: #ff914d;  /* Bright orange */
  --color-4_1: #ffe6c0; /* Soft apricot */
  --color-5: #d9534f;  /* Classic red */
    --transition-speed: .3s;
    --font-size-base: 1rem;
}
body {
  background-color: #cecfcf80;
  color: var(--color-2);
  font-size: var(--font-size-base);
  min-height: 100vh;
  
}

a {
  text-decoration: none;
  color: var(--color-0);
  transition: color var(--transition-speed);
}
a:hover {
  color: var(--color-4);
}
/* Responsive Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: "Gotham Narrow", sans-serif;
  margin: 0.5rem 0;
}


.f-color-0 {
  color: var(--color-0) !important;
}
.b-color-0 {
  background-color: var(--color-0) !important;
}
.f-color-1 {
  color: var(--color-1) !important;
}
.b-color-1 {
  background-color: var(--color-1);
}
.f-color-1_1 {
  color: var(--color-1_1) !important;
}
.b-color-1_1 {
  background-color: var(--color-1_1);
}
.f-color-2 {
  color: var(--color-2);
}
.b-color-2 {
  background-color: var(--color-2);
}
.f-color-3 {
  color: var(--color-3) !important;
}
.b-color-3 {
  background-color: var(--color-3) !important;
}
.f-color-3_3 {
  color: var(--color-3_3) !important;
}
.b-color-3_3 {
  background-color: var(--color-3_3) !important;
}
.f-color-4 {
  color: var(--color-4) !important;
}
.b-color-4 {
  background-color: var(--color-4) !important;
}
.f-color-4_1 {
  color: var(--color-4_1) !important;
}
.b-color-4_1 {
  background-color: var(--color-4_1) !important;
}
.f-color-5 {
  color: var(--color-5) !important;
}
.b-color-5 {
  background-color: var(--color-5) !important;
}
.alert-success {
  color: #073d2c;
  background-color: #acffe6;
  border: none;
}
.alert-warning {
  color: #000000;
  background-color: #ffd7c5;
  border: none;
}
/*--------Buttons----------*/
/* General Button Styling */
button {
  border-radius: 35px;
  background-color: var(--color-1);
  color: #fff;
  border: none;
  font-size: clamp(0.9rem, 1.5vw, 1.2rem);
  font-weight: 500;
  transition: transform var(--transition-speed), box-shadow var(--transition-speed), background-color var(--transition-speed);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

/* Hover and Focus Effects */
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  background-color: var(--color-1_1);
}
button:focus {
  outline: none;
  background-color: var(--color-4_1);
  box-shadow: 0 0 10px rgba(245, 141, 95, 0.6);
}

/* Main Button Style */
.main-button-style {
  background-color: var(--color-1);
  color: var(--color-0);
}
.main-button-style:hover {
  background-color: var(--color-4);
}
.main-button-style:focus {
  background-color: var(--color-3);
}

/* Soft Button Style */
.soft-button-style {
  background-color: var(--color-1_1);
  color: var(--color-1);
}
.soft-button-style:hover {
  background-color: var(--color-1);
  color: var(--color-0);
}
.soft-button-style:focus {
  background-color: var(--color-4_1);
}

/* Pagination Buttons */
.paginate-buttons {
  margin-top: 20px;
  color: #ff914d;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f5f5;
  transition: background-color var(--transition-speed), color var(--transition-speed), box-shadow var(--transition-speed);
}
.paginate-buttons:hover {
  background-color: var(--color-1);
  color: var(--color-0);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
.active-page {
  background-color: var(--color-4);
  border: none;
  color: var(--color-0);
}

/* Delete and Secondary Buttons */
.delete-btn, .secondery-btn {
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity var(--transition-speed), transform var(--transition-speed);
}
.delete-btn {
  background-color: var(--color-5);
  color: #fff;
}
.delete-btn:hover {
  opacity: 1;
  transform: scale(1.05);
}
.secondery-btn {
  background-color: var(--color-4_1);
  color: var(--color-4);
}
.secondery-btn:hover {
  opacity: 1;
  transform: scale(1.05);
}
/*--------------Forms input----------*/

/* Responsive Forms */
input, textarea, select {
  width: 100%; /* Full width by default */
  max-width: 100%; /* Ensures no overflow */
  padding: 0.75rem;
  border: 1px solid var(--color-3_3);
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color var(--transition-speed), box-shadow var(--transition-speed);
}
input:focus, textarea:focus, select:focus {
  border-color: var(--color-1);
  box-shadow: 0 0 8px rgba(44, 115, 108, 0.5);
  outline: none;
}

/* Form Groups for Responsiveness */
.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* Larger Screens */
@media (min-width: 768px) {
  .form-group {
    justify-content: space-between;
  }
  .form-group > * {
    flex: 1 1 calc(50% - 1rem); /* Two fields per row on medium to large screens */
  }
}

/* Smaller Screens */
@media (max-width: 767px) {
  .form-group > * {
    flex: 1 1 100%; /* Full width for small screens */
  }
  .flex-wrap {
    margin: 10px;
    flex-wrap: wrap !important;
    width: 90%;
  }
  .col-10 {
width: 130%;
}
.d-flex {
    display: flex !important;
    flex-wrap: wrap;
}
.col-12.col-md-4 {
    border-radius: 35px 0 0 35px;
    flex: 0 0 80%;
}
}

/* Very Small Screens */
@media (max-width: 480px) {
  input, textarea, select {
    font-size: 0.9rem; /* Slightly smaller font for very narrow screens */
    padding: 0.5rem;
    
  }
  .flex-wrap {
    margin: 10px;
    flex-wrap: wrap !important;
    width: 90%;
}
.col-10 {
width: 130%;
}
.d-flex {
    display: flex !important;
    flex-wrap: wrap;
}
.col-12.col-md-4 {
    border-radius: 35px 0 0 35px;
    flex: 0 0 80%;
}

}

/*--------------Forms control----------*/
.form-control:focus,.form-select:focus {
  box-shadow: 0 0 10px rgba(97, 97, 97, 0.5);
}
.form-control {
  padding: 0.57rem 0.75rem;
}
.form-select {
  color: var(--color-3_3);
  font-size: 90%;
  padding: 0.6299rem 0.75rem;
}
.width-100px {
  width: 100px;
}
.box-shadow-style {
  box-shadow: 3px 10px 20px 0px #4646462e;
}
.z-index-1 {
  z-index: 1;
}
.cursor-pointer {
  cursor: pointer;
}
.text-on-hover:hover {
  cursor: pointer;
  transition: 0.25s ease-in-out;
  color: #1ba769 !important;
}
.opacity-100-on-hover:hover {
  cursor: pointer;
  opacity: 1 !important;
  transition: 0.25s ease-in-out;
}
/*---------- Pagination -------*/
.pagination-container {
  display: flex;
  column-gap: 10px;
}

.active-page {
  background-color: #f58d5f;
  border: 1px solid #f58d5f;
  color: white;
}
.active-page:hover {
  background-color: #d17751;
}
/*---------------------------*/
/* Table Rows */
.rowTable {
  margin: 5px 15px;
  background-color: #ededed;
  color: #181818;
  border-radius: 35px;
  cursor: pointer;
  padding: 1rem;
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed), transform var(--transition-speed);
}
.rowTable:hover {
  background-color: #dfdfdf;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

/*---------------------------- The switch - the box around the slider ------------------------------------------*/
.switch {
  position: relative;
  display: flex;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #8bc294;
}

input:focus + .slider {
  box-shadow: 0 0 1px #4d4d4d;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.borderRadius {
  border-radius: 35px 0px 35px 0px;
}
.modal-content {
  margin: 0;
  display: flex;
  border-radius: 35px 0px 35px 0px;
  width: 50vh;
}
</style>
