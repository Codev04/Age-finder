document.addEventListener("DOMContentLoaded", function () {
    // Set max date for DOB input to today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("dob").setAttribute("max", today);

    // Update live date and time every second
    setInterval(updateLiveDateTime, 1000);
    updateLiveDateTime();
});

function updateLiveDateTime() {
    const now = new Date();
    document.getElementById("liveDate").textContent = now.toLocaleDateString();
    document.getElementById("livetime").textContent = now.toLocaleTimeString();
}

function findage() {
    const dobInput = document.getElementById("dob");
    const dob = dobInput.value;
    if (!dob) {
        alert("Please select your date of birth.");
        return;
    }

    const birthDate = new Date(dob);
    const now = new Date();
    const diff = now - birthDate;

    const years = now.getFullYear() - birthDate.getFullYear();
    const months = years * 12 + (now.getMonth() - birthDate.getMonth());
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <p><strong>Years:</strong> ${years} &nbsp;&nbsp; <strong>Months:</strong> ${months}</p>
        <p><strong>Weeks:</strong> ${weeks} &nbsp;&nbsp; <strong>Days:</strong> ${days}</p>
        <p><strong>Hours:</strong> ${hours} &nbsp;&nbsp; <strong>Minutes:</strong> ${minutes}</p>
    `;

    // Show footer with download receipt link
    const footer = document.getElementById("footer");
    footer.style.display = "block";

    // Store age data globally for receipt use
    window.ageData = { years, months, weeks, days, hours, minutes, dob };

    // Hide receipt form if visible
    document.getElementById("receiptFormSection").style.display = "none";
}

// Scroll to receipt form and autofill when "Download Receipt" clicked
document.getElementById("downloadReceiptLink").addEventListener("click", function (e) {
    e.preventDefault();

    if (!window.ageData) {
        alert("Please calculate your age first.");
        return;
    }

    const formSection = document.getElementById("receiptFormSection");
    formSection.style.display = "block";

    // Scroll smoothly to form
    formSection.scrollIntoView({ behavior: "smooth" });

    // Autofill DOB
    document.getElementById("userDob").value = window.ageData.dob;

    // Clear previous inputs except DOB
    document.getElementById("userName").value = "";
    document.getElementById("userGender").value = "";
    document.getElementById("userLocation").value = "";

    // Show age summary nicely formatted
    const ageSummary = `
        Age Summary:<br>
        Years: ${window.ageData.years}<br>
        Months: ${window.ageData.months}<br>
        Weeks: ${window.ageData.weeks}<br>
        Days: ${window.ageData.days}<br>
        Hours: ${window.ageData.hours}<br>
        Minutes: ${window.ageData.minutes}
    `;
    document.getElementById("ageSummary").innerHTML = ageSummary;
});

// Download PDF receipt on button click
document.getElementById("downloadReceiptBtn").addEventListener("click", function () {
    const name = document.getElementById("userName").value.trim();
    const gender = document.getElementById("userGender").value;
    const location = document.getElementById("userLocation").value.trim();
    const dob = document.getElementById("userDob").value;

    if (!name) {
        alert("Please fill your name.");
        return;
    }

    if (!dob || !window.ageData) {
        alert("Date of birth or age data missing.");
        return;
    }

    generatePDF({ name, gender, location, dob, ageData: window.ageData });
});

function generatePDF({ name, gender, location, dob, ageData }) {
    const doc = new jsPDF();

    // Draw header background rectangle
    doc.setFillColor(0, 123, 255); // Bootstrap primary blue
    doc.rect(0, 0, 210, 30, 'F'); // Full width, height 30

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Age Finder Receipt", 105, 20, null, null, "center");

    // Reset text color for body
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Draw a line below header
    doc.setDrawColor(0, 123, 255);
    doc.setLineWidth(0.8);
    doc.line(10, 35, 200, 35);

    // User info section
    let y = 45;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("User  Information:", 20, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${name}`, 25, y);
    y += 7;
    doc.text(`Gender: ${gender || "Not specified"}`, 25, y);
    y += 7;
    doc.text(`Location: ${location || "Not specified"}`, 25, y);
    y += 7;
    doc.text(`Date of Birth: ${dob}`, 25, y);

    // Age info section
    y += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Your Exact Age:", 20, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Years: ${ageData.years}`, 25, y);
    y += 7;
    doc.text(`Months: ${ageData.months}`, 25, y);
    y += 7;
    doc.text(`Weeks: ${ageData.weeks}`, 25, y);
    y += 7;
    doc.text(`Days: ${ageData.days}`, 25, y);
    y += 7;
    doc.text(`Hours: ${ageData.hours}`, 25, y);
    y += 7;
    doc.text(`Minutes: ${ageData.minutes}`, 25, y);

    // Footer thank you text
    y += 20;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for using Age Finder!", 105, y, null, null, "center");

    // Save PDF
    doc.save("Age_Finder_Receipt.pdf");
}