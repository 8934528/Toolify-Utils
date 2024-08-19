document.addEventListener('DOMContentLoaded', function () {
    const skills = document.querySelectorAll('.skill');

    skills.forEach(skill => {
        skill.addEventListener('mouseenter', function () {
            const description = this.getAttribute('data-description');

            Swal.fire({
                title: this.textContent,
                text: description,
                icon: 'info',
                confirmButtonText: 'OK',
                customClass: {
                    container: 'swal2-container',
                    title: 'swal2-title',
                    content: 'swal2-content',
                    confirmButton: 'swal2-confirm'
                }
            });
        });
    });
});
