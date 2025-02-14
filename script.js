document.addEventListener("DOMContentLoaded", function () {
    const scanButton = document.getElementById("scanButton");
    const loading = document.getElementById("loading");
    const bikeInfo = document.getElementById("bikeInfo");
    const bikeImage = document.getElementById("bikeImage");
    const bikeDetails = document.getElementById("bikeDetails");
    const ownerDetails = document.getElementById("ownerDetails");

    const editBikeBtn = document.getElementById("editBike");
    const editOwnerBtn = document.getElementById("editOwner");
    const editModal = document.getElementById("editModal");
    const closeModal = document.querySelector(".close");
    const saveEditBtn = document.getElementById("saveEdit");
    const editField = document.getElementById("editField");
    const passwordField = document.getElementById("password");

    const baseUrl = "https://nfc-rental-system2-1.onrender.com/items";
    let jsonData = {}; // Store fetched data
    let currentEditKey = "";
    let itemId = ""; // Store unique ID

    scanButton.addEventListener("click", function () {
        scanButton.classList.add("hidden");
        loading.classList.remove("hidden");

        setTimeout(() => {
            fetchBikeData();
        }, 2000);
    });

    function fetchBikeData() {
        const urlParams = new URLSearchParams(window.location.search);
        itemId = urlParams.get("id");

        if (!itemId) {
            alert("Invalid NFC tag. No ID found!");
            return;
        }

        fetch(`${baseUrl}/${itemId}`)
            .then(response => response.json())
            .then(data => {
                jsonData = data;
                displayBikeData(data);
            })
            .catch(error => {
                console.error("Error fetching bike details:", error);
            });
    }

    function displayBikeData(data) {
        loading.classList.add("hidden");
        bikeInfo.classList.remove("hidden");

        bikeImage.src = data.image || "default-bike.jpg";
        bikeDetails.innerHTML = `
            <strong>Name:</strong> ${data.bikeName} <br>
            <strong>Model:</strong> ${data.model} <br>
            <strong>Rent:</strong> ₹${data.rent}
        `;

        ownerDetails.innerHTML = `
            <strong>Owner:</strong> ${data.ownerName} <br>
            <strong>Contact:</strong> ${data.contact}
        `;
    }

    editBikeBtn.addEventListener("click", () => openEditModal("bike"));
    editOwnerBtn.addEventListener("click", () => openEditModal("owner"));
    closeModal.addEventListener("click", () => (editModal.style.display = "none"));

    function openEditModal(type) {
        editModal.style.display = "block";
        currentEditKey = type;
    }

    saveEditBtn.addEventListener("click", function () {
        const newValue = editField.value.trim();
        const password = passwordField.value.trim();

        if (!newValue || !password) {
            alert("Please enter a value and password.");
            return;
        }

        const correctPassword = "admin123"; // Change for security
        if (password !== correctPassword) {
            alert("Incorrect password!");
            return;
        }

        if (currentEditKey === "bike") {
            jsonData.bikeName = newValue;
        } else if (currentEditKey === "owner") {
            jsonData.ownerName = newValue;
        }

        updateBackend(jsonData);
    });

    function updateBackend(updatedData) {
        if (!itemId) {
            alert("Invalid ID. Cannot update.");
            return;
        }

        fetch(`${baseUrl}/${itemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        })
        .then(response => response.json())
        .then(() => {
            alert("Details updated successfully!");
            editModal.style.display = "none";
            displayBikeData(updatedData);
        })
        .catch(error => {
            console.error("Error updating details:", error);
            alert("Failed to update details.");
        });
    }
});
