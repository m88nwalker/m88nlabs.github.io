document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.getElementById("gallery");
  const filters = document.getElementById("filters");
  let jsonData = [];
  const pageSize = 50; // Number of images per page
  let currentPage = 0; // Track the current page
  let manifestFiles = []; // Holds the list of files from the manifest

  // Dynamically load the manifest
  async function loadManifest() {
    try {
      const response = await fetch("metadata/manifest.json");
      manifestFiles = await response.json();
    } catch (error) {
      console.error("Error loading manifest file:", error);
    }
  }

  // Load metadata for the current page
  async function loadMetadataChunk() {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    const chunk = manifestFiles.slice(start, end);

    try {
      const metadataPromises = chunk.map(async (file) => {
        const fileResponse = await fetch(`metadata/${file}`);
        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch: ${file}`);
        }
        return fileResponse.json();
      });

      const chunkData = await Promise.all(metadataPromises);
      jsonData = [...jsonData, ...chunkData];
    } catch (error) {
      console.error("Error loading metadata files:", error);
    }
  }

  const traitTypes = ["Background", "Townie", "Pants", "Shirt", "Hair", "Eyes", "Hat", "Mouth"];
  const traitValues = {};

  // Process and collect trait values
  const processTraitValues = () => {
    jsonData.forEach((item) => {
      item.attributes.forEach((attr) => {
        if (!traitValues[attr.trait_type]) {
          traitValues[attr.trait_type] = new Set();
        }
        traitValues[attr.trait_type].add(attr.value);
      });
    });
  };

  // Render filters
  const renderFilters = () => {
    filters.innerHTML = ""; // Clear filters before rendering
    traitTypes.forEach((trait) => {
      const accordionItem = document.createElement("div");
      accordionItem.className = "accordion-item";

      const header = document.createElement("div");
      header.className = "accordion-header";
      header.textContent = trait;
      header.addEventListener("click", () => {
        const body = header.nextElementSibling;
        body.classList.toggle("open");
      });

      const body = document.createElement("div");
      body.className = "accordion-body";

      Array.from(traitValues[trait]).forEach((value) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        checkbox.dataset.traitType = trait;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(value));
        body.appendChild(label);
      });

      accordionItem.appendChild(header);
      accordionItem.appendChild(body);
      filters.appendChild(accordionItem);
    });
  };

  // Apply filters
  const applyFilters = () => {
    const selectedFilters = {};
    document.querySelectorAll(".accordion-body input:checked").forEach((checkbox) => {
      const traitType = checkbox.dataset.traitType;
      if (!selectedFilters[traitType]) {
        selectedFilters[traitType] = new Set();
      }
      selectedFilters[traitType].add(checkbox.value);
    });

    const filteredData = jsonData.filter((item) =>
      item.attributes.every((attr) => {
        if (!selectedFilters[attr.trait_type] || selectedFilters[attr.trait_type].size === 0) {
          return true;
        }
        return selectedFilters[attr.trait_type].has(attr.value);
      })
    );

    renderGallery(filteredData.slice(0, pageSize * (currentPage + 1))); // Render filtered data up to the current page
  };

  // Render gallery
  const renderGallery = (data) => {
    gallery.innerHTML = ""; // Clear gallery before rendering
    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.dataset.src = `images/${item.image}`;
      img.alt = item.name;
      img.classList.add("lazy");

      const observer = new IntersectionObserver(
        ([entry], observer) => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.onload = () => lazyImage.classList.remove("lazy");
            observer.unobserve(lazyImage);
          }
        },
        { rootMargin: "0px 0px 50px 0px" }
      );

      observer.observe(img);
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
  };

  // Load the next chunk of metadata when "Load More" is clicked
  document.getElementById("load-more").addEventListener("click", async () => {
    currentPage++;
    await loadMetadataChunk();
    processTraitValues();
    renderFilters();
    renderGallery(jsonData.slice(0, pageSize * (currentPage + 1)));
  });

  filters.addEventListener("change", applyFilters);

  // Initial load
  await loadManifest();
  await loadMetadataChunk();
  processTraitValues();
  renderFilters();
  renderGallery(jsonData.slice(0, pageSize));
});
