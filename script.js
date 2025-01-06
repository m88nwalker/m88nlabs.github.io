document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.getElementById("gallery");
  const pagination = document.getElementById("pagination");
  const BATCH_SIZE = 50; // Number of files to fetch in each batch
  const ITEMS_PER_PAGE = 20; // Number of items to display per page
  let jsonData = [];
  let currentPage = 1;

  async function loadMetadata() {
    try {
      const response = await fetch("metadata/manifest.json"); // Fetch the manifest
      const allFiles = await response.json();

      for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
        const batch = allFiles.slice(i, i + BATCH_SIZE);

        const metadataPromises = batch.map(async (file) => {
          const fileResponse = await fetch(`metadata/${file}`);
          return fileResponse.json();
        });

        const batchData = await Promise.all(metadataPromises);
        jsonData.push(...batchData);

        // Render current batch
        if (jsonData.length <= ITEMS_PER_PAGE) {
          renderGallery(getCurrentPageData());
          renderPagination();
        }
      }
    } catch (error) {
      console.error("Error loading metadata files:", error);
    }
  }

  function getCurrentPageData() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return jsonData.slice(start, end);
  }

  function renderGallery(data) {
    gallery.innerHTML = "";
    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name;
      card.appendChild(img);

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = item.name;
      card.appendChild(name);

      const attributes = document.createElement("div");
      attributes.className = "attributes";

      item.attributes.forEach((attr) => {
        const attrBox = document.createElement("div");
        attrBox.className = "attribute";
        attrBox.textContent = `${attr.trait_type}: ${attr.value}`;
        attributes.appendChild(attrBox);
      });

      card.appendChild(attributes);
      gallery.appendChild(card);
    });
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(jsonData.length / ITEMS_PER_PAGE);

    if (currentPage > 1) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Previous";
      prevButton.addEventListener("click", () => {
        currentPage--;
        renderGallery(getCurrentPageData());
        renderPagination();
      });
      pagination.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      if (i === currentPage) {
        pageButton.disabled = true;
      }
      pageButton.addEventListener("click", () => {
        currentPage = i;
        renderGallery(getCurrentPageData());
        renderPagination();
      });
      pagination.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.addEventListener("click", () => {
        currentPage++;
        renderGallery(getCurrentPageData());
        renderPagination();
      });
      pagination.appendChild(nextButton);
    }
  }

  await loadMetadata();
});
