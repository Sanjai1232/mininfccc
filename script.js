document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "https://nfc-rental-system2-1.onrender.com/items/";
    const params = new URLSearchParams(window.location.search);
    const uniqueId = params.get("id");
    const bikeContainer = document.getElementById("bike-container");
    const editBtn = document.getElementById("edit-btn");
    const modal = document.getElementById("edit-modal");
    const closeModal = document.getElementById("close-modal");
    const saveBtn = document.getElementById("save-btn");
    const passwordInput = document.getElementById("password");
    const editForm = document.getElementById("edit-form");

    if (uniqueId) {
        fetchBikeData(uniqueId);
    }

    function fetchBikeData(id) {
        fetch(baseUrl + id)
            .then(response => response.json())
            .then(data => {
                displayBikeData(data);
                editBtn.classList.remove("hidden");
            })
            .catch(error => console.error("Error fetching bike details:", error));
    }

    function displayBikeData(data) {
        bikeContainer.innerHTML = `
            <div class="bike-card">
                <h2>${data.bikeName}</h2>
                <p>Model: ${data.model}</p>
                <p>Owner: ${data.ownerName}</p>
                <p>Contact: ${data.contact}</p>
                <p>Rent: $${data.rent}</p>
                <button id="edit-btn" class="btn edit-btn">Edit Details</button>
            </div>
        `;
    }

    editBtn.addEventListener("click", () => {
        modal.classList.add("active");
    });

    closeModal.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    editForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const password = passwordInput.value;
        if (password !== "your-secure-password") {
            alert("Incorrect password!");
            return;
        }

        const updatedData = {
            bikeName: document.getElementById("bike-name").value,
            model: document.getElementById("model").value,
            ownerName: document.getElementById("owner-name").value,
            contact: document.getElementById("contact").value,
            rent: document.getElementById("rent").value
        };

        fetch(baseUrl + uniqueId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            alert("Details updated successfully!");
            modal.classList.remove("active");
            fetchBikeData(uniqueId);
        })
        .catch(error => console.error("Error updating bike details:", error));
    });
});
