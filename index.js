(() => {
  const zipRules = {
    it: ["[0-9]{5}", "00118, 20162"],
    uk: [
      "([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\\s?[0-9][A-Za-z]{2})",
      "SW1W 0NY, PO16 7GZ, GU16 7HF, L1 8JQ",
    ],
    us: ["^\\d{5}(?:[\\-\\s]\\d{4})?$", "10001, "],
    es: ["[0-9]{5}", "28001, 08001"],
  };

  const passwordSpecialChars = "@.#$!%*?&^";
  const passwordRange = [8, 15];
  const passwordRules = {
    lowercase: ".*[a-z].*",
    uppercase: ".*[A-Z].*",
    digit: ".*\\d.*",
    special: `.*[${passwordSpecialChars}].*`,
    length: `[A-Za-z\\d${passwordSpecialChars}]{${passwordRange.join(",")}}`,
  };
  passwordRules.all = `(?=${passwordRules.lowercase})(?=${passwordRules.uppercase})(?=${passwordRules.digit})(?=${passwordRules.special})${passwordRules.length}`;
  const getPasswordRegex = (type) => {
    return `^${passwordRules[type]}$`;
  };
  const checkPasswordFor = (type, str) => {
    const regex = new RegExp(getPasswordRegex(type, "g"));
    return regex.test(str);
  };
  const charPasswordMatch = (type, str) => {
    return checkPasswordFor(type, str) ? "✓" : "-";
  };

  // Cache the elements
  const mainForm = document.querySelector("#main-form");
  const emailInput = document.querySelector("#email");
  const countryInput = document.querySelector("#country");
  const zipCodeInput = document.querySelector("#zip-code");
  const passwordInput = document.querySelector("#password");
  const passwordConfirmationInput = document.querySelector(
    "#password-confirmation"
  );

  const emailMessage = document.querySelector("#email-message");
  const countryMessage = document.querySelector("#country-message");
  const zipCodeMessage = document.querySelector("#zip-code-message");
  const passwordMessage = document.querySelector("#password-message");
  const passwordConfirmationMessage = document.querySelector(
    "#password-confirmation-message"
  );

  // Email Input
  function validateEmail() {
    if (emailInput.validity.typeMismatch) {
      emailInput.setCustomValidity(
        "The email must be in the correct form, e.g., email@example.com"
      );
    } else if (emailInput.validity.valueMissing) {
      emailInput.setCustomValidity("The email is missing.");
    } else if (emailInput.validity.tooLong) {
      emailInput.setCustomValidity("The email is too long.");
    } else {
      emailInput.setCustomValidity("");
    }

    emailMessage.textContent = emailInput.validationMessage;
  }

  function validateCountry() {
    if (countryInput.validity.valueMissing) {
      countryInput.setCustomValidity("The country is missing.");
      zipCodeInput.setAttribute("pattern", "");
    } else {
      // set the pattern of the zip code
      zipCodeInput.setAttribute("pattern", zipRules[countryInput.value][0]);
      console.log(zipCodeInput);
      countryInput.setCustomValidity("");
    }

    countryMessage.textContent = countryInput.validationMessage;

    if (!zipCodeInput.validity.valueMissing) validateZipCode();
  }

  function validateZipCode() {
    if (countryInput.validity.valueMissing) {
      zipCodeInput.setCustomValidity("Please specify the country.");
    } else if (zipCodeInput.validity.valueMissing) {
      zipCodeInput.setCustomValidity("The ZIP code is missing.");
    } else if (zipCodeInput.validity.patternMismatch) {
      zipCodeInput.setCustomValidity(
        `The ZIP code is in the wrong format. Valid examples: ${
          zipRules[countryInput.value][1]
        }`
      );
    } else {
      zipCodeInput.setCustomValidity("");
    }

    zipCodeMessage.textContent = zipCodeInput.validationMessage;
  }

  // Password Input

  passwordInput.setAttribute("pattern", getPasswordRegex("all"));
  passwordMessage.style.whiteSpace = "pre-line";

  function validatePassword() {
    if (passwordInput.validity.valueMissing) {
      passwordInput.setCustomValidity("The password is missing.");
    } else if (passwordInput.validity.patternMismatch) {
      const str = passwordInput.value;
      const strArr = [
        "The password must have:",
        `${charPasswordMatch("lowercase", str)} At least one lowercase letter`,
        `${charPasswordMatch("uppercase", str)} At least one uppercase letter`,
        `${charPasswordMatch("digit", str)} At least one numeric digit`,
        `${charPasswordMatch(
          "special",
          str
        )} At least one special character i.e. [${passwordSpecialChars}]`,
        `${charPasswordMatch(
          "length",
          str
        )} Also, the total length must be in the range [${passwordRange.join(
          "-"
        )}]`,
      ];

      passwordInput.setCustomValidity(strArr.join("\r\n"));
    } else {
      passwordInput.setCustomValidity("");
    }

    passwordMessage.textContent = passwordInput.validationMessage;
  }

  // Password Confirmation Input
  function validatePasswordConfirmation() {
    if (passwordConfirmationInput.value !== passwordInput.value) {
      passwordConfirmationInput.setCustomValidity(
        "The passwords do not match!"
      );
    } else if (passwordConfirmationInput.validity.valueMissing) {
      passwordConfirmationInput.setCustomValidity(
        "The password confirmation is missing."
      );
    } else {
      passwordConfirmationInput.setCustomValidity("");
    }

    passwordConfirmationMessage.textContent =
      passwordConfirmationInput.validationMessage;
  }

  emailInput.addEventListener("blur", validateEmail);
  emailInput.addEventListener("input", validateEmail);

  countryInput.addEventListener("blur", validateCountry);
  countryInput.addEventListener("change", validateCountry);

  zipCodeInput.addEventListener("blur", validateZipCode);
  zipCodeInput.addEventListener("input", validateZipCode);

  passwordInput.addEventListener("blur", validatePassword);
  passwordInput.addEventListener("input", validatePassword);

  passwordConfirmationInput.addEventListener(
    "blur",
    validatePasswordConfirmation
  );
  passwordConfirmationInput.addEventListener(
    "input",
    validatePasswordConfirmation
  );

  mainForm.addEventListener("submit", (e) => {
    validateEmail();
    validateCountry();
    validateZipCode();
    validatePassword();
    validatePasswordConfirmation();
    if (mainForm.reportValidity()) {
      alert("Congrats! Data Submitted 👍");
      mainForm.reset();
    } else {
      e.preventDefault();
    }
  });
})();
