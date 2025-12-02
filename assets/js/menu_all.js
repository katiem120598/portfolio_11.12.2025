function loadNavbar() {
    return fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
        });
}

function handleMenu() {
    const button = document.querySelector('.dropdown-button');
    const menu = document.querySelector('.navlist');
    const menuLinks = document.querySelectorAll('.navlist li');

    if (!button || !menu) {
        console.warn("Navbar elements not found yet");
        return;
    }
    // Toggle the menu when the button is clicked
    button.addEventListener('click', function (event) {
        if (button.contains(event.target)) {
            menu.style.display = 'block'; // Display the menu vertically
        } else {
            menu.style.display = 'none';
        }
    });

    // Close the menu when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!menu.contains(event.target) && !button.contains(event.target)) {
            menu.style.display = 'none';
        }
    });

    // Close the menu when clicking on a menu item
    menuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
                menu.style.display = 'none';
        });
    });
}

loadNavbar().then(() => {
    handleMenu();
    window.addEventListener('resize', handleMenu);
});

