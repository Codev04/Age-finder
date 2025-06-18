document.addEventListener("DOMContentLoaded", function () {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("dob").setAttribute("max", today);
});

function findage() {
    const dob = document.getElementById("dob").value;
    if(!dob) {
        alert("please select your date of birth.");
        return;
    }
    const birthDate= new Date(dob);
    const now = new Date();
    let diff = now - birthDate;

    const years=now.getFullYear()-birthDate.getFullYear();
    const months = years * 12 + (now.getMonth() - birthDate.getMonth());
    const weeks = Math.floor(diff/(1000*60*60*24*7));
    const days = Math.floor(diff/(1000*60*60*24));
    const hours = Math.floor(diff/(1000*60*60));
    const minutes = Math.floor(diff/(1000*60));

    document.getElementById("result").innerHTML= `
    <p><strong>Years:</strong> ${years}&nbsp;&nbsp;
    <strong>Months:</strong> ${months}</p><br>
    <p><strong>weeks:</strong> ${weeks}&nbsp;&nbsp;
    <strong>Days:</strong> ${days}</p><br>
    <p><strong>Hours:</strong> ${hours}&nbsp;&nbsp;
    <strong>Minutes:</strong> ${minutes}</p>`;

    document.getElementById("footer").style.display="block";
}
function updateLiveDateTime() {
    const now = new Date();
const dateString = now.toLocaleDateString();
const timeString = now.toLocaleTimeString();


    document.getElementById("liveDate").textContent=dateString;
    document.getElementById("livetime").textContent=timeString;
}
setInterval(updateLiveDateTime, 1000);