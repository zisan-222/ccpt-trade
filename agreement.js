/* =========================================================
   CPT MARKETS
   CLIENT TRADING AGREEMENT
   JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   ELEMENTS
   ========================================================= */

const agreementForm =
  document.getElementById("agreementForm");

const clientNameInput =
  document.getElementById("clientName");

const usernameInput =
  document.getElementById("username");

const userIdInput =
  document.getElementById("userId");

const countryInput =
  document.getElementById("country");

const cityInput =
  document.getElementById("city");

const addressInput =
  document.getElementById("address");

const phoneCountryInput =
  document.getElementById("phoneCountry");

const phoneInput =
  document.getElementById("phone");

const startDateInput =
  document.getElementById("startDate");

const durationInput =
  document.getElementById("duration");

const endDateInput =
  document.getElementById("endDate");

const tradingPurposeInput =
  document.getElementById("tradingPurpose");

const previewStart =
  document.getElementById("previewStart");

const previewEnd =
  document.getElementById("previewEnd");

const ageCheck =
  document.getElementById("ageCheck");

const confirmationPopup =
  document.getElementById("confirmationPopup");

const popupAgreementId =
  document.getElementById("popupAgreementId");

const popupClientName =
  document.getElementById("popupClientName");

const popupUserId =
  document.getElementById("popupUserId");

const popupCountry =
  document.getElementById("popupCountry");

const popupStartDate =
  document.getElementById("popupStartDate");

const popupEndDate =
  document.getElementById("popupEndDate");

const popupDuration =
  document.getElementById("popupDuration");

const downloadAgreement =
  document.getElementById("downloadAgreement");

const successThankYou =
  document.getElementById("successThankYou");


/* =========================================================
   SAFETY CHECK
   ========================================================= */

if (
  !agreementForm ||
  !confirmationPopup
) {

  console.error(
    "Cpt Markets Agreement: required HTML elements are missing."
  );

}


/* =========================================================
   LOCAL STORAGE USER DATA
   ========================================================= */

function loadExistingUserData() {

  try {

    const storedUser =
      localStorage.getItem("user");


    if (!storedUser) {
      return;
    }


    let user = null;


    try {

      user =
        JSON.parse(storedUser);

    } catch (error) {

      user = {
        username: storedUser
      };

    }


    if (!user) {
      return;
    }


    if (
      !usernameInput.value &&
      user.username
    ) {

      usernameInput.value =
        String(user.username);

    }


    if (
      !userIdInput.value &&
      user.userId
    ) {

      userIdInput.value =
        String(user.userId);

    }


    if (
      !userIdInput.value &&
      user.uid
    ) {

      userIdInput.value =
        String(user.uid);

    }


    if (
      !clientNameInput.value &&
      user.name
    ) {

      clientNameInput.value =
        String(user.name);

    }


    if (
      !clientNameInput.value &&
      user.fullName
    ) {

      clientNameInput.value =
        String(user.fullName);

    }


    if (
      !countryInput.value &&
      user.country
    ) {

      const userCountry =
        String(user.country)
          .trim()
          .toLowerCase();


      const countryOption =
        Array.from(
          countryInput.options
        ).find(
          option =>
            option.value
              .trim()
              .toLowerCase() ===
            userCountry
        );


      if (countryOption) {

        countryInput.value =
          countryOption.value;

      }

    }

  } catch (error) {

    console.warn(
      "User information could not be loaded.",
      error
    );

  }

}


loadExistingUserData();


/* =========================================================
   DEFAULT START DATE
   ========================================================= */

function getLocalToday() {

  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      today.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${year}-${month}-${day}`;

}


function setDefaultStartDate() {

  if (
    !startDateInput.value
  ) {

    startDateInput.value =
      getLocalToday();

  }

}


setDefaultStartDate();


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(
  dateString
) {

  if (!dateString) {
    return "—";
  }


  const date =
    new Date(
      `${dateString}T00:00:00`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "—";

  }


  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


/* =========================================================
   GET DURATION DAYS
   ========================================================= */

function getDurationDays(
  duration
) {

  /*
    The visible duration labels in the HTML are:

    3 Day
    5 Days
    7 Days
    9 Days
    10 Days
    11 Days

    Their option values are:

    1 Day
    7 Days
    30 Days
    90 Days
    180 Days
    365 Days

    This mapping keeps the existing HTML unchanged
    and calculates the actual number of selected days.
  */

  const durationMap = {

    "1 Day": 3,
    "7 Days": 5,
    "30 Days": 7,
    "90 Days": 9,
    "180 Days": 10,
    "365 Days": 11

  };


  return (
    durationMap[duration] ||
    0
  );

}


/* =========================================================
   CALCULATE END DATE
   ========================================================= */

function calculateEndDate() {

  const start =
    startDateInput.value;


  const duration =
    durationInput.value;


  const days =
    getDurationDays(
      duration
    );


  if (
    !start ||
    !days
  ) {

    endDateInput.value = "";

    previewStart.textContent =
      "—";

    previewEnd.textContent =
      "—";

    return;

  }


  const date =
    new Date(
      `${start}T00:00:00`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    endDateInput.value = "";

    previewStart.textContent =
      "—";

    previewEnd.textContent =
      "—";

    return;

  }


  /*
    Starting day is counted as Day 1.

    Example:
    3 Day  = start date + 2 days
    5 Days = start date + 4 days
    7 Days = start date + 6 days
  */

  date.setDate(
    date.getDate() +
    days -
    1
  );


  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );


  const endDate =
    `${year}-${month}-${day}`;


  endDateInput.value =
    endDate;


  previewStart.textContent =
    formatDate(start);


  previewEnd.textContent =
    formatDate(endDate);

}


startDateInput.addEventListener(
  "change",
  calculateEndDate
);


durationInput.addEventListener(
  "change",
  calculateEndDate
);


calculateEndDate();


/* =========================================================
   GENERATE AGREEMENT ID
   ========================================================= */

function generateAgreementId() {

  const now =
    new Date();


  const year =
    now.getFullYear();


  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );


  const random =
    Math.floor(
      100000 +
      Math.random() *
      900000
    );


  return `CPT-${year}${month}${day}-${random}`;

}


/* =========================================================
   VALIDATE REQUIRED FIELDS
   ========================================================= */

function validateFields() {

  const requiredFields = [

    {
      element: clientNameInput,
      message:
        "Please enter your full name."
    },

    {
      element: usernameInput,
      message:
        "Please enter your username."
    },

    {
      element: userIdInput,
      message:
        "Please enter your Client User ID."
    },

    {
      element: countryInput,
      message:
        "Please select your country."
    },

    {
      element: cityInput,
      message:
        "Please enter your city."
    },

    {
      element: addressInput,
      message:
        "Please enter your complete address."
    },

    {
      element: phoneCountryInput,
      message:
        "Please select your phone country code."
    },

    {
      element: phoneInput,
      message:
        "Please enter your phone number."
    },

    {
      element: startDateInput,
      message:
        "Please select the agreement start date."
    },

    {
      element: durationInput,
      message:
        "Please select the agreement duration."
    },

    {
      element: tradingPurposeInput,
      message:
        "Please select your trading purpose."
    }

  ];


  for (
    const item of requiredFields
  ) {

    if (
      !item.element.value.trim()
    ) {

      showError(
        item.message,
        item.element
      );

      return false;

    }

  }


  if (
    !endDateInput.value
  ) {

    showError(
      "Please select the agreement duration so the end date can be calculated.",
      durationInput
    );

    return false;

  }


  return true;

}


/* =========================================================
   ERROR
   ========================================================= */

function showError(
  message,
  element = null
) {

  alert(message);


  if (element) {

    try {

      element.focus();

    } catch (error) {}


    try {

      element.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    } catch (error) {}

  }

}


/* =========================================================
   AGE
   ========================================================= */

function validateAge() {

  if (
    !ageCheck.checked
  ) {

    showError(
      "You must confirm that you are 18 years of age or older.",
      ageCheck
    );

    return false;

  }


  return true;

}


/* =========================================================
   COLLECT AGREEMENT DATA
   ========================================================= */

function collectAgreementData() {

  const now =
    new Date();


  return {

    agreementId:
      generateAgreementId(),

    clientName:
      clientNameInput.value.trim(),

    username:
      usernameInput.value.trim(),

    userId:
      userIdInput.value.trim(),

    country:
      countryInput.value,

    city:
      cityInput.value.trim(),

    address:
      addressInput.value.trim(),

    phoneCountry:
      phoneCountryInput.value,

    phone:
      phoneInput.value.trim(),

    startDate:
      startDateInput.value,

    endDate:
      endDateInput.value,

    duration:
      durationInput.value,

    tradingPurpose:
      tradingPurposeInput.value,

    submittedAt:
      now.toISOString(),

    status:
      "SUBMITTED"

  };

}


/* =========================================================
   SAVE AGREEMENT
   ========================================================= */

function saveAgreement(
  data
) {

  try {

    localStorage.setItem(
      "cptmarkets_last_agreement",
      JSON.stringify(data)
    );


    const existing =
      localStorage.getItem(
        "cptmarkets_agreements"
      );


    let agreements = [];


    if (existing) {

      try {

        agreements =
          JSON.parse(existing);

      } catch (error) {

        agreements = [];

      }

    }


    if (
      !Array.isArray(
        agreements
      )
    ) {

      agreements = [];

    }


    agreements.push(data);


    agreements =
      agreements.slice(-20);


    localStorage.setItem(
      "cptmarkets_agreements",
      JSON.stringify(
        agreements
      )
    );

  } catch (error) {

    console.warn(
      "Local agreement storage unavailable.",
      error
    );

  }

}


/* =========================================================
   SHOW TEMPORARY THANK YOU MESSAGE
   ========================================================= */

let thankYouTimer = null;


function showThankYouMessage() {

  if (
    !successThankYou
  ) {

    return;

  }


  clearTimeout(
    thankYouTimer
  );


  successThankYou.classList.remove(
    "show"
  );


  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          successThankYou.classList.add(
            "show"
          );

        }
      );

    }
  );


  thankYouTimer =
    setTimeout(
      () => {

        successThankYou.classList.remove(
          "show"
        );

      },
      5000
    );

}


/* =========================================================
   SHOW CONFIRMATION
   ========================================================= */

function showConfirmation(
  data
) {

  popupAgreementId.textContent =
    data.agreementId;


  popupClientName.textContent =
    data.clientName;


  popupUserId.textContent =
    data.userId;


  popupCountry.textContent =
    data.country;


  popupStartDate.textContent =
    formatDate(
      data.startDate
    );


  popupEndDate.textContent =
    formatDate(
      data.endDate
    );


  popupDuration.textContent =
    data.duration;


  confirmationPopup.classList.add(
    "show"
  );


  document.body.classList.add(
    "popup-open"
  );


  showThankYouMessage();

}


/* =========================================================
   SUBMIT
   ========================================================= */

agreementForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    if (
      !validateFields()
    ) {

      return;

    }


    if (
      !validateAge()
    ) {

      return;

    }


    calculateEndDate();


    if (
      !endDateInput.value
    ) {

      showError(
        "Unable to calculate the agreement end date.",
        durationInput
      );

      return;

    }


    const data =
      collectAgreementData();


    saveAgreement(data);


    showConfirmation(
      data
    );

  }
);


/* =========================================================
   PDF DOWNLOAD
   ========================================================= */

downloadAgreement.addEventListener(
  "click",
  async () => {

    const stored =
      localStorage.getItem(
        "cptmarkets_last_agreement"
      );


    if (!stored) {

      alert(
        "Agreement information could not be found."
      );

      return;

    }


    let data;


    try {

      data =
        JSON.parse(stored);

    } catch (error) {

      alert(
        "Unable to prepare the agreement download."
      );

      return;

    }


    if (
      !data ||
      !data.agreementId
    ) {

      alert(
        "Agreement data is incomplete. Please submit the agreement again."
      );

      return;

    }


    if (
      typeof html2canvas ===
      "undefined"
    ) {

      alert(
        "PDF library could not be loaded. Please check your internet connection and try again."
      );

      return;

    }


    if (
      !window.jspdf ||
      !window.jspdf.jsPDF
    ) {

      alert(
        "PDF generator could not be loaded. Please try again."
      );

      return;

    }


    const button =
      downloadAgreement;


    const originalButtonHTML =
      button.innerHTML;


    button.disabled = true;


    button.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Preparing...';


    const pdfContainer =
      document.createElement(
        "div"
      );


    pdfContainer.style.position =
      "fixed";


    pdfContainer.style.left =
      "-10000px";


    pdfContainer.style.top =
      "0";


    pdfContainer.style.width =
      "794px";


    pdfContainer.style.padding =
      "45px";


    pdfContainer.style.boxSizing =
      "border-box";


    pdfContainer.style.background =
      "#ffffff";


    pdfContainer.style.color =
      "#111111";


    pdfContainer.style.fontFamily =
      "Arial, sans-serif";


    /*
      PDF content.
      Digital Signature removed.
      Risk Disclosure removed.
    */

    pdfContainer.innerHTML = `

      <div style="
        border-bottom:3px solid #087db5;
        padding-bottom:18px;
        margin-bottom:25px;
      ">

        <div style="
          font-size:28px;
          font-weight:900;
          color:#123;
        ">
          CPT MARKETS
        </div>


        <div style="
          font-size:11px;
          color:#65788a;
          margin-top:4px;
        ">
          Global Trading Platform
        </div>

      </div>


      <h1 style="
        font-size:25px;
        margin:0 0 8px;
      ">
        CLIENT TRADING AGREEMENT
      </h1>


      <p style="
        color:#647586;
        font-size:11px;
        margin-bottom:25px;
      ">

        Agreement ID:

        <strong>
          ${escapeHtml(
            data.agreementId
          )}
        </strong>

      </p>


      <h2 style="
        font-size:15px;
        border-bottom:1px solid #ddd;
        padding-bottom:8px;
      ">
        Client Information
      </h2>


      <table style="
        width:100%;
        border-collapse:collapse;
        margin-bottom:22px;
        font-size:10px;
      ">

        ${pdfRow(
          "Full Name",
          data.clientName
        )}

        ${pdfRow(
          "Username",
          data.username
        )}

        ${pdfRow(
          "Client User ID",
          data.userId
        )}

        ${pdfRow(
          "Country",
          data.country
        )}

        ${pdfRow(
          "City",
          data.city
        )}

        ${pdfRow(
          "Address",
          data.address
        )}

        ${pdfRow(
          "Phone",
          `${data.phoneCountry} ${data.phone}`
        )}

      </table>


      <h2 style="
        font-size:15px;
        border-bottom:1px solid #ddd;
        padding-bottom:8px;
      ">
        Agreement Details
      </h2>


      <table style="
        width:100%;
        border-collapse:collapse;
        margin-bottom:22px;
        font-size:10px;
      ">

        ${pdfRow(
          "Start Date",
          formatDate(
            data.startDate
          )
        )}

        ${pdfRow(
          "End Date",
          formatDate(
            data.endDate
          )
        )}

        ${pdfRow(
          "Duration",
          data.duration
        )}

        ${pdfRow(
          "Trading Purpose",
          data.tradingPurpose
        )}

        ${pdfRow(
          "Status",
          "SUBMITTED"
        )}

      </table>


      <div style="
        margin-top:35px;
        font-size:8px;
        color:#8794a0;
        border-top:1px solid #ddd;
        padding-top:15px;
      ">

        Cpt Markets — cptmarketfx.com

      </div>

    `;


    document.body.appendChild(
      pdfContainer
    );


    try {

      await new Promise(
        resolve =>
          requestAnimationFrame(
            () =>
              requestAnimationFrame(
                resolve
              )
          )
      );


      const canvas =
        await html2canvas(
          pdfContainer,
          {
            scale: 2,
            useCORS: true,
            backgroundColor:
              "#ffffff",
            logging: false
          }
        );


      const imageData =
        canvas.toDataURL(
          "image/png"
        );


      const {
        jsPDF
      } =
        window.jspdf;


      const pdf =
        new jsPDF({
          orientation:
            "portrait",
          unit:
            "mm",
          format:
            "a4"
        });


      const pageWidth =
        pdf.internal.pageSize
          .getWidth();


      const pageHeight =
        pdf.internal.pageSize
          .getHeight();


      const margin = 10;


      const usableWidth =
        pageWidth -
        margin * 2;


      const usableHeight =
        pageHeight -
        margin * 2;


      const imageHeight =
        canvas.height *
        usableWidth /
        canvas.width;


      let heightLeft =
        imageHeight;


      let position =
        margin;


      pdf.addImage(
        imageData,
        "PNG",
        margin,
        position,
        usableWidth,
        imageHeight
      );


      heightLeft -=
        usableHeight;


      while (
        heightLeft > 0
      ) {

        position =
          margin +
          heightLeft -
          imageHeight;


        pdf.addPage();


        pdf.addImage(
          imageData,
          "PNG",
          margin,
          position,
          usableWidth,
          imageHeight
        );


        heightLeft -=
          usableHeight;

      }


      /*
        Download only.
        No redirect.
      */

      pdf.save(
        `${data.agreementId}.pdf`
      );


    } catch (error) {

      console.error(
        "PDF generation error:",
        error
      );


      alert(
        "PDF download could not be created. Please try again."
      );


    } finally {

      pdfContainer.remove();


      button.disabled =
        false;


      button.innerHTML =
        originalButtonHTML;

    }

  }
);


/* =========================================================
   PDF TABLE ROW
   ========================================================= */

function pdfRow(
  label,
  value
) {

  return `

    <tr>

      <td style="
        padding:8px;
        width:35%;
        border-bottom:1px solid #eee;
        color:#68798a;
      ">

        ${escapeHtml(label)}

      </td>


      <td style="
        padding:8px;
        border-bottom:1px solid #eee;
        font-weight:700;
      ">

        ${escapeHtml(value)}

      </td>

    </tr>

  `;

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   POPUP
   ========================================================= */

confirmationPopup.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      confirmationPopup
    ) {

      /*
        Popup intentionally remains open.
        This prevents accidental dismissal before
        the client downloads the agreement.
      */

      return;

    }

  }
);


/* =========================================================
   FINAL INITIALIZATION
   ========================================================= */

calculateEndDate();


console.log(
  "Cpt Markets Client Trading Agreement loaded successfully."
);
