function submitForm(event) {
    event.preventDefault();

    // Get form inputs
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    if (name && email && message) {
        document.getElementById("success-message").classList.remove("hidden");

        // Clear form fields
        document.querySelector("form").reset();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            document.getElementById("success-message").classList.add("hidden");
        }, 3000);
    }
}
