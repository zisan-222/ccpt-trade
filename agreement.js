/* =========================================================
   CPT MARKETS
   CLIENT TRADING AGREEMENT
   JAVASCRIPT
   ========================================================= */


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


const signatureCheck =
  document.getElementById("signatureCheck");


const signatureCanvas =
  document.getElementById("signatureCanvas");


const signaturePlaceholder =
  document.getElementById("signaturePlaceholder");


const signatureStatus =
  document.getElementById("signatureStatus");


const clearSignature =
  document.getElementById("clearSignature");


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


/* =========================================================
   SIGNATURE CANVAS
   ========================================================= */

const signatureContext =
  signatureCanvas.getContext("2d");


let signatureDrawing = false;

let hasDrawn = false;

let signatureData = "";


/* =========================================================
   LOCAL STORAGE USER DATA
   ========================================================= */

/*
  This tries to read the currently logged-in user
  from the same localStorage style commonly used
  by the website.

  If data is not available, the fields remain editable.
*/

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
        user.username;

    }


    if (
      !userIdInput.value &&
      user.userId
    ) {

      userIdInput.value =
        user.userId;

    }


    if (
      !userIdInput.value &&
      user.uid
    ) {

      userIdInput.value =
        user.uid;

    }


    if (
      !clientNameInput.value &&
      user.name
    ) {

      clientNameInput.value =
        user.name;

    }


    if (
      !clientNameInput.value &&
      user.fullName
    ) {

      clientNameInput.value =
        user.fullName;

    }


    if (
      !countryInput.value &&
      user.country
    ) {

      const countryOption =
        [...countryInput.options]
          .find(
            option =>
              option.value.toLowerCase() ===
              String(user.country).toLowerCase()
          );


      if (countryOption) {

        countryInput.value =
          countryOption.value;

      }

    }


  } catch (error) {

    console.log(
      "User information could not be loaded."
    );

  }

}


/* Load user */

loadExistingUserData();


/* =========================================================
   DEFAULT START DATE
   ========================================================= */

function setDefaultStartDate() {

  if (startDateInput.value) {
    return;
  }


  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      today.getDate()
    ).padStart(2, "0");


  startDateInput.value =
    `${year}-${month}-${day}`;

}


setDefaultStartDate();


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(dateString) {

  if (!dateString) {
    return "—";
  }


  const date =
    new Date(
      `${dateString}T00:00:00`
    );


  if (Number.isNaN(date.getTime())) {
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

function getDurationDays(duration) {

  const map = {

    "1 Day": 1,

    "7 Days": 7,

    "30 Days": 30,

    "90 Days": 90,

    "180 Days": 180,

    "365 Days": 365

  };


  return map[duration] || 0;

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
    getDurationDays(duration);


  if (!start || !days) {

    endDateInput.value = "";

    previewStart.textContent = "—";

    previewEnd.textContent = "—";

    return;

  }


  const date =
    new Date(
      `${start}T00:00:00`
    );


  /*
    Agreement duration includes the starting day.
    Example:
    1 Day = same day.
  */

  date.setDate(
    date.getDate() + days - 1
  );


  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      date.getDate()
    ).padStart(2, "0");


  const endDate =
    `${year}-${month}-${day}`;


  endDateInput.value =
    endDate;


  previewStart.textContent =
    formatDate(start);


  previewEnd.textContent =
    formatDate(endDate);

}


/* =========================================================
   DATE EVENTS
   ========================================================= */

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
   SIGNATURE CANVAS SETUP
   ========================================================= */

function setupSignatureCanvas() {

  const rect =
    signatureCanvas.getBoundingClientRect();


  const ratio =
    Math.max(
      1,
      window.devicePixelRatio || 1
    );


  signatureCanvas.width =
    Math.round(
      rect.width * ratio
    );


  signatureCanvas.height =
    Math.round(
      rect.height * ratio
    );


  signatureContext.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );


  signatureContext.lineWidth =
    2.7;


  signatureContext.lineCap =
    "round";


  signatureContext.lineJoin =
    "round";


  signatureContext.strokeStyle =
    "#08dcff";

}


setupSignatureCanvas();


/* =========================================================
   RESIZE SIGNATURE BOARD
   ========================================================= */

let savedSignatureImage = null;


window.addEventListener(
  "resize",
  () => {

    if (hasDrawn) {

      try {

        savedSignatureImage =
          signatureCanvas.toDataURL(
            "image/png"
          );

      } catch (error) {

        savedSignatureImage = null;

      }

    }


    setupSignatureCanvas();


    if (!savedSignatureImage) {
      return;
    }


    const image =
      new Image();


    image.onload = () => {

      signatureContext.drawImage(
        image,
        0,
        0,
        signatureCanvas.clientWidth,
        signatureCanvas.clientHeight
      );

    };


    image.src =
      savedSignatureImage;

  }
);


/* =========================================================
   SIGNATURE POSITION
   ========================================================= */

function getSignaturePosition(event) {

  const rect =
    signatureCanvas.getBoundingClientRect();


  return {

    x:
      event.clientX -
      rect.left,

    y:
      event.clientY -
      rect.top

  };

}


/* =========================================================
   START SIGNATURE
   ========================================================= */

signatureCanvas.addEventListener(
  "pointerdown",
  event => {

    event.preventDefault();


    signatureDrawing =
      true;


    hasDrawn =
      true;


    signaturePlaceholder.style.display =
      "none";


    signatureStatus.textContent =
      "Signature captured";


    signatureStatus.classList.add(
      "signed"
    );


    const position =
      getSignaturePosition(event);


    signatureContext.beginPath();


    signatureContext.moveTo(
      position.x,
      position.y
    );


    try {

      signatureCanvas.setPointerCapture(
        event.pointerId
      );

    } catch (error) {}

  },
  {
    passive: false
  }
);


/* =========================================================
   DRAW SIGNATURE
   ========================================================= */

signatureCanvas.addEventListener(
  "pointermove",
  event => {

    if (!signatureDrawing) {
      return;
    }


    event.preventDefault();


    const position =
      getSignaturePosition(event);


    signatureContext.lineTo(
      position.x,
      position.y
    );


    signatureContext.stroke();

  },
  {
    passive: false
  }
);


/* =========================================================
   STOP SIGNATURE
   ========================================================= */

function stopSignature(event) {

  if (!signatureDrawing) {
    return;
  }


  signatureDrawing =
    false;


  try {

    signatureCanvas.releasePointerCapture(
      event.pointerId
    );

  } catch (error) {}

}


signatureCanvas.addEventListener(
  "pointerup",
  stopSignature
);


signatureCanvas.addEventListener(
  "pointercancel",
  stopSignature
);


/* =========================================================
   CLEAR SIGNATURE
   ========================================================= */

clearSignature.addEventListener(
  "click",
  () => {

    signatureContext.clearRect(
      0,
      0,
      signatureCanvas.width,
      signatureCanvas.height
    );


    signatureDrawing =
      false;


    hasDrawn =
      false;


    signatureData =
      "";


    savedSignatureImage =
      null;


    signaturePlaceholder.style.display =
      "block";


    signatureStatus.textContent =
      "Waiting for signature";


    signatureStatus.classList.remove(
      "signed"
    );

  }
);


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
    ).padStart(2, "0");


  const day =
    String(
      now.getDate()
    ).padStart(2, "0");


  const random =
    Math.floor(
      100000 +
      Math.random() * 900000
    );


  return (
    `CPT-${year}${month}${day}-${random}`
  );

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


  return true;

}


/* =========================================================
   ERROR MESSAGE
   ========================================================= */

function showError(
  message,
  element = null
) {

  alert(message);


  if (element) {

    element.focus();

    element.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }

}


/* =========================================================
   AGE CHECK
   ========================================================= */

function validateAge() {

  if (!ageCheck.checked) {

    showError(
      "You must confirm that you are 18 years of age or older.",
      ageCheck
    );

    return false;

  }


  return true;

}


/* =========================================================
   SIGNATURE CHECK
   ========================================================= */

function validateSignature() {

  if (!hasDrawn) {

    showError(
      "Please sign inside the signature board before submitting the agreement.",
      signatureCanvas
    );

    signatureCanvas.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });


    return false;

  }


  if (!signatureCheck.checked) {

    showError(
      "Please confirm your electronic signature acceptance.",
      signatureCheck
    );

    return false;

  }


  return true;

}


/* =========================================================
   GET FORM DATA
   ========================================================= */

function collectAgreementData() {

  signatureData =
    signatureCanvas.toDataURL(
      "image/png"
    );


  const agreementId =
    generateAgreementId();


  const now =
    new Date();


  return {

    agreementId:

      agreementId,


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


    signature:

      signatureData,


    status:

      "SUBMITTED"

  };

}


/* =========================================================
   SAVE AGREEMENT LOCALLY
   ========================================================= */

function saveAgreement(data) {

  try {

    localStorage.setItem(
      "cptmarkets_last_agreement",
      JSON.stringify(data)
    );


    /*
      Also keep a small agreement list.
    */

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


    if (!Array.isArray(agreements)) {

      agreements = [];

    }


    agreements.push(data);


    /*
      Keep latest 20 local agreements.
    */

    agreements =
      agreements.slice(-20);


    localStorage.setItem(
      "cptmarkets_agreements",
      JSON.stringify(agreements)
    );


  } catch (error) {

    console.log(
      "Local agreement storage unavailable."
    );

  }

}


/* =========================================================
   SHOW CONFIRMATION
   ========================================================= */

function showConfirmation(data) {

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


  document.body.style.overflow =
    "hidden";

}


/* =========================================================
   SUBMIT
   ========================================================= */

agreementForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    /*
      1. Required information
    */

    if (!validateFields()) {
      return;
    }


    /*
      2. 18+
    */

    if (!validateAge()) {
      return;
    }


    /*
      3. Signature
    */

    if (!validateSignature()) {
      return;
    }


    /*
      4. Make sure end date exists
    */

    calculateEndDate();


    /*
      5. Collect
    */

    const data =
      collectAgreementData();


    /*
      6. Save
    */

    saveAgreement(data);


    /*
      7. Show success
    */

    showConfirmation(data);

  }
);


/* =========================================================
   DOWNLOAD AGREEMENT
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


    /*
      Create temporary printable agreement.
    */

    const pdfContainer =
      document.createElement("div");


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


    pdfContainer.style.background =
      "#ffffff";


    pdfContainer.style.color =
      "#111111";


    pdfContainer.style.fontFamily =
      "Arial, sans-serif";


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
        <strong>${escapeHtml(data.agreementId)}</strong>
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
          formatDate(data.startDate)
        )}

        ${pdfRow(
          "End Date",
          formatDate(data.endDate)
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


      <h2 style="
        font-size:15px;
        border-bottom:1px solid #ddd;
        padding-bottom:8px;
      ">
        Risk Disclosure
      </h2>


      <p style="
        font-size:10px;
        line-height:1.7;
        color:#445;
      ">
        Trading financial markets involves a high level
        of risk and may not be suitable for every client.
        The value of financial instruments may rise or fall,
        and clients may lose some or all of the funds
        allocated for trading.
      </p>


      <p style="
        font-size:10px;
        line-height:1.7;
        color:#445;
      ">
        The client acknowledges that trading decisions are
        made at the client's own risk and that previous
        performance does not guarantee future results.
      </p>


      <h2 style="
        font-size:15px;
        border-bottom:1px solid #ddd;
        padding-bottom:8px;
        margin-top:25px;
      ">
        Client Acceptance
      </h2>


      <p style="
        font-size:10px;
        line-height:1.7;
        color:#445;
      ">
        The client confirms that the information provided
        is accurate, that they are 18 years of age or older,
        and that they have electronically accepted this
        Client Trading Agreement.
      </p>


      <div style="
        margin-top:35px;
        padding-top:15px;
        border-top:1px solid #ddd;
      ">

        <div style="
          font-size:10px;
          color:#68798a;
          margin-bottom:8px;
        ">
          ELECTRONIC SIGNATURE
        </div>


        <img
          src="${data.signature}"
          style="
            width:260px;
            height:95px;
            object-fit:contain;
            object-position:left center;
            border-bottom:1px solid #555;
          "
        />


        <div style="
          margin-top:7px;
          font-size:10px;
        ">
          ${escapeHtml(data.clientName)}
        </div>

      </div>


      <div style="
        margin-top:35px;
        font-size:8px;
        color:#8794a0;
      ">
        Cpt Markets — https://cptmarketfx.com
      </div>

    `;


    document.body.appendChild(
      pdfContainer
    );


    try {

      if (
        typeof html2canvas ===
        "undefined"
      ) {

        throw new Error(
          "html2canvas unavailable"
        );

      }


      if (
        !window.jspdf ||
        !window.jspdf.jsPDF
      ) {

        throw new Error(
          "jsPDF unavailable"
        );

      }


      const canvas =
        await html2canvas(
          pdfContainer,
          {
            scale: 2,
            backgroundColor: "#ffffff"
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
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });


      const pageWidth =
        pdf.internal.pageSize.getWidth();


      const pageHeight =
        pdf.internal.pageSize.getHeight();


      const margin =
        10;


      const usableWidth =
        pageWidth -
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
        pageHeight -
        margin * 2;


      while (
        heightLeft > 0
      ) {

        position =
          heightLeft -
          imageHeight +
          margin;


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
          pageHeight -
          margin * 2;

      }


      pdf.save(
        `${data.agreementId}.pdf`
      );


    } catch (error) {

      console.error(error);


      alert(
        "PDF download could not be created. Please try again."
      );

    }


    pdfContainer.remove();

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

function escapeHtml(value) {

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
   POPUP CLOSE WHEN CLICKING OUTSIDE
   ========================================================= */

confirmationPopup.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      confirmationPopup
    ) {

      /*
        Intentionally do not close automatically.
        Client should keep the confirmation available
        for downloading the agreement.
      */

    }

  }
);


/* =========================================================
   PREVENT ACCIDENTAL PAGE EXIT WHILE SIGNING
   ========================================================= */

window.addEventListener(
  "beforeunload",
  event => {

    /*
      We don't block normal navigation.
      This is intentionally left lightweight.
    */

  }
);


/* =========================================================
   FINAL INITIALIZATION
   ========================================================= */

calculateEndDate();


console.log(
  "Cpt Markets Client Trading Agreement loaded."
);
