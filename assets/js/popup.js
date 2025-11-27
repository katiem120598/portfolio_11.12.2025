document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = modal?.querySelector('.modal-close');

    if (!modal || !modalBody) return;

    document.querySelectorAll('.filler-container').forEach(item => {
        const title = item.dataset.projectTitle || "project";
        const desc  = item.dataset.projectDesc  || "";
        const link  = item.dataset.projectLink  || null;

        // 🔹 skills now defined *per item*
        const skills = item.dataset.projectSkills
            ? item.dataset.projectSkills.split(',').map(s => s.trim())
            : [];

        const modalImgSrc = item.dataset.projectModalImg  || null;
        const modalImgAlt = item.dataset.projectModalAlt  || "";
        const modalScale  = item.dataset.projectModalScale || null;

        const fallbackImg = item.querySelector('img');
        const fallbackSrc = fallbackImg?.getAttribute('src');
        const fallbackAlt = fallbackImg?.getAttribute('alt') || "";

        item.addEventListener('click', (e) => {
            e.preventDefault();

            modalBody.innerHTML = `
                <div class="modal-body">
                    <h2>${title}</h2>

                    ${
                        skills.length
                        ? `<div class="skills-list">
                               ${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                           </div>`
                        : ''
                    }

                    <p style="margin: 20px auto;">${desc}</p>


                    ${
                        item.dataset.projectModalVideo
                        ? `
                            <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; margin:20px 0;">
                                <iframe 
                                    src="${item.dataset.projectModalVideo}"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                    style="position:absolute; top:0; left:0; width:100%; height:100%;">
                                </iframe>
                            </div>
                        `
                        : (
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

    // close behaviors
    closeBtn?.addEventListener('click', () => modal.close());

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.open) modal.close();
    });
});
