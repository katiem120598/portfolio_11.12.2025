document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = modal?.querySelector('.modal-close');

    if (!modal || !modalBody) return;

    document.querySelectorAll('.filler-container').forEach(item => {
        const title = item.dataset.projectTitle || "project";
        const desc = item.dataset.projectDesc || "";
        const link = item.dataset.projectLink || null;

        const modalImgSrc = item.dataset.projectModalImg || null;
        const modalImgAlt = item.dataset.projectModalAlt || "";
        const modalScale = item.dataset.projectModalScale || null;

        const fallbackImg = item.querySelector('img');
        const fallbackSrc = fallbackImg?.getAttribute('src');
        const fallbackAlt = fallbackImg?.getAttribute('alt') || "";

        item.addEventListener('click', (e) => {
            e.preventDefault();

            modalBody.innerHTML = `
                <div class="modal-body">
                    <h2>${title}</h2>

                    <p>${desc}</p>

                    ${
                        modalImgSrc
                        ? `<img src="${modalImgSrc}" 
                                alt="${modalImgAlt}" 
                                style="width:${modalScale ? modalScale + '%' : '100%'}; height:auto; display:block; margin:20px auto;">`
                        : (fallbackSrc 
                            ? `<img src="${fallbackSrc}" 
                                    alt="${fallbackAlt}"
                                    style="width:${modalScale ? modalScale + '%' : '100%'}; height:auto; display:block; margin:20px auto;">`
                            : ''
                        )
                    }

                    ${
                        link
                        ? `<a href="${link}" target="_blank" rel="noopener noreferrer">
                                open full project →
                           </a>`
                        : ''
                    }
                </div>
            `;

            modal.showModal();
            closeBtn?.focus();
        });
    });

    // ✅ you were missing this:
    closeBtn?.addEventListener('click', () => {
        modal.close();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.open) modal.close();
    });
});
