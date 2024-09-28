  function showSection(section) {
        const sections = document.querySelectorAll('.section');
        sections.forEach((sec) => {
            sec.style.display = 'none'; // Hide all sections
        });
        document.getElementById(section).style.display = 'block'; // Show the selected section
    }